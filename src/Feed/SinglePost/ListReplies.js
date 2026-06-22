/**
 * ListReplies
 */
/* eslint-disable no-underscore-dangle */
import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import styled from 'styled-components';
import { SafeAreaView } from 'react-native-safe-area-context';

// redux
import { getCommentReplies } from '../redux/actions';

// components
import CardPostComment from '../../components/CardPostComment';

// Hoc
import HocCommentComposer from '../hoc/HocCommentComposer';

const Container = styled(View)`
  flex: 1;
`;

const List = styled(FlatList)`
  height: 100%;
  padding-top: 8px;
`;

const CardPostCommentContainer = styled(View)`
  margin: 8px;
`;

const SingleReplyContainer = styled(View)`
  flex: 1;
  width: 100%;
  align-items: flex-start;
  padding-left: 32px;
  margin-bottom: 16px;
  flex-direction: column;
`;

const ReplySection = styled(TouchableOpacity)`
  padding: 0 16px;
  flex-direction: row;
`;

const ReplyLabelSection = styled(Text)`
  opacity: 0.7;
  font-size: 14px;
  margin-top: 16px;
  font-family: Circular-Bold;
  margin-left: 12px;
  line-height: 15px;
`;

const ListReplies = ({
  post,
  route,
  colors,
  userAuth,
  navigation,

  // actions
  onPressLike,
  onPressReply,
  onDeleteComment,
  navigateToProfile,
  onLoadEditedCommentInfo
}) => {
  const dispatch = useDispatch();
  const { colorSlateGray } = colors;

  const { params: { commentId } = {} } = route;

  const { comments = [], commentsDisabled } = post;
  const parentComment = comments.find(item => item.id === commentId);

  const _loadMoreReplies = async comment => {
    await getCommentReplies(post, comment)(dispatch);
  };

  const renderReply = item => {
    const { id: itemId, likesCount, likedByUser } = item;
    return (
      <SingleReplyContainer>
        <CardPostComment
          key={`list-reply-replyItem-${itemId}`}
          isReply
          comment={item}
          userAuth={userAuth}
          showActions
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
        />
      </SingleReplyContainer>
    );
  };

  const renderComment = ({ item }) => {
    const { id: itemId, replies, likesCount, likedByUser, repliesCount } = item;

    return (
      <CardPostCommentContainer>
        <CardPostComment
          key={`list-reply-commentItem-${itemId}`}
          comment={item}
          delComment={() => onDeleteComment(item)}
          editComment={() => onLoadEditedCommentInfo(item)}
          commentsDisabled={commentsDisabled}
          navigateToProfile={() => navigateToProfile(item)}
          navigation={navigation}
          userAuth={userAuth}
          commentLikeProps={{
            onPress: () => onPressLike(item, post),
            counter: likesCount,
            likedByUser
          }}
          commentReplyProps={{
            onPress: onPressReply
          }}
        />

        {replies && replies.length > 0 ? (
          <>
            {replies.length < repliesCount && (
              <ReplySection onPress={() => _loadMoreReplies(item)}>
                <ReplyLabelSection
                  style={{
                    color: colorSlateGray,
                    marginLeft: 50,
                    marginBottom: 15
                  }}
                >
                  Load more replies
                </ReplyLabelSection>
              </ReplySection>
            )}
            {replies.map(itemReply =>
              itemReply.parentPostCommentId === item.id
                ? renderReply(itemReply)
                : null
            )}
          </>
        ) : null}
      </CardPostCommentContainer>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Container>
        {/** Render List */}
        <List
          data={[parentComment]}
          initialNumToRender={10}
          renderItem={renderComment}
          keyExtractor={({ id, uniqueIdentifier }, index) =>
            `list-reply-item-${id || uniqueIdentifier || index}`
          }
          showsVerticalScrollIndicator
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'flex-start'
          }}
        />
      </Container>
    </SafeAreaView>
  );
};

ListReplies.propTypes = {
  post: PropTypes.shape({}).isRequired,
  colors: PropTypes.shape({}).isRequired,
  userAuth: PropTypes.shape({}).isRequired,
  navigation: PropTypes.shape({}).isRequired,

  // actions
  onPressLike: PropTypes.func,
  onPressReply: PropTypes.func,
  onDeleteComment: PropTypes.func,
  navigateToProfile: PropTypes.func,
  onLoadEditedCommentInfo: PropTypes.func
};

ListReplies.defaultProps = {
  // actions
  onPressLike: () => {},
  onPressReply: () => {},
  onDeleteComment: () => {},
  navigateToProfile: () => {},
  onLoadEditedCommentInfo: () => {}
};

export default HocCommentComposer(ListReplies);
