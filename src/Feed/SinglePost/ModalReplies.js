/* eslint-disable react/display-name */
/**
 * ModalReplies
 */
import React, { useEffect, useRef } from 'react';
import { View, Text, StatusBar, KeyboardAvoidingView } from 'react-native';
import i18n from 'format-message';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';

import { IS_ANDROID } from '../../shared/constants';
import { getFeedPosts } from '../redux/selectors';
import FooterCommentComposer from '../../components/FooterCommentComposer';

// containers
import ListReplies from './ListReplies';
import HocCommentComposer from '../hoc/HocCommentComposer';

const Container = styled(KeyboardAvoidingView)`
  flex: 1;
  border-top-width: 1px;
`;

const ContentWrapper = styled(View)`
  flex: 1;
`;

const CounterReplies = styled(Text)`
  font-size: 17px;
  line-height: 22px;
  font-family: Circular Book;
  margin-right: 5px;
`;

const ModalReplies = ({
  route,
  route: { params: { postId, commentId, newsfeedType } = {} },
  navigation,
  editCommentInfo,

  // actions
  onCreateComment,
  onLoadEditedCommentInfo,
  onSaveEditedCommentInfo,
  onClearEditedCommentInfo
}) => {
  const inputRef = useRef(null);

  const theme = useTheme();
  const { legacy: themeColors } = theme;

  const allPosts = useSelector(getFeedPosts(newsfeedType));
  const singlePost = useSelector(state => state.feed.singlePost);
  const post = singlePost || allPosts.find(p => p.id === postId);

  const { comments = [], commentsDisabled } = post;
  const parentComment = comments.find(item => item.id === commentId);
  let { replies = [], repliesCount = 0 } = parentComment;
  replies = replies || [];
  repliesCount = repliesCount || 0;

  useEffect(() => {
    const navigationOptions = {
      headerRight: () => (
        <View>
          {replies?.length && repliesCount > 0 ? (
            <CounterReplies style={{ color: themeColors.slateGray }}>
              {`${replies.length} of ${repliesCount}`}
            </CounterReplies>
          ) : null}
        </View>
      )
    };

    navigation.setOptions({ ...navigationOptions });
  }, [
    replies,
    repliesCount,
    themeColors.backgroundColor,
    themeColors.textPrimary
  ]);

  const onPressReply = () => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  };

  let inputComposerProps = {
    action: 'create',
    onSave: onCreateComment,
    parentIdForReply: commentId
  };

  if (editCommentInfo) {
    inputComposerProps = {
      action: 'edit',
      comment: editCommentInfo,
      onSave: onSaveEditedCommentInfo,
      onCancel: onClearEditedCommentInfo
    };
  }

  return (
    <Container
      style={{ backgroundColor: themeColors.body }}
      behavior={IS_ANDROID ? 'height' : 'padding'}
    >
      <SafeAreaView
        style={{ backgroundColor: themeColors.backgroundColor, flex: 1 }}
        mode="margin"
      >
        <ContentWrapper>
          <ListReplies
            route={route}
            onPressReply={onPressReply}
            navigation={navigation}
            onLoadEditedCommentInfo={onLoadEditedCommentInfo}
          />
        </ContentWrapper>

        {!commentsDisabled && (
          <FooterCommentComposer
            inputRef={inputRef}
            showAvatar={false}
            inputProps={{ placeholder: i18n('Leave a reply...') }}
            {...inputComposerProps}
            style={{
              paddingLeft: 16,
              paddingRight: 16,
              borderTopWidth: 1,
              borderTopColor: themeColors.systemBorderColor,
              backgroundColor: themeColors.body
            }}
          />
        )}
        <StatusBar
          barStyle={theme.dark ? 'light-content' : 'dark-content'}
          backgroundColor={themeColors.backgroundColor}
          animated
          translucent
        />
      </SafeAreaView>
    </Container>
  );
};

ModalReplies.propTypes = {
  route: PropTypes.shape({}).isRequired,
  colors: PropTypes.shape({}).isRequired,
  navigation: PropTypes.shape({}).isRequired,
  editCommentInfo: PropTypes.shape({}),

  // actions
  onCreateComment: PropTypes.func,
  onLoadEditedCommentInfo: PropTypes.func,
  onSaveEditedCommentInfo: PropTypes.func,
  onClearEditedCommentInfo: PropTypes.func
};

ModalReplies.defaultProps = {
  editCommentInfo: null,

  // actions
  onCreateComment: () => {},
  onLoadEditedCommentInfo: () => {},
  onSaveEditedCommentInfo: () => {},
  onClearEditedCommentInfo: () => {}
};

export default HocCommentComposer(ModalReplies);
