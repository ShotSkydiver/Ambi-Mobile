/**
 * PostActivity
 */
/* eslint-disable no-underscore-dangle */
import React, { memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from 'react-native';
import i18n from 'format-message';
import styled from 'styled-components';
import { useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import FeatherIcon from 'react-native-vector-icons/Feather';

import { ThemeConstants } from '../../shared/contexts/themeContext';

import Reactions from '../../components/Reactions';

// redux
import { getSinglePost } from '../redux/actions';

const PostActivityContainer = styled(View)`
  flex: 1;
  flex-direction: row;
`;

const PostActivityInfo = styled(TouchableOpacity)`
  flex: 0 auto;
  align-items: center;
  margin-right: 20px;
  flex-direction: row;
`;

const MessageIcon = styled(FeatherIcon)`
  margin-right: 6px;
`;

const ActivityType = styled(Text)`
  color: ${({ textColor }) => textColor};
  opacity: 0.7;
  font-size: 12px;
  font-family: Circular-Bold;
  line-height: 15px;
`;

const PostActivity = ({
  post,
  navigation,
  showCounter,
  newsfeedType,
  isVideoPlayer,
  handleReactionPress,
  isSinglePostModal = false,
  idShowReaction,
  setIdShowReaction
}) => {
  const theme = useTheme();
  const { legacy: themeColors } = theme;
  const dispatch = useDispatch();
  const {
    id: postId,
    likedByUser,
    commentsCount,
    uniqueIdentifier,
    commentsDisabled
  } = post;

  let textComment = i18n('comment');

  if (showCounter && commentsCount > 0) {
    textComment = `${commentsCount} ${i18n(
      commentsCount === 1 ? 'comment' : 'comments'
    )}`;
  }

  const _navigateToComments = useCallback(async () => {
    await getSinglePost({
      postIdentifier: uniqueIdentifier,
      post,
      feedType: newsfeedType
    })(dispatch);

    navigation.navigate('NativeModalNavigator', {
      screen: 'SinglePostScreen',
      params: {
        postId,
        newsfeedType,
        isSinglePostModal
      }
    });
  }, [
    dispatch,
    navigation,
    getSinglePost,
    postId,
    newsfeedType,
    uniqueIdentifier,
    isSinglePostModal
  ]);

  return (
    <PostActivityContainer>
      {!commentsDisabled && (
        <Reactions
          postId={postId}
          reaction={likedByUser}
          onReactionPress={handleReactionPress}
          idShowReaction={idShowReaction}
          setIdShowReaction={setIdShowReaction}
        />
      )}
      <PostActivityInfo
        key={`option-comment-post-${postId}`}
        onPress={_navigateToComments}
        disabled={false}
      >
        <MessageIcon
          name="message-square"
          size={24}
          color={
            isVideoPlayer
              ? ThemeConstants.dark.textPrimary
              : themeColors.slateGray
          }
        />
        <ActivityType
          textColor={
            isVideoPlayer
              ? ThemeConstants.dark.textPrimary
              : themeColors.textPrimary
          }
        >
          {textComment}
        </ActivityType>
      </PostActivityInfo>
    </PostActivityContainer>
  );
};

PostActivity.propTypes = {
  post: PropTypes.shape().isRequired,
  navigation: PropTypes.shape().isRequired,
  showCounter: PropTypes.bool,
  newsfeedType: PropTypes.string.isRequired,
  isVideoPlayer: PropTypes.bool,
  handleReactionPress: PropTypes.func,
  isSinglePostModal: PropTypes.bool
};

PostActivity.defaultProps = {
  showCounter: false,
  isVideoPlayer: false,
  handleReactionPress: () => {},
  isSinglePostModal: false
};

function areEqual(prevProps, nextProps) {
  return (
    prevProps.post.likesCount === nextProps.post.likesCount &&
    prevProps.post.commentsCount === nextProps.post.commentsCount &&
    prevProps.post.likedByUser === nextProps.post.likedByUser &&
    prevProps.post.commentsDisabled === nextProps.post.commentsDisabled &&
    prevProps.idShowReaction === nextProps.idShowReaction
  );
}
export default memo(PostActivity, areEqual);
