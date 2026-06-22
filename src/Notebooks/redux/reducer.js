import {
  CREATE_NOTEBOOK,
  DELETE_NOTEBOOK,
  UPDATE_NOTEBOOKS,
  UPDATE_SINGLE_NOTEBOOK,
  DELETE_NOTEBOOK_ITEM,
  LOADED_NOTEBOOK_MEMBERS
} from './actions';
import { User } from '../../models/User';

const initialState = {};

const ifItemMatches = (matchItem, callback) => {
  return mappedNote => {
    if (
      mappedNote.id === matchItem.id ||
      mappedNote.uniqueIdentifier === matchItem.uniqueIdentifier
    ) {
      return callback(mappedNote);
    }
    return mappedNote;
  };
};

export function notebooksReducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_NOTEBOOK:
      return { ...state, ...action.notebook };
    case DELETE_NOTEBOOK: {
      const notebooks = state;
      delete notebooks[action.notebookId];
      return { ...notebooks };
    }
    case UPDATE_SINGLE_NOTEBOOK:
      const notebooks = state;
      notebooks[action.notebook.id] = action.notebook;
      return { ...notebooks };
    case UPDATE_NOTEBOOKS:
      return { ...action.notebooks };
    case DELETE_NOTEBOOK_ITEM:
      const { itemType, itemId, notebookId } = action;
      const allNotebooks = state;
      const notebook = allNotebooks[notebookId];
      if (itemType === 'file') {
        delete notebook.files[itemId];
      } else if (itemType === 'note') {
        delete notebook.notes[itemId];
      } else {
        // Todo: folder
      }
      allNotebooks[notebookId] = notebook;
      return { ...allNotebooks };
    case LOADED_NOTEBOOK_MEMBERS:
      return {
        ...state,
        // members: action.members.map(membership => ({
        //   ...membership,
        //   user: new User(membership.user)
        // })),
        notebooks: state.notebooks.map(
          ifItemMatches(action.notebook, notebook => {
            return {
              ...notebook,
              membersCount: action.members.length,
              members: action.members.map(membership => ({
                ...membership,
                user: new User(membership.user)
              }))
            };
          })
        )
      };
    default:
      return state;
  }
}
