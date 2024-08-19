// import React, { PureComponent } from 'react';
// import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
// import { CardField, useStripe } from '@stripe/stripe-react-native';

// // import stripe from 'tipsi-stripe';
// // import Button from '../../../Tipsi-Stripe/components/Button';

// export default class CardPaymentScreen extends PureComponent {
//   static title = 'Card Form';

//   state = {
//     loading: false,
//     paymentMethod: null,
//   };

//   handleCardPayPress = async () => {
//     try {
//       this.setState({ loading: true, paymentMethod: null });

//       // const paymentMethod = await stripe.paymentRequestWithCardForm({
//       //   theme: {
//       //     primaryBackgroundColor: 'white',
//       //     secondaryBackgroundColor: 'white',
//       //     primaryForegroundColor: 'black',
//       //     secondaryForegroundColor: 'black',
//       //     accentColor: 'blue',
//       //     errorColor: 'red',
//       //   },
//       //   // Only iOS support this options
//       //   smsAutofillDisabled: true,
//       //   requiredBillingAddressFields: 'full',
//       //   prefilledInformation: {
//       //     billingAddress: {
//       //       name: 'Gunilla Haugeh',
//       //       line1: 'Canary Place',
//       //       line2: '3',
//       //       city: 'Macon',
//       //       state: 'Georgia',
//       //       country: 'US',
//       //       postalCode: '31217',
//       //       email: 'ghaugeh0@printfriendly.com',
//       //     },
//       //   },
//       // });

//       // console.log('Payment Info => ', paymentMethod);
//       // this.setState({ loading: false, paymentMethod });
//     } catch (error) {
//       this.setState({ loading: false });
//     }
//   };

//   render() {
//     const { loading, paymentMethod } = this.state;

//     return (
//       <View style={styles.container}>
//         <SafeAreaView style={{ flex: 1 }}>
//           <Text style={styles.header}>Card Form Example</Text>
//           <Text style={styles.instruction}>
//             Click button to show Card Form dialog.
//           </Text>
//           {/* <Button
//             text="Enter you card and pay"
//             loading={loading}
//             onPress={this.handleCardPayPress}
//           /> */}
//           <View style={styles.paymentMethod}>
//             {paymentMethod && (
//               <Text style={styles.instruction}>
//                 Payment Method: {paymentMethod.id}
//               </Text>
//             )}
//           </View>
//         </SafeAreaView>
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   header: {
//     fontSize: 20,
//     textAlign: 'center',
//     margin: 10,
//   },
//   instruction: {
//     textAlign: 'center',
//     color: '#333333',
//     marginBottom: 5,
//   },
//   paymentMethod: {
//     // height: 20,
//   },
// });

import {
  CardField,
  createPaymentMethod,
  createToken,
  useStripe,
} from '@stripe/stripe-react-native';
import React, {useEffect, useState} from 'react';
import {Button} from 'native-base';
import {
  ScrollView,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Appearance,
  StyleSheet,
  Alert,
} from 'react-native';
import {height as h, width as w} from 'react-native-dimension';
import {RFValue} from 'react-native-responsive-fontsize';
import HeaderBackCompoenent from '../../../helpers/HeaderBackCompoenent';

// import stripe from 'tipsi-stripe';
import {strings, titles} from '../../../constants/Localization';
import {ScreenNames} from '../../../constants/ScreenNames';
import AlertComponent from '../../../helpers/AlertComponent';
import colors from '../../../helpers/colors';
import {
  AlertTypesEnum,
  CALL_STATE,
  PaymentMethodsEnum,
} from '../../../helpers/enum';
import FullScreenLoader from '../../../helpers/FullScreenLoader';
import {backImage} from '../../../helpers/Images';
import {navigate} from '../../../helpers/Util';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {
  clearCartInfo,
  createOrder,
  doStripePayment,
  doStripePaymentIdle,
} from '../../../redux/actions/cartActions';
import {searchDeals} from '../../../redux/actions/productActions';
import TextInputWithLabel from '../../../helpers/TextInputWithLabel';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CardPaymentScreen = ({route}) => {
  const navigation = useNavigation();

  const dispatch = useDispatch();

  const RedStripePayment = useSelector(
    state => state.cartReducer.stripePayment,
  );

  const RedOrderPlacedSuccessfully = useSelector(
    state => state.cartReducer.orderPlacedSuccessfully,
  );
  const RedOrderPlaceError = useSelector(
    state => state.cartReducer.orderPlaceError,
  );

  const RedOrderConfirmedSuccessfully = useSelector(
    state => state.cartReducer.orderConfirmedSuccessfully,
  );
  const RedOrderConfirmError = useSelector(
    state => state.cartReducer.orderConfirmError,
  );

  const {confirmPayment} = useStripe();
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const [myComponentProps, setMyComponentProps] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [card, setCard] = useState(null);
  const [myStripePaymentMethod, setMyStripePaymentMethod] = useState(null);
  const [alertProps, setAlertProps] = useState({
    alertModalVisible: false,
    alertType: '',
    alertHeading: '',
    alertMsg: '',
    showLeftButton: false,
    leftBtnText: '',
    leftBtnDestructive: false,
    showRightButton: false,
    rightBtnText: '',
    rightBtnDestructive: false,
  });

  const [currentMode, setCurrentMode] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');
  const [postalCode, setPostalCode] = useState('');

  useEffect(() => {
    var mCoupon = !!route.params?.coupon ? route.params.coupon : '';
    var mPaymentMethod = !!route.params?.paymentMethod
      ? route.params.paymentMethod
      : '';
    var mLowDibbsCreditMode = !!route.params?.lowDibbsCreditMode
      ? route.params.lowDibbsCreditMode
      : '';

    var mOrderTotalUpFrontAmount = !!route.params?.orderTotalUpFrontAmount
      ? route.params.orderTotalUpFrontAmount
      : '';

    var mTotalRemaining = !!route.params?.totalRemaining
      ? route.params.totalRemaining
      : '';

    setMyComponentProps({
      coupon: mCoupon,
      paymentMethod: mPaymentMethod,
      lowDibbsCreditMode: mLowDibbsCreditMode,
      orderTotalUpFrontAmount: mOrderTotalUpFrontAmount,
      totalRemaining: mTotalRemaining,
    });

    const subscription = Appearance.addChangeListener(({colorScheme}) => {
      console.log('Appearance mode changed to', colorScheme);
      // You can update your state or trigger actions based on colorScheme
      setCurrentMode(colorScheme);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (
      RedStripePayment.state !== CALL_STATE.IDLE &&
      RedStripePayment.state !== CALL_STATE.FETCHING
    ) {
      dispatch(doStripePaymentIdle());
      if (RedStripePayment.state === CALL_STATE.SUCCESS) {
        // Alert.alert('Success');

        dispatch(
          createOrder(
            myComponentProps.coupon,
            myComponentProps.lowDibbsCreditMode
              ? PaymentMethodsEnum.LowDibbsCredit
              : PaymentMethodsEnum.Stripe,
            myStripePaymentMethod,
          ),
        );

        // this.props.createOrder(
        //   this.state.coupon,
        //   lowDibbsCreditMode
        //     ? PaymentMethodsEnum.LowDibbsCredit
        //     : PaymentMethodsEnum.Stripe,
        //   this.state.paymentMethod,
        // );
      } else if (RedStripePayment.state === CALL_STATE.ERROR) {
        setIsLoading(false);
        Alert.alert('Error');
      }
    }
  }, [RedStripePayment.state]);

  useEffect(() => {
    console.log(
      'fahad useeffect RedOrderConfirmedSuccessfully: ',
      RedOrderConfirmedSuccessfully,
    );
    console.log(
      'fahad useeffect myComponentProps?.paymentMethod: ',
      myComponentProps?.paymentMethod,
    );
    if (
      RedOrderConfirmedSuccessfully === true &&
      myComponentProps?.paymentMethod === PaymentMethodsEnum.Stripe
    ) {
      setIsLoading(false);
      Alert.alert(
        'Success',
        'Order Placed Successfully!',

        [
          {
            text: 'OK',
            onPress: () => {
              dispatch(searchDeals(''));
              dispatch(clearCartInfo());

              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: ScreenNames.BottomNavigator,
                    params: {},
                  },
                ],
              });
            },
          },
        ],
        {cancelable: false},
      );
    }
  }, [RedOrderConfirmedSuccessfully]);

  useEffect(() => {
    if (!!RedOrderConfirmError) {
      setIsLoading(false);
      Alert.alert(
        'Error',
        RedOrderConfirmError,

        [
          {
            text: 'OK',
            onPress: () => {},
          },
        ],
        {cancelable: false},
      );
    }
  }, [RedOrderConfirmError]);

  useEffect(() => {
    if (
      RedOrderPlacedSuccessfully === true &&
      myComponentProps?.paymentMethod === PaymentMethodsEnum.Stripe &&
      false
    ) {
      setIsLoading(false);
      Alert.alert(
        'Success',
        'Order Placed Successfully!',

        [
          {
            text: 'OK',
            onPress: () => {
              dispatch(searchDeals(''));
              dispatch(clearCartInfo());
              // navigation.navigate(ScreenNames.DealsScreen);

              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: ScreenNames.BottomNavigator,
                    params: {},
                  },
                ],
              });
            },
          },
        ],
        {cancelable: false},
      );
    }
  }, [RedOrderPlacedSuccessfully]);

  useEffect(() => {
    if (!!RedOrderPlaceError) {
      setIsLoading(false);
      Alert.alert(
        'Error',
        RedOrderPlaceError,

        [
          {
            text: 'OK',
            onPress: () => {},
          },
        ],
        {cancelable: false},
      );
    }
  }, [RedOrderPlaceError]);

  // useEffect(() => {
  //   if (
  //     this.props.orderConfirmedSuccessfully !==
  //       prevProps.orderConfirmedSuccessfully &&
  //     this.props.orderConfirmedSuccessfully === true &&
  //     this.state.orderPaymentMethod === PaymentMethodsEnum.Stripe
  //   ) {
  //   }

  //   if (
  //     this.props.orderPlacedSuccessfully !==
  //       prevProps.orderPlacedSuccessfully &&
  //     this.props.orderPlacedSuccessfully === true &&
  //     (this.state.orderPaymentMethod === PaymentMethodsEnum.DibbsCredit ||
  //       this.state.orderPaymentMethod === PaymentMethodsEnum.LowDibbsCredit ||
  //       (this.state.orderPaymentMethod === PaymentMethodsEnum.Stripe &&
  //         this.state.orderTotalUpFrontAmount === 0))
  //   ) {
  //   }

  //   if (
  //     this.props.orderConfirmError !== prevProps.orderConfirmError &&
  //     !!this.props.orderConfirmError
  //   ) {
  //   }
  // });

  const handlePayment = async () => {
    try {
      // const { paymentMethod, error } = await createPaymentMethod({
      //   type: 'Card',
      //   paymentMethodType: 'Card',
      //   billingDetails: {
      //     name: 'John Doe',
      //     email: 'john.doe@example.com',
      //   },
      // });

      if (!!!cardHolderName) {
        showAlertModal('Validation Error', 'Please enter card holder name!');
        return;
      }
      if (
        !!!card ||
        !!card?.complete === false ||
        card?.validCVC !== 'Valid' ||
        card?.validExpiryDate !== 'Valid' ||
        card?.validNumber !== 'Valid'
      ) {
        showAlertModal('Validation Error', 'Please enter correct card info!');

        return;
      }

      setIsLoading(true);
      const obj = await createPaymentMethod({
        // type: 'Card',
        paymentMethodType: 'Card',
        // card: {
        //   brand: 'Visa',
        //   complete: true,
        //   expiryMonth: 11,
        //   expiryYear: 26,
        //   last4: '4242',
        //   validCVC: 'Valid',
        //   validExpiryDate: 'Valid',
        //   validNumber: 'Valid',
        // },
        // billingDetails: {
        //   name: 'John Doe',
        //   email: 'john.doe@example.com',
        // },
      });

      // const {paymentMethodIntent, error} = await createToken({
      //   type: 'Card',
      //   name: "Fahad Ibrahim",
      //   currency: 'usd',
      // });

      // const {paymentIntent, error} = await confirmPayment(
      //   'sk_test_51PMveFDMW1AQXKDfidIQkFvgPpuXo9rBIFOpSToPuV5h9ZFCV7jAtrWb0JDOvfAQUOrOSMJyPVtvnOWZcUAasbZJ00o0HKEBMz',
      //   {
      //     type: 'Card',
      //     paymentMethodType: 'Card',
      //   },
      // );

      setMyStripePaymentMethod(obj.paymentMethod);
      // if (error) {
      //   console.log('Payment confirmation error:', error.message);
      //   setPaymentError(`Payment failed: ${error.message}`);
      //   setPaymentSuccess(false);
      // } else if (paymentIntent) {
      //   console.log('Success:', paymentIntent);
      //   setPaymentSuccess(true);
      //   setPaymentError(null);
      // }
      dispatch(
        doStripePayment(
          5000,
          'usd',
          obj.paymentMethod?.id,
          myComponentProps.coupon,
        ),
      );
    } catch (error) {
      console.log('Error while confirming payment:', error);
      setPaymentError(`Payment failed: ${error.message}`);
      setPaymentSuccess(false);
    }
  };

  const showAlertModal = (
    alertHeading,
    alertMsg,
    alertType = '',
    showLeftButton = false,
    leftBtnText = '',
    leftBtnDestructive = false,
    showRightButton = true,
    rightBtnText = 'OK',
    rightBtnDestructive = false,
  ) => {
    setAlertProps({
      alertModalVisible: true,
      alertHeading: alertHeading,
      alertMsg: alertMsg,
      alertType: alertType,
      showLeftButton: showLeftButton,
      leftBtnText: leftBtnText,
      leftBtnDestructive: leftBtnDestructive,
      showRightButton: showRightButton,
      rightBtnText: rightBtnText,
      rightBtnDestructive: rightBtnDestructive,
    });
  };

  const setAlertModalVisible = visible => {
    setAlertProps({...alertProps, alertModalVisible: visible});
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.commonBackground,
      }}>
      <SafeAreaView style={{flex: 1}}>
        <AlertComponent
          alertProps={alertProps}
          setModalVisible={setAlertModalVisible}
          onLeftBtnClick={() => {
            setAlertModalVisible(false);
          }}
          onRightBtnClick={() => {
            setAlertModalVisible(false);
          }}
          width={w(85)}
        />
        <HeaderBackCompoenent
          cardStyle={true}
          leftImageSource={backImage}
          onPressLeftButton={() => {
            navigation.goBack(null);
          }}
          leftType="image"
          leftImageColor={colors.appPurple}
          headingTitle={'Enter Card Details'}
          titleAlignment={'flex-start'}
          // iconR2={'md-share'}
          // iconR2Color={colors.appPurple}
          // onIconR2Press={() => {
          //   this.onShare('', 'http://thedibbsapp.com/', '');
          // }}
        />
        <ScrollView
          contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}
          style={{marginBottom: RFValue(10)}}
          keyboardShouldPersistTaps="always">
          <View style={{flex: 1}}>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'center',
                marginTop: RFValue(10),
              }}>
              <View
                style={{
                  flex: 0.45,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: 'black',
                  }}>
                  Amount Due Now
                </Text>

                <View>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: RFValue(22),
                      marginTop: RFValue(10),
                      color: colors.black,
                      // textDecorationLine: 'underline',
                    }}>
                    $ {myComponentProps?.orderTotalUpFrontAmount.toFixed(2)}
                  </Text>
                  <View
                    style={{
                      // position: 'absolute',
                      left: 0,
                      right: 0,
                      bottom: 0,
                      height: 1,
                      backgroundColor: 'black',
                    }}
                  />
                </View>
              </View>

              <View
                style={{
                  backgroundColor: colors.black,
                  width: RFValue(2),
                }}></View>
              <View
                style={{
                  flex: 0.45,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: 'black',
                  }}>
                  Due Upon Redemption
                </Text>

                <View>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: RFValue(22),
                      marginTop: RFValue(10),
                      color: colors.black,
                      // textDecorationLine: 'underline',
                    }}>
                    $ {myComponentProps?.totalRemaining.toFixed(2)}
                  </Text>

                  <View
                    style={{
                      // position: 'absolute',
                      left: 0,
                      right: 0,
                      bottom: 0,
                      height: 1,
                      backgroundColor: 'black',
                    }}
                  />
                </View>
              </View>
            </View>

            <View style={{flex: 1, alignItems: 'center'}}>
              <View
                style={{
                  marginTop: 50,
                  width: '80%',
                }}>
                <Text
                  style={{
                    color: 'black',
                  }}>
                  Card Holder Name*
                </Text>
                <TextInputWithLabel
                  label={''}
                  value={cardHolderName}
                  onChange={text => {
                    setCardHolderName(text);
                  }}
                  inputContainerStyles={{
                    borderRadius: 10,
                  }}
                  placeHolder={'i.e Alex Martin'}
                  outerContainerStyles={{width: '100%', marginBottom: 20}}
                  inputStyles={{
                    // height: h(5),
                    fontSize: RFValue(16),
                    marginLeft: 10,
                  }}
                  keyboardType="default"
                  autoCapitalize="words"
                  // ref={this.lastNameRef}
                  // returnKeyType={'next'}
                  // nextRef={this.emailRef}
                />
                <Text
                  style={{
                    color: 'black',
                  }}>
                  Card Details*
                </Text>
                <CardField
                  postalCodeEnabled={false}
                  // placeholders={{ number: '4242 4242 4242 4242' }}

                  placeholders={{
                    number: '4242 4242 4242 4242',
                  }}
                  cardStyle={{
                    backgroundColor: '#F8F2FE',
                    textColor: '#000000',
                    placeholderColor:
                      currentMode === 'dark' ? '#888888' : '#AAAAAA',
                    borderWidth: 1,
                    borderColor: currentMode === 'dark' ? '#444444' : '#DDDDDD',
                    borderRadius: 10,
                    fontSize: 16,
                  }}
                  style={{
                    width: '100%',
                    height: h(7),
                    marginVertical: 20,
                  }}
                  onCardChange={cardDetails => {
                    // console.log('card details', cardDetails);
                    setCard(cardDetails);
                  }}
                />

                <Text
                  style={{
                    color: 'black',
                  }}>
                  Postal Code
                </Text>
                <TextInputWithLabel
                  label={''}
                  value={postalCode}
                  onChange={text => {
                    setPostalCode(text);
                  }}
                  inputContainerStyles={{
                    borderRadius: 10,
                  }}
                  placeHolder={'i.e 123456'}
                  outerContainerStyles={{width: '100%', marginBottom: 20}}
                  inputStyles={{
                    // height: h(5),
                    fontSize: RFValue(16),
                    marginLeft: 10,
                  }}
                  keyboardType={'number-pad'}
                  autoCapitalize="words"
                  // ref={this.lastNameRef}
                  returnKeyType={'done'}
                  // nextRef={this.emailRef}
                />
              </View>

              <Button
                light
                // onPress={()=>logIn()}
                onPress={() => {
                  handlePayment();
                }}
                rounded
                style={[styles.btnStyle]}
                // iconLeft
              >
                <Text style={[styles.textStyle, {fontSize: 16}]}>
                  Pay ${myComponentProps?.orderTotalUpFrontAmount.toFixed(2)}
                </Text>
              </Button>
              {/* <Button
                title="Pay $50"
                onPress={() => {
                  showAlertModal(
                    'Validation Error',
                    'Please enter your email!',
                  );
                  // handlePayment();
                }}
              /> */}
              {paymentError && (
                <Text style={{color: 'red', marginTop: 10}}>
                  {paymentError}
                </Text>
              )}
              {paymentSuccess && (
                <Text style={{color: 'green', marginTop: 10}}>
                  Payment successful!
                </Text>
              )}
              <View
                style={{
                  // backgroundColor: 'blue',
                  paddingLeft: 20,
                  paddingRight: 20,
                  paddingVertical: 10,
                }}>
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',

                    // backgroundColor: 'red',
                  }}>
                  <Ionicons
                    name={'information-circle-outline'}
                    size={h(3)}
                    color={'#666666'}
                  />

                  <Text
                    style={{
                      color: '#666666',
                      fontSize: 14,
                      marginLeft: 10,
                      // textAlign: 'center',
                    }}>
                    Secure payment processing by Stripe. Your payment details
                    are encrypted and safe.
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <FullScreenLoader
            title={titles.fullScreenLoaderTitle}
            loading={isLoading}
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default CardPaymentScreen;

// export default class CardPaymentScreen extends PureComponent {
//   static title = 'Card Form';

//   state = {
//     loading: false,
//     paymentMethod: null,
//   };

//   handleCardPayPress = async () => {
//     try {
//       this.setState({ loading: true, paymentMethod: null });

//       // const paymentMethod = await stripe.paymentRequestWithCardForm({
//       //   theme: {
//       //     primaryBackgroundColor: 'white',
//       //     secondaryBackgroundColor: 'white',
//       //     primaryForegroundColor: 'black',
//       //     secondaryForegroundColor: 'black',
//       //     accentColor: 'blue',
//       //     errorColor: 'red',
//       //   },
//       //   // Only iOS support this options
//       //   smsAutofillDisabled: true,
//       //   requiredBillingAddressFields: 'full',
//       //   prefilledInformation: {
//       //     billingAddress: {
//       //       name: 'Gunilla Haugeh',
//       //       line1: 'Canary Place',
//       //       line2: '3',
//       //       city: 'Macon',
//       //       state: 'Georgia',
//       //       country: 'US',
//       //       postalCode: '31217',
//       //       email: 'ghaugeh0@printfriendly.com',
//       //     },
//       //   },
//       // });

//       // console.log('Payment Info => ', paymentMethod);
//       // this.setState({ loading: false, paymentMethod });
//     } catch (error) {
//       this.setState({ loading: false });
//     }
//   };

//   render() {
//     const { loading, paymentMethod } = this.state;

//     return (
//       <View style={styles.container}>
//         <SafeAreaView style={{ flex: 1 }}>
//           <Text style={styles.header}>Card Form Example</Text>
//           <Text style={styles.instruction}>
//             Click button to show Card Form dialog.
//           </Text>
//           {/* <Button
//             text="Enter you card and pay"
//             loading={loading}
//             onPress={this.handleCardPayPress}
//           /> */}
//           <View style={styles.paymentMethod}>
//             {paymentMethod && (
//               <Text style={styles.instruction}>
//                 Payment Method: {paymentMethod.id}
//               </Text>
//             )}
//           </View>
//         </SafeAreaView>
//       </View>
//     );
//   }
// }

const styles = StyleSheet.create({
  btnStyle: {
    justifyContent: 'center',
    marginTop: h(5),
    backgroundColor: 'rgb(74, 29, 121)',
    height: h(6.5),
    width: '50%',
    alignSelf: 'center',
  },
  textStyle: {
    width: '100%',
    textAlign: 'center',
    fontSize: RFValue(15),
    color: 'white',
    fontWeight: 'bold',
  },
});
