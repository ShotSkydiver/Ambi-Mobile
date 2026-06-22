// import PushNotification from 'react-native-push-notification';

// class NotificationHandler {
//   onNotification(notification) {
//     console.warn('NotificationHandler onnotif:', notification);

//     if (typeof this._onNotification === 'function') {
//       this._onNotification(notification);
//     }
//   }

//   onAction(notification) {
//     console.warn('Notification action received: ', notification);

//     if (notification.action === 'Yes') {
//       PushNotification.invokeApp(notification);
//     }
//   }

//   attachNotification(handler) {
//     this._onNotification = handler;
//   }
// }

// const handler = new NotificationHandler();

// PushNotification.configure({
//   // (required) Called when a remote or local notification is opened or received
//   onNotification: handler.onNotification.bind(handler),

//   // (optional) Called when Action is pressed (Android)
//   onAction: handler.onAction.bind(handler),

//   requestPermissions: false
// });

// export default handler;
