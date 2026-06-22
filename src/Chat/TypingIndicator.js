import React from 'react';
import { View, Image, Text } from 'react-native';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { AvatarGroup } from '../shared/Avatars';

const Container = styled(View)`
  display: flex;
  flex-direction: row;
  padding-horizontal: ${({ isGroupChat, onlyNames }) =>
    onlyNames ? '0' : isGroupChat ? '12px' : '48px'};
  margin: 14px 0;
`;

const Wrapper = styled(View)`
  padding-horizontal: 24px;
`;

const AvatarWrapper = styled(View)`
  margin-top: 8px;
`;

const TypingIndicatorText = styled(Text)`
  font-family: Circular-Bold;
  color: ${({ onlyNames }) => (onlyNames ? '#029ee2' : '#707689')};
  font-size: 14px;
  letter-spacing: -0.23px;
  line-height: 15px;
  margin-left: 2px;
`;

const GifWrapper = styled(View)`
  height: 40px;
  width: 64px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 20px;
  background-color: rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TypingIndicatorGif = styled(Image)`
  width: 50px;
  height: 50px;
`;

function TypingIndicator({
  typingMembers,
  memberships,
  currentUser,
  onlyNames
}) {
  const channelTypingUsers = typingMembers.filter(userTyping => {
    const identity = userTyping?.identity || userTyping?.state?.identity;
    return identity !== currentUser.email;
  });

  const typingUsersNum = channelTypingUsers.length;
  if (typingUsersNum === 0) {
    return null;
  }

  const typingUsersAvatars = channelTypingUsers.map(({ attributes }) => {
    return { url: attributes.avatar, hideOnline: true };
  });

  const isGroupChat = memberships && memberships.length > 2;

  const renderTypingText = () => {
    return (
      <TypingIndicatorText onlyNames={onlyNames}>
        {typingUsersNum <= 3 &&
          channelTypingUsers.map(({ attributes }, i) => {
            return `${attributes.firstName}${
              i === typingUsersNum - 1 ? '' : ','
            } ${
              // eslint-disable-next-line no-nested-ternary
              onlyNames
                ? channelTypingUsers.length === 1
                  ? 'is typing...'
                  : 'are typing...'
                : ''
            }`;
          })}
        {typingUsersNum > 3 && 'Several people are typing'}
      </TypingIndicatorText>
    );
  };

  return (
    <Container isGroupChat={isGroupChat} onlyNames={onlyNames}>
      {onlyNames ? (
        renderTypingText()
      ) : (
        <>
          {isGroupChat && (
            <AvatarWrapper>
              <AvatarGroup urls={typingUsersAvatars} size={31} />
            </AvatarWrapper>
          )}
          <Wrapper>
            {isGroupChat && renderTypingText()}
            <GifWrapper>
              <TypingIndicatorGif
                source={{
                  uri: 'https://ambi-static.s3.amazonaws.com/images/ambi/typing-indicator.gif'
                }}
              />
            </GifWrapper>
          </Wrapper>
        </>
      )}
    </Container>
  );
}

TypingIndicator.defaultProps = {
  typingMembers: [],
  memberships: [],
  onlyNames: false
};

TypingIndicator.propTypes = {
  typingMembers: PropTypes.arrayOf(PropTypes.shape()),
  memberships: PropTypes.arrayOf(PropTypes.shape()),
  currentUser: PropTypes.shape().isRequired,
  onlyNames: PropTypes.bool
};

export default TypingIndicator;
