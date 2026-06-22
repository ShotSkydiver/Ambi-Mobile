import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import PropTypes from 'prop-types';
import { FlatList, Text, View } from 'react-native';
import Emoji from 'react-native-emoji';
import i18n from 'format-message';

import { useTheme } from '@react-navigation/native';

import TypingIndicator from './TypingIndicator';
import BaseMessage from './Messages/BaseMessage';
import UploadingItem from './Messages/Uploading';
import Avatar, { AvatarGroup } from '../shared/Avatars';
import { IS_ANDROID } from '../shared/constants';

const Container = styled(View)`
  flex: 1;
  padding-bottom: 8px;
`;

const List = styled(FlatList)`
  margin-bottom: 0px;
  padding-horizontal: 16px;
`;

const StyledEmptyStateContainer = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const StyledEmptyStateName = styled(Text)`
  margin-top: 8px;
  font-family: Circular-Bold;
  color: #030303;
  font-size: 22px;
  font-weight: bold;
`;

const StyledHi = styled(Text)`
  font-size: 16px;
  opacity: 0.6;
`;

const StyledContainer = styled(View)`
  flex-direction: row;
  margin-top: 16px;
`;

const StyledChatContainer = styled(View)`
  flex-direction: column;
  align-items: stretch;
  flex: 1;
`;

const StyledAvatar = styled(Avatar)`
  align-self: flex-end;
  margin-right: 16px;
`;

const StyledName = styled(Text)`
  font-family: Circular-Bold;
  font-size: 14px;
  line-height: 18px;
`;

function getNamesFromUsers(users, max) {
  if (users.length === 1) {
    return `${users[0].firstName} ${users[0].lastName}`;
  }
  if (users.length === 2) {
    return `${users[0].firstName} & ${users[1].firstName}`;
  } else {
    let names = users
      .slice(0, max)
      .map(user => user.firstName)
      .join(', ');
    if (max < users.length) {
      names = `${names}, +${users.length - max}`;
    }
    return names;
  }
}

function EmptyState({ memberships, themeColors }) {
  const users = memberships.map(m => m.attributes);
  const avatarUrls = users.map(u => ({ url: u.avatar, hideOnline: true }));
  const size = users.length >= 3 ? 108 : users.length === 2 ? 141 : 80;
  const overlap = users.length >= 3 ? 0.05 : 0.1;
  return (
    <StyledEmptyStateContainer>
      <AvatarGroup urls={avatarUrls} size={size} overlapPercent={overlap} />
      <StyledEmptyStateName style={{ color: themeColors.textPrimary }}>
        {getNamesFromUsers(users, 3)}
      </StyledEmptyStateName>
      <Emoji name="wave" style={{ fontSize: 36, marginTop: 16 }} />
      <StyledHi style={{ color: themeColors.textPrimary }}>
        {i18n('Say Hi!')}
      </StyledHi>
    </StyledEmptyStateContainer>
  );
}

const messageKeyExtractor = item =>
  item.sid ? `message-${item.sid}` : `upload-${item.sid}`;

const INITIAL_MESSAGES_NUM = 20;

// Todo: add uploading message view

function ChatMessagesList({ channel, currentUser, onLinkPress, navigation }) {
  const theme = useTheme();
  const { legacy: themeColors } = theme;
  const {
    messages = [],
    members: memberships,
    typingMembers = [],
    lastMessage
  } = channel;

  const isGroupChat = memberships && memberships.length > 2;

  const renderTypingIndicator = () => {
    return (
      <TypingIndicator
        typingMembers={typingMembers}
        currentUser={currentUser}
        memberships={memberships}
      />
    );
  };

  const renderMessageItem = ({ item }) => {
    const isUploadMessage = item.type === 'upload';
    const messageAuthor = memberships.find(m => m.identity === item.author);
    const {
      state: {
        attributes: { avatar: userAvatarUrl, firstName }
      }
    } = messageAuthor || { state: { attributes: {} } };
    const fromSelf = isUploadMessage || item.author === currentUser.email;
    const timeDiff = Math.abs(
      moment(item.dateCreated).diff(moment(lastMessage?.dateCreated))
    );
    const shouldShowTime = timeDiff > 1000 * 60 * 60; // Show date if more than 5 minutes since previous message

    return (
      <StyledContainer key={item.sid}>
        {!fromSelf && <StyledAvatar size={31} url={userAvatarUrl} />}
        <StyledChatContainer>
          {!fromSelf && isGroupChat && !isUploadMessage && (
            <StyledName style={{ color: themeColors.slateGray }}>
              {firstName}
            </StyledName>
          )}
          {isUploadMessage ? (
            <UploadingItem item={item} />
          ) : (
            <BaseMessage
              message={item}
              onLinkPress={onLinkPress}
              fromSelf={fromSelf}
              shouldShowTime={shouldShowTime}
              memberships={memberships}
              isLastMessage={item?.index === lastMessage?.index}
              navigation={navigation}
            />
          )}
        </StyledChatContainer>
      </StyledContainer>
    );
  };

  // Todo
  const getMessages = () => {
    // getChannelMessages(uniqueIdentifier, currentPage, currentUser.id)(dispatch);
  };

  const ITEMS_COUNT = messages.length;

  const getListLayout = (data, index) => {
    return {
      length: ITEMS_COUNT,
      offset: index * ITEMS_COUNT,
      index
    };
  };

  return (
    <Container style={{ backgroundColor: themeColors.body }}>
      {ITEMS_COUNT ? (
        <List
          inverted
          initialNumToRender={INITIAL_MESSAGES_NUM}
          fadingEdgeLength={1}
          keyboardDismissMode={IS_ANDROID ? 'on-drag' : 'interactive'}
          data={messages}
          onEndReached={getMessages}
          onEndReachedThreshold={0.5}
          getItemLayout={getListLayout}
          renderItem={renderMessageItem}
          keyExtractor={messageKeyExtractor}
        />
      ) : (
        <EmptyState themeColors={themeColors} memberships={memberships} />
      )}
      {typingMembers.length > 0 && renderTypingIndicator()}
    </Container>
  );
}

ChatMessagesList.propTypes = {
  navigation: PropTypes.shape({}).isRequired,
  onLinkPress: PropTypes.func.isRequired
};

export default ChatMessagesList;
