/**
 * HocCommentComposer (High Order Component)
 */
/* eslint-disable react/display-name */
/* eslint-disable no-underscore-dangle */
import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useTheme } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';

// redux
import { getFeedPosts } from '../redux/selectors';
import {
  editComment,
  createComment,
  deleteComment,
  toggleLikeComment
} from '../redux/actions';
import { updateCurrentUserInView } from '../../Profile/redux/actions';
import { FullScreenLoader } from '../../shared/Loader';

const Container = styled(View)`
  flex: 1;
`;

const HocCommentComposer = WrappedComponent => {
  const Component = props => {
    const { route, navigation } = props;
    const { params: { postId, newsfeedType } = {} } = route;

    const theme = useTheme();
    const {
      legacy: {
        body: colorBody,
        slateGray: colorSlateGray,
        textPrimary: colorTextPrimary,
        shadowBorder: colorBorderInput,
        backgroundColor,
        systemBorderColor: colorSystemBorder
      }
    } = theme;

    const propsColor = {
      colorBody,
      colorSlateGray,
      colorTextPrimary,
      colorBorderInput,
      backgroundColor,
      colorSystemBorder
    };

    const dispatch = useDispatch();
    const [editCommentInfo, setEditCommentInfo] = useState(null);

    const allPosts = useSelector(getFeedPosts(newsfeedType));
    const userAuth = useSelector(state => state.auth.user);
    const singlePost = useSelector(state => state.feed.singlePost);
    const post = singlePost || allPosts.find(p => p.id === postId);

    const [uploading, setUploading] = useState(false);
    const [uploadingText, setUploadingText] = useState('Uploading...');
    const [likeActionInProgress, setLikeActionInProgress] = useState(false);

    const _navigateToProfile = async ({ createdBy: { user: byUser } = {} }) => {
      if (byUser) {
        const user = { id: byUser.id, profile: byUser };
        updateCurrentUserInView(user)(dispatch);
        navigation.navigate('ModalNavigator', {
          screen: 'Profile',
          params: { user }
        });
      }
    };

    const _navigateToReplies = async parentReplayId => {
      navigation.navigate('NativeModalNavigator', {
        screen: 'ModalRepliesScreen',
        params: {
          postId: post.id,
          commentId: parentReplayId,
          newsfeedType
        }
      });
    };

    const _onPressLikeComment = async (comment, post) => {
      if (!likeActionInProgress) {
        setLikeActionInProgress(true);
        await toggleLikeComment(post, comment, comment.id)(dispatch);
        setLikeActionInProgress(false);
      }
    };

    const _onCreateComment = async comment => {
      await createComment(post, comment, {
        onUploadLoaded: () => {},
        onUploadStarted: () => {
          setUploading(true);
          setUploadingText('Uploading...');
        },
        onUploadProgress: ({ progress, count }) => {
          const { attachmentNumber, totalAttachments } = count;
          setUploadingText(
            `Uploading file ${attachmentNumber} of ${totalAttachments}... ${progress}%`
          );
        },
        onUploadError: ({ name }) => {
          Alert.alert(
            `There was an error uploading ${name}! Please try again.`
          );
          setUploading(false);
        },
        onUploadFinished: ({ name }) => {
          setUploadingText(`Finished uploading ${name}!`);
        }
      })(dispatch);
      setUploading(false);
    };

    const _onDeleteComment = comment => {
      deleteComment(post, comment)(dispatch);
    };

    const _onLoadEditedCommentInfo = comment => {
      setEditCommentInfo(comment);
    };

    const _onClearEditedCommentInfo = () => {
      setEditCommentInfo(null);
    };

    const _onSaveEditedCommentInfo = async commentEdited => {
      await editComment(post, commentEdited)(dispatch);
      _onClearEditedCommentInfo();
    };

    return (
      <Container>
        <WrappedComponent
          post={post}
          colors={propsColor}
          userAuth={userAuth}
          editCommentInfo={editCommentInfo}
          navigateToProfile={_navigateToProfile}
          navigateToReplies={_navigateToReplies}
          // actions
          onPressLike={_onPressLikeComment}
          onCreateComment={_onCreateComment}
          onDeleteComment={_onDeleteComment}
          onLoadEditedCommentInfo={_onLoadEditedCommentInfo}
          onClearEditedCommentInfo={_onClearEditedCommentInfo}
          onSaveEditedCommentInfo={_onSaveEditedCommentInfo}
          {...props}
        />
        {uploading && <FullScreenLoader text={uploadingText} />}
      </Container>
    );
  };

  return Component;
};

HocCommentComposer.propTypes = {
  route: PropTypes.shape({
    postId: PropTypes.string,
    commentId: PropTypes.string,
    newsfeedType: PropTypes.string
  }).isRequired,
  navigation: PropTypes.shape().isRequired
};

export default HocCommentComposer;
