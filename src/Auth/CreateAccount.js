import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Image,
  StatusBar
} from 'react-native';
import { useDispatch } from 'react-redux';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import i18n from 'format-message';
import styled from 'styled-components';
import { RectButton } from 'react-native-gesture-handler';
import FeatherIcon from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-crop-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { v4 as uuid } from 'uuid';

import { register } from './redux/actions';
import useAppTheme from '../shared/hooks/useAppTheme';
import { emailIsValidFormat } from '../shared/utils/helpers';
import { AmbiColors } from '../shared/contexts/themeContext';
import { FullScreenLoader } from '../shared/Loader';
import {
  Field,
  ActionButton,
  CaptionText,
  Spacer,
  validatePassword
} from './shared';
import { ErrorText, LinkText, Wrapper, Row } from './styles';
import { IS_ANDROID, APPBAR_HEIGHT } from '../shared/constants';
import ProfileButtonImg from './images/PhotoPlaceholder.png';

const PhotoEditButton = styled(View)`
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 2;
  bottom: 3;
`;

const styles = StyleSheet.create({
  editButton: {
    borderRadius: 100,
    borderWidth: 1,
    elevation: 3,
    shadowColor: '#1D2129',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22
  }
});

const CreateAccount = ({ navigation }) => {
  const dispatch = useDispatch();
  const { appTheme, themeColors } = useAppTheme();

  const [profileImage, setProfileImage] = useState(null);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [showErrors, setShowErrors] = useState(false);

  const missingFields =
    email.length === 0 ||
    firstName.length === 0 ||
    lastName.length === 0 ||
    password?.length === 0 ||
    confirmPassword?.length === 0;
  const validEmailFormat = emailIsValidFormat(email);
  const passwordsMatched = password === confirmPassword;
  const validPassword = validatePassword(password);

  const inputRef = useRef(null);

  const insets = useSafeAreaInsets();

  const handleChangeEmail = text => {
    setEmail(text.trim());
  };
  const handleChangePassword = pass => {
    setPassword(pass.trim());
  };
  const handleChangePasswordConfirm = pass => {
    setConfirmPassword(pass.trim());
  };
  const handleChangeFirstName = text => {
    setFirstName(text.trim());
  };
  const handleChangeLastName = text => {
    setLastName(text.trim());
  };

  const openUrl = url => () => {
    InAppBrowser.open(url);
  };

  const openImagePicker = async () => {
    try {
      const image = await ImagePicker.openPicker({
        cropping: true,
        cropperCircleOverlay: true,
        smartAlbums: [
          'UserLibrary',
          'Favorites',
          'RecentlyAdded',
          'Videos',
          'SelfPortraits',
          'LivePhotos',
          'DepthEffect',
          'Panoramas',
          'Bursts',
          'Screenshots',
          'LongExposure',
          'Animated',
          'Generic',
          'AllHidden',
          'Regular',
          'PhotoStream',
          'CloudShared'
        ],
        mediaType: 'photo',
        sortOrder: 'asc',
        waitAnimationEnd: false
      });

      if (image) {
        const processedImage = {
          ...image,
          filename: image.filename ?? image.name,
          type: image.type ?? image.mime,
          uniqueIdentifier: uuid()
        };
        setProfileImage(processedImage);
      }
    } catch (err) {
      if (err.code && err.code !== 'E_PICKER_CANCELLED') {
        console.error(err.code, err.message);
      }
    }
  };

  useEffect(() => {
    return () => {
      ImagePicker.clean();
    };
  }, []);

  const handleSubmit = async () => {
    setSubmitting(true);
    const hasErrors =
      !validPassword || !passwordsMatched || !validEmailFormat || missingFields;
    setShowErrors(hasErrors);
    if (!hasErrors) {
      await register(
        email,
        password,
        firstName,
        lastName,
        navigation
      )(dispatch);
      // Todo: update the profile pic in ambi or even better create/update the user in ambi
    }
    setSubmitting(false);
  };

  const STATUSBAR_HEIGHT = !IS_ANDROID ? insets.top : StatusBar.currentHeight;

  return (
    <Wrapper
      style={{
        backgroundColor: themeColors.backgroundColor,
        paddingTop: APPBAR_HEIGHT + STATUSBAR_HEIGHT
      }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behaviour={IS_ANDROID ? 'height' : 'position'}
      >
        <Spacer height="40px" />
        <View style={{ flex: 1, alignItems: 'center' }}>
          <RectButton
            onPress={openImagePicker}
            activeOpacity={0.4}
            rippleColor={themeColors.systemBorderColor}
          >
            {profileImage && (
              <>
                <Image
                  style={{ width: 120, height: 120, borderRadius: 90 }}
                  source={{
                    uri: profileImage.path
                  }}
                />
                <PhotoEditButton
                  style={{
                    ...styles.editButton,
                    backgroundColor: themeColors.backgroundColor,
                    borderColor: '#CED1D9'
                  }}
                >
                  <FeatherIcon
                    name="plus"
                    size={36}
                    color={AmbiColors.razzmatazz}
                  />
                </PhotoEditButton>
              </>
            )}
            {profileImage == null && (
              <Image
                source={ProfileButtonImg}
                style={{ width: 121, height: 121 }}
              />
            )}
          </RectButton>
          <Spacer height="22px" />
          <Row>
            <Field
              placeholder={i18n('First Name')}
              autoCompleteType="name"
              returnKeyType="next"
              autoCapitalize="words"
              autoCorrect={false}
              textContentType="name"
              onChangeText={handleChangeFirstName}
              containerStyle={{
                width: '49%',
                backgroundColor: themeColors.backgroundColor,
                borderColor:
                  showErrors && firstName?.length === 0
                    ? themeColors.error
                    : themeColors.systemBorderColor
              }}
            />
            <Spacer width="8px" />
            <Field
              placeholder={i18n('Last Name')}
              autoCompleteType="name"
              returnKeyType="next"
              autoCapitalize="words"
              autoCorrect={false}
              textContentType="name"
              onChangeText={handleChangeLastName}
              containerStyle={{
                width: '49%',
                backgroundColor: themeColors.backgroundColor,
                borderColor:
                  showErrors && lastName?.length === 0
                    ? themeColors.error
                    : themeColors.systemBorderColor
              }}
            />
          </Row>
          <Spacer height="12px" />
          <Field
            placeholder={i18n('Email')}
            autoCompleteType="email"
            keyboardType="email-address"
            returnKeyType="next"
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="emailAddress"
            onChangeText={handleChangeEmail}
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
            textInputRef={inputRef}
            placeholder={i18n('Password')}
            autoCompleteType="password"
            keyboardType="default"
            returnKeyType="next"
            autoCapitalize="none"
            spellCheck={false}
            blurOnSubmit={false}
            textContentType="newPassword"
            secureTextEntry
            importantForAutofill="yes"
            onSubmitEditing={() => {
              inputRef.current.blur();
            }}
            onChangeText={handleChangePassword}
            containerStyle={{
              backgroundColor: themeColors.backgroundColor,
              borderColor:
                showErrors && (!validPassword || !passwordsMatched)
                  ? themeColors.error
                  : themeColors.systemBorderColor
            }}
            isPasswordField
          />
          <Spacer height="12px" />

          <Field
            textInputRef={inputRef}
            placeholder={i18n('Re-Enter Password')}
            autoCompleteType="password"
            keyboardType="default"
            returnKeyType="go"
            autoCapitalize="none"
            spellCheck={false}
            blurOnSubmit={false}
            textContentType="newPassword"
            secureTextEntry
            importantForAutofill="yes"
            onSubmitEditing={() => {
              inputRef.current.blur();
            }}
            onChangeText={handleChangePasswordConfirm}
            containerStyle={{
              backgroundColor: themeColors.backgroundColor,
              borderColor:
                showErrors && (!validPassword || !passwordsMatched)
                  ? themeColors.error
                  : themeColors.systemBorderColor
            }}
            isPasswordField
          />
          <Spacer height="12px" />

          <View style={{ flex: 1, alignSelf: 'flex-start', marginTop: 16 }}>
            {showErrors && (
              <>
                {missingFields && (
                  <ErrorText theme={appTheme}>
                    {i18n('*All fields are required')}
                  </ErrorText>
                )}
                {!validEmailFormat && (
                  <ErrorText theme={appTheme}>
                    {i18n('*Please enter a valid email')}
                  </ErrorText>
                )}

                {!passwordsMatched && (
                  <ErrorText theme={appTheme}>
                    {i18n('*Passswords do not match')}
                  </ErrorText>
                )}
                {!validPassword && (
                  <ErrorText theme={appTheme}>
                    {i18n('*Please set a stronger password')}
                  </ErrorText>
                )}
                {!validPassword && (
                  <ErrorText theme={appTheme}>
                    {i18n(
                      '*Passwords must contain atleast 8 characters and maximum 14 characters, 1 uppercase letter and 1 number'
                    )}
                  </ErrorText>
                )}
              </>
            )}
          </View>
          <View style={{ marginBottom: 40 }}>
            <CaptionText
              style={{ color: themeColors.slateGray, paddingHorizontal: 0 }}
            >
              By continuing you agree to our{' '}
              {
                <LinkText
                  style={{ fontSize: 14 }}
                  onPress={openUrl('https://ambi.school/terms-conditions')}
                >
                  Terms of Service{' '}
                </LinkText>
              }
              and our{' '}
              {
                <LinkText
                  style={{ fontSize: 14 }}
                  onPress={openUrl('https://ambi.school/privacy-policy')}
                >
                  privacy Policy,{' '}
                </LinkText>
              }
            </CaptionText>
            <Spacer height="16px" />
            <ActionButton
              title={i18n('Sign Up')}
              disabled={false}
              onPress={handleSubmit}
            />
          </View>
        </View>
        {submitting && <FullScreenLoader />}
      </KeyboardAvoidingView>
    </Wrapper>
  );
};

export default CreateAccount;
