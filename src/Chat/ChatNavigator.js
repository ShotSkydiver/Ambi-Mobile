/* eslint-disable react/display-name */
import React from 'react';
import { BorderlessButton } from 'react-native-gesture-handler';
import i18n from 'format-message';
import { useTheme } from '@react-navigation/native';

import Chat from './index';
import SingleChat from './ChatDetail';

import ChatChannelMembers from './ChatChannelMembers';
import ChatMessageStatus from './ChatMessageStatus';

import { NativeStack } from '../Navigation/Navigators';
import { HEADER_BUTTON_SIZE } from '../shared/constants';
import StartChatIcon from '../shared/images/start_chat.svg';

function ChatStackNavigator() {
  const theme = useTheme();
  const { legacy: themeColors } = theme;
  return (
    <NativeStack.Navigator
      screenOptions={{
        headerTintColor: themeColors.textPrimary,
        headerStyle: { backgroundColor: themeColors.backgroundColor }
      }}
    >
      <NativeStack.Screen
        name="Chat"
        component={Chat}
        options={({ navigation }) => ({
          headerTitle: i18n('Chats'),
          headerTintColor: themeColors.textPrimary,
          headerHideShadow: true,
          headerRight: () => {
            const navigateToNewChat = () => {
              navigation.navigate('NativeModalNavigator', {
                screen: 'InviteUsersScreen',
                params: {
                  type: 'chat'
                }
              });
            };
            return (
              <BorderlessButton onPress={navigateToNewChat}>
                <StartChatIcon
                  width={HEADER_BUTTON_SIZE}
                  height={HEADER_BUTTON_SIZE}
                  fill={themeColors.textPrimary}
                  onPress={navigateToNewChat}
                />
              </BorderlessButton>
            );
          }
        })}
      />
      <NativeStack.Screen
        name="SingleChat"
        component={SingleChat}
        options={{
          headerStyle: {
            backgroundColor: themeColors.backgroundColor
          },
          animationEnabled: false,
          headerHideShadow: false,
          backgroundColor: themeColors.backgroundColor,
          headerTintColor: themeColors.textPrimary,
          headerTitle: 'Chat'
        }}
      />
      <NativeStack.Screen
        name="ChatChannelMembers"
        component={ChatChannelMembers}
        options={{
          headerTitle: i18n('Channel Members'),
          headerTintColor: themeColors.textPrimary,
          headerHideShadow: false
        }}
      />
      <NativeStack.Screen
        name="ChatMessageStatus"
        component={ChatMessageStatus}
        options={{
          headerTitle: 'Delivered Message',
          headerHideShadow: false
        }}
      />
    </NativeStack.Navigator>
  );
}

export default ChatStackNavigator;
