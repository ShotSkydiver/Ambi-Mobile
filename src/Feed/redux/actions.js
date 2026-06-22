import moment from 'moment';
import * as feedService from '../FeedService';
import { removeDuplicates } from '../../shared/utils/helpers';
import { newsfeedType } from '../enums';

export const CREATE_POST = 'FEED/CREATE_POST';
export const DELETE_POST = 'FEED/DELETE_POST';
export const LOAD_POSTS = 'FEED/LOAD_POSTS';
export const LOADING_POSTS = 'FEED/LOADING_POSTS';
export const UPDATE_POST = 'FEED/UPDATE_POST';
export const FETCH_MORE_POSTS = 'FEED/FETCH_MORE_POSTS';
export const UPDATE_SINGLE_POST = 'FEED/UPDATE_SINGLE_POST';
export const UPDATE_COMMENT = 'FEED/UPDATE_COMMENT';
export const UPDATE_COMMENT_LIKE = 'FEED/UPDATE_COMMENT_LIKE';
export const SET_SHOW_COMMENTS = 'FEED/SET_SHOW_COMMENTS';
export const RESET_SINGLE_POST = 'FEED/RESET_SINGLE_POST';
export const FLAGGED_POST = 'FEED/FLAGGED_POST';

export async function uploadAttachments(attachments, events) {
  try {
    const appendedAttachments = [];
    attachments.forEach(attachment => {
      const attachmentNumber = attachments.indexOf(attachment) + 1;
      const currentCountData = {
        attachmentNumber,
        totalAttachments: attachments.length
      };
      appendedAttachments.push({ ...attachment, events, currentCountData });
    });
    const results = await Promise.all(
      appendedAttachments.map(feedService.uploadPostMedia)
    );
    return results.map(result => result.data);
  } catch (err) {
    console.error(err);
  }
  return null;
}

export function createPost(post, newsfeedType, callbackEvents = {}) {
  return async dispatch => {
    try {
      let { attachments } = post;

      if (attachments && attachments.length > 0) {
        const uploadedAttachments = await uploadAttachments(
          attachments,
          callbackEvents
        );
        attachments = uploadedAttachments;
      }
      const newPost = await feedService.createPost({ ...post, attachments });
      newPost.comments = [];
      newPost.newsfeedType = newsfeedType;
      return dispatch({
        type: CREATE_POST,
        post: newPost
      });
    } catch (err) {
      console.error(err);
    }
    return null;
  };
}

export function loadPosts(
  hostId,
  hostType,
  page = 1,
  currentUserId,
  isHomeFeed
) {
  return async dispatch => {
    try {
      dispatch({ type: LOADING_POSTS });
      let posts = await feedService.getPosts(hostId, hostType, page);
      posts = posts.map(post => ({
        ...post,
        newsfeedType: hostType,
        postPinned: (post.postPins || [])
          .map(pin => pin.createdBy.userId)
          .includes(currentUserId),
        comments: post.comments
      }));
      return dispatch({
        type: LOAD_POSTS,
        posts,
        newsfeedType: hostType,
        page,
        isHomeFeed
      });
    } catch (err) {
      console.error(err);
    }
    return null;
  };
}

export function togglePostReaction(post, reaction) {
  return async dispatch => {
    try {
      const { reactToPost, unReactPost } = feedService;

      post.likedByUser && reaction && (await unReactPost(post));

      await reactToPost(post, reaction || 'unlike');
      const postUpdated = await feedService.getPostInfo(post.id);
      const { likesCount, latestLikes, likedByUser, latestLikesJson } =
        postUpdated;

      dispatch({
        type: UPDATE_POST,
        post: { ...post, latestLikes, latestLikesJson, likesCount, likedByUser }
      });
    } catch (err) {
      console.error(err);
    }
  };
}

export function togglePostPin(post, isPinned) {
  return async dispatch => {
    try {
      const updatedPost = await feedService.togglePostPin(post, isPinned);
      if (!updatedPost) {
        return;
      }
      updatedPost.newsfeedType = post.newsfeedType;
      dispatch({
        type: UPDATE_POST,
        post: { ...updatedPost }
      });
    } catch (err) {
      console.error(err);
    }
  };
}

export function togglePostPoll(post, option, isVoted) {
  return async dispatch => {
    try {
      await feedService.updatePoll(post, option, isVoted);
      dispatch({
        type: UPDATE_POST,
        post: { ...post }
      });
    } catch (err) {
      console.error(err);
    }
  };
}

export function editPost(post, postId, callbackEvents = {}) {
  const postToUpdate = { ...post };
  return async dispatch => {
    try {
      let editedPost;
      const { postPinned, postPins = [] } = post;
      if (postPins.length === 0 && postPinned) {
        editedPost = await feedService.togglePostPin(post, false);
      } else if (postPins.length >= 1 && !postPinned) {
        editedPost = await feedService.togglePostPin(post, true);
      }
      let { postAttachments } = post;
      if (postAttachments && postAttachments.length > 0) {
        const uploadedAttachments = await uploadAttachments(
          postAttachments,
          callbackEvents
        );
        postAttachments = uploadedAttachments;
      }
      editedPost = await feedService.editPost({ post: postToUpdate }, postId);
      editedPost.newsfeedType = postToUpdate.newsfeedType;
      editedPost.postPinned = postToUpdate.postPinned;
      dispatch({
        type: UPDATE_POST,
        post: editedPost
      });
    } catch (err) {
      console.error(err);
    }
  };
}

export function resetSinglePost() {
  return async dispatch => {
    try {
      dispatch({ type: RESET_SINGLE_POST });
    } catch (err) {
      console.error(err);
    }
  };
}

export function flaggedPost(post, data) {
  return async dispatch => {
    try {
      await feedService.reportPost(data);
      dispatch({ type: FLAGGED_POST, post: { ...post, flaggedByUser: true } });
    } catch (err) {
      console.error(err);
    }
  };
}

export function deletePost(post) {
  return async dispatch => {
    try {
      await feedService.deletePost(post);
      dispatch({ type: DELETE_POST, postId: post.id });
    } catch (err) {
      console.error(err);
    }
  };
}

export function getSinglePost({
  postIdentifier,
  existingPost = null,
  feedType = newsfeedType.GENERAL
}) {
  return async dispatch => {
    try {
      let post = existingPost;
      if (!post) {
        post = await feedService.getPostInfo(postIdentifier);
      }
      post.newsfeedType = feedType;
      dispatch({ type: UPDATE_SINGLE_POST, post });
    } catch (err) {
      console.error(err);
    }
  };
}

/* post comment-related stuff */

export function getPostComments(post, isSinglePostModal = false) {
  return async dispatch => {
    try {
      const { comments } = post;
      const beforeTime =
        comments.length > 0 ? comments[0].dateCreated : post.dateModified;
      const fetchedComments = await feedService.getPostComments(
        post,
        beforeTime
      );

      const updatedPost = { ...post };
      if (fetchedComments && fetchedComments.length > 0) {
        updatedPost.comments = removeDuplicates([
          ...comments,
          ...fetchedComments
        ]);

        if (!isSinglePostModal) {
          updatedPost.comments = updatedPost.comments.sort((a, b) =>
            moment(a.dateCreated).isBefore(b.dateCreated) ? -1 : 1
          );

          dispatch({
            type: UPDATE_POST,
            post: updatedPost
          });
        } else {
          updatedPost.comments = updatedPost.comments.sort((a, b) =>
            moment(a.dateCreated).isAfter(b.dateCreated) ? -1 : 1
          );

          dispatch({ type: UPDATE_SINGLE_POST, post: updatedPost });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };
}

export function getCommentReplies(post, comment, isSinglePostModal = false) {
  return async dispatch => {
    try {
      const { id } = comment;
      const replies = await feedService.getMoreReplies(
        post,
        id,
        comment.replies[0].dateCreated
      );
      if (replies) {
        const newComment = {
          ...comment,
          replies: [...comment.replies, ...replies]
        };

        newComment.replies.sort((a, b) =>
          moment(a.dateCreated).isBefore(b.dateCreated) ? -1 : 1
        );

        newComment.replies = removeDuplicates([...newComment.replies]);
        dispatch({
          type: UPDATE_COMMENT,
          post,
          parentPostCommentId: id,
          comment: newComment,
          isSinglePostModal
        });
      }
    } catch (err) {
      console.error(err);
    }
  };
}

export async function uploadAttachmentsInComment(attachments, events) {
  try {
    const appendedAttachments = [];
    attachments.forEach(attachment => {
      const attachmentNumber = attachments.indexOf(attachment) + 1;
      const currentCountData = {
        attachmentNumber,
        totalAttachments: attachments.length
      };
      appendedAttachments.push({ ...attachment, events, currentCountData });
    });
    const results = await Promise.all(
      appendedAttachments.map(feedService.uploadPostMediaInComment)
    );
    return results.map(result => result.data);
  } catch (err) {
    console.error(err);
  }
  return null;
}

/**
 * createComment create comment or reply in post
 * @param {*} post
 * @param {*} comment
 * @param {*} isFromSinglePost
 * @param {*} callbackEvents
 */
export function createComment(
  post,
  comment,
  callbackEvents = {},
  isFromSinglePost = false
) {
  return async dispatch => {
    try {
      const updatedPost = post;
      const commentInfo = { ...comment };
      const {
        comment: { attachments, parentPostCommentId }
      } = commentInfo;
      const isReply = !!parentPostCommentId;
      if (attachments && attachments.length > 0) {
        const uploadedAttachments = await uploadAttachmentsInComment(
          attachments,
          callbackEvents
        );
        commentInfo.comment.attachments = uploadedAttachments;
      }
      const newComment = await feedService.createComment(post, commentInfo);
      if (newComment) {
        let typeAction = UPDATE_POST;

        if (isReply) {
          const newArrayComments = [];
          updatedPost.comments.forEach(item => {
            let updateListReply = item.replies;
            let updateCountReply = item.repliesCount || 0;
            if (item.id === parentPostCommentId) {
              updateListReply = [...item.replies, newComment];
              updateCountReply++;

              if (isFromSinglePost) {
                typeAction = UPDATE_SINGLE_POST;
                updateListReply = [newComment, ...item.replies];
              }
            }

            newArrayComments.push({
              ...item,
              replies: updateListReply,
              repliesCount: updateCountReply
            });
          });
          updatedPost.comments = newArrayComments;
        } else {
          let updateListComment = [...updatedPost.comments, newComment];
          if (isFromSinglePost) {
            typeAction = UPDATE_SINGLE_POST;
            updateListComment = [newComment, ...updatedPost.comments];
          }
          updatedPost.comments = updateListComment;
          updatedPost.commentsCount += 1;
        }

        dispatch({
          type: typeAction,
          post: updatedPost
        });
      }
    } catch (err) {
      console.error(err);
    }
  };
}

export function deleteComment(post, comment, isFromSinglePost = false) {
  return async dispatch => {
    if (!post || !comment) {
      return;
    }
    try {
      const updatedPost = { ...post };
      const delComment = await feedService.deleteComment(post, comment);
      if (delComment) {
        const { comments } = post;
        const { parentPostCommentId } = comment;
        if (parentPostCommentId) {
          const commentParentIndex = comments.findIndex(
            comment => comment.id === parentPostCommentId
          );
          const commentParent = comments[commentParentIndex];
          commentParent.replies = commentParent.replies.filter(
            reply => reply.id !== comment.id
          );
          commentParent.repliesCount = commentParent.replies.length;
          updatedPost.comments[commentParentIndex] = commentParent;
        } else {
          updatedPost.comments = comments.filter(
            commentPost => commentPost.id !== comment.id
          );
          updatedPost.commentsCount = updatedPost.comments.length;
        }

        dispatch({
          type: isFromSinglePost ? UPDATE_SINGLE_POST : UPDATE_POST,
          post: updatedPost
        });
      }
    } catch (err) {
      console.error(err);
    }
  };
}

/**
 * EditComment edit comment or reply
 * @param {*} post
 * @param {*} commentBody
 */
export function editComment(post, commentBody, isFromSinglePost = false) {
  return async dispatch => {
    if (!post || !commentBody) {
      return;
    }
    try {
      const updatedPost = { ...post };
      const commentInfo = { ...commentBody };
      const {
        comment,
        comment: { attachments }
      } = commentInfo;

      if (attachments && attachments.length > 0) {
        const uploadedAttachments = await uploadAttachmentsInComment(
          attachments
        ); // eslint-disable-line
        commentInfo.comment.attachments = uploadedAttachments;
      }
      const commentEdited = await feedService.editComment(post, commentInfo);

      if (commentEdited) {
        const { comments } = post;
        const { parentPostCommentId, id } = comment;

        if (parentPostCommentId) {
          const commentParentIndex = comments.findIndex(
            comment => comment.id === parentPostCommentId
          );
          const replyIndex = comments[commentParentIndex].replies.findIndex(
            reply => reply.id === id
          );
          updatedPost.comments[commentParentIndex].replies[replyIndex] =
            commentEdited;
        } else {
          const commentIndex = comments.findIndex(comment => comment.id === id);
          updatedPost.comments[commentIndex] = commentEdited;
        }

        dispatch({
          type: isFromSinglePost ? UPDATE_SINGLE_POST : UPDATE_POST,
          post: updatedPost
        });
      }
    } catch (err) {
      console.error(err);
    }
  };
}

/**
 * toggleLikeComment like or unLike comment/reply
 * @param {*} post
 * @param {*} commentBody
 */
export function toggleLikeComment(post, comment, parentPostCommentId) {
  return async dispatch => {
    try {
      const updatedComment = comment;
      const { likedByUser } = comment;

      const likeUnlike = likedByUser
        ? await feedService.unlikeComment(post, comment)
        : await feedService.likeComment(post, comment);

      updatedComment.likedByUser = !likedByUser;
      updatedComment.likesCount += likedByUser ? -1 : 1;

      likeUnlike &&
        dispatch({
          type: UPDATE_COMMENT_LIKE,
          post,
          comment: updatedComment,
          parentPostCommentId
        });
    } catch (err) {
      console.error('Unable to like comment: ', err);
    }
  };
}

export function setShowComments(showComments) {
  return async dispatch => {
    try {
      dispatch({ type: SET_SHOW_COMMENTS, showComments });
    } catch (err) {
      console.error(err);
    }
  };
}
