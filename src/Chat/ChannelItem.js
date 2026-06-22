import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import i18n from 'format-message';
import { useTheme } from '@react-navigation/native';

import TypingIndicator from './TypingIndicator';
import StyledText from '../shared/StyledText';
import { AvatarGroup } from '../shared/Avatars';

const Content = styled(TouchableOpacity)`
  height: 71px;
  padding-horizontal: 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const ChannelNameMsg = styled(View)`
  flex: 1;
  padding-horizontal: 14px;
`;
const ChannelName = styled(StyledText)`
  font-size: 16px;
  font-family: Circular-Bold;
  line-height: 20px;
`;
const ChannelMsg = styled(StyledText)`
  font-size: 16px;
  font-family: Circular-Book;
  margin-top: 2px;
  opacity: 0.8;
  line-height: 18px;
`;

const DateCountWrapper = styled(View)``;
const UnreadCount = styled(View)`
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  background-color: #ed1d7a;
  border-radius: 4px;
  padding-horizontal: 4px;
  margin-bottom: 4px;
  margin-left: auto;
`;
const Count = styled(StyledText)`
  font-size: 14px;
  color: white;
`;
const ChannelDate = styled(StyledText)`
  font-size: 13px;
  margin-left: auto;
  font-family: Circular-Book;
`;

function ChannelItem({ item: chatChannel, navigation }) {
  const currentUser = useSelector(state => state.auth.user);
  const theme = useTheme();
  const { legacy: themeColors } = theme;
  if (!chatChannel.hydration) {
    console.warn('Channel has not been hydrated. Skipping.');
    return null;
  }
  const {
    hydration: {
      avatars: { urls: avatarUrls, useRectangle: rectangle },
      lastChatMessage: { date, preview },
      name,
      unreadCount: count
    },
    attributes: { space },
    members: memberships,
    messages,
    lastMessage,
    typingMembers
  } = chatChannel;
  const hasUnread = count > 0;

  const lastMsg =
    messages.find(m => m.index === lastMessage?.index) || messages.slice(-1)[0];
  const lastMessageAuthor = memberships.find(
    m => m.identity === lastMsg?.author
  );
  const fromSelf = lastMsg?.author === currentUser.email;
  let chatChannelAvatars = avatarUrls.filter(
    u => u.identity !== currentUser.email
  );
  const isGroupChat = (memberships && memberships.length > 2) || space;
  if (space) {
    chatChannelAvatars = [{ url: space?.avatar, hideOnline: true }];
  }

  const msgPrefix = isGroupChat
    ? `${lastMessageAuthor?.attributes?.firstName}: `
    : '';

  const selectedChannel = () => {
    navigation.navigate('SingleChat', { channelSid: chatChannel.sid });
  };

  const channelTypingUsers = typingMembers?.filter(userTyping => {
    const identity = userTyping?.identity || userTyping?.state?.identity;
    return identity !== currentUser.email;
  });

  return (
    <Content
      onPress={selectedChannel}
      underlayColor={themeColors.slateGray}
      rippleColor={themeColors.slateGray}
    >
      <>
        <AvatarGroup
          urls={chatChannelAvatars}
          rectangle={rectangle}
          size={40}
        />
        <ChannelNameMsg>
          <ChannelName style={{ color: themeColors.textPrimary }}>
            {name}
          </ChannelName>
          <ChannelMsg style={{ color: themeColors.textPrimary }}>
            {channelTypingUsers.length > 0 ? (
              <TypingIndicator
                typingMembers={channelTypingUsers}
                memberships={memberships}
                currentUser={currentUser}
                onlyNames
              />
            ) : (
              <>
                {fromSelf ? i18n('You: ') : msgPrefix}
                {preview}
              </>
            )}
          </ChannelMsg>
        </ChannelNameMsg>
        <DateCountWrapper>
          <UnreadCount visible={!fromSelf && hasUnread}>
            <Count>{count}</Count>
          </UnreadCount>
          <ChannelDate style={{ color: themeColors.slateGray }}>
            {date}
          </ChannelDate>
        </DateCountWrapper>
      </>
    </Content>
  );
}

ChannelItem.propTypes = {
  item: PropTypes.shape().isRequired
};

export default ChannelItem;
