/* eslint-disable react/display-name */
import React from 'react';
import i18n from 'format-message';
import { useTheme } from '@react-navigation/native';

import SettingsStackNavigator from '../Settings/SettingsNavigator';
import More from './index';
import CalendarNavigator from '../Calendar/CalendarNavigator';
import Notebooks from '../Notebooks';
import SingleNotebookScreen from '../Notebooks/SingleNotebookScreen';
import Support from '../Support';

import { Stack, SlideTransition } from '../Navigation/Navigators';

function MoreStackNavigator() {
  const theme = useTheme();
  const { legacy: themeColors } = theme;
  return (
    <Stack.Navigator
      initialRouteName="More"
      screenOptions={{ cardStyleInterpolator: SlideTransition }}
    >
      <Stack.Screen
        name="More"
        component={More}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="Calendar"
        component={CalendarNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Notebooks" component={Notebooks} />
      <Stack.Screen
        name="SingleNotebookScreen"
        component={SingleNotebookScreen}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsStackNavigator}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="Support"
        component={Support}
        options={{
          headerTitle: i18n('Submit Ticket'),
          headerTintColor: themeColors.textPrimary,
          headerStyle: { backgroundColor: themeColors.backgroundColor },
          headerHideShadow: false
        }}
      />
    </Stack.Navigator>
  );
}

export default MoreStackNavigator;
