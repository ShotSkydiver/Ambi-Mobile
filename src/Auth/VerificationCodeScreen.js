import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import {
  CodeField,
  useBlurOnFulfill,
  useClearByFocusCell
} from 'react-native-confirmation-code-field';
import i18n from 'format-message';
import { useSelector } from 'react-redux';
import useAppTheme from '../shared/hooks/useAppTheme';

import { ActionButton, Spacer } from './shared';
import {
  Wrapper,
  InfoText,
  codeStyles,
  CodeFieldText,
  MagicEmailIcon,
  NotRecognizedText
} from './styles';
import EmailIcon from './images/email_passwordless.png';

function VerificationCodeScreen({ navigation, route }) {
  const auth = useSelector(state => state.auth);
  const [verificationCode, setVerificationCode] = useState('');
  const { appTheme, themeColors } = useAppTheme();
  const { email, headerTitle, showEmailIcon } = route.params;
  const ref = useBlurOnFulfill({ value: verificationCode, cellCount: 4 });
  const [cellProps, getCellOnLayoutHandler] = useClearByFocusCell({
    value: verificationCode,
    setValue: setVerificationCode
  });

  useEffect(() => {
    if (headerTitle !== null) {
      navigation.setOptions({
        headerTitle
      });
    }
  }, []);

  const submitVerificationCode = async () => {
    if (verificationCode !== '') {
      // exchangeVerificationCode(
      //   navigation,
      //   auth.auth0,
      //   email,
      //   auth.audience,
      //   verificationCode,
      //   isFromSettings,
      //   isFromRecoverPassword,
      //   currentUserId
      // )(dispatch);
    }
  };

  const styles = codeStyles(themeColors);

  return (
    <Wrapper
      style={{
        backgroundColor: themeColors.backgroundColor,
        justifyContent: 'center'
      }}
    >
      <View style={{ alignItems: 'center' }}>
        <InfoText
          style={{ fontFamily: 'Circular-Bold' }}
          color={themeColors.darkGreenColor}
        >
          {i18n('Enter Confirmation Code')}
        </InfoText>
        <InfoText color={themeColors.slateGray}>
          Enter the 4-digit code we sent to{' '}
          {<Text style={{ fontFamily: 'Circular-Bold' }}>{`${email}`}</Text>}.
        </InfoText>
        {showEmailIcon && <MagicEmailIcon source={EmailIcon} />}
      </View>
      <CodeField
        ref={ref}
        {...cellProps}
        value={verificationCode}
        onChangeText={setVerificationCode}
        cellCount={4}
        rootStyle={styles.codeFiledRoot}
        keyboardType="number-pad"
        renderCell={({ index, symbol, isFocused }) => (
          <CodeFieldText
            key={index}
            color={themeColors.darkGreenColor}
            indexValue={index}
            isFocused={isFocused}
            onLayout={getCellOnLayoutHandler(index)}
            style={styles.cell}
          >
            {symbol || null}
          </CodeFieldText>
        )}
      />
      <Spacer height="8px" />
      {auth.loggingInError && (
        <NotRecognizedText theme={appTheme}>
          {i18n('Incorrect code entered!')}
        </NotRecognizedText>
      )}
      <Spacer height="16px" />
      <ActionButton
        title={i18n('Verify Code')}
        disabled={verificationCode.length < 4}
        onPress={submitVerificationCode}
      />
    </Wrapper>
  );
}

export default VerificationCodeScreen;
