import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeModules } from 'react-native';

import { AUTH_ACTION_TYPES } from './actionTypes';
import { ambiApi } from '../../models/AmbiApi';
import FirebaseService from '../../shared/utils/FirebaseService';

import { ambiApiUrl } from '../shared';

const AUTH_TOKEN_STORAGE_KEY = 'ambi-auth';

// Todo && Note: We should not store the accessTokens/auth related info in the Asyncstorage to do auth.
// We should make use of keycloak react-native library and use it to authenticate the user instead.
// Sticking with this old implementation because the UI flow only supports the old way.

// keycloak react native library: https://github.com/react-keycloak/react-native-keycloak
// We're not using this right now. But ideally we should instead of dealing with the api.

export async function setApiAndLookupClient() {
  try {
    await AsyncStorage.setItem('api-url', ambiApiUrl);
  } catch (err) {
    console.error('unable to lookup client: ', err);
  }
}

export async function setUpAuthTokens(authResult) {
  const { accessToken, expiresIn, idToken, refreshToken } = authResult;
  const authPayload = {
    accessToken,
    expiresAt: new Date(new Date().getTime() + expiresIn * 1000).getTime(),
    idToken,
    refreshToken
  };
  try {
    await ambiApi.setTokens({ accessToken, idToken, refreshToken });
    await AsyncStorage.setItem(
      AUTH_TOKEN_STORAGE_KEY,
      JSON.stringify(authPayload)
    );
  } catch (exception) {
    console.warn('Unable to save authentication information: ', exception);
  }
}

export async function revokeRefreshToken() {
  try {
    // Todo:
    // await auth0.auth.revoke({
    //   refreshToken
    // });
  } catch (err) {
    console.warn('revoke token failed:', err);
  }
}

export async function clearLocalCredentials() {
  try {
    // Todo: await revokeRefreshToken(auth0, tokens.refreshToken);
    await AsyncStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  } catch (exception) {
    console.warn('Unable to clear authentication information: ', exception);
  }
}

export function verifyUser(navigation) {
  return async dispatch => {
    let authenticatedUser = {};
    try {
      authenticatedUser = (await ambiApi.getFromApi('/auth/verify')).data;
    } catch (err) {
      console.warn('Unable to verify user:', JSON.stringify(err));
      clearLocalCredentials();
      dispatch({ type: AUTH_ACTION_TYPES.LOGGED_OUT });
      navigation.navigate('SSOFailScreen');
      return;
    }
    dispatch({
      type: AUTH_ACTION_TYPES.LOGGED_IN,
      user: authenticatedUser
    });
  };
}

export async function exchangeRefreshToken() {
  let tokenResult;
  try {
    // tokenResult = await auth0.auth.refreshToken({
    //   refreshToken,
    //   scope: 'openid email profile offline_access'
    // });
  } catch (err) {
    console.warn('refresh token failed:', err);
    return null;
  }
  return tokenResult;
}

export function fetchSession(navigation) {
  return async dispatch => {
    dispatch({ type: AUTH_ACTION_TYPES.FETCHING_SESSION });
    let isAuthenticated = false;
    let localAuthTokenData;
    try {
      localAuthTokenData = await AsyncStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    } catch (err) {
      console.warn('Unable to retrieve authentication information:', err);
    }
    if (localAuthTokenData) {
      let accessToken;
      let refreshToken;
      let expiresAt;
      let idToken;
      try {
        ({ accessToken, expiresAt, idToken, refreshToken } =
          JSON.parse(localAuthTokenData));
        if (new Date() < new Date(expiresAt)) {
          isAuthenticated = true;
          ambiApi.setTokens({ accessToken, idToken, refreshToken });
        } else {
          // Todo: refresh token
          // const newTokens = await exchangeRefreshToken(refreshToken);
          // ({ accessToken, idToken, expiresIn: expiresAt } = newTokens);
          // const authPayload = {
          //   accessToken,
          //   expiresAt: new Date(
          //     new Date().getTime() + expiresAt * 1000
          //   ).getTime(),
          //   idToken,
          //   refreshToken
          // };
          // isAuthenticated = true;
          // ambiApi.setTokens({ accessToken, idToken, refreshToken });
          // try {
          //   await AsyncStorage.setItem(
          //     AUTH_TOKEN_STORAGE_KEY,
          //     JSON.stringify(authPayload)
          //   );
          // } catch (exception) {
          //   console.warn(
          //     'Unable to save authentication information: ',
          //     exception
          //   );
          // }
        }
      } catch (err) {
        console.warn('Unable to load authentication information:', err);
      }
    }

    if (isAuthenticated) {
      await verifyUser(navigation)(dispatch);
    } else {
      dispatch({ type: AUTH_ACTION_TYPES.LOGGED_OUT });
    }
  };
}

export function lookupClient(email) {
  return async dispatch => {
    dispatch({ type: AUTH_ACTION_TYPES.LOOKING_UP_CLIENT });
    let clientResult;
    try {
      clientResult = await ambiApi.getFromApi(
        `/client/onboarding?emailAddress=${encodeURIComponent(email)}`
      );
    } catch (err) {
      console.warn('Unable to look up client for email address:', err);
      dispatch({ type: AUTH_ACTION_TYPES.CLIENT_LOOKUP_ERROR });
      return;
    }
    if (!clientResult || !clientResult.data) {
      console.error('Auth has not been setup properly for the API');
      dispatch({ type: AUTH_ACTION_TYPES.CLIENT_LOOKUP_ERROR });
      return;
    }
    const { name, subdomain, theme } = clientResult.data;

    dispatch({
      type: AUTH_ACTION_TYPES.FOUND_AUTH0_CLIENT,
      clientName: name,
      subdomain,
      theme
    });
  };
}

export async function generateOauthParams() {
  if (!NativeModules.A0Auth0) {
    return Promise.reject(
      new Error(
        'Missing NativeModule. React Native versions 0.60 and up perform auto-linking. Please see https://github.com/react-native-community/cli/blob/master/docs/autolinking.md.'
      )
    );
  }

  return new Promise(resolve => {
    NativeModules.A0Auth0.oauthParameters(parameters => {
      resolve(parameters);
    });
  });
}

export async function checkEmailWhitelist(email, dispatch) {
  dispatch({ type: AUTH_ACTION_TYPES.LOOKING_UP_EMAIL });
  let isValidEmail = false;
  try {
    const validResponse = await ambiApi.getFromApi(
      `/auth/verify/email?email=${email}&isWhitelist=true&isInvited=true`
    );

    if (!validResponse || !validResponse.data) {
      dispatch({ type: AUTH_ACTION_TYPES.EMAIL_WHITELIST_ERROR });
      return false;
    }
    const validData = validResponse.data[0] || validResponse.data;
    isValidEmail = validData;

    if (isValidEmail) {
      dispatch({ type: AUTH_ACTION_TYPES.FOUND_VALID_EMAIL });
    } else {
      dispatch({ type: AUTH_ACTION_TYPES.EMAIL_WHITELIST_ERROR });
    }
  } catch (err) {
    console.warn('Unable to verify account:', JSON.stringify(err));
    dispatch({ type: AUTH_ACTION_TYPES.EMAIL_WHITELIST_ERROR });
    return false;
  }
  return isValidEmail;
}

export async function updateUserPassword(newPassword, oldPassword = null) {
  let response;
  try {
    response = await ambiApi.postToApi({
      url: '/auth/me/password',
      body: { newPassword, oldPassword }
    });
  } catch (err) {
    console.warn('error updating user password');
  }
  return response;
}

export function register(email, password, firstName, lastName, navigation) {
  return async dispatch => {
    try {
      const signUpRes = await ambiApi.postToApi({
        url: '/auth/keycloak/register',
        body: {
          email,
          password,
          firstName,
          lastName,
          realmName: 'AMBIQA',
          clientId: 'ambi'
        }
      });
      const { accessToken, refreshToken, idToken, expiresIn } = signUpRes.data;
      if (accessToken && refreshToken && idToken && expiresIn) {
        await setUpAuthTokens(signUpRes.data);
        await verifyUser(navigation)(dispatch);
      }
    } catch (err) {
      console.warn('Login failed:', err);
    }
  };
}

export function loginWithPassword(email, password, navigation) {
  return async dispatch => {
    try {
      const loginRes = await ambiApi.postToApi({
        url: '/auth/keycloak/login',
        body: {
          email,
          password,
          realmName: 'AMBIQA',
          clientId: 'ambi'
        }
      });
      await setUpAuthTokens(loginRes.data);
      await verifyUser(navigation)(dispatch);
    } catch (err) {
      console.warn('Login failed:', err);
    }
  };
}

// Todo: Also need to clear the keycloak session. Use the api. Write a new route.
export function logout(currentUserId) {
  return async dispatch => {
    try {
      if (currentUserId) {
        await FirebaseService.removeUserDevice(currentUserId);
      }
    } catch (err) {
      console.warn('Unable to remove user device:', err);
    }
    await clearLocalCredentials();
    dispatch({ type: AUTH_ACTION_TYPES.LOGGED_OUT });
    try {
      await AsyncStorage.removeItem('api-url');
    } catch (err) {
      console.warn('unable to clear api info: ', err);
    }
  };
}

export async function getAllUserEmails(currentUserId) {
  let emails = [];
  try {
    const result = await ambiApi.getFromApi(`/users/${currentUserId}/emails`);
    emails = result.data;
  } catch (err) {
    console.warn('error fetching user emails: ', err);
  }
  return emails;
}

export async function removeUserEmail(email, currentUserId) {
  try {
    await ambiApi.deleteFromApi({
      url: `/users/${currentUserId}/email/${email}`
    });
  } catch (err) {
    console.warn('error deleting user email: ', err);
  }
}

export function changeNotificationStatus(notificationStatus) {
  return async dispatch => {
    dispatch({
      type: AUTH_ACTION_TYPES.CHANGE_NOTIFICATIONS_STATUS,
      pushNotificationsStatus: notificationStatus
    });
  };
}

// check and add to user in all communities that he could be added
export async function addUserToCommunities(email, currentUserId) {
  try {
    await ambiApi.postToApi({
      url: `/communities/members/add/onboarding`,
      body: {
        userId: currentUserId,
        role: 'member',
        email
      }
    });
  } catch (err) {
    console.warn('error adding user to the community: ', err);
  }
}
