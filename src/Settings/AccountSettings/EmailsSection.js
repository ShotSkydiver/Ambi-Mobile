import React, { useState } from 'react';
import { TouchableOpacity, Alert } from 'react-native';
import i18n from 'format-message';
import FeatherIcon from 'react-native-vector-icons/Feather';

import SingleSection from '../SingleSection';
import BottomSheet from '../../shared/BottomSheet';
import { RowSpaced, ItemTitle, LinkText, HeaderTitle } from '../shared';

import useAppTheme from '../../shared/hooks/useAppTheme';

const EmailsSection = ({
  currentUser,
  userEmails,
  removeUserEmail,
  navigateTo
}) => {
  const secondaryUserEmails = new Set(userEmails);

  const [bottomSheetVisible, setBottomSheet] = useState(false);
  const [emailToRemove, setEmailToRemove] = useState(null);
  const { themeColors } = useAppTheme();

  const toggleBottomSheet = (email = null) => {
    setBottomSheet(!bottomSheetVisible);
    setEmailToRemove(email);
  };

  const removeEmail = async () => {
    await removeUserEmail(emailToRemove);
    toggleBottomSheet();
  };

  const renderRemoveEmailAlert = () => {
    return Alert.alert(
      'Remove Email?',
      `Remove this email (${emailToRemove})?`,
      [
        {
          text: 'Cancel',
          onPress: () => console.warn('Cancel pressed'),
          style: 'cancel'
        },
        {
          text: 'Remove',
          onPress: removeEmail,
          style: 'destructive'
        }
      ],
      {
        cancelable: true
      }
    );
  };

  const emailOptions = [
    {
      icon: 'trash-2',
      title: i18n('Remove Email Address'),
      onPress: renderRemoveEmailAlert
    }
  ];

  return (
    <SingleSection themeColors={themeColors} title="Email Addresses">
      <HeaderTitle themeColors={themeColors}>
        {currentUser.email} (Primary)
      </HeaderTitle>
      {[...secondaryUserEmails].map(email => {
        if (email === currentUser.email) return null;
        return (
          <RowSpaced style={{ marginTop: 16 }} key={email}>
            <ItemTitle themeColors={themeColors}>{email}</ItemTitle>
            <TouchableOpacity onPress={() => toggleBottomSheet(email)}>
              <FeatherIcon name="more-horizontal" size={18} color="#707689" />
            </TouchableOpacity>
          </RowSpaced>
        );
      })}

      <TouchableOpacity
        onPress={navigateTo('AddUserEmail')}
        style={{ marginTop: 16 }}
      >
        <LinkText>+Add Email Address</LinkText>
      </TouchableOpacity>
      <BottomSheet
        toggle={toggleBottomSheet}
        visible={bottomSheetVisible}
        options={emailOptions}
        title="Post options"
      />
    </SingleSection>
  );
};

export default EmailsSection;
