import { NOTIFICATION_TYPES } from '../enums';
import {
  removeDuplicates
  // sortByDateCreated - commented out fixing-linter-issues-05132020
} from '../../shared/utils/helpers';

const initialState = {
  list: [],
  page: 1,
  bottomNavUnreadCount: 0,
  isLoading: false
};

export function NotificationsReducer(state = initialState, action) {
  switch (action.type) {
    case NOTIFICATION_TYPES.LOADING:
      return {
        ...state,
        loading: true
      };
    case NOTIFICATION_TYPES.UPDATE_NOTIFICATIONS:
      const filteredNotifs = action.list.filter(
        notification => notification.userHidden === false
      );

      const notificationsWithoutDiplicates = removeDuplicates([
        ...state.list,
        ...filteredNotifs
      ]);

      const ordererNotifications = notificationsWithoutDiplicates.sort(
        (a, b) => new Date(b.dateCreated) - new Date(a.dateCreated)
      );

      return {
        ...state,
        list: [...ordererNotifications],
        bottomNavUnreadCount: action.unreadCount,
        page: action.page,
        loading: false
      };
    case NOTIFICATION_TYPES.MARK_ALL_AS_READ:
      const updatedNotifs = action.list.map(n => {
        const notif = n;
        notif.dateConsumed =
          notif.dateConsumed === null ? Date.now() : notif.dateConsumed;
        return notif;
      });
      return {
        ...state,
        list: updatedNotifs,
        bottomNavUnreadCount: 0
      };
    case NOTIFICATION_TYPES.UPDATE_TOTAL_UNREAD_COUNT:
      let totalUnreadCount = 0;
      state.list.forEach(notification => {
        if (notification.dateConsumed === null) {
          totalUnreadCount += 1;
        }
      });
      return {
        ...state,
        bottomNavUnreadCount: totalUnreadCount
      };
    case NOTIFICATION_TYPES.MARK_AS_READ:
      const updatedNotifications = state.list.map(n => {
        if (n.uniqueIdentifier === action.notification.uniqueIdentifier) {
          return action.notification;
        }
        return n;
      });
      return {
        ...state,
        list: updatedNotifications,
        bottomNavUnreadCount: state.bottomNavUnreadCount - 1
      };
    case NOTIFICATION_TYPES.MARK_AS_HIDDEN:
      const updatedNotification = state.list.filter(
        n => n.uniqueIdentifier !== action.notification.uniqueIdentifier
      );
      const shouldUpdateCount = action.notification.dateConsumed === null;
      return {
        ...state,
        list: updatedNotification,
        bottomNavUnreadCount: shouldUpdateCount
          ? state.bottomNavUnreadCount - 1
          : state.bottomNavUnreadCount
      };
    default:
      return state;
  }
}
