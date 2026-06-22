/**
 * CardAttachmentVideo
 */
/* eslint-disable no-underscore-dangle */
import React, { useState, useRef, useCallback } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Video from 'react-native-video';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import FeatherIcon from 'react-native-vector-icons/Feather';

// components
import CardAttachmentBody from './CardAttachmentBody';
import { ShadowStyles } from '../shared/contexts/themeContext';

const ContainerVideo = styled(TouchableOpacity)`
  flex: 1;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 10px;
`;

const ContainerPlay = styled(View)`
  flex: 1;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  z-index: 2;
  position: absolute;
  align-items: center;
  justify-content: center;
`;

const ButtonPlay = styled(FeatherIcon)`
  position: absolute;
`;

const VideoViewer = styled(Video)`
  flex: 1;
`;

const CardAttachmentVideo = ({ style, video, iconRemoveStyle, onRemove }) => {
  const { uniqueIdentifier: videoKey, path: uri } = video || {};
  const playerRef = useRef(null);
  const [isPaused, setIsPaused] = useState(true);

  const _onRemove = useCallback(() => onRemove(videoKey), [onRemove, videoKey]); // eslint-disable-line
  const _onTogglePause = useCallback(() => setIsPaused(!isPaused), [isPaused]);
  const _onEndVideo = useCallback(() => {
    setIsPaused(true);
    if (playerRef) {
      playerRef.current.seek(0);
    }
  }, [playerRef]);

  if (video === null) { return null; } // eslint-disable-line
  return (
    <CardAttachmentBody
      style={style}
      onRemove={onRemove ? _onRemove : null}
      iconRemoveStyle={iconRemoveStyle}
    >
      <ContainerVideo onPress={_onTogglePause}>
        <ContainerPlay>
          {isPaused && (
            <ButtonPlay
              name="play-circle"
              size={30}
              color="#fff"
              style={ShadowStyles.buttonsAndText}
            />
          )}
        </ContainerPlay>
        <VideoViewer
          ref={playerRef}
          onEnd={_onEndVideo}
          source={{ uri }}
          paused={isPaused}
          muted
          resizeMode="cover"
        />
      </ContainerVideo>
    </CardAttachmentBody>
  );
};

CardAttachmentVideo.propTypes = {
  style: PropTypes.shape(),
  video: PropTypes.shape({
    path: PropTypes.string,
    uniqueIdentifier: PropTypes.string
  }),
  iconRemoveStyle: PropTypes.shape(),

  // actions
  onRemove: PropTypes.func
};

CardAttachmentVideo.defaultProps = {
  style: {},
  video: null,
  iconRemoveStyle: {},

  // actions
  onRemove: null
};

export default CardAttachmentVideo;
