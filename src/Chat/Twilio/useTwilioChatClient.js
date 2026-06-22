/* eslint-disable no-use-before-define */
/* eslint-disable prefer-destructuring */
import { useEffect } from 'react';
import TwilioChat from 'twilio-chat';
import { useSelector, useDispatch } from 'react-redux';
import { sortBy, uniqBy, isEqual } from 'lodash';

import { ambiApi } from '../../models/AmbiApi';
import { CHAT_TYPES } from '../chatsReducer';
import useChannelHydrator from './useChannelHydrator';

function useTwilioChatClient() {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.auth.user);
  const chatChannels = useSelector(state => state.chats.chatChannels) || [];
  const Client = useSelector(state => state.chats.twilioClient);
  const { channelHydrator } = useChannelHydrator();

  const handleConnectionStateChange = async connectionState => {
    console.warn('connection state change: ', connectionState);
  };

  const initializeClient = () => {
    ambiApi.getFromApi(`/twilio/accessToken`).then(result => {
      const accessToken = result?.data?.token;
      if (accessToken) {
        TwilioChat.create(accessToken, { logLevel: 'warn' }).then(client => {
          client.on('userSubscribed', handleOnUserSubscribed);
          client.on('channelAdded', handleOnChannelAdded);
          client.on('tokenAboutToExpire', refreshClientToken);
          // debugging events
          client.on('connectionStateChanged', handleConnectionStateChange);
          client.on('tokenExpired', obj => console.warn('token expired', obj));
          dispatch({
            type: CHAT_TYPES.SETUP_TWILIO_CLIENT,
            client
          });
        });
      }
    });
  };

  const getToken = async () => {
    let newToken = '';
    try {
      const result = await ambiApi.getFromApi(`/twilio/accessToken`);
      newToken = result.data.token;
    } catch (exception) {
      console.error('error doing init: ', exception);
      return null;
    }
    return newToken;
  };

  const refreshClientToken = async () => {
    const refreshToken = await getToken();
    Client.updateToken(refreshToken);
  };

  const handleOnUserSubscribed = async user => {
    if (currentUser.email === user.identity) {
      const currentUserAttributes = mapUserAttributes({
        ...currentUser.profile,
        id: currentUser.id,
        email: currentUser.email
      });
      const updatedUser = await user.updateFriendlyName(
        `${currentUserAttributes.firstName} ${currentUserAttributes.lastName}`
      );
      await updatedUser.updateAttributes(currentUserAttributes);
    }
  };

  const handleChannelUpdate = (updatedChannel, moveChannelToTop = false) => {
    if (updatedChannel) {
      dispatch({
        type: CHAT_TYPES.UPDATE_CHANNELS,
        channel: updatedChannel,
        moveChannelToTop
      });
    }
  };

  const populateChannelMembers = async channel => {
    const members = await channel.getMembers();
    const handleChannelMemberUpdate = ({ user: chatUser, updateReasons }) => {
      if (updateReasons.includes('online') && channel) {
        const updatedChannel = channel;
        updatedChannel.members = updatedChannel.members.map(m => {
          const updatedMember = m;
          if (m.identity === chatUser.identity) {
            updatedMember.isOnline = chatUser.online;
          }
          return updatedMember;
        });
        handleChannelUpdate(channelHydrator(updatedChannel));
      }
    };
    const updatedMembers = await Promise.all(
      members.map(async m => {
        const memberWithOnlineStatus = m;
        const user = await m.getUser();
        user.removeAllListeners(); // avoids memory leaks
        // mainly used to check and update members online status realtime.
        user.on('updated', handleChannelMemberUpdate);
        memberWithOnlineStatus.isOnline = user.online;
        return memberWithOnlineStatus;
      })
    );
    return updatedMembers;
  };

  const mapUserAttributes = user => {
    const { avatarMedia, avatarUrl, firstName, lastName, id } = user;
    let userAvatarMedia = avatarMedia;
    if (typeof avatarMedia === 'string') {
      userAvatarMedia = JSON.parse(userAvatarMedia);
    }
    const avatar = userAvatarMedia?.links?.content || avatarUrl;
    return { id, firstName, lastName, email: user.email, avatar };
  };

  const mapSpaceAttributes = space => {
    const spaceAvatar =
      space?.coverBannerMedia?.links?.image_32_32 ||
      space?.coverBannerMedia?.links?.content ||
      space.coverBannerUrl;
    return {
      id: space.id,
      type: space.type,
      name: space.name,
      avatar: spaceAvatar,
      color: space?.clientColor?.hexValue
    };
  };

  const getHydratedChannel = async channel => {
    const channelToHydrate = channel;
    const members = await channel.getMembers();
    const messagesCount = await channel.getMessagesCount();
    const { items: messages = [] } = await channel.getMessages();
    channelToHydrate.messagesCount = messagesCount;
    channelToHydrate.messages = messages.reverse();

    const currentUserAttributes = mapUserAttributes({
      ...currentUser.profile,
      id: currentUser.id,
      email: currentUser.email
    });
    const myMembership = members.find(m => m.identity === currentUser.email);
    if (!isEqual(myMembership.attributes, currentUserAttributes)) {
      myMembership.updateAttributes(currentUserAttributes);
    }

    const updatedMembers = await populateChannelMembers(channelToHydrate);
    channelToHydrate.members = updatedMembers;
    channelToHydrate.membersCount = members.length;
    return channelHydrator(channelToHydrate);
  };

  const handleOnMessageAdded = async message => {
    let channel = message.channel;
    channel.messages = uniqBy([message, ...(channel.messages || [])], 'sid');
    channel.messagesCount += 1;
    const isExistingChannel = chatChannels.find(ch => ch.sid === channel.sid);
    if (!isExistingChannel) {
      channel = await getHydratedChannel(channel);
    } else {
      channel = channelHydrator(channel);
    }
    if (message.author === currentUser.email) {
      channel.hydration.unreadCount = 0;
    }
    handleChannelUpdate(channel, true);
  };

  const handleOnTypingStart = member => {
    const { channel } = member;
    const existingChannel = chatChannels.find(ch => ch.sid === channel.sid);
    if (!existingChannel) {
      return;
    }
    channel.typingMembers = uniqBy(
      [...(channel.typingMembers || []), member],
      'sid'
    );
    handleChannelUpdate(channelHydrator(channel));
  };

  const handleOnTypingEnd = member => {
    const { channel } = member;
    const existingChannel = chatChannels.find(ch => ch.sid === channel.sid);
    if (!existingChannel) {
      return;
    }
    channel.typingMembers = channel.typingMembers.filter(
      m => m.identity !== member.identity
    );
    handleChannelUpdate(channelHydrator(channel));
  };

  const setUpChannelListeners = channel => {
    channel.on('messageAdded', handleOnMessageAdded);
    channel.on('typingStarted', handleOnTypingStart);
    channel.on('typingEnded', handleOnTypingEnd);
  };

  const handleOnChannelAdded = async channel => {
    let newChannel = channel;
    setUpChannelListeners(channel);
    const members = await populateChannelMembers(channel);
    const isMember = members.find(m => m.identity === currentUser.email);
    if (!isMember) {
      newChannel = await channel.join();
      newChannel = await getHydratedChannel(newChannel);
      handleChannelUpdate(newChannel);
    }
  };

  useEffect(() => {
    chatChannels.forEach(async ch => {
      await ch.removeAllListeners();
      setUpChannelListeners(ch);
    });
  }, [chatChannels.length]);

  const updateSpaceChannelAttributes = async channel => {
    const channelToUpdate = channel;
    const spaceChannelAttributes = channelToUpdate?.attributes?.space;
    const { type, id } = spaceChannelAttributes || {};
    if (type && id) {
      const spacePluralType =
        // eslint-disable-next-line no-nested-ternary
        type === 'community'
          ? 'communities'
          : type === 'group'
          ? 'groups'
          : 'classes';
      try {
        const { data: space } = await ambiApi.getFromApi(
          `/${spacePluralType}/${id}`
        );
        if (
          space &&
          !isEqual(
            spaceChannelAttributes,
            mapSpaceAttributes({ ...space, type })
          )
        ) {
          await channelToUpdate.updateAttributes({
            space: mapSpaceAttributes({ ...space, type })
          });
        }
      } catch (err) {
        console.warn('unable to update channel space attributes: ', err);
      }
    }
    return channelToUpdate;
  };

  const getUserChannels = async () => {
    if (!Client || !currentUser) {
      return [];
    }
    let channels = [];
    const { items, hasNextPage } = await Client.getUserChannelDescriptors();
    if (items && items.length > 0) {
      const userChannels = await Promise.all(
        items.map(async channelDescriptor => {
          let channel = await channelDescriptor.getChannel();
          channel = await updateSpaceChannelAttributes(channel);
          const hydratedChannel = await getHydratedChannel(channel);
          return hydratedChannel;
        })
      );
      channels = userChannels.filter(ch => ch?.messages?.length > 0);
    }

    return { channels, hasNextPage };
  };

  const getChannelByUniqueName = async uniqueName => {
    let channel = await Client.getChannelByUniqueName(uniqueName);
    channel = await getHydratedChannel(channel);
    return channel;
  };

  const buildUniqueName = (users, space = null) => {
    let uniqueName;
    if (space) {
      const { name, uniqueIdentifier } = space;
      uniqueName = `${uniqueIdentifier}-${name}`;
    } else {
      uniqueName = sortBy(uniqBy(users, 'email'), ['email'])
        .map(u => u.email)
        .join(',');
    }
    return uniqueName;
  };

  const createChannel = async (channelMembersToAdd, space = null) => {
    if (!Client || !currentUser) {
      console.warn('Client not initialized yet');
      return null;
    }
    const currentUserAttributes = mapUserAttributes({
      ...currentUser.profile,
      id: currentUser.id,
      email: currentUser.email
    });
    const channelParams = {
      uniqueName: buildUniqueName(
        [...channelMembersToAdd, currentUserAttributes],
        space
      ),
      createdBy: currentUser.email,
      isPrivate: true,
      friendlyName: space ? space.name : 'Chat'
    };

    if (space) {
      const spaceAttributes = mapSpaceAttributes(space);
      channelParams.attributes = { space: spaceAttributes };
    }
    let channel;
    let existingChannel;

    try {
      existingChannel = await getChannelByUniqueName(channelParams.uniqueName);
    } catch (err) {
      console.warn('No existing channel: ', err);
    }

    try {
      if (!existingChannel) {
        channel = await Client.createChannel(channelParams);
      }
    } catch (err) {
      console.warn('error while creating a new channel: ', err);
      return null;
    }

    try {
      if (!existingChannel) {
        await channel.join();
        const myMembership = await channel.getMemberByIdentity(
          currentUser.email
        );
        await myMembership.updateAttributes(currentUserAttributes);
      }
    } catch (err) {
      console.warn(
        'error joining channel and updating my channel membership attributes after creating new channel: ',
        err
      );
    }

    try {
      if (!existingChannel) {
        await Promise.all(
          channelMembersToAdd.map(async member => {
            await ambiApi.postToApi({
              url: '/twilio/chat/members/create',
              body: {
                channelSid: channel.sid,
                identity: member.email,
                attributes: JSON.stringify(mapUserAttributes(member))
              }
            });
          })
        );
      }
    } catch (err) {
      console.warn(
        'error creating other channel members after channel creation so deleting this channel, pls try again',
        err
      );
      channel.delete();
      return null;
    }

    if (existingChannel) {
      channel = chatChannels.find(ch => ch.sid === existingChannel.sid);
      if (!channel) {
        channel = await getHydratedChannel(existingChannel);
      }
    } else {
      const members = await populateChannelMembers(channel);
      channel.members = members;
      channel.membersCount = members.length;
      channel.messagesCount = 0;
      channel.messages = [];
    }
    return channelHydrator(channel);
  };

  return {
    Client,
    initializeClient,
    getToken,
    refreshClientToken,
    getUserChannels,
    getChannelByUniqueName,
    createChannel,
    buildUniqueName,
    channelHydrator,
    getHydratedChannel,
    handleOnChannelAdded,
    updateSpaceChannelAttributes
  };
}

export default useTwilioChatClient;
