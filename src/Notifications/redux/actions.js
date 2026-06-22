import { ambiApi } from '../../models/AmbiApi';

import { NOTIFICATION_TYPES } from '../enums';

export function getNotifications(page = 1) {
  return async dispatch => {
    dispatch({ type: NOTIFICATION_TYPES.LOADING });
    try {
      const notifications = await ambiApi.getFromApi(
        `/notifications/me?page=${page}`
      );
      dispatch({
        type: NOTIFICATION_TYPES.UPDATE_NOTIFICATIONS,
        list: notifications.data,
        unreadCount: notifications.unconsumedCount,
        page
      });
      dispatch({ type: NOTIFICATION_TYPES.UPDATE_TOTAL_UNREAD_COUNT });
    } catch (exception) {
      console.error('error fetching notifications: ', exception);
    }
  };
}

export function markAllAsRead(notifications) {
  return async dispatch => {
    try {
      const consumedCount = await ambiApi.postToApi({
        url: `/notifications/me/consume`
      });
      dispatch({
        type: NOTIFICATION_TYPES.MARK_ALL_AS_READ,
        list: notifications,
        unreadCount: consumedCount || 0
      });
      dispatch({ type: NOTIFICATION_TYPES.UPDATE_TOTAL_UNREAD_COUNT });
    } catch (exception) {
      console.error('error marking notifications as read: ', exception);
    }
  };
}

export function markOneAsRead(notif) {
  return async dispatch => {
    if (notif.dateConsumed === null) {
      dispatch({
        type: NOTIFICATION_TYPES.MARK_AS_READ,
        notification: { ...notif, dateConsumed: Date.now() }
      });
      dispatch({ type: NOTIFICATION_TYPES.UPDATE_TOTAL_UNREAD_COUNT });
    }
    try {
      if (notif.dateConsumed === null) {
        // handle the request async in background
        ambiApi.postToApi({
          url: `/notifications/me/${notif.id}/consume`
        });
      }
    } catch (exception) {
      console.error('error marking notification as read: ', exception);
      dispatch({
        type: NOTIFICATION_TYPES.MARK_AS_READ,
        notification: { ...notif, dateConsumed: null }
      });
    }
  };
}

export function markOneAsHidden(notif) {
  return async dispatch => {
    try {
      await ambiApi.postToApi({
        url: `/notifications/me/${notif.id}/hide`
      });
      dispatch({
        type: NOTIFICATION_TYPES.MARK_AS_HIDDEN,
        notification: { ...notif, userHidden: true }
      });
    } catch (exception) {
      console.error('error marking notification as hidden: ', exception);
    }
  };
}

export function updateNavUnreadCount() {
  return dispatch =>
    dispatch({ type: NOTIFICATION_TYPES.UPDATE_TOTAL_UNREAD_COUNT });
}
