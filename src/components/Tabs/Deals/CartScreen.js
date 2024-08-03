import {Button} from 'native-base';
import React, {Component} from 'react';
import {
  Alert,
  FlatList,
  Image as Image_ReactNative,
  Keyboard,
  SafeAreaView,
  ScrollView,
  Share,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {height as h, width as w} from 'react-native-dimension';
import FastImage from 'react-native-fast-image';
import {createImageProgress} from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Circle';
import {RFValue} from 'react-native-responsive-fontsize';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';
import {APP_CONSTANTS} from '../../../constants/APIs';
import {strings, titles} from '../../../constants/Localization';
import {ScreenNames, TabScreenNames} from '../../../constants/ScreenNames';
import IncrementDecrementButton from '../../../CustomComponents/IncrementDecrementButton';
import AlertComponent from '../../../helpers/AlertComponent';
import colors from '../../../helpers/colors';
import {AlertTypesEnum, CartUpdateActionEnum} from '../../../helpers/enum';
import HeaderBackCompoenent from '../../../helpers/HeaderBackCompoenent';
import {backImage, dibbsLogo} from '../../../helpers/Images';
import {
  navigate,
  navigateWithParams,
  stringToNumber,
} from '../../../helpers/Util';
import {addRemoveProductInCart} from '../../../redux/actions/cartActions';
import {
  getMySavedProducts,
  removeProduct,
} from '../../../redux/actions/productActions';
const Image = createImageProgress(FastImage);

class CartScreen extends Component {
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

    filteredData: [],

    coupon: '',

    parentDealDetailFun: null,
  };

  componentDidMount() {
    const parentDealDetailFun =
      !!this.props.route.params && !!this.props.route.params.setProductDetail
        ? this.props.route.params.setProductDetail
        : null;

    if (!!parentDealDetailFun) {
      this.setState({
        parentDealDetailFun: parentDealDetailFun,
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.mySavedProducts.length !== prevProps.mySavedProducts.length
    ) {
      this.setState({
        filteredData: this.props.mySavedProducts,
      });
    }

    if (
      this.props.productDeletedSuccessfully !==
        prevProps.productDeletedSuccessfully &&
      this.props.productDeletedSuccessfully === true
    ) {
      this.onRefresh();
    }
  }

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

  renderCellItem = (item, index) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigateWithParams(
            this.props.navigation,
            ScreenNames.ProductDetailScreen,
            {productDetails: item.productDetails},
          );

          // this.props.navigation.goBack(null);
          // this.state.parentDealDetailFun(item.productDetails, true);
        }}
        activeOpacity={0.9}>
        <View
          style={{
            width: '90%',
            height: h(22),
            alignSelf: 'center',
            marginTop: h(2),
            borderRadius: h(2),
            borderColor: colors.black,
            borderWidth: 0.5,
            elevation: h(2),
            backgroundColor: colors.white,
          }}
          activeOpacity={0.8}
          onPress={() => {}}>
          <View style={{width: '100%', height: '100%', flexDirection: 'row'}}>
            <View
              style={{
                flex: 0.3,
                borderTopLeftRadius: h(2),
                borderBottomLeftRadius: h(2),
                backgroundColor: '#115588',
                padding: 0.5,
              }}>
              {!!item.productDetails.images &&
              item.productDetails.images.length > 0 ? (
                <Image
                  source={{
                    uri: item.productDetails.images[0].image_full,
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
                flex: 0.7,
                borderTopRightRadius: h(2),
                borderBottomRightRadius: h(2),
                paddingLeft: h(2),
                paddingRight: h(0),
                // backgroundColor: "#106545"
              }}>
              <View style={{flex: 1}}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontWeight: '400',
                    fontSize: RFValue(22),
                    marginTop: h(0.5),
                    color: '#22044e',
                    textTransform: 'capitalize',
                  }}>
                  {item.productDetails.product_name}
                </Text>

                <Text
                  numberOfLines={1}
                  style={{color: 'black', fontSize: RFValue(16)}}>
                  {!!item.name ? item.name : ' - '}
                </Text>

                <View
                  style={{
                    flex: 1,
                    marginTop: h(1),
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    <Text
                      style={{
                        color: colors.appPurple,
                        fontWeight: 'bold',
                        fontSize: RFValue(15),
                      }}>
                      ${stringToNumber(item.price - item.discount).toFixed(2)}
                    </Text>

                    {Math.floor((item.discount / item.price) * 100).toFixed(
                      0,
                    ) != 0 && (
                      <Text
                        style={{
                          color: 'black',
                          textDecorationLine: 'line-through',
                          marginLeft: h(1),
                          fontSize: RFValue(15),
                        }}>
                        ${stringToNumber(item.price).toFixed(2)}
                      </Text>
                    )}
                  </View>

                  <View
                    style={{
                      alignSelf: 'flex-end',
                      marginTop: RFValue(10),
                      marginRight: RFValue(20),
                    }}>
                    {Math.floor((item.discount / item.price) * 100).toFixed(
                      0,
                    ) != 0 && (
                      <View
                        style={{
                          width: w(22),

                          borderRadius: h(50),
                          backgroundColor: colors.appGray,
                          marginLeft: RFValue(5),
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            textAlign: 'center',
                            color: colors.appPurple,
                            fontSize: RFValue(15),
                          }}>
                          {Math.floor(
                            (item.discount / item.price) * 100,
                          ).toFixed(0)}
                          % off
                        </Text>
                      </View>
                    )}
                  </View>

                  <View
                    style={{
                      flex: 1,
                      paddingLeft: RFValue(4),
                      paddingRight: RFValue(4),
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <IncrementDecrementButton
                      currentValue={item.currentCount}
                      buttonColor={colors.appPurple}
                      decrementPressed={() => {
                        this.props.addRemoveProductInCart(
                          item,
                          item.productDetails,
                          CartUpdateActionEnum.Remove,
                          this.state.coupon,
                        );
                      }}
                      incrementPressed={() => {
                        this.props.addRemoveProductInCart(
                          item,
                          item.productDetails,
                          CartUpdateActionEnum.Add,
                          this.state.coupon,
                        );
                      }}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  renderEmptyCartUI() {
    return (
      <View style={{flex: 1}}>
        {!this.props.isFetchingMySavedProducts &&
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
                    <View
                      style={{
                        width: h(10),
                        height: h(10),
                        backgroundColor: 'white',
                        borderRadius: 100,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Ionicons
                        name="md-cart"
                        color={colors.black}
                        size={h(7)}
                      />
                    </View>
                  </View>
                  <View
                    style={{
                      justifyContent: 'center',
                      borderColor: 'transparent',
                      marginTop: h(3),
                    }}>
                    <Text
                      style={{
                        fontSize: RFValue(22),
                        fontWeight: 'bold',
                        color: 'black',
                      }}>
                      Empty Shopping Cart
                    </Text>
                  </View>
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderColor: 'transparent',
                    }}>
                    <Text style={{fontSize: RFValue(12), color: 'black'}}>
                      Please add some items to your cart
                    </Text>
                  </View>

                  <Button
                    light
                    onPress={() => {
                      navigate(this.props.navigation, ScreenNames.DealsScreen);
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
                      DIBBS DEALS
                    </Text>
                  </Button>
                </View>
              </View>
            </View>
          )}
      </View>
    );
  }

  renderCartSummaryCell(item) {
    <View
      style={{
        justifyContent: 'center',
        marginLeft: h(1),
        borderBottomWidth: 1,
        paddingBottom: h(1.5),
      }}>
      <View
        style={{
          marginTop: h(1),
          marginLeft: h(1),
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
        }}>
        <View
          style={{
            marginLeft: h(2),
          }}>
          <Text
            style={[
              {
                textAlign: 'left',
                fontSize: RFValue(15),
                color: !!item.color ? item.color : colors.appTextColor,
                fontFamily: 'SFProText-Medium',
              },
            ]}
            numberOfLines={1}>
            {item.heading}
          </Text>
        </View>
      </View>
    </View>;
  }

  renderCartInfo() {
    return (
      <View>
        <FlatList
          data={this.props.productsList}
          horizontal={false}
          style={{marginTop: h(2), marginBottom: h(2)}}
          renderItem={({item, index}) => this.renderCellItem(item, index)}
          keyExtractor={(item, index) => item}
          keyboardShouldPersistTaps="always"
          // refreshControl={
          //   <RefreshControl
          //     tintColor={colors.appPurple}
          //     title={'Refreshing...'}
          //     titleColor={colors.appPurple}
          //     refreshing={this.props.isFetchingMySavedProducts}
          //     onRefresh={this.onRefresh}
          //   />
          // }
        />

        <View
          style={{
            paddingTop: h(2),
            paddingBottom: h(2),
            backgroundColor: colors.appGray,
          }}>
          <Text style={{marginLeft: h(3)}}>Order Summary</Text>
        </View>

        <View
          style={{
            justifyContent: 'center',
            // marginLeft: h(1),
            borderBottomWidth: 1,
            paddingBottom: h(0.5),
            backgroundColor: colors.white,
          }}>
          <View
            style={{
              marginTop: h(1),
              marginLeft: h(1),
              flexDirection: 'row',
              alignItems: 'center',
              width: '100%',
            }}>
            <View
              style={{
                marginLeft: h(2),
                flex: 1,
              }}>
              <TextInput
                style={[
                  {
                    width: '90%',
                    paddingTop: RFValue(5),
                    paddingBottom: RFValue(5),
                    fontSize: RFValue(16),
                    marginRight: h(1),
                    color: colors.black,
                  },
                ]}
                autoCapitalize={'characters'}
                value={this.state.coupon}
                maxLength={30}
                onChangeText={text => {
                  this.setState({
                    coupon: text.toUpperCase(),
                  });
                }}
                numberOfLines={1}
                placeholder={'Have a promo code?'}
                placeholderTextColor={colors.graySettled}
                returnKeyType={'done'}
                onSubmitEditing={() => {
                  Keyboard.dismiss();
                }}
              />
            </View>
          </View>
        </View>

        <View
          style={{
            justifyContent: 'center',

            borderBottomWidth: 1,
            paddingBottom: h(1.5),
            backgroundColor: colors.white,
          }}>
          <View
            style={{
              marginTop: h(1),
              marginLeft: h(1),
              flexDirection: 'row',
              alignItems: 'center',
              width: '100%',
            }}>
            <View
              style={{
                flex: 1,
                marginRight: h(2),
                marginLeft: h(2),
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text
                style={[
                  {
                    textAlign: 'left',
                    fontSize: RFValue(15),
                    color: colors.appTextColor,
                    fontWeight: 'bold',
                  },
                ]}
                numberOfLines={1}>
                Total Deals In Cart
              </Text>

              <Text
                style={[
                  {
                    textAlign: 'left',
                    fontSize: RFValue(15),
                    color: colors.appTextColor,
                    fontWeight: 'bold',
                    marginRight: RFValue(10),
                  },
                ]}
                numberOfLines={1}>
                {this.props.productsList.length}
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            justifyContent: 'center',
            // marginLeft: h(1),
            borderBottomWidth: 1,
            paddingBottom: h(1.5),
            backgroundColor: colors.white,
          }}>
          <View
            style={{
              marginTop: h(1),
              marginLeft: h(1),
              flexDirection: 'row',
              alignItems: 'center',
              width: '100%',
            }}>
            <View
              style={{
                flex: 1,
                marginRight: h(2),
                marginLeft: h(2),
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text
                style={[
                  {
                    textAlign: 'left',
                    fontSize: RFValue(15),
                    color: colors.appTextColor,
                    fontWeight: 'bold',
                  },
                ]}
                numberOfLines={1}>
                Total Price Of Deal(s)
              </Text>

              <Text
                style={[
                  {
                    textAlign: 'left',
                    fontSize: RFValue(15),
                    color: colors.appTextColor,
                    fontWeight: 'bold',
                    marginRight: RFValue(10),
                  },
                ]}
                numberOfLines={1}>
                $ {this.props.totalPrice.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            justifyContent: 'center',
            // marginLeft: h(1),
            borderBottomWidth: 1,
            paddingBottom: h(1.5),
            backgroundColor: colors.white,
          }}>
          <View
            style={{
              marginTop: h(1),
              marginLeft: h(1),
              flexDirection: 'row',
              alignItems: 'center',
              width: '100%',
            }}>
            <View
              style={{
                flex: 1,
                marginRight: h(2),
                marginLeft: h(2),
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={[
                    {
                      textAlign: 'left',
                      fontSize: RFValue(18),
                      color: colors.appSelectedTextColor,
                      fontWeight: 'bold',
                    },
                  ]}
                  numberOfLines={1}>
                  Due Today
                </Text>

                <TouchableOpacity
                  style={{
                    height: h(3),
                    width: h(3),
                    backgroundColor: 'white',
                    borderRadius: RFValue(20),
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: w(1),
                  }}
                  onPress={() => {
                    Alert.alert(
                      'Info',
                      'How this works: Claim any deal(s) you want by only paying a small percentage up front. Pay the remaining balance once you’re ready to go to the business and redeem your deal.',

                      [
                        {
                          text: 'OK',
                          onPress: () => {},
                        },
                      ],
                      {cancelable: false},
                    );
                  }}>
                  <Ionicons
                    name="information-circle-outline"
                    size={h(3)}
                    color={colors.appSelectedTextColor}
                  />
                </TouchableOpacity>
              </View>

              <Text
                style={[
                  {
                    textAlign: 'left',
                    fontSize: RFValue(18),
                    color: colors.appSelectedTextColor,
                    fontWeight: 'bold',
                    marginRight: RFValue(10),
                  },
                ]}
                numberOfLines={1}>
                $ {this.props.totalUpFront.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            justifyContent: 'center',
            // marginLeft: h(1),
            borderBottomWidth: 1,
            paddingBottom: h(1.5),
            backgroundColor: colors.white,
          }}>
          <View
            style={{
              marginTop: h(1),
              marginLeft: h(1),
              flexDirection: 'row',
              alignItems: 'center',
              width: '100%',
            }}>
            <View
              style={{
                flex: 1,
                marginRight: h(2),
                marginLeft: h(2),
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={[
                    {
                      textAlign: 'left',
                      fontSize: RFValue(15),
                      color: colors.appTextColor,
                      fontWeight: 'bold',
                    },
                  ]}
                  numberOfLines={1}>
                  Balance Remaining
                </Text>

                <TouchableOpacity
                  style={{
                    height: h(3),
                    width: h(3),
                    backgroundColor: 'white',
                    borderRadius: RFValue(20),
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: w(1),
                  }}
                  onPress={() => {
                    Alert.alert(
                      'Info',
                      'Paid when you go and claim your deal(s)',

                      [
                        {
                          text: 'OK',
                          onPress: () => {},
                        },
                      ],
                      {cancelable: false},
                    );
                  }}>
                  <Ionicons
                    name="information-circle-outline"
                    size={h(3)}
                    color="#000000"
                  />
                </TouchableOpacity>
              </View>

              <Text
                style={[
                  {
                    textAlign: 'left',
                    fontSize: RFValue(15),
                    color: colors.appTextColor,
                    fontWeight: 'bold',
                    marginRight: RFValue(10),
                  },
                ]}
                numberOfLines={1}>
                $ {this.props.totalRemaining.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        <Button
          light
          onPress={() => {
            if (this.props.isAuthenticated) {
              navigateWithParams(
                this.props.navigation,
                ScreenNames.PaymentScreen,
                {coupon: this.state.coupon},
              );
            } else {
              this.showAlertModal(
                'Alert',
                titles.guestUserMsg,
                AlertTypesEnum.GuestUser,
                true,
                'Cancel',
                true,
                true,
                'Login',
                false,
              );
            }
          }}
          rounded
          style={{
            justifyContent: 'center',
            marginTop: h(2),
            backgroundColor: 'rgb(74, 29, 121)',
            height: h(6.5),
            width: '75%',
            alignSelf: 'center',

            elevation: 0.5,

            shadowOpacity: 0.4,
            shadowRadius: 2,
            shadowOffset: {
              height: 1,
              width: 1,
            },
          }}>
          <Text
            style={{
              width: '100%',
              textAlign: 'center',
              fontSize: RFValue(15),
              color: colors.white,
              fontWeight: 'bold',
            }}>
            PROCEED TO PAYMENT
          </Text>
        </Button>

        <View style={{height: RFValue(10)}}></View>
      </View>
    );
  }

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
                navigate(this.props.navigation, TabScreenNames.MyDibbs);
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
            headingTitle={strings.cart}
            titleAlignment={'flex-start'}
            // iconR1={'md-cart'}
            // iconR1Color={colors.black}
            // onIconR1Press={() => {
            //   alert('TODO!');
            // }}
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
              {this.props.productsList.length > 0
                ? this.renderCartInfo()
                : this.renderEmptyCartUI()}
            </View>
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
  } = state.cartReducer;

  return {
    appName,
    isAuthenticated,
    isFetchingMySavedProducts,
    mySavedProducts,
    mySavedProductsError,
    productDeletedSuccessfully,
    isUpdatingCartInfo,
    cartInfoUpdatedSuccessFully,
    productsList,
    coupon,
    totalItems,
    totalUpFront,
    totalRemaining,
    totalPrice,
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CartScreen);
