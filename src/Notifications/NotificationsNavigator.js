/* eslint-disable react/display-name */
import React from 'react';
import { useTheme } from '@react-navigation/native';

import Notifications from './index';
import { NativeStack } from '../Navigation/Navigators';

function NotificationsStackNavigator() {
  const theme = useTheme();
  const { legacy: themeColors } = theme;
  return (
    <NativeStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: themeColors.backgroundColor },
        headerTintColor: themeColors.textPrimary,
        headerHideShadow: false
      }}
    >
      <NativeStack.Screen
        name="Notifications"
        component={Notifications}
        options={{
          headerTitle: 'Notifications',
          headerHideShadow: false
        }}
      />
    </NativeStack.Navigator>
  );
}

export default NotificationsStackNavigator;
