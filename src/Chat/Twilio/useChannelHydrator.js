import { useSelector } from 'react-redux';
import { formatDate } from '../../shared/utils/helpers';

function useChannelHydrator() {
  const currentUser = useSelector(state => state.auth.user);
  const channelHydrator = channel => {
    const channelToHydrate = channel;
    const {
      channelState,
      members = [],
      messagesCount,
      messages = [],
      typingMembers = [],
      lastMessage,
      lastConsumedMessageIndex
    } = channelToHydrate;
    const {
      attributes: { space: spaceInfo }
    } = channelState;

    let unreadMessageCount = 0;
    if (lastConsumedMessageIndex == null) {
      unreadMessageCount = lastMessage ? lastMessage.index + 1 : messagesCount;
    } else {
      unreadMessageCount = messagesCount - (lastConsumedMessageIndex + 1);
    }

    let avatarUrls = [
      {
        url: 'https://static.ambi.school/images/ambi/avatar.png',
        isOnline: false
      }
    ];
    const useRectangleAvatar = !!spaceInfo;
    if (spaceInfo) {
      avatarUrls = [
        {
          url: spaceInfo.avatarUrl || spaceInfo.coverBannerUrl,
          isOnline: false,
          hideOnline: true,
          color: '#000000' // Todo
        }
      ];
    } else {
      const channelMemberAvatars = members.slice(0, 4).map(user => {
        const { attributes, isOnline, identity } = user;
        return {
          identity,
          url: attributes?.avatar,
          isOnline
        };
      });
      if (channelMemberAvatars.length > 0) {
        avatarUrls = channelMemberAvatars;
      }
    }

    const lastChatMessage = messages[0];

    const mediaSnippetText = media => {
      const { contentType, filename } = media;
      if (contentType) {
        if (contentType.slice(0, 5) === 'image') {
          return `📷 Image: ${filename}`;
        }
        if (contentType.slice(0, 5) === 'video') {
          return `📹 Video: ${filename}`;
        }
        if (contentType.slice(0, 5) === 'audio') {
          return `🔈 Audio: ${filename}`;
        }
      }
      return `📄 File: ${filename}`;
    };

    const buildFriendlyName = () => {
      let friendlyName;
      if (spaceInfo) {
        friendlyName = spaceInfo.name;
      } else {
        const membersWithoutCurrentUser = members.filter(
          m => m.identity !== currentUser.email
        );
        const firstNames = membersWithoutCurrentUser
          .slice(0, 2)
          .map(member => member?.attributes?.firstName || member.identity);
        friendlyName = `${firstNames.join(', ')}${
          members.length > 3 ? ` + ${members.length - 3}` : ''
        }`;
      }
      return friendlyName;
    };

    channelToHydrate.typingMembers = typingMembers;
    channelToHydrate.hydration = {
      unreadCount: unreadMessageCount,
      name: buildFriendlyName(),
      avatars: {
        useRectangle: useRectangleAvatar,
        urls: avatarUrls
      },
      lastChatMessage: {
        date: lastChatMessage
          ? formatDate(lastChatMessage.dateCreated)
          : formatDate(new Date()),
        dateRaw: lastChatMessage ? lastChatMessage.dateCreated : new Date(),
        preview: lastChatMessage
          ? lastChatMessage.attributes.media
            ? mediaSnippetText(lastChatMessage.attributes.media)
            : lastChatMessage.body
          : 'No messages yet'
      }
    };
    return channelToHydrate;
  };
  return { channelHydrator };
}

export default useChannelHydrator;
