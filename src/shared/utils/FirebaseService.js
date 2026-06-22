import { Linking } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import crashlytics from '@react-native-firebase/crashlytics';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import messaging from '@react-native-firebase/messaging';

import UserService from '../../Profile/UserService';
import { IS_ANDROID } from '../constants';

export default class FirebaseService {
  static initialSetup() {
    FirebaseService.createDefaultChannels();

    PushNotification.getApplicationIconBadgeNumber(number => {
      if (number > 0) {
        PushNotification.setApplicationIconBadgeNumber(0);
      }
    });
  }

  static async checkPermissions() {
    try {
      const authorizationStatus = await messaging().hasPermission();

      if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
        console.warn('auth is good');
      } else {
        console.warn('auth is no good');
        await messaging().requestPermission({
          // provisional: true,
          alert: true,
          badge: true,
          sound: true
        });
      }
    } catch (err) {
      console.error('some error getting permissions: ', err);
      return false;
    }
    return true;
  }

  static async getToken() {
    let fcmToken = '';
    try {
      fcmToken = await messaging().getToken();
    } catch (err) {
      console.error('some error getting token: ', err);
      return null;
    }
    return fcmToken;
  }

  static updateBadgeCount(newCount) {
    PushNotification.getApplicationIconBadgeNumber(number => {
      console.warn('current badge count before update: ', number);
      PushNotification.setApplicationIconBadgeNumber(newCount);
    });
  }

  static async displayNotification(notification) {
    try {
      console.warn('notif:', notification);

      const { isChatMessage, messageData } = notification.data;
      const parsedData = JSON.parse(messageData);
      console.warn('parsed: ', parsedData);
      if (isChatMessage === 'true') {
        const {
          // messageSid,
          channelSid,
          channelInstance,
          messageBody,
          messageAttributes,
          // messageIndex,
          // clientIdentity,
          dateCreated,
          messageAuthorAttributes
        } = parsedData;
        const {
          friendlyName
          // uniqueName,
          // membersCount,
          // messagesCount
        } = channelInstance;
        const {
          // id,
          firstName,
          lastName,
          // email,
          avatar
        } = messageAuthorAttributes;
        let imageToAttach = avatar;

        const parsedMessageAttributes = JSON.parse(messageAttributes);
        console.warn('parsed attributes: ', parsedData);
        const { media } = parsedMessageAttributes;
        if (media) {
          const { filename, links } = media;
          console.warn('message has media!: ', filename, media);
          imageToAttach = links.content || links.preview;
        }

        const formattedTitle = friendlyName
          ? `${friendlyName}`
          : `${firstName} ${lastName}`;

        PushNotification.localNotification({
          title: formattedTitle,
          message: messageBody,
          userInfo: { threadIdentifier: channelSid },
          // Android only
          channelId: 'ambi-received-chat-message',
          group: channelSid,
          smallIcon: 'ic_stat_ic_notification',
          largeIconUrl: imageToAttach,
          bigText: messageBody,
          subText: 'New message',
          // bigPictureUrl: avatar,
          ignoreInForeground: true,
          when: dateCreated,
          // invokeApp: false,
          actions: ['ReplyInput', 'View'],
          reply_placeholder_text: 'Write your response...',
          reply_button_text: 'Reply',
          // iOS
          category: 'CHAT_MESSAGE'
        });

        PushNotification.getApplicationIconBadgeNumber(number => {
          PushNotification.setApplicationIconBadgeNumber(number + 1);
        });
      }
    } catch (err) {
      console.error(err);
      crashlytics().log(
        'There was an error trying to parse the push notification!'
      );
      crashlytics().setAttribute('notification', notification);
      crashlytics().recordError(err);
    }
  }

  static createDefaultChannels() {
    if (IS_ANDROID) {
      PushNotification.createChannel(
        {
          channelId: 'ambi-received-chat-message',
          channelName: 'Chat Messages',
          channelDescription: 'Incoming messages from your active Ambi chats',
          importance: 4
        },
        created => console.warn(`createChannel returned '${created}'`)
      );
      PushNotification.createChannel(
        {
          channelId: 'ambi-post-announcement',
          channelName: 'Post Announcements',
          channelDescription:
            'Notifications about post announcements that you need to take action on',
          importance: 4
        },
        created => console.warn(`createChannel returned '${created}'`)
      );
    } else {
      PushNotificationIOS.setNotificationCategories([
        {
          id: 'CHAT_MESSAGE',
          actions: [
            { id: 'view', title: 'View', options: { foreground: true } },
            {
              id: 'reply',
              title: 'Reply',
              options: { foreground: true },
              textInput: {
                buttonTitle: 'Reply',
                placeholder: 'Type a response...'
              }
            }
          ]
        },
        {
          id: 'POST_ANNOUNCEMENT',
          actions: [
            { id: 'view', title: 'View', options: { foreground: true } },
            {
              id: 'acknowledge',
              title: 'Acknowledge',
              options: { foreground: true }
            }
          ]
        }
      ]);
    }
  }

  static async updateUserDevice(pushToken, currentUserId) {
    if (!pushToken) {
      return null;
    }

    let updatedDevice;
    try {
      const deviceName = await DeviceInfo.getDeviceName();

      const device = {
        uniqueIdentifier: DeviceInfo.getUniqueId(),
        deviceOS: DeviceInfo.getSystemName(),
        deviceId: DeviceInfo.getDeviceId(),
        deviceName,
        deviceKind: DeviceInfo.getBrand(),
        osVersion: DeviceInfo.getSystemVersion(),
        pushToken
      };

      const existingDevice = await UserService.getUserDevice(
        currentUserId,
        device.uniqueIdentifier
      );

      if (!existingDevice) {
        const otherUserDevice = await UserService.getAnyDevice(
          device.uniqueIdentifier
        );
        if (otherUserDevice) {
          const {
            user: { id: otherUserId }
          } = otherUserDevice;
          await UserService.deleteUserDevice(
            otherUserId,
            device.uniqueIdentifier
          );
        }

        updatedDevice = await UserService.addNewUserDevice(
          currentUserId,
          device
        );
      } else {
        updatedDevice = await UserService.updateUserDevice(
          currentUserId,
          device
        );
      }
    } catch (err) {
      crashlytics().log('There was an error trying to update the user device!');
      crashlytics().setAttribute('token', pushToken);
      crashlytics().recordError(err);
    }
    return updatedDevice;
  }

  async removeUserDevice(currentUserId) {
    try {
      const uniqueDeviceId = DeviceInfo.getUniqueId();
      await UserService.deleteUserDevice(currentUserId, uniqueDeviceId);
    } catch (err) {
      crashlytics().log('There was an error trying to delete the user device!');
      crashlytics().recordError(err);
    }
  }

  static async handleOpenedNotification(notification) {
    try {
      console.warn('action exists? : ', notification);
      if (notification.action === 'view' || notification.action === 'reply') {
        console.warn('action ios EXISTS: ', notification.action);
        const { data, threadId, category } = notification;
        const { aps } = data;
        const uniqueId = threadId || aps.threadId;
        if (uniqueId) {
          console.warn('unique id: ', uniqueId);
          if (category && category === 'CHAT_MESSAGE') {
            console.warn('category is chat message');
            if (notification.action === 'view') {
              await Linking.openURL(`ambi://chat/${uniqueId}`);
            } else {
              console.warn('reply action');
            }
          }
        }
      } else {
        const { data, threadId, category } = notification;
        const { message } = data;
        const uniqueId = threadId || message.threadId;
        if (uniqueId) {
          console.warn('unique id: ', uniqueId);
          if (category && category === 'CHAT_MESSAGE') {
            console.warn('category is chat message');
            await Linking.openURL(`ambi://chat/${uniqueId}`);
          }
        }
      }
    } catch (err) {
      crashlytics().log(
        'There was an error trying to navigate to the url for this notification!'
      );
      crashlytics().setAttribute('notification', JSON.stringify(notification));
      crashlytics().recordError(err);
    }
  }

  static async handleNotificationAction(notification) {
    try {
      console.warn('action: ', notification.action);
      if (notification.action === 'ReplyInput') {
        console.warn('reply action: ', notification.reply_text);
        // do something to send reply in BG
      } else if (notification.action === 'View') {
        console.warn('view action: ', notification.reply_text);
        PushNotification.invokeApp(notification);
      }
    } catch (err) {
      crashlytics().log(
        'There was an error trying to parse the action for this notification!'
      );
      crashlytics().setAttribute('notification', JSON.stringify(notification));
      crashlytics().recordError(err);
    }
  }
}
