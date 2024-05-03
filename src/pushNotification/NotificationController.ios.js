import PushNotificationIOS from '@react-native-community/push-notification-ios';
import React, {Component} from 'react';
// import PushNotification from 'react-native-push-notification';

import messaging from '@react-native-firebase/messaging';
import {View} from 'react-native';
import {AsyncKeysEnum} from '../helpers/enum';
import {AsyncStoreViaKey} from '../helpers/LocalStorage/AsyncStorage';

class NotificationController extends Component {
  constructor(props) {
    super(props);
  }

  async requestUserPermission() {
    //const aa = await messaging().registerDeviceForRemoteMessages();
    const token = await messaging().getToken();

    AsyncStoreViaKey(AsyncKeysEnum.DEVICE_TOKEN, {
      deviceToken: token,
    });

    messaging()
      .subscribeToTopic('AllUsers')
      .then(() => console.log('Subscribed to topic!'));

    const authorizationStatus = await messaging().requestPermission({
      sound: false,
      announcement: true,
    });

    if (authorizationStatus) {
      console.log('Permission status:', authorizationStatus);
    }
  }

  componentDidMount() {
    this.requestUserPermission();

    messaging().onMessage(async remoteMessage => {
      //console.log('Fahad => ', remoteMessage);

      if (
        !!remoteMessage &&
        !!remoteMessage.notification &&
        !!remoteMessage.notification.title
      ) {
        const id = new Date().toISOString();
        PushNotificationIOS.addNotificationRequest({
          id: id,
          title: remoteMessage.notification.title,
          subtitle: !!remoteMessage.notification.body
            ? remoteMessage.notification.body
            : '',
        });
      }
    });

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
        }
      });
  }

  componentWillUnmount() {}

  render() {
    return <View />;
  }
}

export default NotificationController;
