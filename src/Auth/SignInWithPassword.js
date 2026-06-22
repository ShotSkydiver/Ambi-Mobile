import React, { useState, useRef } from 'react';
import i18n from 'format-message';
import { View, Image, StatusBar } from 'react-native';
import { useDispatch } from 'react-redux';

import { loginWithPassword } from './redux/actions';
import { FullScreenLoader } from '../shared/Loader';
import useAppTheme from '../shared/hooks/useAppTheme';
// import { emailIsValidFormat } from '../shared/utils/helpers';
import {
  Field,
  ActionButton,
  Spacer,
  SubtitleText,
  // validatePassword,
  BaseText
} from './shared';
import Logo from './images/Logo.png';
import LogoWhite from './images/LogoWhite.png';

import { NotRecognizedText, LinkText, BottomButton, Wrapper } from './styles';

function SignInWithPassword({ navigation }) {
  const dispatch = useDispatch();
  const { appTheme, themeColors } = useAppTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const secondInputRef = useRef(null);

  // const validEmailFormat = emailIsValidFormat(email);
  // const validPassword = validatePassword(password);
  const validEmailFormat = true;
  const validPassword = true;

  const navigateTo = route => () => {
    navigation.navigate(route);
  };

  const startPasswordSignIn = async () => {
    setSubmitting(true);
    const hasErrors = !validEmailFormat || !validPassword;
    setShowErrors(hasErrors);
    if (!hasErrors) {
      await loginWithPassword(email, password, navigation)(dispatch);
    }
    setSubmitting(false);
  };

  return (
    <Wrapper
      style={{
        backgroundColor: themeColors.backgroundColor,
        justifyContent: 'center'
      }}
    >
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Image
          source={appTheme.dark ? LogoWhite : Logo}
          style={{
            resizeMode: 'contain',
            height: 61,
            width: 200
          }}
        />
        <SubtitleText
          style={{
            color: themeColors.darkGreenColor,
            textAlign: 'center',
            marginTop: 24
          }}
        >
          {i18n(`Connect with peers and discover events via private Networks`)}
        </SubtitleText>
      </View>
      <Spacer height="40px" />
      <Field
        placeholder={i18n('Email')}
        value={email || null}
        autoCompleteType="email"
        keyboardType="email-address"
        returnKeyType="next"
        autoCapitalize="none"
        spellCheck={false}
        importantForAutofill="yes"
        blurOnSubmit={false}
        onSubmitEditing={() => {
          secondInputRef.current.focus();
        }}
        textContentType="emailAddress"
        onChangeText={text => setEmail(text.trim())}
        containerStyle={{
          backgroundColor: themeColors.backgroundColor,
          borderColor:
            showErrors && !validEmailFormat
              ? themeColors.error
              : themeColors.systemBorderColor
        }}
      />
      <Spacer height="12px" />

      <Field
        textInputRef={secondInputRef}
        placeholder={i18n('Password')}
        autoCompleteType="password"
        keyboardType="default"
        returnKeyType="go"
        autoCapitalize="none"
        spellCheck={false}
        blurOnSubmit={false}
        textContentType="password"
        secureTextEntry
        importantForAutofill="yes"
        onSubmitEditing={() => {
          secondInputRef.current.blur();
        }}
        onChangeText={text => setPassword(text.trim())}
        containerStyle={{
          backgroundColor: themeColors.backgroundColor,
          borderColor:
            !validPassword && showErrors
              ? themeColors.error
              : themeColors.systemBorderColor
        }}
        isPasswordField
      />

      <Spacer height="24px" />
      <ActionButton title={i18n('Log In')} onPress={startPasswordSignIn} />
      <Spacer height="16px" />
      <LinkText
        style={{ textAlign: 'center', fontFamily: 'Circular-Book' }}
        onPress={navigateTo('RecoverPassword')}
      >
        Forgot Password
      </LinkText>
      {(!validPassword || !validEmailFormat) && (
        <NotRecognizedText style={{ paddingTop: 8 }} theme={appTheme}>
          {i18n('*incorrect email or password')}
        </NotRecognizedText>
      )}
      <Spacer height="24px" />
      <BottomButton onPress={navigateTo('SignUpStackNavigator')}>
        <BaseText style={{ color: themeColors.chatText }}>
          {i18n('Create Account')}
        </BaseText>
      </BottomButton>
      {submitting && <FullScreenLoader />}
      <StatusBar
        barStyle={appTheme.dark ? 'light-content' : 'dark-content'}
        backgroundColor={themeColors.bgColorSemiTransparent}
        translucent
        animated
      />
    </Wrapper>
  );
}

export default SignInWithPassword;
