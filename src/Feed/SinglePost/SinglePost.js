/**
 * SinglePost
 */
/* eslint-disable no-underscore-dangle */
import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import styled from 'styled-components';
import { useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import {
  togglePostPin,
  togglePostPoll,
  deletePost,
  togglePostReaction,
  setShowComments
} from '../redux/actions';
import PostHeader from './PostHeader';
import PostContent from './PostContent';
import PostActivity from './PostActivity';
import SinglePostPins from './SinglePostPins';

import PostActivityResult from '../../components/PostActivityResult';

const SinglePostContainer = styled(View)`
  flex: 1;
  flex-shrink: 0;
`;

const SinglePostContent = styled(View)`
  padding: 16px;
  border-top-width: 0.5px;
  border-bottom-width: 0.5px;
`;

const SinglePost = ({
  post,
  route,
  isModal,
  hostInfo,
  navigation,
  currentUser,
  showComments,
  newsfeedType,
  containerStyles,
  showActivityResult,
  idShowReaction,
  setIdShowReaction
}) => {
  const dispatch = useDispatch();
  const { announcementEnabled, postPins } = post;

  const isPinned = postPins && postPins.length > 0;
  const theme = useTheme();
  const { legacy: themeColors } = theme;

  const _onDeleteItem = () => deletePost(post)(dispatch);

  const _onTogglePin = isPinned => {
    togglePostPin(post, isPinned)(dispatch);
  };

  const _onToggleVote = (option, isVoted) =>
    togglePostPoll(post, option, isVoted)(dispatch);

  const _onReaction = reaction => {
    togglePostReaction(post, reaction)(dispatch);
  };

  const _onToggleShowComments = () => {
    setShowComments(!showComments)(dispatch);
  };

  return (
    <SinglePostContainer style={containerStyles}>
      {(isPinned || announcementEnabled) && (
        <SinglePostPins
          postPins={postPins || []}
          announcementEnabled={announcementEnabled}
        />
      )}
      <SinglePostContent
        style={{
          backgroundColor: themeColors.backgroundColor,
          borderBottomColor: themeColors.systemBorderColor,
          borderTopColor: themeColors.systemBorderColor
        }}
      >
        <PostHeader
          post={post}
          navigation={navigation}
          currentUser={currentUser}
          isPinned={isPinned}
          togglePostPin={_onTogglePin}
          deletePost={_onDeleteItem}
          newsfeedType={newsfeedType}
          isSinglePostModal={isModal}
          hostInfo={hostInfo}
        />
        <PostContent
          post={post}
          navigation={navigation}
          currentUser={currentUser}
          togglePostVote={_onToggleVote}
        />
        {showActivityResult && (
          <PostActivityResult
            post={post}
            onPress={_onToggleShowComments}
            disabled={isModal}
            typeCounterComments={route ? 'inScreen' : 'total'}
            navigation={navigation}
          />
        )}
        <PostActivity
          post={post}
          navigation={navigation}
          newsfeedType={newsfeedType}
          handleReactionPress={_onReaction}
          isSinglePostModal={isModal}
          idShowReaction={idShowReaction}
          setIdShowReaction={setIdShowReaction}
        />
      </SinglePostContent>
    </SinglePostContainer>
  );
};

SinglePost.propTypes = {
  post: PropTypes.shape({}).isRequired,
  route: PropTypes.shape(),
  isModal: PropTypes.bool,
  hostInfo: PropTypes.shape({}),
  navigation: PropTypes.shape({}).isRequired,
  showComments: PropTypes.bool,
  containerStyles: PropTypes.shape({}),
  showActivityResult: PropTypes.bool
};

SinglePost.defaultProps = {
  route: null,
  isModal: false,
  hostInfo: {},
  showComments: true,
  containerStyles: {},
  showActivityResult: true
};

export default SinglePost;
