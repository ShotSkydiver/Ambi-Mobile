/**
 * ListComments
 */
/* eslint-disable no-underscore-dangle */
import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import styled from 'styled-components';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getPostComments } from '../redux/actions';
import CardPostComment from '../../components/CardPostComment';
import HocCommentComposer from '../hoc/HocCommentComposer';

const Container = styled(View)`
  flex: 2;
`;

const List = styled(FlatList)`
  height: 100%;
  padding-top: 0px;
  padding-bottom: 50px;
`;

const ListEmpty = styled(View)`
  flex: 2;
  padding-top: 8px;
`;

const SingleCommentContainer = styled(View)`
  margin-bottom: 16px;
  margin-horizontal: 8px;
`;

const ReplySection = styled(TouchableOpacity)`
  padding: 0 16px;
  flex-direction: row;
`;

const ReplyLabelSection = styled(Text)`
  opacity: 0.7;
  font-size: 14px;
  margin-top: 16px;
  margin-left: 12px;
  line-height: 15px;
  font-family: Circular-Bold;
`;

const ListComments = ({
  ListHeaderComponent,
  post,
  colors,
  userAuth,
  navigation,
  showComments,

  // actions
  onPressLike,
  onDeleteComment,
  navigateToProfile,
  navigateToReplies,
  onLoadEditedCommentInfo
}) => {
  const dispatch = useDispatch();
  const { colorSlateGray } = colors;

  const { comments = [], commentsCount, commentsDisabled } = post;

  const _loadMoreComments = async post => {
    await getPostComments(post)(dispatch);
  };

  const renderComment = ({ item }) => {
    const {
      id: commentId,
      likesCount,
      likedByUser,
      repliesCount,
      parentPostCommentId: parentReplyId
    } = item;

    const messageReply =
      repliesCount > 1
        ? `see replies (${repliesCount})`
        : `${repliesCount || 0} reply`;

    return !parentReplyId ? (
      <SingleCommentContainer>
        <CardPostComment
          key={`list-commment-commentItem-${commentId}`}
          comment={item}
          userAuth={userAuth}
          navigation={navigation}
          delComment={() => onDeleteComment(item)}
          editComment={() => onLoadEditedCommentInfo(item)}
          commentsDisabled={commentsDisabled}
          navigateToProfile={() => navigateToProfile(item)}
          commentLikeProps={{
            onPress: () => onPressLike(item, post),
            counter: likesCount,
            likedByUser
          }}
          commentReplyProps={{
            onPress: () => navigateToReplies(commentId)
          }}
        />
        {repliesCount > 0 && (
          <ReplySection onPress={() => navigateToReplies(commentId)}>
            <FeatherIcon
              name="corner-down-right"
              size={24}
              color={colorSlateGray}
              style={{ marginTop: 10, marginLeft: 42, fontWeight: '900' }}
            />
            <ReplyLabelSection style={{ color: colorSlateGray }}>
              {messageReply}
            </ReplyLabelSection>
          </ReplySection>
        )}
      </SingleCommentContainer>
    ) : null;
  };

  return (
    <SafeAreaView
      style={{ flex: 1 }}
      mode="padding"
      edges={['right', 'top', 'left']}
    >
      <Container>
        {/** Render List */}
        {showComments && (
          <List
            keyboardDismissMode="on-drag"
            ListHeaderComponent={
              <>
                <View style={{ zIndex: comments.length }}>
                  {ListHeaderComponent}
                </View>
                {comments.length < commentsCount && (
                  <ReplySection onPress={() => _loadMoreComments(post)}>
                    <ReplyLabelSection
                      style={{
                        color: colorSlateGray,
                        marginLeft: 10,
                        marginBottom: 15
                      }}
                    >
                      load earlier comments
                    </ReplyLabelSection>
                  </ReplySection>
                )}
              </>
            }
            data={comments}
            renderItem={renderComment}
            initialNumToRender={10}
            keyExtractor={({ id, uniqueIdentifier }, index) =>
              `list-comment-item-${id || uniqueIdentifier || index}`
            }
            showsVerticalScrollIndicator
            CellRendererComponent={({ children, index, style, ...props }) => (
              <View
                style={[style, { zIndex: -index - 1 }]}
                index={index}
                {...props}
              >
                {children}
              </View>
            )}
          />
        )}
        {!showComments && <ListEmpty />}
      </Container>
    </SafeAreaView>
  );
};

ListComments.propTypes = {
  post: PropTypes.shape({}).isRequired,
  colors: PropTypes.shape({}).isRequired,
  userAuth: PropTypes.shape({}).isRequired,
  navigation: PropTypes.shape({}).isRequired,
  showComments: PropTypes.bool,
  editCommentInfo: PropTypes.shape({}),

  // actions
  onPressLike: PropTypes.func,
  onDeleteComment: PropTypes.func,
  navigateToProfile: PropTypes.func,
  navigateToReplies: PropTypes.func,
  onLoadEditedCommentInfo: PropTypes.func
};

ListComments.defaultProps = {
  showComments: true,
  editCommentInfo: null,

  // actions
  onPressLike: () => {},
  onDeleteComment: () => {},
  navigateToProfile: () => {},
  navigateToReplies: () => {},
  onLoadEditedCommentInfo: () => {}
};

export default HocCommentComposer(ListComments);
