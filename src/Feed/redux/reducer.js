import {
  CREATE_POST,
  LOAD_POSTS,
  UPDATE_POST,
  DELETE_POST,
  LOADING_POSTS,
  FETCH_MORE_POSTS,
  UPDATE_SINGLE_POST,
  UPDATE_COMMENT,
  UPDATE_COMMENT_LIKE,
  SET_SHOW_COMMENTS,
  RESET_SINGLE_POST,
  FLAGGED_POST
} from './actions';
import {
  removeDuplicates,
  sortByDateCreated
} from '../../shared/utils/helpers';
import { newsfeedType } from '../enums';

const initialState = {
  posts: [],
  currentPage: 1,
  loadingPosts: false,
  hasMorePosts: false,
  singlePost: null,
  showComments: true
};

function placePinnedPostsOnTop(posts) {
  const pinnedPosts = posts.filter(p => p.postPins && p.postPins.length > 0);
  const unPinnedPosts = posts.filter(
    p => !p.postPins || (p.postPins && p.postPins.length === 0)
  );
  return [...pinnedPosts, ...unPinnedPosts];
}

const updatePost = (action, state) => {
  let postsToLoad = state.posts.map(post =>
    post.id === action.post.id ? { ...post, ...action.post } : post
  );
  postsToLoad =
    action.newsfeedType === newsfeedType.GENERAL ||
    action.newsfeedType === newsfeedType.BROADCASTS
      ? postsToLoad
      : placePinnedPostsOnTop(postsToLoad);

  // hack to update the single post if it exists
  const stateUpdated = {
    ...state,
    posts: postsToLoad.filter(post => !post.flaggedByUser),
    showComments: true
  };
  if (
    state.singlePost &&
    state.singlePost.id &&
    state.singlePost.id === action.post.id
  ) {
    stateUpdated.singlePost = { ...state.singlePost, ...action.post };
  }

  return stateUpdated;
};

export function feedReducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_POST: {
      let postsToLoad = removeDuplicates([action.post, ...state.posts]);
      postsToLoad =
        action.newsfeedType === newsfeedType.GENERAL ||
        action.newsfeedType === newsfeedType.BROADCASTS
          ? postsToLoad
          : placePinnedPostsOnTop(postsToLoad);
      return {
        ...state,
        posts: postsToLoad
      };
    }

    case UPDATE_POST: {
      return updatePost(action, state);
    }

    case UPDATE_COMMENT: {
      const { posts } = state;
      const postsId = posts.findIndex(post => post.id === action.post.id);
      const { comments } = posts[postsId];
      const commentId = comments.findIndex(
        comment => comment.id === action.comment.id
      );
      comments[commentId] = action.comment;

      posts[postsId].comments = comments;
      posts[postsId].repliesCount = comments[commentId].replies.length;

      const { isSinglePostModal = false } = action;

      return !isSinglePostModal
        ? updatePost({ ...action, post: posts[postsId] }, state)
        : {
            ...state,
            singlePost: posts[postsId]
          };
    }

    case UPDATE_COMMENT_LIKE: {
      const postIndex = state.posts.findIndex(
        post => post.id === action.post.id
      );
      const posts = [...state.posts];
      const postUpdate = { ...posts[postIndex] };
      const commentIndex = postUpdate.comments.findIndex(
        comment => comment.id === action.comment.id
      );
      postUpdate.comments[commentIndex] = { ...action.comment };
      posts[postIndex] = postUpdate;

      return {
        ...state,
        posts
      };
    }

    case DELETE_POST: {
      return {
        ...state,
        posts: state.posts.filter(post => post.id !== action.postId)
      };
    }

    case LOADING_POSTS:
      return { ...state, loadingPosts: true };

    case LOAD_POSTS: {
      let postsToLoad = removeDuplicates([...state.posts, ...action.posts]);
      postsToLoad = sortByDateCreated(postsToLoad);
      if (!action.isHomeFeed) {
        postsToLoad = placePinnedPostsOnTop(postsToLoad);
      }
      return {
        ...state,
        posts: postsToLoad,
        currentPage: action.page,
        hasMorePosts: action.posts.length > 0,
        loadingPosts: false
      };
    }

    case FETCH_MORE_POSTS:
      return {
        ...state,
        hasMorePosts: action.hasMorePosts
      };

    // Note: used only for single post modal
    case UPDATE_SINGLE_POST:
      return {
        ...state,
        singlePost: action.post
      };

    case SET_SHOW_COMMENTS:
      return {
        ...state,
        showComments: action.showComments
      };

    case RESET_SINGLE_POST:
      return {
        ...state,
        singlePost: null,
        showComments: true
      };

    case FLAGGED_POST: {
      return updatePost(action, state);
    }

    default:
      return state;
  }
}
