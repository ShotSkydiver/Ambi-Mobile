import React, { useState, useEffect } from 'react';
import { StatusBar, View, KeyboardAvoidingView } from 'react-native';
import i18n from 'format-message';
import { useSelector } from 'react-redux';

import useAppTheme from '../shared/hooks/useAppTheme';
import { clearLocalCredentials, updateUserPassword } from './redux/actions';
import { Field, ActionButton, Spacer, validatePassword } from './shared';
import { emailIsValidFormat } from '../shared/utils/helpers';
import { IS_ANDROID } from '../shared/constants';
import { FullScreenLoader } from '../shared/Loader';
import { NotRecognizedText, InfoText, Wrapper } from './styles';

const RecoverPassword = ({ route, navigation }) => {
  const auth = useSelector(state => state.auth);
  const { appTheme, themeColors } = useAppTheme();

  const auth0Result = route.params?.auth0Result;
  const submittedValidVerificationCode =
    route.params?.submittedValidVerificationCode;
  const showPasswordResetScreen =
    submittedValidVerificationCode && !!auth0Result;

  const [email, setEmail] = useState('');
  const [validEmailFormat, setIsValidFormat] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [resetCompleted, setResetCompleted] = useState(false);
  const [isValidPasswordError, setIsValidPasswordError] = useState(false);
  const [hasPasswordsMatchError, setPasswordsMatchError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setIsValidFormat(emailIsValidFormat(email));
  }, [email]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Recover Password'
    });
  }, []);

  useEffect(() => {
    if (newPassword.length > 0 && passwordConfirm.length > 0) {
      const matchError = newPassword !== passwordConfirm;
      setPasswordsMatchError(matchError);
    }
    setIsValidPasswordError(false);
  }, [newPassword, passwordConfirm]);

  const startPasswordless = async () => {
    setSubmitting(true);
    // const isExistingAccount = await verifyIfExistingAccount(email, dispatch);
    // dispatch({
    //   type: AUTH_ACTION_TYPES.EXISTING_ACCOUNT,
    //   existingAccount: isExistingAccount
    // });
    // if (isExistingAccount) {
    //   const result = await passwordlessEmailWithCode(
    //     auth.auth0,
    //     email
    //   )(dispatch);
    //   if (result) {
    //     navigation.navigate('VerificationCodeScreen', {
    //       email,
    //       isFromRecoverPassword: true,
    //       headerTitle: 'Recover Password'
    //     });
    //   }
    // }
    setSubmitting(false);
  };

  const handleSubmitPasswordChange = async () => {
    setSubmitting(true);
    const isValidPassword = validatePassword(newPassword);
    if (!isValidPassword) {
      setIsValidPasswordError(true);
      return;
    }
    try {
      const response = await updateUserPassword(newPassword);
      if (response && response.success) {
        await clearLocalCredentials();
        setResetCompleted(true);
      }
    } catch (err) {
      console.warn('error updating user password');
    }
    setSubmitting(false);
  };

  const navigateToPasswordSignIn = () => {
    navigation.navigate('SignInWithPassword');
  };

  function getAttributes() {
    let action = startPasswordless;
    let title = 'Trouble logging in';
    let description = `Enter the email you signed up with and we’ll send you a code to get back into your account.`;
    let btnText = 'Next';
    if (showPasswordResetScreen) {
      action = handleSubmitPasswordChange;
      title = 'Create a Password';
      description =
        'Passwords must contain at least one lowercase & uppercase character, number, & special symbol (();’<>?!;;’-+-)';
      if (resetCompleted) {
        action = navigateToPasswordSignIn;
        title = 'New Password Set';
        description = 'Use your new password to sign back into ambi';
        btnText = 'Return to sign in';
      }
    }
    return { action, title, description, btnText };
  }

  const { action, title, description, btnText } = getAttributes();

  return (
    <Wrapper
      style={{
        backgroundColor: themeColors.backgroundColor,
        justifyContent: 'center'
      }}
    >
      <KeyboardAvoidingView behavior={IS_ANDROID ? 'height' : 'position'}>
        <View>
          <InfoText
            style={{ fontFamily: 'Circular-Bold' }}
            color={themeColors.darkGreenColor}
          >
            {i18n('{title}', { title })}
          </InfoText>
          <InfoText color={themeColors.slateGray}>
            {i18n('{description}', { description })}
          </InfoText>
          <Spacer height="16px" />

          {!showPasswordResetScreen && !resetCompleted && (
            <Field
              placeholder={i18n('Ambi linked or School email')}
              autoCompleteType="email"
              keyboardType="email-address"
              returnKeyType="done"
              autoCapitalize="none"
              spellCheck={false}
              textContentType="emailAddress"
              onChangeText={text => setEmail(text.trim())}
              containerStyle={{
                backgroundColor: themeColors.backgroundColor,
                borderColor: auth.clientLookUpError
                  ? themeColors.error
                  : themeColors.systemBorderColor
              }}
              useIcon
            />
          )}

          {showPasswordResetScreen && !resetCompleted && (
            <>
              <Field
                placeholder={i18n('Enter a password')}
                autoCompleteType="password"
                keyboardType="default"
                returnKeyType="go"
                autoCapitalize="none"
                spellCheck={false}
                textContentType="password"
                onChangeText={text => setNewPassword(text.trim())}
                containerStyle={{
                  backgroundColor: themeColors.backgroundColor,
                  borderColor:
                    auth.clientLookUpError ||
                    (auth.validPasswordError &&
                      (isValidPasswordError || hasPasswordsMatchError))
                      ? themeColors.error
                      : themeColors.systemBorderColor
                }}
                useIcon
                isPasswordField
              />
              <Spacer height="16px" />
              <Field
                placeholder={i18n('Re-enter your password')}
                autoCompleteType="password"
                keyboardType="default"
                returnKeyType="go"
                autoCapitalize="none"
                spellCheck={false}
                textContentType="password"
                onChangeText={text => setPasswordConfirm(text.trim())}
                containerStyle={{
                  backgroundColor: themeColors.backgroundColor,
                  borderColor:
                    auth.clientLookUpError ||
                    (auth.validPasswordError &&
                      (isValidPasswordError || hasPasswordsMatchError))
                      ? themeColors.error
                      : themeColors.systemBorderColor
                }}
                useIcon
                isPasswordField
              />
            </>
          )}
          <Spacer height="22px" />
          <ActionButton
            title={i18n('{btnText}', { btnText })}
            disabled={!validEmailFormat && !resetCompleted}
            onPress={action}
          />
          <Spacer height="7px" />
          {auth.emailValidError && (
            <NotRecognizedText theme={appTheme}>
              {i18n('No account was found for this email!')}
            </NotRecognizedText>
          )}
          {(auth.clientLookUpError || auth.emailWhitelistError) && (
            <NotRecognizedText theme={appTheme}>
              {i18n(
                "Non-validated email domain, please make sure it's your school email"
              )}
            </NotRecognizedText>
          )}
          {isValidPasswordError && (
            <NotRecognizedText theme={appTheme}>
              {i18n('*invalid password')}
            </NotRecognizedText>
          )}
          {hasPasswordsMatchError && (
            <NotRecognizedText theme={appTheme}>
              {i18n('*passwords do not match')}
            </NotRecognizedText>
          )}
          {submitting && <FullScreenLoader />}
          <StatusBar
            barStyle={appTheme.dark ? 'light-content' : 'dark-content'}
            backgroundColor="transparent"
            translucent
            animated
          />
        </View>
      </KeyboardAvoidingView>
    </Wrapper>
  );
};

export default RecoverPassword;
