import UserService from '../UserService';

export const CURRENT_USER_IN_VIEW = 'CURRENT_USER_IN_VIEW';
export const GET_USER = 'GET_USER';

// Currently unused
export function getUser(id) {
  return async dispatch => {
    try {
      const user = await UserService.getUserById(id);
      dispatch({
        type: GET_USER,
        user
      });
    } catch (err) {
      console.error(err);
    }
  };
}

export function updateCurrentUserInView(user) {
  return dispatch =>
    dispatch({
      type: CURRENT_USER_IN_VIEW,
      user
    });
}
