import { NavigationContainer } from '@react-navigation/native';
import React, { Component } from 'react';
import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';
// import stripe from 'tipsi-stripe';
import RootNavigator from './src/navigation/RootNavigator';
import NotificationController from './src/pushNotification/NotificationController';
import configureStore from './src/redux/store/configureStore';

import analytics from '@react-native-firebase/analytics';
import { StripeProvider } from '@stripe/stripe-react-native';
import { Stripe_LIVE, Stripe_TEST } from './src/helpers/enum';


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
        <StripeProvider
          publishableKey={Stripe_LIVE.KEY}
        // urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
        // merchantIdentifier="merchant.com.{{YOUR_APP_NAME}}" // required for Apple Pay
        >
          <Provider store={store}>
            <RootNavigator />

            <StatusBar backgroundColor="#324192" barStyle="dark-content" />

            <NotificationController />
          </Provider>
        </StripeProvider>
      </NavigationContainer>
    );
  }
}
