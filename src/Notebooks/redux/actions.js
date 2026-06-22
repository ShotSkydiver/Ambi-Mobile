import NotebooksService from '../NotebooksService';
import { User } from '../../models/User';
import { normalizeById } from '../../shared/utils/helpers';

export const UPDATE_NOTEBOOKS = 'UPDATE_NOTEBOOKS';
export const CREATE_NOTEBOOK = 'CREATE_NOTEBOOK';
export const DELETE_NOTEBOOK = 'DELETE_NOTEBOOK';
export const UPDATE_SINGLE_NOTEBOOK = 'UPDATE_SINGLE_NOTEBOOK';
export const DELETE_NOTEBOOK_ITEM = 'DELETE_NOTEBOOK_ITEM';
export const LOADED_NOTEBOOK_MEMBERS = 'LOADED_NOTEBOOK_MEMBERS';

export function createNotebook(notebookInfo) {
  return async dispatch => {
    try {
      const newNotebook = await NotebooksService.createNotebook(notebookInfo);
      return dispatch({
        type: CREATE_NOTEBOOK,
        notebook: { [newNotebook.id]: newNotebook }
      });
    } catch (err) {
      console.error(err);
    }
    return null;
  };
}

export function deleteNotebook(notebookId) {
  return async dispatch => {
    try {
      const isDeleted = await NotebooksService.deleteNotebook(notebookId);
      if (isDeleted) {
        return dispatch({
          type: DELETE_NOTEBOOK,
          notebookId
        });
      }
    } catch (err) {
      console.error(err);
    }
    return null;
  };
}

export function updateNotebook(notebook) {
  return async dispatch => {
    try {
      await NotebooksService.updateNotebook(notebook);
      return dispatch({
        type: UPDATE_SINGLE_NOTEBOOK,
        notebook
      });
    } catch (err) {
      console.error(err);
    }
    return null;
  };
}

export function getNotebooks(type, page = 1) {
  return async dispatch => {
    try {
      const notebooks = await NotebooksService.getNotebooks(type, page);

      return dispatch({
        type: UPDATE_NOTEBOOKS,
        notebooks: normalizeById(notebooks)
      });
    } catch (err) {
      console.error(err);
    }
    return null;
  };
}

export function getNotebookItems(notebook) {
  return async dispatch => {
    try {
      const notebookItems = await NotebooksService.getNotebookItems(
        notebook.id
      );
      const updatedNotebook = { ...notebook, ...notebookItems };
      updatedNotebook.files = normalizeById(notebookItems.files);
      updatedNotebook.notes = normalizeById(notebookItems.notes);
      dispatch({
        type: UPDATE_SINGLE_NOTEBOOK,
        notebook: updatedNotebook
      });
    } catch (err) {
      console.error(err);
    }
  };
}

export function deleteNotebookItem(notebookId, itemId, itemType) {
  return async dispatch => {
    try {
      await NotebooksService.deleteNotebookItem(notebookId, itemId, itemType);
      dispatch({
        type: DELETE_NOTEBOOK_ITEM,
        notebookId,
        itemId,
        itemType
      });
    } catch (err) {
      console.error(err);
    }
  };
}

export function getNotebookMembers(notebook) {
  return async dispatch => {
    try {
      const members = await NotebooksService.loadMembers(notebook.id);

      dispatch({
        type: LOADED_NOTEBOOK_MEMBERS,
        members: members.map(membership => ({
          ...membership,
          user: new User(membership.user)
        })),
        notebook
      });
    } catch (err) {
      console.error(err);
    }
  };
}
