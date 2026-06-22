import React from 'react';
import PropTypes from 'prop-types';
import { Text, View, TouchableOpacity } from 'react-native';
import styled from 'styled-components';
import { AmbiChatMessage } from '@ambiwork/shared-js/classes';
import { useTheme } from '@react-navigation/native';
import { AmbiColors } from '../../shared/contexts/themeContext';

const Message = styled(TouchableOpacity)`
  max-width: 75%;
  margin-left: ${({ fromSelf }) => (fromSelf ? 'auto' : '0')};
  margin-right: ${({ fromSelf }) => (fromSelf ? '0' : 'auto')};
  padding: 8px 16px;
  border-bottom-left-radius: ${({ fromSelf }) => (fromSelf ? '15px' : '4px')};
  border-bottom-right-radius: ${({ fromSelf }) => (fromSelf ? '4px' : '15px')};
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  overflow: hidden;
  border-color: transparent;
  border-width: 1px;
`;

const MessageText = styled(Text)`
  font-family: Circular-Book;
  font-size: 16px;
  line-height: 22px;
`;

const MessageLink = styled(Text)`
  text-decoration: underline;
  text-decoration-color: white;
`;
const ReceivedMessageLink = styled(Text)`
  text-decoration: underline;
`;

function generateMessageText(messageId, body, fromSelf, onPress, theme) {
  const matches = AmbiChatMessage.buildBodyMatches(body);
  const textColor = fromSelf ? theme.chatText : theme.charcoal;
  if (matches.length > 0) {
    let startAtIndex = 0;
    const matchResults = matches.map(
      ({ start, end, result: { href, label } }, index) => {
        const leadingText = `${body.slice(startAtIndex, start)}`;
        startAtIndex = end;
        return (
          <MessageText
            // eslint-disable-next-line react/no-array-index-key
            key={`message-${messageId}-link-${index}`}
            style={{
              color: textColor
            }}
          >
            <MessageText
              style={{
                color: textColor
              }}
            >
              {leadingText}
            </MessageText>
            <MessageLink
              as={!fromSelf && ReceivedMessageLink}
              onPress={() => {
                onPress(href);
              }}
            >
              {label}
            </MessageLink>
          </MessageText>
        );
      }
    );
    return (
      <MessageText
        style={{
          color: textColor
        }}
      >
        {matchResults}
        <MessageText
          style={{
            color: textColor
          }}
        >
          {body.slice(matches[matches.length - 1].end)}
        </MessageText>
      </MessageText>
    );
  }
  return (
    <MessageText
      style={{
        color: textColor
      }}
      selectable
    >
      {body}
    </MessageText>
  );
}

function ChatMessageText({
  message,
  onLinkPress,
  isTapped,
  isLastMessage,
  isGroupChat,
  fromSelf,
  ...props
}) {
  const { sid, body } = message;
  const theme = useTheme();
  const { legacy: themeColors } = theme;
  return (
    <Message
      fromSelf={fromSelf}
      style={{
        backgroundColor: fromSelf
          ? isTapped
            ? '#0785bc'
            : AmbiColors.ambiBlue
          : themeColors.chatMessageBG
      }}
      {...props}
      as={(isLastMessage || isGroupChat || !fromSelf) && View}
    >
      {generateMessageText(sid, body, fromSelf, onLinkPress, themeColors)}
    </Message>
  );
}

ChatMessageText.propTypes = {
  fromSelf: PropTypes.bool.isRequired,
  message: PropTypes.shape().isRequired,
  onLinkPress: PropTypes.func.isRequired,
  isTapped: PropTypes.bool.isRequired
};

export { ChatMessageText as default };
