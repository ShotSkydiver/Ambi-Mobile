import React, { useCallback, useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  TouchableOpacity,
  View,
  Alert,
  Animated,
  Easing,
  TextInput,
  Text
} from 'react-native';
import styled from 'styled-components';
import i18n from 'format-message';
import { useTheme } from '@react-navigation/native';

import useKeyboard from '../shared/hooks/useKeyboard';
import { AmbiColors } from '../shared/contexts/themeContext';
import CenteredIcon from '../shared/CenteredIcon';
import Send from '../shared/images/send.svg';

const Container = styled(View)`
  flex-direction: row;
  align-items: flex-end;
  padding: 16px 16px 10px 16px;
`;

const SendingIndicator = styled(Text)`
  font-family: Circular-Medium;
  font-size: 12px;
  letter-spacing: 0.2px;
  text-align: right;
  margin: -8px 14px 14px 0;
`;

const StyledSendButton = styled(TouchableOpacity)`
  margin: 0 8px 8px 8px;
`;

const Input = styled(TextInput)`
  flex: 1;
  border-width: 1px;
  min-height: 30px;
  margin: 0 16px;
  padding: 10px 16px 10px 16px;
  border-radius: 8px;
  font-size: 16px;
  font-family: Circular-Book;
  line-height: 20px;
  overflow: hidden;
`;

const StyledAddMediaButton = styled(TouchableOpacity)`
  width: 26px;
  height: 26px;
  margin-left: 8px;
  margin-right: 8px;
  margin-bottom: 7px;
  align-items: center;
  justify-content: center;
`;

const StyledMediaOptions = styled(Animated.View)`
  flex-direction: row;
  height: 100%;
  align-items: flex-end;
  overflow: hidden;
`;

const useSlide = (from, to, duration = 300) => {
  const offset = useRef(new Animated.Value(from)).current;

  const slideIn = useRef(
    Animated.timing(offset, {
      duration,
      toValue: to,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false
    })
  ).current;

  const slideOut = useRef(
    Animated.timing(offset, {
      duration,
      toValue: from,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false
    })
  ).current;

  const startSlideIn = useCallback(() => {
    slideOut.stop();
    slideIn.start();
  }, [slideIn, slideOut]);

  const startSlideOut = useCallback(() => {
    slideIn.stop();
    slideOut.start();
  }, [slideIn, slideOut]);

  return [offset, startSlideIn, startSlideOut];
};

function ChatInput({ channel, onCameraPress, onPhotoLibraryPress }) {
  const { isKeyboardActive } = useKeyboard();
  const [currentText, setCurrentText] = useState('');
  const [sending, setSending] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [offset, startSlideIn, startSlideOut] = useSlide(42, 85);
  const inputRef = useRef(null);
  const [mode, setMode] = useState('media');

  useEffect(() => {
    if (mode === 'text') {
      startSlideOut();
    } else {
      startSlideIn();
    }
  }, [mode, startSlideIn, startSlideOut]);

  useEffect(() => {
    if (!isKeyboardActive) {
      setMode('media');
      setInputFocused(false);
      inputRef.current.blur();
    }
  }, [isKeyboardActive]);

  const onStartTyping = event => {
    setMode('text');
    setCurrentText(event.nativeEvent.text);
    channel.typing();
  };

  function onSendButtonPress() {
    if (channel && !sending && currentText && currentText.trim()) {
      setSending(true);
      // We only show a loading indicator if it's been 200ms. Some study
      // somewhere (citation needed) claimed that it was a good amount
      const isWaitingTimeout = setTimeout(() => {
        setWaiting(true);
      }, 200);
      channel
        .sendMessage(currentText)
        .then(() => {
          channel.setAllMessagesConsumed();
          setSending(false);
          setWaiting(false);
          clearTimeout(isWaitingTimeout);
          setCurrentText('');
          inputRef.current.clear();
        })
        .catch(error => {
          inputRef.current.focus();
          console.warn('Send error: ', error);
          Alert.alert(i18n('Unable to send message. Please try again'));
        });
    }
  }

  const theme = useTheme();
  const { legacy: themeColors } = theme;
  return (
    <>
      {sending && (
        <SendingIndicator style={{ color: themeColors.slateGray }}>
          {i18n('Sending...')}
        </SendingIndicator>
      )}
      <Container
        style={{
          backgroundColor: themeColors.backgroundColor
        }}
      >
        <StyledMediaOptions
          style={{
            width: offset,
            backgroundColor: themeColors.backgroundColor
          }}
        >
          {mode === 'text' ? (
            <StyledAddMediaButton
              onPress={() => {
                setMode('media');
              }}
              rippleColor={AmbiColors.ambiBlue}
            >
              <CenteredIcon
                name="arrow-right"
                size={26}
                color={themeColors.slateGray}
              />
            </StyledAddMediaButton>
          ) : (
            <StyledAddMediaButton
              onPress={onCameraPress}
              rippleColor={AmbiColors.ambiBlue}
            >
              <CenteredIcon
                name="camera"
                size={26}
                color={themeColors.slateGray}
              />
            </StyledAddMediaButton>
          )}
          <StyledAddMediaButton
            onPress={onPhotoLibraryPress}
            rippleColor={AmbiColors.ambiBlue}
          >
            <View accessible>
              <CenteredIcon
                name="image"
                size={26}
                color={themeColors.slateGray}
              />
            </View>
          </StyledAddMediaButton>
        </StyledMediaOptions>
        <Input
          ref={inputRef}
          editable={!waiting}
          placeholder={i18n('Type your message...')}
          placeholderTextColor={themeColors.textPrimaryInactive}
          selectionColor={AmbiColors.ambiBlue}
          multiline
          textAlignVertical="top"
          numberOfLines={3}
          onFocus={() => {
            setInputFocused(true);
            setMode('text');
          }}
          onBlur={() => setInputFocused(false)}
          style={{
            borderColor: inputFocused ? AmbiColors.ambiBlue : '#f1f1f1',
            maxHeight: inputFocused ? 90 : 40,
            backgroundColor: themeColors.elementBGColor,
            color: themeColors.textPrimary
          }}
          onTouchStart={startSlideOut}
          onChange={onStartTyping}
        />
        <StyledSendButton onPress={onSendButtonPress} disabled={waiting}>
          <Send
            width={24}
            height={24}
            fill={
              currentText === ''
                ? themeColors.buttonDisabled
                : AmbiColors.ambiBlue
            }
          />
        </StyledSendButton>
      </Container>
    </>
  );
}

ChatInput.propTypes = {
  channel: PropTypes.shape().isRequired,
  onCameraPress: PropTypes.func,
  onPhotoLibraryPress: PropTypes.func
};

ChatInput.defaultProps = {
  onCameraPress: null,
  onPhotoLibraryPress: null
};

export { ChatInput as default };
