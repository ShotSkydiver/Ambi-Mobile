import { CURRENT_USER_IN_VIEW, GET_USER } from './actions';

const initialState = {
  currentUserInView: {},
  allUsers: {}
};

export function usersReducer(state = initialState, action) {
  switch (action.type) {
    case GET_USER:
      return {
        ...state,
        allUsers: {
          ...state.allUsers,
          [action.user.id]: action.user
        }
      };
    case CURRENT_USER_IN_VIEW: {
      return {
        ...state,
        currentUserInView: action.user,
        allUsers: {
          ...state.allUsers,
          [action.user.id]: action.user
        }
      };
    }
    default:
      return state;
  }
}
