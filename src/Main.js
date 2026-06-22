import React, { useState, useRef, useEffect } from 'react';
import { View, useColorScheme } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
import messaging from '@react-native-firebase/messaging';
import Heap from '@heap/react-native-heap';

import useTwilioChatClient from './Chat/Twilio/useTwilioChatClient';
import { CHAT_TYPES } from './Chat/chatsReducer';
import { getNotifications } from './Notifications/redux/actions';

import { FullScreenLoader } from './shared/Loader';
import Auth from './Auth/index';
import { getActiveRouteName } from './shared/utils/helpers';
import ThemeContext, {
  ThemeConstants,
  AmbiDarkTheme,
  AmbiLightTheme
} from './shared/contexts/themeContext';
import { User } from './models/User';
import BadgeCountsContext from './shared/contexts/badgeCountsContext';
import FirebaseService from './shared/utils/FirebaseService';

const HeapNavigationContainer =
  Heap.withReactNavigationAutotrack(NavigationContainer);

const Main = () => {
  const navigator = useRef(null);
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const chatUnreadCount = useSelector(
    state => state.chats.bottomNavUnreadCount
  );
  const chatMessagesUnreadCount = useSelector(
    state => state.chats.appIconBadgeCount
  );
  const notifUnreadCount = useSelector(
    state => state.notifications.bottomNavUnreadCount
  );
  const { id: currentUserId } = auth.user || {};
  const [currentRoute, setRoute] = useState('');

  const [fcmToken, setFcmToken] = useState(null);

  const { Client, getUserChannels, initializeClient } = useTwilioChatClient();

  useEffect(() => {
    if (currentUserId) {
      getNotifications()(dispatch);

      const currentUser = new User(auth.user);
      const userName = currentUser.getName();
      const userIsRegistered = currentUser.isRegistered();
      if (userIsRegistered) {
        analytics().setUserProperty('first_name', userName);
        analytics().setUserId(`${currentUserId}`);
        crashlytics().setUserId(`${currentUserId}`);
      }
    }
  }, [currentUserId]);

  useEffect(() => {
    console.warn('unread count updated: ', chatMessagesUnreadCount);
    FirebaseService.updateBadgeCount(chatMessagesUnreadCount);
  }, [chatMessagesUnreadCount]);

  useEffect(() => {
    FirebaseService.initialSetup();
    FirebaseService.checkPermissions().then(validPermissions => {
      if (validPermissions) {
        FirebaseService.getToken().then(fcmToken => {
          setFcmToken(fcmToken);
          if (currentUserId) {
            FirebaseService.updateUserDevice(fcmToken, currentUserId);
          }
        });
      }
    });

    if (fcmToken && Client == null && currentUserId) {
      initializeClient();
    }
  }, [Client, fcmToken, currentUserId]);

  useEffect(() => {
    return messaging().onTokenRefresh(token => {
      setFcmToken(token);
      if (currentUserId) {
        FirebaseService.updateUserDevice(token, currentUserId);
      }
    });
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const parsedMessage = JSON.parse(remoteMessage);
      console.warn('fcm onMessage:', parsedMessage);
      FirebaseService.displayNotification(remoteMessage);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.warn(
        'Notification caused app to open from background state:',
        remoteMessage.notification
      );
      FirebaseService.handleOpenedNotification(remoteMessage);
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.warn(
            'Notification caused app to open from quit state:',
            remoteMessage.notification
          );
          FirebaseService.handleOpenedNotification(remoteMessage);
        }
      });
  }, []);

  useEffect(() => {
    if (Client) {
      dispatch({ type: CHAT_TYPES.LOADING_CHANNELS });
      getUserChannels()
        .then(({ channels }) => {
          dispatch({
            type: CHAT_TYPES.LOADED_CHANNELS,
            channels
          });
        })
        .catch(err => {
          console.warn(err);
          dispatch({ type: CHAT_TYPES.ERROR });
        });
    }
  }, [Client]);

  const theme = useColorScheme();
  const themeColors = ThemeConstants[theme];

  useEffect(() => {
    const navState = navigator && navigator.current && navigator.current.state;
    if (navState) {
      setRoute(getActiveRouteName(navState));
    }
  }, []);

  const linking = {
    prefixes: ['ambi://'],
    config: {
      screens: {
        BottomNavigator: {
          initialRouteName: 'Home',
          screens: {
            Chat: {
              initialRouteName: 'Chat',
              screens: {
                SingleChat: 'chat/:channelSid'
              }
            }
          }
        }
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ theme }}>
      <BadgeCountsContext.Provider
        value={{ chatUnreadCount, notifUnreadCount }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: themeColors.body
          }}
        >
          <HeapNavigationContainer
            ref={navigator}
            theme={theme === 'dark' ? AmbiDarkTheme : AmbiLightTheme}
            onStateChange={async state => {
              const previousRouteName = currentRoute;
              const currentRouteName = getActiveRouteName(state);
              if (previousRouteName !== currentRouteName) {
                await analytics().logScreenView({
                  screen_name: currentRouteName,
                  screen_class: currentRouteName
                });
              }
              setRoute(getActiveRouteName(state));
            }}
            linking={linking}
            fallback={<FullScreenLoader text="loading" />}
          >
            <Auth />
          </HeapNavigationContainer>
        </View>
      </BadgeCountsContext.Provider>
    </ThemeContext.Provider>
  );
};

export default Main;
