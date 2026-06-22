import { AUTH_ACTION_TYPES } from './actionTypes';

export const initialState = {
  loggedIn: false,
  linkedIdentities: [],
  existingAccount: false
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_ACTION_TYPES.RESET_ALL_ERRORS:
      return {
        ...state,
        clientLookUpError: false,
        emailWhitelistError: false,
        emailValidError: false,
        emailDuplicateError: false,
        validPasswordError: false,
        loggingInError: false,
        linkingAccountError: false,
        unlinkingAccountError: false,
        existingAccount: false
      };
    case AUTH_ACTION_TYPES.FETCHING_SESSION:
      return {
        ...state,
        fetchingSession: true
      };
    case AUTH_ACTION_TYPES.LOOKING_UP_CLIENT:
      return {
        ...state,
        lookingUpClient: true,
        clientLookUpError: false
      };
    case AUTH_ACTION_TYPES.CLIENT_LOOKUP_ERROR:
      return {
        ...state,
        lookingUpClient: false,
        clientLookUpError: true
      };
    case AUTH_ACTION_TYPES.LOOKING_UP_EMAIL:
      return {
        ...state,
        lookingUpEmail: true,
        emailWhitelistError: false,
        emailValidError: false
      };
    case AUTH_ACTION_TYPES.FOUND_VALID_EMAIL:
      return {
        ...state,
        lookingUpEmail: false
      };
    case AUTH_ACTION_TYPES.EMAIL_DUPLICATE_ERROR:
      return {
        ...state,
        lookingUpEmail: false,
        emailDuplicateError: true
      };
    case AUTH_ACTION_TYPES.EMAIL_WHITELIST_ERROR:
      return {
        ...state,
        lookingUpEmail: false,
        emailWhitelistError: true,
        emailValidError: false
      };
    case AUTH_ACTION_TYPES.VALID_EMAIL_ERROR:
      return {
        ...state,
        lookingUpEmail: false,
        emailWhitelistError: false,
        emailValidError: true
      };
    case AUTH_ACTION_TYPES.VALIDATING_PASSWORD:
      return {
        ...state,
        validatingPassword: true,
        validPasswordError: false
      };
    case AUTH_ACTION_TYPES.PASSWORD_VALIDATED:
      return {
        ...state,
        validatingPassword: false
      };
    case AUTH_ACTION_TYPES.VALID_PASSWORD_ERROR:
      return {
        ...state,
        validatingPassword: false,
        validPasswordError: true
      };
    case AUTH_ACTION_TYPES.LOGGING_IN:
      return {
        ...state,
        loggingIn: true,
        loginMethod: action.loginMethod,
        passwordAdded: false,
        loggingInError: false
      };
    case AUTH_ACTION_TYPES.LOGGED_IN:
      return {
        ...state,
        loggingIn: false,
        fetchingSession: false,
        loggedIn: true,
        user: action.user,
        auth0: action.auth0 || state.auth0
      };
    case AUTH_ACTION_TYPES.LOGGING_IN_ERROR:
      return {
        ...state,
        loggingIn: false,
        passwordAdded: false,
        loggingInError: true,
        fetchingSession: false,
        isSocialSignUp: action.socialSignUp || false
      };
    case AUTH_ACTION_TYPES.LINKING_ACCOUNT:
      return {
        ...state,
        linkingAccount: true,
        linkingAccountError: false,
        loginMethod: action.loginMethod
      };
    case AUTH_ACTION_TYPES.LINKED_ACCOUNT:
      return {
        ...state,
        linkingAccount: false,
        fetchingSession: false,
        linkedAccount: true,
        primaryUserId: action.primaryUserId || state.primaryUserId,
        linkedIdentities: action.linkedIdentities
      };
    case AUTH_ACTION_TYPES.LINKING_ACCOUNT_ERROR:
      return {
        ...state,
        linkingAccount: false,
        fetchingSession: false,
        linkingAccountError: true
      };
    case AUTH_ACTION_TYPES.UNLINKING_ACCOUNT:
      return {
        ...state,
        unlinkingAccount: true,
        unlinkingAccountError: false
      };
    case AUTH_ACTION_TYPES.UNLINKED_ACCOUNT:
      return {
        ...state,
        unlinkingAccount: false,
        unlinkedAccount: true,
        linkedIdentities: state.linkedIdentities.filter(
          identity => identity.user_id !== action.secondaryUserId
        )
      };
    case AUTH_ACTION_TYPES.UNLINKING_ACCOUNT_ERROR:
      return {
        ...state,
        unlinkingAccount: false,
        fetchingSession: false,
        unlinkingAccountError: true
      };
    case AUTH_ACTION_TYPES.PASSWORD_EXISTS:
      return {
        ...state,
        passwordAdded: action.hasPassword
      };
    case AUTH_ACTION_TYPES.CHANGE_NOTIFICATIONS_STATUS:
      const userUpdated = { ...state.user };
      userUpdated.pushNotificationsEnabled = action.pushNotificationsStatus;
      return {
        ...state,
        user: userUpdated
      };
    case AUTH_ACTION_TYPES.EXISTING_ACCOUNT:
      return {
        ...state,
        existingAccount: action.existingAccount
      };
    default:
      return { ...state };
  }
};
