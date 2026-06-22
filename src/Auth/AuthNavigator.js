/* eslint-disable react/display-name */
import React from 'react';
import { useTheme } from '@react-navigation/native';

import Onboarding from './Onboarding';
import CreateAccount from './CreateAccount';
import VerificationCodeScreen from './VerificationCodeScreen';
import SSOFailScreen from './SSOFailScreen';
import SignInWithPassword from './SignInWithPassword';
import RecoverPassword from './RecoverPassword';

import { NativeStack } from '../Navigation/Navigators';

function SignUpStackNavigator() {
  const theme = useTheme();
  const { legacy: themeColors } = theme;
  return (
    <NativeStack.Navigator
      screenOptions={() => ({
        headerTitle: null,
        headerBackTitleVisible: true,
        headerTranslucent: true,
        headerHideShadow: true,
        headerTintColor: themeColors.textPrimary
      })}
    >
      <NativeStack.Screen
        name="CreateAccount"
        component={CreateAccount}
        options={() => ({ headerTitle: 'Create an Account' })}
      />
      <NativeStack.Screen
        name="VerificationCodeScreen"
        component={VerificationCodeScreen}
      />
      <NativeStack.Screen name="SSOFailScreen" component={SSOFailScreen} />
    </NativeStack.Navigator>
  );
}

function LoginStackNavigator() {
  const theme = useTheme();
  const { legacy: themeColors } = theme;
  return (
    <NativeStack.Navigator
      initialRouteName="SignInWithPassword"
      screenOptions={() => ({
        headerTitle: null,
        headerTranslucent: true,
        headerHideShadow: true,
        headerTintColor: themeColors.textPrimary,
        stackPresentation: 'push',
        stackAnimation: 'slide_from_right'
      })}
    >
      <NativeStack.Screen
        name="SignInWithPassword"
        component={SignInWithPassword}
        options={() => ({
          headerShown: false
        })}
      />
      <NativeStack.Screen name="RecoverPassword" component={RecoverPassword} />
      <NativeStack.Screen
        name="VerificationCodeScreen"
        component={VerificationCodeScreen}
      />
      <NativeStack.Screen name="SSOFailScreen" component={SSOFailScreen} />
    </NativeStack.Navigator>
  );
}

function AuthStackNavigator() {
  return (
    <NativeStack.Navigator
      initialRouteName="LoginStackNavigator"
      screenOptions={{
        stackPresentation: 'push',
        stackAnimation: 'slide_from_right'
      }}
    >
      <NativeStack.Screen name="Onboarding" component={Onboarding} />
      <NativeStack.Screen
        name="LoginStackNavigator"
        component={LoginStackNavigator}
        options={() => ({
          headerShown: false
        })}
      />

      <NativeStack.Screen
        name="SignUpStackNavigator"
        component={SignUpStackNavigator}
        options={() => ({
          headerShown: false
        })}
      />
    </NativeStack.Navigator>
  );
}

export default AuthStackNavigator;
