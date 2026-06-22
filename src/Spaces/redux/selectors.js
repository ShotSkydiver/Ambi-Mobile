import { createSelector } from 'reselect';
import { normalizeById } from '../../shared/utils/helpers';

export const currentSpace = state => state.spaces.currentSpaceInView;
export const currentUserInView = state => state.users.currentUserInView;

export const getAllGroups = state => Object.values(state.spaces.groups);
export const getAllClasses = state => Object.values(state.spaces.classes);
export const getAllCommunities = state =>
  Object.values(state.spaces.communities);

export const getCurrentUserGroups = createSelector(
  [currentUserInView, getAllGroups],
  (user, groups) => {
    const userGroups = groups.filter(grp => {
      const isGroupCreator = grp.createdBy.user.id === user.id;
      const isGroupMember = (grp.members || [])
        .map(member => member.id)
        .includes(user.id);
      return isGroupCreator || isGroupMember;
    });
    return normalizeById(userGroups);
  }
);
