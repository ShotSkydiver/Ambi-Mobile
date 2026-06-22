/**
 * ModalSinglePost
 */
/* eslint-disable react/display-name */
import React, { useEffect } from 'react';
import { View, StatusBar, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import i18n from 'format-message';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '@react-navigation/native';

// components
import SinglePost from './SinglePost';
import ListComments from './ListComments';
import FooterCommentComposer from '../../components/FooterCommentComposer';
import { IconHeaderButtons, Item } from '../../shared/HeaderButtons';
import { IS_ANDROID } from '../../shared/constants';

// redux
import { resetSinglePost } from '../redux/actions';
import HocCommentComposer from '../hoc/HocCommentComposer';

const Container = styled(KeyboardAvoidingView)`
  flex: 1;
`;

const ContentWrapper = styled(View)`
  flex: 1;
  min-height: 100%;
  padding-bottom: 0px;
`;

const ModalSinglePost = ({
  route,
  navigation,
  editCommentInfo,

  // actions
  onCreateComment,
  onLoadEditedCommentInfo,
  onSaveEditedCommentInfo,
  onClearEditedCommentInfo
}) => {
  const currentUser = useSelector(state => state.auth.user);
  const feed = useSelector(state => state.feed);
  const { singlePost: post, showComments } = feed;
  const { commentsDisabled } = post;
  const newsfeedType = route.params?.newsfeedType || 'general';
  const isSinglePostModal = route.params?.isSinglePostModal || false;

  const theme = useTheme();
  const { legacy: themeColors } = theme;

  const dispatch = useDispatch();

  useEffect(() => {
    const goBack = () => {
      resetSinglePost()(dispatch);
      navigation.pop();
    };

    const navigationOptions = {
      headerLeft: () => (
        <IconHeaderButtons useLeftHeader={false}>
          <Item title="X" iconName="close" onPress={goBack} />
        </IconHeaderButtons>
      )
    };

    navigation.setOptions({ ...navigationOptions });
  }, [navigation, themeColors.backgroundColor, themeColors.textPrimary]);

  let inputComposerProps = {
    key: 'create',
    action: 'create',
    onSave: onCreateComment
  };

  if (editCommentInfo) {
    inputComposerProps = {
      key: 'edit',
      action: 'edit',
      comment: editCommentInfo,
      onSave: onSaveEditedCommentInfo,
      onCancel: onClearEditedCommentInfo
    };
  }

  return (
    <Container behavior={IS_ANDROID ? 'height' : 'padding'}>
      <SafeAreaView
        style={{ backgroundColor: themeColors.backgroundColor, flex: 1 }}
        mode="padding"
      >
        <ContentWrapper>
          <ListComments
            ListHeaderComponent={
              <SinglePost
                post={post}
                route={route}
                isModal={isSinglePostModal}
                navigation={navigation}
                currentUser={currentUser}
                showComments={showComments}
                newsfeedType={newsfeedType}
                showActivityResult
              />
            }
            route={route}
            navigation={navigation}
            showComments={showComments}
            onLoadEditedCommentInfo={onLoadEditedCommentInfo}
          />
        </ContentWrapper>
        {!commentsDisabled && (
          <FooterCommentComposer
            showAvatar={false}
            inputProps={{ placeholder: i18n('Leave a comment...') }}
            {...inputComposerProps}
            style={{
              paddingLeft: 16,
              paddingRight: 16,
              borderTopWidth: 1,
              borderTopColor: themeColors.systemBorderColor
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

ModalSinglePost.propTypes = {
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

ModalSinglePost.defaultProps = {
  editCommentInfo: null,

  // actions
  onCreateComment: () => {},
  onLoadEditedCommentInfo: () => {},
  onSaveEditedCommentInfo: () => {},
  onClearEditedCommentInfo: () => {}
};

export default HocCommentComposer(ModalSinglePost);
