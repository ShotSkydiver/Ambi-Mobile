import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { View, Text, PanResponder } from 'react-native';
import styled from 'styled-components';
import i18n from 'format-message';
import { useTheme } from '@react-navigation/native';

import MessageAttachment from './Attachment';
import MessageText from './Text';
import MessageMedia from './Media';

import { formatDate } from '../../shared/utils/helpers';

const Container = styled(View)``;

const Content = styled(View)`
  display: flex;
  flex-direction: row;
  margin-top: 8px;
`;

const StatusIndicator = styled(Text)`
  font-family: Circular-Book;
  font-size: 14px;
  line-height: 18px;
  text-align: right;
  margin: 5px 5px 10px 0;
`;

const Time = styled(Text)`
  text-align: center;
  line-height: 13px;
  font-size: 13px;
  font-family: Circular-Book;
  margin: 5px 0 10px 0;
`;

function BaseMessageItem({
  message,
  onLinkPress,
  shouldShowTime,
  memberships,
  isLastMessage,
  navigation,
  fromSelf
}) {
  const [isTapped, toggleTapMessage] = useState(false);

  const isGroupChat = memberships.length > 2;
  const {
    index,
    type,
    dateCreated,
    attributes: { media }
  } = message;

  const messageSeenBy = memberships.filter(
    member =>
      member.lastConsumedMessageIndex === index ||
      member.lastConsumedMessageIndex > index
  );

  const hasSeenStatus = messageSeenBy.length > 0;
  const messageSeenLength = messageSeenBy.length;

  const sortTimestamps = timestamps => {
    return timestamps.sort((a, b) => {
      return new Date(a).valueOf() - new Date(b).valueOf();
    });
  };

  const useCreatedDate = isLastMessage && fromSelf;
  const consumedTimestamps = messageSeenBy.map(m => m.lastConsumptionTimestamp);
  const messageTime = formatDate(
    hasSeenStatus && !useCreatedDate
      ? sortTimestamps(consumedTimestamps)[0]
      : dateCreated
  );

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      if (gestureState.dx < -50 && isGroupChat && fromSelf) {
        navigation.navigate('ChatMessageStatus', {
          messageSid: message.sid,
          channelSid: message.channel.sid
        });
      }
    }
  });

  const theme = useTheme();
  const { legacy: themeColors } = theme;

  const renderMessageStatus = () => {
    return (
      <StatusIndicator style={{ color: themeColors.slateGray }}>
        {hasSeenStatus ? messageTime : `Delivered ${messageTime}`}
        {hasSeenStatus &&
          i18n('{status}', {
            status: isGroupChat
              ? ` - Seen by ${
                  messageSeenLength === memberships.length
                    ? 'All'
                    : messageSeenLength
                }`
              : ` - Seen`
          })}
      </StatusIndicator>
    );
  };

  const onMessagePress = () => {
    if (fromSelf && !isLastMessage && !isGroupChat) {
      toggleTapMessage(!isTapped);
    }
  };

  const showImagePreviewScreen = media => {
    navigation.navigate('NativeModalNavigator', {
      screen: 'ImagePreviewScreen',
      params: { images: [media] }
    });
  };

  const isTextMessage = type === 'text' && !media;

  return (
    <Container>
      {shouldShowTime && (
        <Time style={{ color: themeColors.disabled }}>
          {formatDate(dateCreated)}
        </Time>
      )}
      <Content>
        {isTextMessage ? (
          <MessageText
            fromSelf={fromSelf}
            message={message}
            onLinkPress={onLinkPress}
            isTapped={isTapped}
            onPress={onMessagePress}
            isLastMessage={isLastMessage}
            isGroupChat={isGroupChat}
            {...panResponder.panHandlers}
          />
        ) : media && media.contentType.indexOf('image/') === 0 ? (
          <MessageMedia
            message={message}
            onPress={showImagePreviewScreen}
            fromSelf={fromSelf}
          />
        ) : (
          media &&
          (media.filename || media.contentType.indexOf('video/') === 0) && (
            <MessageAttachment message={message} fromSelf={fromSelf} />
          )
        )}
      </Content>
      {isTapped && (
        <StatusIndicator style={{ color: themeColors.slateGray }}>
          {renderMessageStatus()}
        </StatusIndicator>
      )}
      {isLastMessage && fromSelf && renderMessageStatus()}
    </Container>
  );
}

BaseMessageItem.propTypes = {
  message: PropTypes.shape().isRequired,
  shouldShowTime: PropTypes.bool.isRequired
};

export { BaseMessageItem as default };
