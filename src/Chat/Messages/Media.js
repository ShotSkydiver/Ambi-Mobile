/**
 * ChatMessageMedia
 */
/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, Animated, Easing } from 'react-native';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';
import { useTheme } from '@react-navigation/native';

import { ambiApi } from '../../models/AmbiApi';
import LoaderIcon from '../../shared/images/loader.svg';

const StyledMediaContainer = styled(View)`
  margin-left: ${({ fromSelf }) => (fromSelf ? 'auto' : '0')};
  margin-right: ${({ fromSelf }) => (fromSelf ? '0' : 'auto')};
  align-items: ${({ fromSelf }) => (fromSelf ? 'flex-end' : 'flex-start')};
`;

const MediaImage = styled(FastImage)`
  width: 80%;
  display: flex;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
`;

const ContainerAnimation = styled(Animated.View)`
  width: 30;
  height: 30;
`;

function ChatMessageMedia({ message, onPress, fromSelf }) {
  const [aspectRatio, setAspectRatio] = useState(1.5);
  const [contentLink, setContentLink] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const spinValue = new Animated.Value(0);

  const theme = useTheme();
  const {
    legacy: { imageBGColor, textPrimary: colorText }
  } = theme;

  Animated.timing(spinValue, {
    toValue: 1,
    duration: 3000,
    easing: Easing.linear, // Easing is an additional import from react-native
    useNativeDriver: true // To make use of native driver for performance
  }).start();

  // Next, interpolate beginning and end values (in this case 0 and 1)
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const {
    attributes: { media }
  } = message;
  const handleImageLoad = ({ nativeEvent: { width, height } }) => {
    setAspectRatio(width / height);
  };

  useEffect(() => {
    async function fetchMedia() {
      try {
        const result = await ambiApi.getFromApi(
          `/chat/media/${media.uniqueIdentifier}`
        );
        const { data: newMsgMedia } = result;
        setContentLink(newMsgMedia.links.content);
      } catch (err) {
        console.warn('error fetching msg media: ', err);
      }
    }
    if (media?.uniqueIdentifier) {
      fetchMedia();
    }
  }, [media?.uniqueIdentifier]);

  const _onLoadStart = () => setIsLoading(true);
  const _onLoadEnd = () => setIsLoading(false);

  return (
    <StyledMediaContainer fromSelf={fromSelf}>
      <TouchableOpacity onPress={() => onPress(media)}>
        <MediaImage
          onLoad={handleImageLoad}
          source={{
            uri: contentLink,
            priority: FastImage.priority.normal
          }}
          style={{ aspectRatio, backgroundColor: imageBGColor }}
          onLoadStart={_onLoadStart}
          onLoadEnd={_onLoadEnd}
        >
          {isLoading && (
            <ContainerAnimation style={{ transform: [{ rotate: spin }] }}>
              <LoaderIcon width={30} height={30} fill={colorText} />
            </ContainerAnimation>
          )}
        </MediaImage>
      </TouchableOpacity>
    </StyledMediaContainer>
  );
}

ChatMessageMedia.propTypes = {
  fromSelf: PropTypes.bool.isRequired,
  message: PropTypes.shape().isRequired,
  onPress: PropTypes.func.isRequired
};

export { ChatMessageMedia as default };
