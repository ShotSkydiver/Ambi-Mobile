import { createSelector } from 'reselect';
import { normalizeById } from '../../shared/utils/helpers';

export const currentUser = state => state.auth.user;
export const getNotebooks = state => state.notebooks;
export const currentSpaceInView = state => state.spaces.currentSpaceInView;

export const getCurrentUserNotebooks = createSelector(
  [currentUser, getNotebooks],
  (user, notebooks) => {
    const userNotebooks = notebooks.filter(notebook => {
      const isNotebookCreator = notebook.createdBy.user.id === user.id;
      const isNotebookMember = (notebook.members || [])
        .map(member => member.id)
        .includes(user.id);
      return isNotebookCreator || isNotebookMember;
    });
    return normalizeById(userNotebooks);
  }
);

export const getSpaceNotebooks = createSelector(
  [currentSpaceInView, getNotebooks],
  (space, notebooks) => {
    const spaceNotebooks = notebooks.filter(notebook => {
      const { createdTo } = notebook;
      const key = space.type;
      if (createdTo[key]) {
        return createdTo[key].id === space.id;
      }
      return false;
    });
    return spaceNotebooks;
  }
);
