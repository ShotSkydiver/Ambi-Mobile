/* eslint-disable react/display-name */
import React from 'react';
import i18n from 'format-message';
import { useTheme } from '@react-navigation/native';
import { HeaderStyleInterpolators } from '@react-navigation/stack';

import { Stack, NativeStack } from './Navigators';

import BottomNavigator from './BottomNav';
import CreatePostScreen from '../Feed/PostCreator/CreatePostScreen';
import EditPostScreen from '../Feed/PostEdit/EditPostScreen';
import ReportPostScreen from '../Feed/ReportPostScreen';
import ModalRepliesScreen from '../Feed/SinglePost/ModalReplies';
import VideoViewer from '../Feed/SinglePost/VideoViewer';
import { SpaceStackNavigator } from '../Spaces/SpacesNavigator';
import CreateGroupScreen from '../Spaces/CreateGroupScreen';
import Profile from '../Profile/index';
import InviteUsersScreen from '../shared/InviteUsersScreen';
import ImagePreviewScreen from '../shared/ImageViewer';
import { AmbiColors, ThemeConstants } from '../shared/contexts/themeContext';
import { IconHeaderButtons, Item } from '../shared/HeaderButtons';
import ModalSinglePostScreen from '../Feed/SinglePost/ModalSinglePost';
import SinglePostPollDetail from '../Feed/SinglePost/SinglePostPollDetail';
import ReactionsListModal from '../components/ReactionsListModal';
import { upperFirstLetter } from '../shared/utils/helpers';

export const ModalStackNavigator = () => {
  const theme = useTheme();
  const { legacy: themeColors } = theme;
  return (
    <Stack.Navigator
      screenOptions={{
        headerTranslucent: true,
        headerStyle: {
          backgroundColor: themeColors.backgroundColor
        },
        headerTintColor: themeColors.textPrimary
      }}
    >
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          headerTitle: null,
          headerTransparent: true,
          headerStyleInterpolator: HeaderStyleInterpolators.forFade,
          headerTintColor: themeColors.textPrimary
        }}
      />
    </Stack.Navigator>
  );
};

export const NativeModalStackNavigator = () => {
  const theme = useTheme();
  const { legacy: themeColors } = theme;
  return (
    <NativeStack.Navigator
      screenOptions={{
        headerTranslucent: true,
        headerStyle: {
          backgroundColor: themeColors.backgroundColor
        },
        headerTintColor: themeColors.textPrimary
      }}
    >
      <NativeStack.Screen
        name="CreatePostScreen"
        component={CreatePostScreen}
        options={({ navigation }) => ({
          headerTitle: 'Post to Feed',
          headerBackTitleVisible: false,
          headerTranslucent: false,
          headerHideShadow: false,
          headerStyle: {
            backgroundColor: themeColors.bgColorSemiTransparent,
            blurEffect: 'prominent'
          },
          headerTintColor: themeColors.textPrimary,
          headerLeft: () => {
            return (
              <IconHeaderButtons useLeftHeader={false}>
                <Item
                  title="X"
                  iconName="close"
                  onPress={() => navigation.pop()}
                />
              </IconHeaderButtons>
            );
          }
        })}
      />

      <NativeStack.Screen
        name="SinglePostScreen"
        component={ModalSinglePostScreen}
        options={{
          headerTitle: 'Post',
          headerTranslucent: true,
          headerHideShadow: false,
          headerStyle: {
            backgroundColor: themeColors.bgColorSemiTransparent,
            blurEffect: 'prominent'
          },
          headerTintColor: themeColors.textPrimary
        }}
      />

      <NativeStack.Screen
        name="EditPostScreen"
        component={EditPostScreen}
        options={({ navigation }) => ({
          title: 'Edit Post',
          headerBackTitleVisible: false,
          headerTranslucent: true,
          headerHideShadow: false,
          headerStyle: {
            backgroundColor: themeColors.backgroundColor
          },
          headerTintColor: themeColors.textPrimary,
          headerLeft: () => {
            return (
              <IconHeaderButtons useLeftHeader={false}>
                <Item
                  title="X"
                  iconName="close"
                  onPress={() => navigation.pop()}
                />
              </IconHeaderButtons>
            );
          }
        })}
      />

      <NativeStack.Screen
        name="DetailPollScreen"
        component={SinglePostPollDetail}
        options={() => ({
          title: 'Poll Respondents',
          headerBackTitleVisible: false,
          headerTranslucent: true,
          headerHideShadow: true,
          headerStyle: {
            backgroundColor: themeColors.backgroundColor
          },
          headerTintColor: themeColors.textPrimary
        })}
      />

      <NativeStack.Screen
        name="ReportPostScreen"
        component={ReportPostScreen}
        options={({ route }) => ({
          title: i18n(
            `Report ${upperFirstLetter(route.params?.typeComment || 'Post')}`
          ),
          headerTranslucent: false,
          headerHideShadow: false,
          headerStyle: {
            backgroundColor: themeColors.backgroundColor
          },
          headerTintColor: themeColors.textPrimary
        })}
      />
      <NativeStack.Screen
        name="ModalRepliesScreen"
        component={ModalRepliesScreen}
        options={() => ({
          title: 'Replies',
          headerBackTitleVisible: true,
          headerTranslucent: true,
          headerHideShadow: false,
          headerStyle: {
            backgroundColor: themeColors.backgroundColor
          },
          headerTintColor: themeColors.textPrimary
        })}
      />
      <NativeStack.Screen
        name="VideoViewer"
        component={VideoViewer}
        options={({ navigation }) => ({
          headerTitle: null,
          headerBackTitleVisible: false,
          headerTranslucent: true,
          headerHideShadow: true,
          headerStyle: {
            backgroundColor: ThemeConstants.dark.elementBGColor
          },
          headerTintColor: ThemeConstants.dark.textPrimary,
          headerLeft: () => {
            return (
              <IconHeaderButtons useLeftHeader={false}>
                <Item
                  title="X"
                  iconName="close"
                  color={ThemeConstants.dark.textPrimary}
                  onPress={() => navigation.pop()}
                />
              </IconHeaderButtons>
            );
          }
        })}
      />
      <NativeStack.Screen
        name="CreateGroupScreen"
        component={CreateGroupScreen}
        options={({ navigation }) => ({
          headerTitle: 'New Group',
          headerHideShadow: false,
          headerStyle: {
            backgroundColor: themeColors.bgColorSemiTransparent,
            blurEffect: 'prominent'
          },
          headerTintColor: themeColors.textPrimary,
          headerTranslucent: false,
          headerLeft: () => {
            return (
              <IconHeaderButtons useLeftHeader={false}>
                <Item
                  title="Cancel"
                  color={themeColors.textPrimary}
                  onPress={() => navigation.pop()}
                />
              </IconHeaderButtons>
            );
          }
        })}
      />
      <NativeStack.Screen
        name="InviteUsersScreen"
        component={InviteUsersScreen}
        options={({ route, navigation }) => ({
          headerTitle:
            route.params?.type === 'chat' && route.params?.newCreation
              ? i18n('New Chat')
              : i18n('Add Members'),
          headerHideShadow: true,
          headerStyle: {
            backgroundColor: themeColors.bgColorSemiTransparent,
            blurEffect: 'prominent'
          },
          headerTintColor: themeColors.textPrimary,
          headerTranslucent: false,
          headerLeft: () => {
            return (
              <IconHeaderButtons useLeftHeader={false}>
                <Item
                  title="Back"
                  color={themeColors.textPrimary}
                  onPress={() => navigation.pop()}
                />
              </IconHeaderButtons>
            );
          },
          headerRight: () => {
            const type = route.params?.type;
            const isNewChatOrSpace = route.params?.newCreation;
            const hasInvitedUsers = route.params?.hasInvitedUsers;
            const onConfirm = route.params?.onConfirm || (() => {});
            return (
              <IconHeaderButtons useLeftHeader>
                <Item
                  title={
                    isNewChatOrSpace && type === 'chat'
                      ? i18n('Start Chat')
                      : i18n('Invite')
                  }
                  color={AmbiColors.ambiBlue}
                  onPress={() => {
                    if (hasInvitedUsers) {
                      onConfirm();
                    }
                  }}
                  disabled={!hasInvitedUsers}
                  actionable
                />
              </IconHeaderButtons>
            );
          }
        })}
      />
      <NativeStack.Screen
        name="ImagePreviewScreen"
        component={ImagePreviewScreen}
        options={{ headerShown: false }}
      />
      <NativeStack.Screen
        name="ReactionsListModal"
        component={ReactionsListModal}
        options={({ navigation }) => ({
          headerTitle: 'Reactions',
          headerShown: true,
          headerStyle: {
            backgroundColor: themeColors.elementBGColor,
            blurEffect: 'prominent'
          },
          headerTintColor: themeColors.textPrimary,
          headerTranslucent: false,
          headerLeft: () => {
            return (
              <IconHeaderButtons useLeftHeader={false}>
                <Item
                  title="Back"
                  iconName="chevron-left"
                  color={themeColors.slateGray}
                  style={{
                    marginRight: -9
                  }}
                  onPress={() => navigation.pop()}
                />
                <Item
                  title="Back"
                  color={themeColors.slateGray}
                  onPress={() => navigation.pop()}
                />
              </IconHeaderButtons>
            );
          }
        })}
      />
    </NativeStack.Navigator>
  );
};

export const MainStackNavigator = () => {
  return (
    <NativeStack.Navigator
      screenOptions={{
        // this might be broken after rn-screens 3.2.0 upgrade
        headerShown: false,
        stackPresentation: 'fullScreenModal'
      }}
    >
      <NativeStack.Screen name="BottomNavigator" component={BottomNavigator} />
      <NativeStack.Screen name="Space" component={SpaceStackNavigator} />
      <NativeStack.Screen
        name="ModalNavigator"
        component={ModalStackNavigator}
      />
      <NativeStack.Screen
        name="NativeModalNavigator"
        component={NativeModalStackNavigator}
      />
    </NativeStack.Navigator>
  );
};
