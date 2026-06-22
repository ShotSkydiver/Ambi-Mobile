import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, View } from 'react-native';
import i18n from 'format-message';

import useAppTheme from '../../shared/hooks/useAppTheme';
import {
  SettingsContainer as Container,
  HeadingContainer,
  HeaderTitle,
  SeparatorComponent,
  Input,
  Spacer
} from '../shared';

import { FullScreenLoader } from '../../shared/Loader';
import { NotRecognizedText } from '../../Auth/styles';
import { IS_ANDROID } from '../../shared/constants';

function SetPasswordScreen({ navigation, route }) {
  const hasPasswordAlready = route.params?.hasPasswordAlready;
  // eslint-disable-next-line no-unused-vars
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [incorrectOldPassword, setIncorrectOldPassword] = useState(false);
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [isMatched, setIsMatched] = useState(false);

  const { appTheme, themeColors } = useAppTheme();

  const handlePasswordUpdate = async () => {
    setSubmitted(true);
    // const isValid = validatePassword(password);
    // if (hasPasswordAlready) {
    //   const oldPasswordMatched = await checkValidPassword(
    //     auth.user.email,
    //     oldPassword,
    //     dispatch
    //   );
    //   setIncorrectOldPassword(!oldPasswordMatched);
    //   if (!oldPasswordMatched) {
    //     setSubmitted(false);
    //     return;
    //   }
    // }
    // setIsValidPassword(isValid);
    // if (isValid && hasPasswordAlready) {
    //   try {
    //     await ambiApi.postToApi({
    //       url: '/auth/keycloak/password/change',
    //       body: {
    //         userId: auth.primaryUserId, // Todo:
    //         dataToUpdate: { password },
    //         connection: AUTH0_DB_NAME
    //       }
    //     });
    //     await updateUserPassword(password, oldPassword);
    //     navigation.navigate('AccountSettings');
    //   } catch (err) {
    //     console.warn('error updating user password on auth0: ', err);
    //   }
    // }

    // if (isValid && !hasPasswordAlready) {
    //   try {
    //     const newCreatedUser = await auth.auth0.auth.createUser({
    //       email: auth.user.email,
    //       password,
    //       connection: AUTH0_DB_NAME
    //     });
    //     await linkSecondaryAccount(
    //       auth.auth0,
    //       null,
    //       `auth0|${newCreatedUser.Id}`,
    //       'auth0'
    //     )(dispatch);
    //     await updateUserPassword(password);
    //     navigation.navigate('AccountSettings');
    //   } catch (err) {
    //     console.warn('error creating a user password: ', err);
    //   }
    // }
    setSubmitted(false);
  };

  useEffect(() => {
    const isMatched = password === passwordConfirm;
    if (!isValidPassword) {
      setIsValidPassword(true);
    }
    setIsMatched(isMatched);
    navigation.setParams({
      isMatched,
      submitted,
      handlePasswordUpdate
    });
  }, [password, passwordConfirm, submitted]);

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: themeColors.body
      }}
      behavior={IS_ANDROID ? null : 'padding'}
    >
      <Spacer height="1px" />
      <Container style={{ justifyContent: 'center' }}>
        {hasPasswordAlready && (
          <>
            <HeadingContainer themeColors={themeColors}>
              <HeaderTitle style={{ color: themeColors.textPrimary }}>
                Enter your current Password
              </HeaderTitle>
            </HeadingContainer>
            <SeparatorComponent />
            <Input
              borderColor={incorrectOldPassword && themeColors.error}
              color={themeColors.textPrimary}
              secureTextEntry
              placeholder={i18n('Enter your current Password')}
              onChangeText={setOldPassword}
              style={{
                backgroundColor: themeColors.body
              }}
            />
            <SeparatorComponent />
          </>
        )}
        <Spacer height="16px" />
        <>
          <HeadingContainer themeColors={themeColors}>
            <HeaderTitle style={{ color: themeColors.textPrimary }}>
              Enter a Password
            </HeaderTitle>
          </HeadingContainer>
          <SeparatorComponent />
          <Input
            borderColor={!isValidPassword && themeColors.error}
            color={themeColors.textPrimary}
            placeholderTextColor={themeColors.slateGray}
            secureTextEntry
            placeholder={i18n('Enter a Password')}
            onChangeText={setPassword}
            style={{
              backgroundColor: themeColors.body
            }}
          />
          <SeparatorComponent />
        </>
        <Spacer height="16px" />
        <>
          <HeadingContainer themeColors={themeColors}>
            <HeaderTitle style={{ color: themeColors.textPrimary }}>
              Re-enter your Password
            </HeaderTitle>
          </HeadingContainer>
          <SeparatorComponent />
          <Input
            borderColor={!isValidPassword && themeColors.error}
            color={themeColors.textPrimary}
            secureTextEntry
            placeholder={i18n('Reenter your Password')}
            onChangeText={setPasswordConfirm}
            style={{
              backgroundColor: themeColors.body
            }}
          />
          <SeparatorComponent />
        </>
        <Spacer height="16px" />
        {(!isValidPassword || incorrectOldPassword || !isMatched) && (
          <NotRecognizedText theme={appTheme}>
            {!isValidPassword &&
              `password must contain at least 1 uppercase, 1 lowercase, 1 number, 1 special character (such as @#$!%*?&) and minimum length of 8.`}
            {incorrectOldPassword && 'Wrong old password'}
            {!isMatched && "Passwords didn't match"}
          </NotRecognizedText>
        )}
        {submitted && <FullScreenLoader />}
        <View style={{ flex: 1 }} />
      </Container>
    </KeyboardAvoidingView>
  );
}

SetPasswordScreen.displayName = 'Settings Set Password Screen';

export default SetPasswordScreen;
