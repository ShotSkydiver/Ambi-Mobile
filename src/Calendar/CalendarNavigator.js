/* eslint-disable react/display-name */
import React from 'react';

import Calendar from './index';
import SingleEventScreen from './SingleEventScreen';

import { Stack } from '../Navigation/Navigators';

const CalendarNavigator = () => (
  <Stack.Navigator initialRouteName="Calendar">
    <Stack.Screen name="Calendar" component={Calendar} />
    <Stack.Screen
      name="SingleEventScreen"
      component={SingleEventScreen}
      options={{
        headerShown: false
      }}
    />
  </Stack.Navigator>
);

export default CalendarNavigator;
