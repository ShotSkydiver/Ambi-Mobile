import React, { useState, memo } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import styled from 'styled-components';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Video from 'react-native-video';

const VideoAttachmentContainer = styled(TouchableOpacity)`
  flex: 1;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
`;

const StyledVideo = styled(Video)`
  border-radius: 7px;
  margin-top: 16px;
  width: 100%;
  height: 220px;
`;

const PlayIcon = styled(FeatherIcon)`
  position: absolute;
  z-index: 2;
`;

const VideoDuration = styled(Text)`
  color: white;
  font-family: Circular-Medium;
  font-size: 14px;
  line-height: 18px;
  text-align: center;
  position: absolute;
  bottom: 10px;
  left: 10px;
  z-index: 2;
`;

const Overlay = styled(View)`
  background-color: #030303;
  opacity: 0.3;
  position: absolute;
  bottom: 0;
  left: 0;
  top: 16px;
  right: 0;
  width: 100%;
  z-index: 1;
  border-radius: 7px;
`;

const SingleVideoAttachment = ({ attachment, onAttachmentPress }) => {
  const [videoDuration, setVideoDuration] = useState('0:00');
  const [videoLoading, setVideoLoading] = useState(true);
  const setDuration = seconds => {
    let mins = ~~(seconds / 60);
    if (mins < 10) {
      mins = `0${mins}`;
    }
    let secs = seconds - mins * 60;
    if (secs < 10) {
      secs = `0${secs}`;
    }
    const hours = ~~(mins / 60);
    setVideoDuration(`${hours > 0 ? `${hours}:` : ''}${mins}:${secs}`);
  };
  return (
    <VideoAttachmentContainer
      activeOpacity={0.5}
      onPress={() => onAttachmentPress(attachment)}
      key={attachment.id}
    >
      <Overlay />
      {!videoLoading && <PlayIcon name="play-circle" size={60} color="white" />}
      {videoLoading && (
        <ActivityIndicator
          size="large"
          style={{ position: 'absolute', zIndex: 3 }}
        />
      )}
      <StyledVideo
        muted
        paused
        resizeMode="cover"
        source={{ uri: attachment.links.content }}
        onLoad={({ duration }) => {
          setDuration(~~duration);
          setVideoLoading(false);
        }}
      />
      <VideoDuration>{videoDuration}</VideoDuration>
    </VideoAttachmentContainer>
  );
};

const VideoAttachments = ({ attachments, onAttachmentPress }) => {
  return (
    <View style={{ flex: 1 }}>
      {attachments.map(attachment => (
        <SingleVideoAttachment
          key={attachment.id}
          attachment={attachment}
          onAttachmentPress={onAttachmentPress}
        />
      ))}
    </View>
  );
};

export { SingleVideoAttachment };
export default memo(VideoAttachments, () => true);
