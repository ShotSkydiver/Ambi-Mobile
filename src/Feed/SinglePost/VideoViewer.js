import React, { useRef, useState } from 'react';
import { Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import styled from 'styled-components';
import { connect, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Video from 'react-native-video';
import LinearGradient from 'react-native-linear-gradient';
import { Slider } from '@miblanchard/react-native-slider';
import { ThemeConstants } from '../../shared/contexts/themeContext';
import PostActivity from './PostActivity';
import { togglePostReaction } from '../redux/actions';

const GradientView = styled(LinearGradient)`
  flex: 1;
  flex-direction: column;
  align-items: stretch;
`;

const StyledVideo = styled(Video)`
  flex: 1;
`;

const StyledSlider = styled(Slider)`
  margin: 0 16px;
  padding-horizontal: 16px;
`;

const StyledInfo = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  margin: 0 16px 16px;
`;

const StyledTracks = styled(View)`
  flex-direction: row;
`;

const StyledTrackText = styled(Text)`
  color: #ffffff;
  font-family: Circular-Book;
  font-size: 14px;
  line-height: 18px;
`;

const StyledPostActivityContainer = styled(View)`
  flex: 0 0 56px;
  margin: 0 16px 16px;
`;

const ActivityIndicatorContainer = styled(View)`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  align-items: center;
  justify-content: center;
  z-index: 10;
`;

const TimeTrack = ({ seconds = 0 }) => {
  const onlyMinutes = Math.floor(seconds / 60);
  const onlySeconds = Math.floor(seconds - onlyMinutes * 60);
  return (
    <StyledTrackText>
      {onlyMinutes}:{`0${onlySeconds}`.substr(-2)}
    </StyledTrackText>
  );
};

const VideoViewer = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const post = route.params?.post;
  const { newsfeedType } = post;
  const attachment = route.params?.attachment;

  const [videoLoading, setVideoLoading] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [paused, setPaused] = useState(false);
  const player = useRef(null);

  const toggleLike = () => {
    togglePostReaction(post)(dispatch);
  };

  return (
    <GradientView
      colors={[
        ThemeConstants.dark.elementBGColor,
        ThemeConstants.dark.backgroundColor
      ]}
    >
      <StyledVideo
        ref={player}
        onLoad={({ duration, currentPosition }) => {
          setVideoLoading(false);
          setDuration(duration);
          setCurrentPosition(currentPosition);
        }}
        onProgress={({ currentTime }) => setCurrentPosition(currentTime)}
        poster={attachment.links.preview}
        source={{ uri: attachment.links.content }}
        resizeMode="contain"
        paused={paused || isSeeking}
      />
      {videoLoading && (
        <ActivityIndicatorContainer>
          <ActivityIndicator size="large" />
        </ActivityIndicatorContainer>
      )}
      <StyledSlider
        onValueChange={value => player.current.seek(value)}
        onSlidingStart={() => setIsSeeking(true)}
        onSlidingComplete={() => setIsSeeking(false)}
        minimumValue={0}
        maximumValue={duration}
        value={currentPosition}
        minimumTrackTintColor="#ffffff"
        maximumTrackTintColor="#707689"
        thumbStyle={{ width: 14, height: 14, backgroundColor: '#ffffff' }}
      />
      <StyledInfo>
        <TouchableOpacity>
          <Icon
            onPress={() => setPaused(paused => !paused)}
            name={paused ? 'play' : 'pause'}
            color="#ffffff"
            size={18}
          />
        </TouchableOpacity>
        <StyledTracks>
          <TimeTrack seconds={currentPosition} />
          <StyledTrackText> / </StyledTrackText>
          <TimeTrack seconds={duration} />
        </StyledTracks>
      </StyledInfo>
      <StyledPostActivityContainer>
        <PostActivity
          post={post}
          navigation={navigation}
          newsfeedType={newsfeedType}
          handleLikePress={toggleLike}
          isVideoPlayer
        />
      </StyledPostActivityContainer>
    </GradientView>
  );
};

export default connect(null, { togglePostReaction })(VideoViewer);
