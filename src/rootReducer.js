import { combineReducers } from 'redux';
import { authReducer } from './Auth/redux/reducer';
import { feedReducer } from './Feed/redux/reducer';
import { spacesReducer } from './Spaces/redux/reducer';
import { usersReducer } from './Profile/redux/reducer';
import { notebooksReducer } from './Notebooks/redux/reducer';
import { ChatsReducer } from './Chat/chatsReducer';
import { NotificationsReducer } from './Notifications/redux/reducer';
import { CalendarReducer } from './Calendar/redux/reducer';

import { AUTH_ACTION_TYPES } from './Auth/redux/actionTypes';

const appReducer = combineReducers({
  auth: authReducer,
  feed: feedReducer,
  spaces: spacesReducer,
  users: usersReducer,
  notebooks: notebooksReducer,
  chats: ChatsReducer,
  notifications: NotificationsReducer,
  calendar: CalendarReducer
});

const rootReducer = (state, action) => {
  let updatedState = state;
  if (action.type === AUTH_ACTION_TYPES.LOGGED_OUT) {
    updatedState = undefined; // reset/clear the redux store
  }
  return appReducer(updatedState, action);
};

export default rootReducer;
