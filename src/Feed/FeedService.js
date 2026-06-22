import { ambiApi } from '../models/AmbiApi';
import uploadFile from '../shared/utils/uploadFile';
import { newsfeedType } from './enums';

const getUrlString = (id, type, page) => {
  const url = {
    [newsfeedType.CLASS]: `/classes/${id}/discussion/posts/?page=${page}`,
    [newsfeedType.GROUP]: `/groups/${id}/discussion/posts/?page=${page}`,
    [newsfeedType.COMMUNITY]: `/communities/${id}/discussion/posts/?page=${page}`,
    [newsfeedType.PERSONAL]: `/users/${id}/posts/?page=${page}`,
    [newsfeedType.OTHER_USER]: `/users/${id}/posts/?page=${page}`,
    [newsfeedType.GENERAL]: `/posts/?page=${page}`,
    [newsfeedType.BROADCASTS]: `/posts/?type=${type}&page=${page}`
  };
  return url[type.toLowerCase()];
};

export const createPost = async post => {
  try {
    const createdPost = await ambiApi.postToApi({
      url: '/posts',
      body: { post }
    });
    return createdPost.data;
  } catch (err) {
    console.error(err);
  }
  return null;
};

export const editPost = async (post, postId) => {
  try {
    const editedPost = await ambiApi.putToApi({
      url: `/posts/${postId}`,
      body: { ...post }
    });
    return editedPost.data;
  } catch (err) {
    console.error(err);
  }
  return null;
};

export const getPosts = async (id, type, page) => {
  try {
    const posts = await ambiApi.getFromApi(`${getUrlString(id, type, page)}`);
    return [...(posts.data || [])].filter(post => !post.flaggedByUser);
  } catch (err) {
    console.error(err);
  }
  return null;
};

export const getPostComments = async (post, beforeDateTime) => {
  try {
    const comments = await ambiApi.getFromApi(
      `/posts/${post.id}/comments?before=${beforeDateTime}&isSingle=true&limit=15`
    );
    return comments.data;
  } catch (err) {
    console.error(err);
  }
  return null;
};

export const getMoreReplies = async (
  post,
  parentPostCommentId,
  beforeDateTime
) => {
  try {
    const replies = await ambiApi.getFromApi(
      `/posts/${post.id}/comments/${parentPostCommentId}?before=${beforeDateTime}&limit=5&isSingle=true`
    );
    return replies.data;
  } catch (err) {
    console.error(err);
  }
  return null;
};

/**
 * CreateComment create comment or reply
 * @param {*} post
 * @param {*} commentInfo
 */
export const createComment = async (post, commentInfo) => {
  try {
    const newComment = await ambiApi.postToApi({
      url: `/posts/${post.id}/comments`,
      body: commentInfo
    });
    return newComment.data;
  } catch (err) {
    console.error(err);
  }
  return null;
};

/**
 * DeleteComment delete comment or reply
 * @param {*} post
 * @param {*} comment
 */
export const deleteComment = async (post, comment) => {
  try {
    const delComment = await ambiApi.deleteFromApi({
      url: `/posts/${post.id}/comments/${comment.id}`
    });
    return delComment;
  } catch (err) {
    console.error(err);
  }
  return null;
};

/**
 * EditComment edit comment or reply
 * @param {*} post
 * @param {*} commentBody
 */
export const editComment = async (post, commentBody) => {
  const {
    comment: { id: commentId }
  } = commentBody;

  try {
    const editComment = await ambiApi.putToApi({
      url: `/posts/${post.id}/comments/${commentId}`,
      body: commentBody
    });
    return editComment.data;
  } catch (err) {
    console.error(err);
  }
  return null;
};

export const deletePost = async post => {
  try {
    await ambiApi.deleteFromApi({
      url: `/posts/${post.id}`
    });
  } catch (err) {
    console.error(err);
  }
};

export const togglePostPin = async (post, isPinned) => {
  try {
    const response = await ambiApi.postToApi({
      url: `/posts/${post.id}/${isPinned ? 'unpin' : 'pin'}`
    });
    return response.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const reactToPost = async (post, reaction) => {
  try {
    await ambiApi.postToApi({
      url: `/posts/${post.id}/reaction/${reaction}`
    });
  } catch (err) {
    console.error(err);
  }
};

export const unReactPost = async post => {
  try {
    await ambiApi.postToApi({
      url: `/posts/${post.id}/reaction/unlike`
    });
  } catch (err) {
    console.error(err);
  }
};

export const likeComment = async (post, comment) => {
  try {
    const response = await ambiApi.postToApi({
      url: `/posts/${post.id}/comments/${comment.id}/like`,
      body: { comment }
    });

    return response;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const unlikeComment = async (post, comment) => {
  try {
    const response = await ambiApi.postToApi({
      url: `/posts/${post.id}/comments/${comment.id}/unlike`,
      body: { comment }
    });

    return response;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const uploadPostMedia = async uploadInfo => {
  const file = { ...uploadInfo };
  delete file.events;
  const callbackEvents = { ...uploadInfo.events };
  try {
    const uploadedFile = await uploadFile({
      url: '/posts/media',
      file,
      events: callbackEvents
    });
    return uploadedFile;
  } catch (err) {
    console.error(err);
  }
  return null;
};

export const uploadPostMediaInComment = async uploadInfo => {
  const file = { ...uploadInfo };
  delete file.events;
  const callbackEvents = { ...uploadInfo.events };
  try {
    const uploadedFile = await uploadFile({
      url: '/posts/comments/media',
      file,
      events: callbackEvents
    });
    return uploadedFile;
  } catch (err) {
    console.error(err);
  }
  return null;
};

export const updatePoll = async (post, pollOption, isVoted) => {
  try {
    const updatedPoll = await ambiApi.postToApi({
      url: `/posts/${post.id}/poll`,
      body: {
        action: isVoted ? 'vote' : 'unvote',
        pollOptionId: pollOption.id
      }
    });
    return updatedPoll.data;
  } catch (exception) {
    console.warn('Unable to change vote: ', exception);
    return null;
  }
};

export const reportPost = async ({
  postId,
  reasons,
  description,
  commentId,
  parentPostCommentId,
  createdByUserId,
  content
}) => {
  try {
    await ambiApi.postToApi({
      url: `/posts/${postId}/report`,
      body: {
        moderationPostReport: {
          data: {
            id: postId,
            reasons,
            description,
            commentId,
            parentPostCommentId,
            createdByUserId,
            content
          }
        }
      }
    });
  } catch (err) {
    console.warn('Unable to report post: ', err);
  }
  return null;
};

export const getPostInfo = async uniqueIdentifier => {
  let result;
  try {
    result = await ambiApi.getFromApi({
      url: `/post/${uniqueIdentifier}`
    });
  } catch (err) {
    console.warn(err);
  }
  return result.data;
};
