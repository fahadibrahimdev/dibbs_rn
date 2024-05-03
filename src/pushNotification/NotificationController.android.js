import messaging from '@react-native-firebase/messaging';
import React, {Component} from 'react';
import {View} from 'react-native';
import PushNotification, {Importance} from 'react-native-push-notification';
import {AsyncKeysEnum} from '../helpers/enum';
import {AsyncStoreViaKey} from '../helpers/LocalStorage/AsyncStorage';

class NotificationController extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      hasPermission: false,
    };
  }

  componentDidMount() {
    this.registerHandlers();
  }
  componentWillUnmount() {}

  registerHandlers() {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Fahad => ', remoteMessage);

      PushNotification.localNotification({
        title: remoteMessage.notification.title,
        message: remoteMessage.notification.body,
        allowWhileIdle: false,
        channelId: 'channel-DIBBS',
      });
    });

    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        console.log('TOKEN:', token);

        AsyncStoreViaKey(AsyncKeysEnum.DEVICE_TOKEN, {
          deviceToken: token.token,
        });
      },

      // (required) Called when a remote is received or opened, or local notification is opened
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);

        // if (notification.foreground) {
        //   alert('Foreground clicked!');
        // } else if (notification.userInteraction) {
        //   alert('Background click');
        // } else {
        //   alert('Background receive');
        // }
      },

      // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
      onAction: function (notification) {
        console.log('ACTION:', notification.action);
        console.log('NOTIFICATION:', notification);

        // process the action
      },

      // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
      onRegistrationError: function (err) {
        console.error(err.message, err);
      },

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       * - if you are not using remote notification or do not have Firebase installed, use this:
       *     requestPermissions: Platform.OS === 'ios'
       */
      requestPermissions: true,
    });

    PushNotification.createChannel(
      {
        channelId: 'channel-DIBBS', // (required)
        channelName: 'DIBBS', // (required)
        channelDescription: 'A channel to categorise notifications', // (optional) default: undefined.
        playSound: true, // (optional) default: true
        // soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
        importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
      },
      created => {
        console.log(`createChannel returned '${created}'`); // (optional) callback returns whether the channel was created, false means it already existed.
      },
    );

    PushNotification.subscribeToTopic('AllUsers');
  }
  render() {
    return <View></View>;
  }
}

export default NotificationController;
