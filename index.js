import React from 'react';
import 'node-libs-react-native/globals';
import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import setupi18n from './i18n/setup';
import FCMService from './src/shared/utils/FCMService';

setupi18n();

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.warn('background message is gettin handled', remoteMessage);
  await FCMService(remoteMessage);
});

function HeadlessCheck({ isHeadless }) {
  if (isHeadless) {
    return null;
  }
  return <App />;
}

AppRegistry.registerComponent('AmbiNext', () => HeadlessCheck);
