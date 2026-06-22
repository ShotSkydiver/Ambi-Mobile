import { createSelector } from 'reselect';
import { newsfeedType } from '../enums';
import { currentSpace } from '../../Spaces/redux/selectors';

const allPosts = state => state.feed.posts;
const userProfile = state => state.users.currentUserInView;

export const getBroadCastPosts = createSelector([allPosts], posts =>
  posts.filter(post => post.broadcastEnabled)
);

export const getHomePosts = createSelector([allPosts], posts =>
  posts.filter(
    post => post.newsfeedType === newsfeedType.GENERAL && !post.broadcastEnabled
  )
);

export const getCurrentSpacePosts = createSelector(
  [currentSpace, allPosts],
  (space, posts) => {
    const spacePosts = posts.filter(post => {
      const { postedTo } = post;
      const key = space.type;
      if (postedTo[key]) {
        return postedTo[key].id === space.id;
      }
      return false;
    });
    return spacePosts;
  }
);

export const getCurrentProfilePosts = createSelector(
  [userProfile, allPosts],
  (user, posts) => {
    const userPosts = posts.filter(post => {
      const { createdBy, postedTo } = post;
      if (createdBy.user) {
        return (
          postedTo &&
          postedTo.user &&
          (createdBy.user.id === user.id || postedTo.user.id === user.id)
        );
      }
      return false;
    });
    return userPosts;
  }
);

export const getFeedPosts = type =>
  createSelector(
    [
      getHomePosts,
      getBroadCastPosts,
      getCurrentSpacePosts,
      getCurrentProfilePosts
    ],
    (homePosts, broadcastPosts, spacePosts, profilePosts) => {
      const feedPosts = {
        [newsfeedType.CLASS]: spacePosts,
        [newsfeedType.GROUP]: spacePosts,
        [newsfeedType.COMMUNITY]: spacePosts,
        [newsfeedType.PERSONAL]: profilePosts,
        [newsfeedType.OTHER_USER]: profilePosts,
        [newsfeedType.GENERAL]: homePosts,
        [newsfeedType.BROADCASTS]: broadcastPosts
      };
      return feedPosts[type];
    }
  );
