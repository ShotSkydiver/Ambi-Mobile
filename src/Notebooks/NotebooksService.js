import { ambiApi } from '../models/AmbiApi';

class NotebooksService {
  static async getNotebooks(type, page) {
    let notebooks;
    try {
      const urlString = type
        ? `/notebooks?page=${page}&type=${type}`
        : `/notebooks?page=${page}`;
      notebooks = await ambiApi.getFromApi(urlString);
    } catch (err) {
      console.error(err);
    }
    return notebooks.data;
  }

  static async getNotebookItems(id) {
    let notebookItems;
    try {
      notebookItems = await ambiApi.getFromApi(`/notebooks/${id}/items`);
    } catch (err) {
      console.error(err);
    }
    return notebookItems.data;
  }

  static async deleteNotebookItem(notebookId, itemId, type) {
    try {
      await ambiApi.deleteFromApi({
        url: `/notebooks/${notebookId}/${type}s/itemId`
      });
    } catch (err) {
      console.error(err);
    }
  }

  static async loadMembers(notebookId) {
    let loadedMembers;
    try {
      loadedMembers = await ambiApi.getFromApi(
        `/notebooks/${notebookId}/members`
      );
    } catch (err) {
      console.error(err);
    }
    return loadedMembers.data;
  }

  static async createNotebook(notebook) {
    console.error('createNotebook function not implemented yet!');
    return notebook;
  }

  static async deleteNotebook(notebookId) {
    console.error('deleteNotebook function not implemented yet!');
    return notebookId;
  }

  static async updateNotebook(notebooksId) {
    console.error('updateNotebook function not implemented yet!');
    return notebooksId;
  }
}

export default NotebooksService;
