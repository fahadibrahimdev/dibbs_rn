import moment from 'moment';
import {Button} from 'native-base';
import React, {Component} from 'react';
import {
  FlatList,
  Image as Image_ReactNative,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {height as h, width as w} from 'react-native-dimension';
import FastImage from 'react-native-fast-image';
import {createImageProgress} from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Circle';
import {RFValue} from 'react-native-responsive-fontsize';
import {SafeAreaView} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
import {APP_CONSTANTS} from '../../../constants/APIs';
import {strings, titles} from '../../../constants/Localization';
import {ScreenNames} from '../../../constants/ScreenNames';
import AlertComponent from '../../../helpers/AlertComponent';
import colors from '../../../helpers/colors';
import {AlertTypesEnum} from '../../../helpers/enum';
import FullScreenLoader from '../../../helpers/FullScreenLoader';
import HeaderBackCompoenent from '../../../helpers/HeaderBackCompoenent';
import {backImage, dibbsLogo} from '../../../helpers/Images';
import RedeemAlertComponent from '../../../helpers/RedeemAlertComponent';
import {
  goBack,
  navigateWithParams,
  stringToNumber,
} from '../../../helpers/Util';
import {getMyOrders, redeemOrder} from '../../../redux/actions/cartActions';
const Image = createImageProgress(FastImage);

class MyOrdersScreen extends Component {
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
      leftBtnColor: '',
      rightBtnColor: '',
    },
    // Redeem Alert State
    redeemAlertProps: {
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
      leftBtnColor: '',
      rightBtnColor: '',
      redeemCode: '',
    },

    filteredData: [],
    selectedOrder: null,
  };

  componentDidMount() {
    this.props.getMyOrders();
  }

  componentDidUpdate(prevProps) {
    if (this.props.myOrders.length !== prevProps.myOrders.length) {
      this.setState({
        filteredData: this.props.myOrders,
      });
    }

    if (
      this.props.isOrderRedeemed !== prevProps.isOrderRedeemed &&
      this.props.isOrderRedeemed === true
    ) {
      this.props.getMyOrders();
    }

    if (
      this.props.redeemOrdersError !== prevProps.redeemOrdersError &&
      this.props.redeemOrdersError !== ''
    ) {
      this.showAlertModal('Error', this.props.redeemOrdersError);
    }
  }

  onRefresh = () => {
    this.props.getMyOrders();
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

    leftBtnColor = colors.lightGrey,
    rightBtnColor = colors.lightGrey,
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
        leftBtnColor: leftBtnColor,
        rightBtnColor: rightBtnColor,
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

  // <Redeem Alert Functions>
  showRedeemAlertModal = (
    alertHeading,
    alertMsg,
    alertType = '',
    showLeftButton = false,
    leftBtnText = '',
    leftBtnDestructive = false,
    showRightButton = true,
    rightBtnText = 'OK',
    rightBtnDestructive = false,

    leftBtnColor = colors.lightGrey,
    rightBtnColor = colors.lightGrey,
  ) => {
    this.setState({
      redeemAlertProps: {
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
        leftBtnColor: leftBtnColor,
        rightBtnColor: rightBtnColor,
      },
    });
  };

  setRedeemAlertModalVisible = visible => {
    this.setState({
      redeemAlertProps: {
        alertModalVisible: visible,
      },
    });
  };

  setRedeemAlertRedeemCode = text => {
    this.setState({
      redeemAlertProps: {
        ...this.state.redeemAlertProps,
        redeemCode: text,
      },
    });
  };
  // </Redeem Alert Functions>

  alertForRedeem() {
    this.showAlertModal(
      'Redeem Deal',
      'Please pay your balance and allow the business representative to enter the code to redeem your deal',
      AlertTypesEnum.Redeem,
      true,
      'Go Back',
      false,
      true,
      'Redeem',
      false,
      colors.lightGray,
      colors.lightGray,
    );
  }

  calculateRemainingAmount(currentItem) {
    if (!!currentItem) {
      var totalPaidAmountWithDiscount = 0;

      if (currentItem?.owner_amount && currentItem?.owner_amount !== '') {
        const ownerAmount = parseFloat(currentItem?.owner_amount);

        totalPaidAmountWithDiscount =
          (ownerAmount * 100) /
          (!!currentItem?.coupon ? 100 - parseFloat(currentItem?.coupon) : 100);
      }

      if (currentItem?.total_price && currentItem?.total_price !== '') {
        return (
          parseFloat(currentItem?.total_price) - totalPaidAmountWithDiscount
        ).toFixed(2);
      }

      return !!currentItem.remaining_amount
        ? stringToNumber(currentItem.remaining_amount).toFixed(2)
        : ' 0 ';
    }
  }

  renderCellItem = (item, index) => {
    return (
      <TouchableOpacity
        style={{
          width: '90%',
          height: RFValue(210),
          alignSelf: 'center',
          marginTop: h(2),
          borderRadius: h(2),
          borderColor: colors.black,
          borderWidth: 0.5,
          elevation: h(2),
          backgroundColor: colors.white,
        }}
        activeOpacity={0.8}
        onPress={() => {
          navigateWithParams(
            this.props.navigation,
            ScreenNames.DealDetailScreen,
            {
              productDetails: item,
            },
          );
        }}>
        <View style={{width: '100%', height: '100%', flexDirection: 'row'}}>
          <View
            style={{
              flex: 0.35,
              borderTopLeftRadius: h(2),
              borderBottomLeftRadius: h(2),
              backgroundColor: '#115588',
              padding: 0.5,
            }}>
            {!!item.items[0].prodData.images &&
            !!item.items[0].prodData.images.length > 0 ? (
              <Image
                source={{
                  uri: item.items[0].prodData.images[0].image_full,
                }}
                indicator={ProgressBar}
                style={{
                  width: '100%',
                  height: '100%',
                }}
                imageStyle={{
                  borderTopLeftRadius: h(2),
                  borderBottomLeftRadius: h(2),
                  resizeMode: 'cover',
                }}
              />
            ) : (
              <Image_ReactNative
                source={dibbsLogo}
                style={{
                  width: '100%',
                  height: '100%',
                  resizeMode: 'cover',
                  borderTopLeftRadius: h(2),
                  borderBottomLeftRadius: h(2),
                }}
              />
            )}
          </View>
          <View
            style={{
              flex: 0.65,
              borderTopRightRadius: h(2),
              borderBottomRightRadius: h(2),
            }}>
            <View
              style={{
                paddingTop: RFValue(5),
                paddingLeft: RFValue(10),
                paddingRight: h(0),
              }}>
              <Text
                numberOfLines={1}
                style={{
                  fontWeight: 'bold',
                  fontSize: RFValue(17),
                  color: '#22044e',
                  textTransform: 'capitalize',
                }}>
                Order # {item.order_id}
              </Text>
              {!!item.items[0].prodData.store_info &&
                !!item.items[0].prodData.store_info.store_name && (
                  <Text
                    numberOfLines={1}
                    style={{
                      color: colors.black,
                      fontSize: RFValue(13),
                      fontWeight: 'bold',
                    }}>
                    {item.items[0].prodData.store_info.store_name}
                  </Text>
                )}

              <Text
                numberOfLines={1}
                style={{
                  color: colors.black,
                  fontWeight: 'bold',
                  fontSize: RFValue(13),
                }}>
                {!!item.items[0].prodData.product_name
                  ? item.items[0].prodData.product_name
                  : ' - '}{' '}
                - {!!item.variations.name ? item.variations.name : ' - '}
              </Text>

              <Text
                numberOfLines={1}
                style={{
                  color: colors.black,
                  fontWeight: 'bold',
                  fontSize: RFValue(13),
                }}>
                Date:{' '}
                {!!item.added_on
                  ? moment.utc(item.added_on).local().format('yyyy-DD-MM')
                  : ' - '}
              </Text>

              <Text
                style={{
                  color: colors.black,
                  fontWeight: 'bold',
                  fontSize: RFValue(13),
                }}>
                Total Price: $
                {!!item.total_price
                  ? stringToNumber(item.total_price).toFixed(2)
                  : ' - '}
              </Text>

              <Text
                numberOfLines={1}
                style={{
                  color: colors.black,
                  fontWeight: 'bold',
                  fontSize: RFValue(13),
                }}>
                Amount Paid: $
                {!!item.owner_amount
                  ? stringToNumber(item.owner_amount).toFixed(2)
                  : ' - '}
              </Text>

              <Text
                numberOfLines={2}
                style={{
                  color: colors.appPurple,
                  fontWeight: 'bold',
                  fontSize: RFValue(15),
                }}>
                Balance Remaining: $
                {item?.is_coupon_applied === 'Y'
                  ? this.calculateRemainingAmount(item)
                  : !!item.remaining_amount
                  ? stringToNumber(item.remaining_amount).toFixed(2)
                  : ' 0 '}
              </Text>
            </View>

            <View
              style={{
                flex: 1,
                paddingLeft: RFValue(10),
                paddingRight: RFValue(10),
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {item.status === 'pending' ? (
                <Button
                  light
                  small
                  onPress={() => {
                    this.setState({
                      selectedOrder: item,
                    });
                    this.alertForRedeem();
                  }}
                  rounded
                  style={{
                    backgroundColor: colors.lightGray,
                  }}>
                  <Text
                    style={{
                      width: '100%',
                      textAlign: 'center',
                      fontSize: RFValue(12),
                      color: 'black',
                      fontWeight: 'bold',
                    }}>
                    Click to Redeem
                  </Text>
                </Button>
              ) : item.status === 'redeemed' ? (
                <Text
                  style={{
                    width: '100%',
                    textAlign: 'center',
                    fontSize: RFValue(15),
                    color: 'black',
                    fontWeight: 'bold',
                  }}>
                  Redeemed
                </Text>
              ) : (
                <Text
                  style={{
                    width: '100%',
                    textAlign: 'center',
                    fontSize: RFValue(15),
                    color: 'black',
                    fontWeight: 'bold',
                  }}>
                  Canceled
                </Text>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: colors.commonBackground,
        }}>
        {/* <ScrollView
          contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}
          style={{marginBottom: 30}}
          keyboardShouldPersistTaps="always">
          <Text
            style={{
              textAlign: 'center',
              color: colors.appTextColor,
              fontFamily:
                Platform.OS === 'android'
                  ? 'digital-7 (italic)'
                  : 'Digital-7Italic',
              fontSize: RFValue(60),
            }}>
            Saved DIBBS
          </Text>
        </ScrollView> */}
        <View style={{flex: 1}}>
          <AlertComponent
            alertProps={this.state.alertProps}
            setModalVisible={this.setAlertModalVisible}
            onLeftBtnClick={() => {
              this.setAlertModalVisible(false);
            }}
            onRightBtnClick={() => {
              this.setAlertModalVisible(false);

              if (this.state.alertProps.alertType === AlertTypesEnum.Redeem) {
                this.showRedeemAlertModal(
                  'Redeem Deal',
                  'This can only be redeem one time so make sure to use it when you are ready',
                  AlertTypesEnum.Redeem,
                  true,
                  'Go Back',
                  false,
                  true,
                  'Redeem',
                  false,
                  colors.lightGray,
                  colors.lightGray,
                );
              }
            }}
            width={w(85)}
          />

          <RedeemAlertComponent
            alertProps={this.state.redeemAlertProps}
            setModalVisible={this.setRedeemAlertModalVisible}
            setRedeemCode={this.setRedeemAlertRedeemCode}
            onLeftBtnClick={() => {
              this.setRedeemAlertModalVisible(false);
            }}
            onRightBtnClick={() => {
              if (
                this.state.redeemAlertProps.alertType === AlertTypesEnum.Redeem
              ) {
                this.props.redeemOrder(
                  this.state.selectedOrder.order_id,
                  this.state.redeemAlertProps.redeemCode,
                );
              }

              this.setRedeemAlertModalVisible(false);
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
            headingTitle={strings.myOrder}
            titleAlignment={'flex-start'}
            iconR1={'md-person'}
            iconR1Color={colors.appPurple}
            onIconR1Press={() => {
              goBack(this.props.navigation);
            }}
            // iconR2={'md-share'}
            // iconR2Color={colors.appPurple}
            // onIconR2Press={() => {
            //   onShare({
            //     title: '',
            //     msg: 'http://thedibbsapp.com/',
            //     url: '',
            //   });
            // }}
          />

          <View style={{flex: 1}}>
            {!this.props.isFetchingMyOrders &&
              this.state.filteredData.length === 0 && (
                <View
                  style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        flexDirection: 'column',
                      }}>
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        {/* <View
                          style={{
                            width: h(10),
                            height: h(10),
                            backgroundColor: 'white',
                            borderRadius: 100,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Ionicons name="heart" color="#502a7e" size={h(7)} />
                        </View> */}
                      </View>
                      <View
                        style={{
                          justifyContent: 'center',
                          borderColor: 'transparent',
                          marginTop: h(3),
                        }}>
                        <Text
                          style={{fontSize: RFValue(22), fontWeight: 'bold'}}>
                          You haven't Placed any order yet
                        </Text>
                      </View>
                      {/* <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderColor: 'transparent',
                        }}>
                        <Text style={{fontSize: RFValue(12), color: 'grey'}}>
                          Tap the heart icon to add any deals
                        </Text>
                      </View> */}

                      {/* <Button
                        light
                        onPress={() => {
                          navigate(this.props.navigation, TabScreenNames.Deals);
                        }}
                        rounded
                        style={{
                          justifyContent: 'center',
                          marginTop: h(2),
                          backgroundColor: colors.lightGray,
                          height: h(6.5),
                          width: '50%',
                          alignSelf: 'center',
                        }}>
                        <Text
                          style={{
                            width: '100%',
                            textAlign: 'center',
                            fontSize: RFValue(15),
                            color: 'black',
                            fontWeight: 'bold',
                          }}>
                          Browse
                        </Text>
                      </Button> */}
                    </View>
                  </View>
                </View>
              )}

            {this.state.filteredData.length > 0 && (
              <FlatList
                data={this.state.filteredData}
                horizontal={false}
                style={{marginTop: h(2), marginBottom: h(2)}}
                renderItem={({item, index}) => this.renderCellItem(item, index)}
                keyExtractor={(item, index) => {
                  return 'OrderList:' + index;
                }}
                keyboardShouldPersistTaps="always"
                refreshControl={
                  <RefreshControl
                    tintColor={colors.appPurple}
                    title={'Refreshing...'}
                    titleColor={colors.appPurple}
                    refreshing={this.props.isFetchingMyOrders}
                    onRefresh={this.onRefresh}
                  />
                }
              />
            )}
          </View>
        </View>

        <FullScreenLoader
          title={titles.fullScreenLoaderTitle}
          loading={
            this.props.isFetchingMyOrders || this.props.isSubmittingRedeemOrder
          }
        />
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const {appName} = state.authReducer;

  const {
    isFetchingMyOrders,
    myOrders,
    myOrdersError,
    isSubmittingRedeemOrder,
    isOrderRedeemed,
    redeemOrdersError,
  } = state.cartReducer;

  return {
    appName,
    isFetchingMyOrders,
    myOrders,
    myOrdersError,
    isSubmittingRedeemOrder,
    isOrderRedeemed,
    redeemOrdersError,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    getMyOrders: () => dispatch(getMyOrders()),
    redeemOrder: (orderId, redeemCode) =>
      dispatch(redeemOrder(orderId, redeemCode)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyOrdersScreen);
