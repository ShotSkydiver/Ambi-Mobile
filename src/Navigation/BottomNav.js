/* eslint-disable react/display-name */
import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { useTheme } from '@react-navigation/native';

import HomeNavigator from '../Home';
import ChatStackNavigator from '../Chat/ChatNavigator';
import NotificationsStackNavigator from '../Notifications/NotificationsNavigator';
import MoreStackNavigator from '../More/MoreNavigator';
import SpacesStackNavigator from '../Spaces/SpacesNavigator';

import useBadgeCounts from '../shared/hooks/useBadgeCounts';
import SpacesIcon from '../shared/images/groups.svg';

export const BottomTab = createMaterialBottomTabNavigator();

function tabBarIcon(name) {
  return ({ color }) => {
    return name === 'spaces' ? (
      <SpacesIcon width={24} height={24} fill={color} />
    ) : (
      <FeatherIcon name={name} size={24} color={color} />
    );
  };
}

function BottomNav() {
  const theme = useTheme();
  const { legacy: themeColors } = theme;
  const { chatUnreadCount, notifUnreadCount } = useBadgeCounts();
  return (
    <BottomTab.Navigator
      backBehavior="order"
      labeled={false}
      activeColor={themeColors.textPrimary}
      inactiveColor={themeColors.systemBorderColor}
      barStyle={{
        backgroundColor: themeColors.backgroundColor
        // borderTopWidth: 1,
        // borderTopColor: themeColors.searchBG
      }}
    >
      <BottomTab.Screen
        name="Home"
        component={HomeNavigator}
        options={{
          tabBarIcon: tabBarIcon('home')
        }}
      />
      <BottomTab.Screen
        name="Spaces"
        component={SpacesStackNavigator}
        options={{
          tabBarIcon: tabBarIcon('spaces')
        }}
      />
      <BottomTab.Screen
        name="Chat"
        component={ChatStackNavigator}
        options={{
          tabBarIcon: tabBarIcon('message-square'),
          tabBarBadge: chatUnreadCount <= 0 ? false : chatUnreadCount
        }}
      />
      <BottomTab.Screen
        name="Notifications"
        component={NotificationsStackNavigator}
        options={{
          tabBarIcon: tabBarIcon('bell'),
          tabBarBadge: notifUnreadCount <= 0 ? false : notifUnreadCount
        }}
      />
      <BottomTab.Screen
        name="More"
        component={MoreStackNavigator}
        options={{
          tabBarIcon: tabBarIcon('menu')
        }}
      />
    </BottomTab.Navigator>
  );
}

export default BottomNav;
