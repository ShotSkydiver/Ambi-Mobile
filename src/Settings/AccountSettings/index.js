import React, { useState } from 'react';
import { ScrollView, StatusBar } from 'react-native';
import { useSelector } from 'react-redux';

import useAppTheme from '../../shared/hooks/useAppTheme';

import PasswordSection from './PasswordSection';
import { SettingsContainer, Spacer } from '../shared';
import { FullScreenLoader } from '../../shared/Loader';

const AccountSettings = ({ navigation, isFocused }) => {
  const auth = useSelector(state => state.auth);
  const currentUser = auth.user;
  // const newAddedEmail = route.params?.newAddedEmail;
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [hasPassword, setHasPassword] = useState(false);
  // const [userEmails, setUserEmails] = useState([]);

  const { appTheme, themeColors } = useAppTheme([isFocused]);

  const navigateTo =
    (screenName, params = {}) =>
    () => {
      navigation.navigate(screenName, params);
    };

  // const getCompleteUserInfo = async () => {
  //   const userInfo = await getUserInfo(auth.auth0, null, true);
  //   if (userInfo && userInfo.identities) {
  //     dispatch({
  //       type: AUTH_ACTION_TYPES.LINKED_ACCOUNT,
  //       linkedIdentities: userInfo.identities,
  //       primaryUserId: userInfo.userId // mainly used for updating password on auth0
  //     });
  //   }
  //   const checkUserPassword = await checkIfPasswordExists(dispatch);
  //   setHasPassword(checkUserPassword);
  //   setLoading(false);
  // };

  // const getUserEmails = async () => {
  //   const userEmails = await getAllUserEmails(currentUser.id);
  //   setUserEmails(userEmails || []);
  // };

  // useEffect(() => {
  //   getUserEmails();
  // }, [newAddedEmail]);

  // useEffect(() => {
  //   getCompleteUserInfo();
  // }, []);

  // const unlinkAndDeleteUserFromAuth0 = async (secondaryUserId, provider) => {
  //   await unlinkSecondaryAccount(
  //     auth.auth0,
  //     null,
  //     secondaryUserId,
  //     provider
  //   )(dispatch);
  //   await deleteUserFromAuth0(`${provider}|${secondaryUserId}`);
  // };

  // const removeLinkedLogin = linkedIdentity => async () => {
  //   setLoading(true);
  //   const { user_id: secondaryUserId, provider } = linkedIdentity;
  //   await unlinkAndDeleteUserFromAuth0(secondaryUserId, provider);
  //   setLoading(false);
  // };

  // const handleRemoveUserEmail = async email => {
  //   const identityWithEmail = auth.linkedIdentities.find(
  //     ({ profileData }) => profileData && profileData.email === email
  //   );
  //   if (identityWithEmail) {
  //     setLoading(true);
  //     const { user_id: secondaryUserId, provider } = identityWithEmail;
  //     await unlinkAndDeleteUserFromAuth0(secondaryUserId, provider);
  //     await removeUserEmail(email, currentUser.id);
  //     await getUserEmails();
  //     setLoading(false);
  //   }
  // };

  // const linkedSocialAccounts = auth.linkedIdentities.filter(
  //   identity => identity.isSocial
  // );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: themeColors.body }}>
      {loading && <FullScreenLoader />}
      <SettingsContainer style={{ backgroundColor: themeColors.body }}>
        <Spacer height="16px" />
        {/* <EmailsSection
          currentUser={currentUser}
          userEmails={userEmails}
          navigateTo={navigateTo}
          removeUserEmail={handleRemoveUserEmail}
        />
        <Spacer height="16px" /> */}
        <PasswordSection
          currentUser={currentUser}
          navigateTo={navigateTo}
          hasPassword={hasPassword}
        />
        <Spacer height="16px" />
        {/* <LinkedLoginsSection
          navigateTo={navigateTo}
          linkedLogins={removeDuplicates(linkedSocialAccounts)}
          removeLinkedLogin={removeLinkedLogin}
        /> */}
      </SettingsContainer>
      <StatusBar
        barStyle={appTheme.dark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
      />
    </ScrollView>
  );
};

export default AccountSettings;
