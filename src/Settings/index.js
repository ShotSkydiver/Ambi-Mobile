import React from 'react';
import { StatusBar } from 'react-native';
import { useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';

import FeatherIcon from 'react-native-vector-icons/Feather';
import useAppTheme from '../shared/hooks/useAppTheme';
import { SettingsContainer, SettingsItem, SettingsItemTitle } from './shared';
import { emailIsColumbia } from '../Auth/shared';

const Settings = ({ navigation }) => {
  const isFocused = useIsFocused();
  const currentUser = useSelector(state => state.auth.user);
  const { appTheme, themeColors } = useAppTheme([isFocused]);

  const regularSettingsSections = [
    { label: 'Account Settings', icon: 'user', screen: 'AccountSettings' },
    {
      label: 'Notification Settings',
      icon: 'bell',
      screen: 'NotificationSettings'
    }
  ];

  const columbiaSettingsSections = [
    {
      label: 'Notification Settings',
      icon: 'bell',
      screen: 'NotificationSettings'
    }
  ];

  const mainSettingsSections = emailIsColumbia(currentUser.email)
    ? columbiaSettingsSections
    : regularSettingsSections;

  const navigateTo = screen => () => {
    navigation.navigate(screen);
  };

  return (
    <SettingsContainer style={{ backgroundColor: themeColors.body }}>
      {mainSettingsSections.map(item => (
        <SettingsItem
          key={item.label}
          onPress={navigateTo(item.screen)}
          style={{
            backgroundColor: themeColors.body,
            borderColor: themeColors.shadowBorder
          }}
        >
          <FeatherIcon
            name={item.icon}
            size={18}
            color={themeColors.textPrimary}
          />
          <SettingsItemTitle style={{ color: themeColors.textPrimary }}>
            {item.label}
          </SettingsItemTitle>
          <FeatherIcon
            name="chevron-right"
            size={14}
            color="#707689"
            style={{ marginLeft: 'auto' }}
          />
        </SettingsItem>
      ))}
      <StatusBar
        barStyle={appTheme.dark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        animated
      />
    </SettingsContainer>
  );
};

export default Settings;
