/* eslint-disable react/display-name */
import React, { useState, useEffect } from 'react';
import i18n from 'format-message';

import useAppTheme from '../../shared/hooks/useAppTheme';
import {
  HeadingContainer,
  HeaderTitle,
  SeparatorComponent,
  Input,
  Spacer,
  SettingsContainer as Container
} from '../shared';
import { FullScreenLoader } from '../../shared/Loader';
import { emailIsValidFormat } from '../../shared/utils/helpers';
import { AmbiColors } from '../../shared/contexts/themeContext';
import { IconHeaderButtons, Item } from '../../shared/HeaderButtons';

const AddUserEmail = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { themeColors } = useAppTheme();

  const handleAddEmail = async () => {
    setSubmitted(true);
    // const isExistingAccount = await verifyIfExistingAccount(email, dispatch);
    // // Todo: show an error message when its an existing account ?
    // // Do we need to whitelist check here ?
    // if (!isExistingAccount) {
    //   const res = await passwordlessEmailWithCode(auth.auth0, email)(dispatch);
    //   if (res) {
    //     navigation.navigate('VerificationCodeScreen', {
    //       email,
    //       showEmailIcon: true,
    //       headerTitle: 'Verify new email',
    //       isFromSettings: true
    //     });
    //   }
    // }
    setSubmitted(false);
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        const isValidEmail = emailIsValidFormat(email);
        return (
          <IconHeaderButtons useLeftHeader>
            <Item
              title={i18n('Add')}
              color={AmbiColors.ambiBlue}
              onPress={handleAddEmail}
              disabled={!isValidEmail}
              actionable
            />
          </IconHeaderButtons>
        );
      }
    });
  }, [email]);

  return (
    <Container style={{ backgroundColor: themeColors.body }}>
      <Spacer height="16px" />
      <HeadingContainer themeColors={themeColors}>
        <HeaderTitle style={{ color: themeColors.textPrimary }}>
          Enter Email Address{' '}
        </HeaderTitle>
      </HeadingContainer>
      <SeparatorComponent />
      <Input
        style={{
          backgroundColor: themeColors.body,
          color: themeColors.textPrimary
        }}
        placeholder={i18n('Enter an Email Address')}
        onChangeText={setEmail}
      />
      <SeparatorComponent />
      {submitted && <FullScreenLoader />}
    </Container>
  );
};

export default AddUserEmail;
