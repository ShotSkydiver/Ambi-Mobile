import React from 'react';
import {
  TouchableOpacity,
  BorderlessButton
} from 'react-native-gesture-handler';
import { Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/Feather';

import UserService from '../Profile/UserService';
import { GET_USER } from '../Profile/redux/actions';
import SpacesService from '../Spaces/SpacesService';
import { AvatarGroup } from '../shared/Avatars';
import { DEFAULT_PROFILE_PIC, HEADER_BUTTON_SIZE } from '../shared/constants';

export const ChatDetailHeaderRight = ({
  navigation,
  route,
  theme,
  isMultiMemberChannel,
  channel
}) => {
  const isChannelMembersScreen = route.name === 'ChatChannelMembers';
  const handleNavigation = () => {
    if (isMultiMemberChannel && !isChannelMembersScreen) {
      navigation.navigate('ChatChannelMembers', {
        type: 'chat',
        channelSid: channel.sid
      });
    } else {
      navigation.navigate('NativeModalNavigator', {
        screen: 'InviteUsersScreen',
        params: {
          type: 'chat',
          channelSid: channel.sid
        }
      });
    }
  };
  return (
    <BorderlessButton onPress={handleNavigation}>
      <Icon
        name={
          isMultiMemberChannel && !isChannelMembersScreen ? 'user' : 'user-plus'
        }
        onPress={handleNavigation}
        size={HEADER_BUTTON_SIZE}
        color={theme.textPrimary}
      />
    </BorderlessButton>
  );
};

ChatDetailHeaderRight.displayName = 'ChatHeaderRight';

export const ChatDetailHeaderTitle = ({
  navigation,
  route,
  theme,
  channel,
  isMultiMemberChannel
}) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.auth.user);
  const isChannelMembersScreen = route.name === 'ChatChannelMembers';
  const {
    members: memberships,
    attributes: { space: spaceAttributes },
    hydration: {
      avatars: { urls: avatarUrls }
    }
  } = channel;

  let chatChannelAvatars = avatarUrls.filter(
    u => u.identity !== currentUser.email
  ) || [{ url: [DEFAULT_PROFILE_PIC] }];
  if (spaceAttributes) {
    chatChannelAvatars = [{ url: spaceAttributes?.avatar, hideOnline: true }];
  }

  const handleNavigation = async () => {
    if (spaceAttributes?.id && spaceAttributes?.type) {
      SpacesService.getSpaceItemById(spaceAttributes.id, spaceAttributes.type)
        .then(spaceItem => {
          navigation.navigate('Space', {
            spaceItem: { ...spaceItem, type: spaceAttributes.type }
          });
        })
        .catch(err => {
          console.warn(
            'cannot navigate to space, unable to get space info: ',
            err
          );
        });
    } else if (isMultiMemberChannel && !isChannelMembersScreen) {
      navigation.navigate('ChatChannelMembers', {
        type: 'chat',
        channelSid: channel.sid
      });
    } else if (
      !isMultiMemberChannel &&
      !spaceAttributes &&
      !isChannelMembersScreen
    ) {
      const otherUserMembership = memberships.find(
        m => m.identity !== currentUser.email
      );

      const otherUserId = otherUserMembership?.attributes?.id;
      if (otherUserId) {
        const userToNavigate = await UserService.getUserById(otherUserId);
        dispatch({ type: GET_USER, user: userToNavigate });
        navigation.navigate('ModalNavigator', {
          screen: 'Profile',
          params: {
            user: userToNavigate
          }
        });
      }
    }
  };

  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
      }}
      onPress={handleNavigation}
    >
      <AvatarGroup
        urls={chatChannelAvatars}
        rectangle={!!spaceAttributes}
        size={spaceAttributes ? 24 : chatChannelAvatars.length > 1 ? 34 : 24}
      />
      <Text
        style={{
          fontFamily: 'Circular-Bold',
          fontSize: 17,
          marginLeft: 8,
          lineHeight: 22,
          textAlign: 'center',
          color: theme.textPrimary
        }}
      >
        {channel.hydration?.name}
      </Text>
    </TouchableOpacity>
  );
};

ChatDetailHeaderTitle.displayName = 'ChatDetailHeaderTitle';
