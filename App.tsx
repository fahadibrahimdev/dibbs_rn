/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import { NavigationContainer } from '@react-navigation/native';
import React, { Component } from 'react';
import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';
// import stripe from 'tipsi-stripe';
import RootNavigator from './src/navigation/RootNavigator';
import NotificationController from './src/pushNotification/NotificationController';
import configureStore from './src/redux/store/configureStore';

import analytics from '@react-native-firebase/analytics';

analytics().setAnalyticsCollectionEnabled(true);


const store = configureStore();

// //Test Key
// stripe.setOptions({
//   publishableKey:
//     'pk_test_51JxmMrAvn2NTb1dZMMmZzSmm5UksBx4pIeHrQFUOPSnhWMb113pTvQpC0sMdhEk2cWjdWTO1RE3LabnJ6Y0LpoWy00n4BtkBEj',
// });

// // //Live Key
// // stripe.setOptions({
// //   publishableKey:
// //     'pk_live_51JxmMrAvn2NTb1dZoFd26SVnrfH5NUrK0Y3x3Q705IB9m51IvXDxoBjV1PXNAauxnl6fD3FniU38YElNEIHZPRKE00nTuScPB2',
// // });

export default class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <Provider store={store}>
          <RootNavigator />

          <StatusBar backgroundColor="#324192" barStyle="dark-content" />

          <NotificationController />
        </Provider>
      </NavigationContainer>
    );
  }
}
