/* eslint-disable react/display-name */
import React from 'react';
import { useTheme } from '@react-navigation/native';
import i18n from 'format-message';

import Settings from './index';
import AccountSettings from './AccountSettings';
import NotificationSettings from './NotificationSettings';
import AddUserEmail from './AccountSettings/AddUserEmail';
import AddLinkedLogins from './AccountSettings/AddLinkedLogins';
import SetPasswordScreen from './AccountSettings/SetPasswordScreen';
import VerificationCodeScreen from '../Auth/VerificationCodeScreen';

import { NativeStack } from '../Navigation/Navigators';
import { AmbiColors } from '../shared/contexts/themeContext';
import { IconHeaderButtons, Item } from '../shared/HeaderButtons';

function SettingsStackNavigator() {
  const theme = useTheme();
  const { legacy: themeColors } = theme;
  return (
    <NativeStack.Navigator
      screenOptions={{
        headerTintColor: themeColors.textPrimary,
        headerStyle: { backgroundColor: themeColors.backgroundColor },
        headerHideShadow: false
      }}
    >
      <NativeStack.Screen
        name="Settings"
        component={Settings}
        options={({ navigation }) => ({
          headerTitle: i18n('Settings'),
          headerBackTitleVisible: true,
          headerLeft: () => {
            return (
              <IconHeaderButtons useLeftHeader={false}>
                <Item
                  title="Back"
                  iconName="arrow-back-ios"
                  color={themeColors.textPrimary}
                  onPress={() => navigation.pop()}
                />
              </IconHeaderButtons>
            );
          }
        })}
      />
      <NativeStack.Screen
        name="AccountSettings"
        component={AccountSettings}
        options={{
          headerTitle: i18n('Account Settings')
        }}
      />
      <NativeStack.Screen
        name="NotificationSettings"
        component={NotificationSettings}
        options={{
          headerTitle: i18n('Notification Settings')
        }}
      />
      <NativeStack.Screen
        name="AddUserEmail"
        component={AddUserEmail}
        options={() => ({
          headerTitle: i18n('Add New Email')
        })}
      />
      <NativeStack.Screen
        name="VerificationCodeScreen"
        component={VerificationCodeScreen}
      />
      <NativeStack.Screen
        name="AddLinkedLogins"
        component={AddLinkedLogins}
        options={({ route }) => ({
          title: 'Add Linked Login',
          headerRight: () => {
            const selectedConnection = route.params?.selectedConnection;
            const handleAddConnection =
              route.params?.handleAddConnection || (() => {});
            return (
              <IconHeaderButtons useLeftHeader>
                <Item
                  title={i18n('Add')}
                  color={AmbiColors.ambiBlue}
                  onPress={handleAddConnection}
                  disabled={!selectedConnection}
                  actionable
                />
              </IconHeaderButtons>
            );
          }
        })}
      />
      <NativeStack.Screen
        name="SetPasswordScreen"
        component={SetPasswordScreen}
        options={({ route }) => ({
          title: 'Set a Password',
          headerRight: () => {
            const isMatched = route.params?.isMatched;
            const submitted = route.params?.submitted;
            const handlePasswordUpdate =
              route.params?.handlePasswordUpdate || (() => {});
            return (
              <IconHeaderButtons useLeftHeader>
                <Item
                  title={i18n('Finish')}
                  color={AmbiColors.ambiBlue}
                  onPress={handlePasswordUpdate}
                  disabled={!isMatched || submitted}
                  actionable
                />
              </IconHeaderButtons>
            );
          }
        })}
      />
    </NativeStack.Navigator>
  );
}

export default SettingsStackNavigator;
