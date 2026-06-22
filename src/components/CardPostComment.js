/**
 * CardPostComment
 * component for comments and replies in Post
 */
/* eslint-disable no-underscore-dangle */
import React, { useCallback, useState } from 'react';
import { View, Text, Alert } from 'react-native';
import i18n from 'format-message';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useTheme } from '@react-navigation/native';

// components
import BottomSheet from '../shared/BottomSheet';
import CommentBody from './CommentBody';
import CommentLikeLabel from './CommentLikeLabel';
import CommentReplyLabel from './CommentReplyLabel';
import CommentComposer from '../containers/CommentComposer';

// helpers
import { User } from '../models/User';
import { IS_ANDROID } from '../shared/constants';
import { upperFirstLetter, formatDate } from '../shared/utils/helpers';

const Container = styled(View)`
  flex: 1;
  width: 100%;
  padding: 8px;
  flex-shrink: 0;
  flex-direction: column;
`;

const Footer = styled(View)`
  flex: 1;
  margin-left: 10px;
  padding-top: 5px;
  flex-direction: row;
`;

const DateTime = styled(Text)`
  flex: 1;
  font-size: 12px;
  margin-left: 22px;
  font-family: Circular-Book;
  margin-top: 3px;
`;

const CardPostComment = ({
  comment,
  userAuth,
  showActions,
  commentLikeProps,
  commentReplyProps,
  navigation,

  // action
  delComment,
  editComment,
  navigateToProfile
}) => {
  const {
    createdBy: { user: userBy } = {},
    parentPostCommentId,
    postId,
    dateCreated
  } = comment || {};

  const theme = useTheme();
  const isReply = !!parentPostCommentId;
  const backgroundComment = !IS_ANDROID ? theme.backgroundColor : 'transparent';
  const { legacy: themeColors } = theme;

  const [showCommentActions, setShowCommentActions] = useState(false);
  const CurrentUser = new User(userAuth);

  const isAdmin = CurrentUser.isAdmin();
  const myOwnComment = userBy?.id === userAuth?.id;

  const _cancelShowReplyActions = useCallback(
    () => setShowCommentActions(false),
    []
  );
  const _toggleShowReplyActions = useCallback(() => {
    setShowCommentActions(!showCommentActions);
  }, [showCommentActions]);

  const typeComment = isReply ? 'reply' : 'comment';

  const _showAlertDelete = () => {
    Alert.alert(
      `Delete this ${typeComment}?`,
      `Are you sure you want to delete this ${typeComment}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: _cancelShowReplyActions
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            _cancelShowReplyActions();
            delComment();
          }
        }
      ],
      { cancelable: false }
    );
  };

  const _reportComment = () => {
    navigation.navigate('NativeModalNavigator', {
      screen: 'ReportPostScreen',
      params: { comment, typeComment, postId }
    });
    setShowCommentActions(false);
  };

  const _optionEditComment = () => {
    setShowCommentActions(false);
    editComment();
  };

  const menuOptions = {
    edit: {
      icon: 'edit-2',
      title: i18n('Edit'),
      onPress: _optionEditComment
    },
    report: {
      icon: 'flag',
      title: i18n(`Report`),
      onPress: _reportComment
    },
    delete: {
      icon: 'trash-2',
      title: i18n('Delete'),
      onPress: _showAlertDelete
    }
  };

  const {
    edit: optionEdit,
    report: optionReport,
    delete: optionDelete
  } = menuOptions;

  let optionsForCommentActions = [];
  if (myOwnComment) {
    optionsForCommentActions = [optionEdit, optionDelete];
  } else {
    optionsForCommentActions = [optionReport];
    if (isAdmin) {
      optionsForCommentActions.push(optionDelete);
    }
  }

  return (
    <Container style={{ backgroundColor: backgroundComment }}>
      <CommentBody
        user={userBy}
        onNavigate={navigateToProfile}
        showIconMenu
        onPressMenu={_toggleShowReplyActions}
      >
        <CommentComposer comment={comment} action="readonly" />
      </CommentBody>
      {showActions && (
        <Footer>
          {commentLikeProps && <CommentLikeLabel {...commentLikeProps} />}
          {commentReplyProps && (
            <CommentReplyLabel
              {...commentReplyProps}
              style={{ marginLeft: 16 }}
            />
          )}
          <DateTime style={{ color: themeColors.slateGray }}>
            {formatDate(dateCreated)}
          </DateTime>
        </Footer>
      )}
      <BottomSheet
        visible={showCommentActions}
        title={i18n(`${upperFirstLetter(typeComment)} Actions`)}
        options={optionsForCommentActions}
        toggle={_toggleShowReplyActions}
      />
    </Container>
  );
};

CardPostComment.propTypes = {
  showActions: PropTypes.bool,
  commentsDisabled: PropTypes.bool,
  commentLikeProps: PropTypes.shape({
    onPress: PropTypes.func,
    counter: PropTypes.number,
    likedByUser: PropTypes.bool
  }),
  commentReplyProps: PropTypes.shape({
    onPress: PropTypes.func
  }),
  navigation: PropTypes.shape().isRequired,

  // actions
  delComment: PropTypes.func,
  editComment: PropTypes.func
};

CardPostComment.defaultProps = {
  showActions: true,
  commentsDisabled: false,
  commentLikeProps: null,
  commentReplyProps: null,

  // actions
  delComment: () => {},
  editComment: () => {}
};

export default CardPostComment;
