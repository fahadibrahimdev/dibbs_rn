import React, {Component} from 'react';
import {
  SafeAreaView,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {width as w} from 'react-native-dimension';
import {RFValue} from 'react-native-responsive-fontsize';
import {connect} from 'react-redux';
// import stripe from 'tipsi-stripe';
import {strings, titles} from '../../../constants/Localization';
import {ScreenNames} from '../../../constants/ScreenNames';
import AlertComponent from '../../../helpers/AlertComponent';
import colors from '../../../helpers/colors';
import {AlertTypesEnum, PaymentMethodsEnum} from '../../../helpers/enum';
import FullScreenLoader from '../../../helpers/FullScreenLoader';
import HeaderBackCompoenent from '../../../helpers/HeaderBackCompoenent';
import {backImage} from '../../../helpers/Images';
import {navigateWithParams} from '../../../helpers/Util';
import {
  addRemoveProductInCart,
  clearCartInfo,
  createOrder,
} from '../../../redux/actions/cartActions';
import {
  getMySavedProducts,
  removeProduct,
  searchDeals,
} from '../../../redux/actions/productActions';

class PaymentScreen extends Component {
  static title = 'Card Form';

  state = {
    //Alert State
    alertProps: {
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
    },

    loading: false,
    paymentMethod: null,
    coupon: '',
    appliedCoupon: null,

    orderPaymentMethod: null,

    orderTotalUpFrontAmount: 0,
  };

  componentDidMount() {
    const coupon = this.props.route.params.coupon;

    var appliedCoupon = null;

    this.props.allCoupons.map(item => {
      if (item.code === coupon) {
        appliedCoupon = item;
      }
    });

    var orderTotalUpFrontAmountInString = !!appliedCoupon
      ? (
          this.props.totalUpFront.toFixed(2) -
          (
            this.props.totalUpFront *
            (parseFloat(appliedCoupon.discount) / 100)
          ).toFixed(2)
        ).toFixed(2)
      : this.props.totalUpFront.toFixed(2);

    var orderTotalUpFrontAmount = parseFloat(orderTotalUpFrontAmountInString);

    this.setState({
      coupon: !!coupon ? coupon : '',
      appliedCoupon: appliedCoupon,
      orderTotalUpFrontAmount: orderTotalUpFrontAmount,
    });
  }

  componentDidUpdate(prevProps) {
    // if (
    //   this.props.orderConfirmedSuccessfully !==
    //   prevProps.orderConfirmedSuccessfully &&
    //   this.props.orderConfirmedSuccessfully === true &&
    //   this.state.orderPaymentMethod === PaymentMethodsEnum.Stripe
    // ) {
    //   Alert.alert(
    //     'Success',
    //     'Order Placed Successfully!',
    //     [
    //       {
    //         text: 'OK',
    //         onPress: () => {
    //           this.props.searchDeals('');
    //           this.props.clearCartInfo();
    //           this.props.navigation.dispatch(
    //             CommonActions.reset({
    //               index: 0,
    //               routes: [{ name: ScreenNames.BottomNavigator }],
    //             }),
    //           );
    //           // navigate(this.props.navigation, ScreenNames.DealsNavigator);
    //         },
    //       },
    //     ],
    //     { cancelable: false },
    //   );
    // }
    // if (
    //   this.props.orderPlacedSuccessfully !==
    //   prevProps.orderPlacedSuccessfully &&
    //   this.props.orderPlacedSuccessfully === true &&
    //   (this.state.orderPaymentMethod === PaymentMethodsEnum.DibbsCredit ||
    //     this.state.orderPaymentMethod === PaymentMethodsEnum.LowDibbsCredit ||
    //     (this.state.orderPaymentMethod === PaymentMethodsEnum.Stripe &&
    //       this.state.orderTotalUpFrontAmount === 0))
    // ) {
    //   Alert.alert(
    //     'Success',
    //     'Order Placed Successfully!',
    //     [
    //       {
    //         text: 'OK',
    //         onPress: () => {
    //           this.props.searchDeals('');
    //           this.props.clearCartInfo();
    //           navigate(this.props.navigation, ScreenNames.DealsScreen);
    //         },
    //       },
    //     ],
    //     { cancelable: false },
    //   );
    // }
    // if (
    //   this.props.orderPlaceError !== prevProps.orderPlaceError &&
    //   !!this.props.orderPlaceError
    // ) {
    //   Alert.alert(
    //     'Error',
    //     this.props.orderPlaceError,
    //     [
    //       {
    //         text: 'OK',
    //         onPress: () => {
    //           // this.props.searchDeals('');
    //           // this.props.clearCartInfo();
    //           // navigate(this.props.navigation, ScreenNames.DealsScreen);
    //         },
    //       },
    //     ],
    //     { cancelable: false },
    //   );
    // }
    // if (
    //   this.props.orderConfirmError !== prevProps.orderConfirmError &&
    //   !!this.props.orderConfirmError
    // ) {
    //   Alert.alert(
    //     'Error',
    //     this.props.orderConfirmError,
    //     [
    //       {
    //         text: 'OK',
    //         onPress: () => {
    //           // this.props.searchDeals('');
    //           // this.props.clearCartInfo();
    //           // navigate(this.props.navigation, ScreenNames.DealsScreen);
    //         },
    //       },
    //     ],
    //     { cancelable: false },
    //   );
    // }
  }

  handleCardPayPress = async (lowDibbsCreditMode = false) => {
    try {
      this.setState({loading: true, paymentMethod: null});

      // const paymentMethod = await stripe.paymentRequestWithCardForm({
      //   theme: {
      //     primaryBackgroundColor: 'white',
      //     secondaryBackgroundColor: 'white',
      //     primaryForegroundColor: 'black',
      //     secondaryForegroundColor: 'black',
      //     accentColor: 'blue',
      //     errorColor: 'red',
      //   },
      //   // // Only iOS support this options
      //   // smsAutofillDisabled: true,
      //   // requiredBillingAddressFields: 'full',
      //   // prefilledInformation: {
      //   //   billingAddress: {
      //   //     name: '',
      //   //     line1: '',
      //   //     line2: '',
      //   //     city: '',
      //   //     state: '',
      //   //     country: '',
      //   //     postalCode: '',
      //   //     email: '',
      //   //   },
      //   // },
      // });

      console.log('Payment Info => ', paymentMethod);
      this.setState({
        loading: false,
        paymentMethod,
        orderPaymentMethod: lowDibbsCreditMode
          ? PaymentMethodsEnum.LowDibbsCredit
          : PaymentMethodsEnum.Stripe,
      });

      this.props.createOrder(
        this.state.coupon,
        lowDibbsCreditMode
          ? PaymentMethodsEnum.LowDibbsCredit
          : PaymentMethodsEnum.Stripe,
        this.state.paymentMethod,
      );
    } catch (error) {
      console.log('Fahad Stripe error msg -> ', error.message);
      this.setState({loading: false});
    }
  };

  // <Alert Functions>
  showAlertModal = (
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
    this.setState({
      alertProps: {
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
      },
    });
  };

  setAlertModalVisible = visible => {
    this.setState({
      alertProps: {
        alertModalVisible: visible,
      },
    });
  };
  // </Alert Functions>

  onShare = async (title, msg, url) => {
    try {
      const result = await Share.share({
        title: title,
        message: msg,
        url: url,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      this.showAlertModal('Error', error.message);
    }
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.commonBackground,
        }}>
        <SafeAreaView style={{flex: 1}}>
          <AlertComponent
            alertProps={this.state.alertProps}
            setModalVisible={this.setAlertModalVisible}
            onLeftBtnClick={() => {
              this.setAlertModalVisible(false);
            }}
            onRightBtnClick={() => {
              if (
                this.state.alertProps.alertType === AlertTypesEnum.GuestUser
              ) {
              } else if (
                this.state.alertProps.alertType === AlertTypesEnum.DibbsCredit
              ) {
                this.handleCardPayPress(true);
              } else if (
                this.state.alertProps.alertType ===
                AlertTypesEnum.DibbsCreditConfirmation
              ) {
                var currentPayment = !!this.state.appliedCoupon
                  ? this.props.totalUpFront.toFixed(2) -
                    (
                      this.props.totalUpFront *
                      (parseFloat(this.state.appliedCoupon.discount) / 100)
                    ).toFixed(2)
                  : this.props.totalUpFront.toFixed(2);

                if (
                  parseFloat(this.props.dibbsCredits) >=
                  parseFloat(currentPayment)
                ) {
                  this.setState({
                    orderPaymentMethod: PaymentMethodsEnum.DibbsCredit,
                  });

                  this.props.createOrder(
                    this.state.coupon,
                    PaymentMethodsEnum.DibbsCredit,
                    null,
                  );
                } else {
                  setTimeout(() => {
                    this.showAlertModal(
                      'Alert',
                      'DIBBS credit are not enough for this order. You will need to pay remaining amount via Credit Card.',
                      AlertTypesEnum.DibbsCredit,
                      true,
                      'Cancel',
                      true,
                      true,
                      'Proceed',
                      false,
                    );
                  }, 500);
                }
              }

              this.setAlertModalVisible(false);
            }}
            width={w(85)}
          />
          <HeaderBackCompoenent
            cardStyle={true}
            leftImageSource={backImage}
            onPressLeftButton={() => {
              this.props.navigation.goBack(null);
            }}
            leftType="image"
            leftImageColor={colors.appPurple}
            headingTitle={strings.payment}
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
                      ${' '}
                      {!!this.state.appliedCoupon
                        ? (
                            this.props.totalUpFront.toFixed(2) -
                            (
                              this.props.totalUpFront *
                              (parseFloat(this.state.appliedCoupon.discount) /
                                100)
                            ).toFixed(2)
                          ).toFixed(2)
                        : this.props.totalUpFront.toFixed(2)}
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
                      $ {this.props.totalRemaining.toFixed(2)}
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

              <View style={{margin: RFValue(10)}}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: RFValue(14),
                    marginTop: RFValue(20),
                    color: colors.black,
                  }}>
                  Click on your preferred Payment Method
                </Text>

                <View
                  style={{
                    marginTop: RFValue(10),
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      navigateWithParams(
                        this.props.navigation,
                        ScreenNames.CardPaymentScreen,
                        {
                          coupon: this.state.coupon,
                          paymentMethod: PaymentMethodsEnum.Stripe,
                          lowDibbsCreditMode: false,
                          orderTotalUpFrontAmount:
                            this.state.orderTotalUpFrontAmount,
                          totalRemaining: this.props.totalRemaining,
                        },
                      );

                      // this.handleCardPayPress();
                    }}
                    style={{
                      height: RFValue(100),
                      width: w(80),
                      backgroundColor: 'white',
                      borderRadius: 5,
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: RFValue(28),
                        fontWeight: 'bold',
                        fontStyle: 'italic',
                        textAlign: 'center',
                        color: '#2b3894',
                      }}>
                      Credit Card
                    </Text>
                  </TouchableOpacity>

                  {/* <TouchableOpacity
                  onPress={() => {
                    // this.props.createOrder(this.state.coupon);
                  }}
                  style={{
                    height: RFValue(100),
                    width: w(80),
                    backgroundColor: 'white',
                    borderRadius: 5,
                    justifyContent: 'center',
                    marginTop: RFValue(10),
                  }}>
                  <Text
                    style={{
                      fontSize: RFValue(28),
                      fontWeight: 'bold',
                      fontStyle: 'italic',
                      textAlign: 'center',
                      color: '#240150',
                    }}>
                    Paypal
                  </Text>
                </TouchableOpacity> */}

                  <TouchableOpacity
                    onPress={() => {
                      this.showAlertModal(
                        'Use Dibbs Credit',
                        'Are you sure you want to use your Dibbs credit on this deal?',
                        AlertTypesEnum.DibbsCreditConfirmation,
                        true,
                        'Cancel',
                        true,
                        true,
                        'Proceed',
                        false,
                      );
                    }}
                    style={{
                      height: RFValue(100),
                      width: w(80),
                      backgroundColor: 'white',
                      borderRadius: 5,
                      justifyContent: 'center',
                      marginTop: RFValue(10),
                    }}>
                    <Text
                      style={{
                        fontSize: RFValue(28),
                        fontWeight: 'bold',
                        fontStyle: 'italic',
                        textAlign: 'center',
                        color: '#240150',
                      }}>
                      DIBBS
                    </Text>
                    <Text
                      style={{
                        fontSize: RFValue(12),
                        fontStyle: 'italic',
                        textAlign: 'center',
                        fontWeight: 'normal',
                      }}>
                      Credit $ {this.props.dibbsCredits}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <FullScreenLoader
              title={titles.fullScreenLoaderTitle}
              loading={
                this.props.isPlacingOrder || this.props.isConfirmingOrder
              }
            />
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  const {appName, isAuthenticated} = state.authReducer;
  const {
    isFetchingMySavedProducts,
    mySavedProducts,
    mySavedProductsError,
    productDeletedSuccessfully,
    couponCode,
    couponAmount,
    dibbsCredits,
    allCoupons,
  } = state.productReducer;

  const {
    isUpdatingCartInfo,
    cartInfoUpdatedSuccessFully,
    productsList,
    coupon,
    totalItems,
    totalUpFront,
    totalRemaining,
    totalPrice,

    isPlacingOrder,
    orderPlacedSuccessfully,
    isConfirmingOrder,
    orderConfirmedSuccessfully,
    orderPlaceError,
    orderConfirmError,
  } = state.cartReducer;

  return {
    appName,
    isAuthenticated,
    isFetchingMySavedProducts,
    mySavedProducts,
    mySavedProductsError,
    productDeletedSuccessfully,
    couponCode,
    couponAmount,
    dibbsCredits,
    allCoupons,
    isUpdatingCartInfo,
    cartInfoUpdatedSuccessFully,
    productsList,
    coupon,
    totalItems,
    totalUpFront,
    totalRemaining,
    totalPrice,
    isPlacingOrder,
    orderPlacedSuccessfully,
    isConfirmingOrder,
    orderConfirmedSuccessfully,
    orderPlaceError,
    orderConfirmError,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    getMySavedProducts: () => dispatch(getMySavedProducts()),
    removeProduct: productID => dispatch(removeProduct(productID)),
    addRemoveProductInCart: (
      productVariation,
      productDetails,
      action,
      newCouponCode,
    ) =>
      dispatch(
        addRemoveProductInCart(
          productVariation,
          productDetails,
          action,
          newCouponCode,
        ),
      ),

    createOrder: (coupon, method, transactionInfo) =>
      dispatch(createOrder(coupon, method, transactionInfo)),
    clearCartInfo: () => dispatch(clearCartInfo()),
    searchDeals: keyword => dispatch(searchDeals(keyword)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PaymentScreen);
