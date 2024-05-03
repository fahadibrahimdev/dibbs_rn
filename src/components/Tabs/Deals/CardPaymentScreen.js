import React, { PureComponent } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
// import stripe from 'tipsi-stripe';
// import Button from '../../../Tipsi-Stripe/components/Button';

export default class CardPaymentScreen extends PureComponent {
  static title = 'Card Form';

  state = {
    loading: false,
    paymentMethod: null,
  };

  handleCardPayPress = async () => {
    try {
      this.setState({ loading: true, paymentMethod: null });

      // const paymentMethod = await stripe.paymentRequestWithCardForm({
      //   theme: {
      //     primaryBackgroundColor: 'white',
      //     secondaryBackgroundColor: 'white',
      //     primaryForegroundColor: 'black',
      //     secondaryForegroundColor: 'black',
      //     accentColor: 'blue',
      //     errorColor: 'red',
      //   },
      //   // Only iOS support this options
      //   smsAutofillDisabled: true,
      //   requiredBillingAddressFields: 'full',
      //   prefilledInformation: {
      //     billingAddress: {
      //       name: 'Gunilla Haugeh',
      //       line1: 'Canary Place',
      //       line2: '3',
      //       city: 'Macon',
      //       state: 'Georgia',
      //       country: 'US',
      //       postalCode: '31217',
      //       email: 'ghaugeh0@printfriendly.com',
      //     },
      //   },
      // });

      // console.log('Payment Info => ', paymentMethod);
      // this.setState({ loading: false, paymentMethod });
    } catch (error) {
      this.setState({ loading: false });
    }
  };

  render() {
    const { loading, paymentMethod } = this.state;

    return (
      <View style={styles.container}>
        <SafeAreaView style={{ flex: 1 }}>
          <Text style={styles.header}>Card Form Example</Text>
          <Text style={styles.instruction}>
            Click button to show Card Form dialog.
          </Text>
          {/* <Button
            text="Enter you card and pay"
            loading={loading}
            onPress={this.handleCardPayPress}
          /> */}
          <View style={styles.paymentMethod}>
            {paymentMethod && (
              <Text style={styles.instruction}>
                Payment Method: {paymentMethod.id}
              </Text>
            )}
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instruction: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  paymentMethod: {
    // height: 20,
  },
});
