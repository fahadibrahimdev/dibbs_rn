import { Button } from 'native-base';
import React, { Component } from 'react';
import {
  FlatList,
  Linking,
  SafeAreaView,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { height as h, width as w } from 'react-native-dimension';
import { Card } from 'react-native-elements';
import { RFValue } from 'react-native-responsive-fontsize';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { ScreenNames } from '../../../constants/ScreenNames';
import AlertComponent from '../../../helpers/AlertComponent';
import colors from '../../../helpers/colors';
import { AlertTypesEnum, CartUpdateActionEnum } from '../../../helpers/enum';
import HeaderBackCompoenent from '../../../helpers/HeaderBackCompoenent';
import { backImage } from '../../../helpers/Images';
import {
  navigate,
  navigateWithParams,
  stringToNumber,
} from '../../../helpers/Util';
import { addRemoveProductInCart } from '../../../redux/actions/cartActions';

class ProductAboutScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
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

      productDetails: {},
      selectedVariation: 0,
    };
  }

  componentDidMount() {
    const productDetails = this.props.route.params.productDetails;

    this.setState({ productDetails: !!productDetails ? productDetails : {} });
  }

  componentDidUpdate(prevProps) { }

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

  renderCellIntervalModeItem = (item, index) => {
    return (
      <View
        style={{
          marginLeft: h(1),
          paddingBottom: h(2),
        }}>
        <TouchableOpacity
          style={{ flexDirection: 'row' }}
          onPress={() => {
            this.setState({ selectedVariation: index });
          }}>
          <Ionicons
            name={
              index === this.state.selectedVariation
                ? 'md-radio-button-on'
                : 'md-radio-button-off'
            }
            size={h(3)}
            color={colors.black}
          />

          <View style={{ flex: 1, marginLeft: w(2) }}>
            <Text style={{ textTransform: 'capitalize', fontSize: RFValue(17) }}>
              {item.name}
            </Text>

            <View
              style={{
                flexDirection: 'row',
                paddingTop: h(1),
                paddingBottom: h(1),
              }}>
              <Text
                style={{
                  color: colors.appPurple,
                  fontWeight: 'bold',
                  fontSize: RFValue(15),
                }}>
                ${stringToNumber(item.price - item.discount).toFixed(2)}
              </Text>

              {Math.floor((item.discount / item.price) * 100).toFixed(0) !=
                0 && (
                  <Text
                    style={{
                      color: 'black',
                      textDecorationLine: 'line-through',
                      marginLeft: h(2),
                      fontSize: RFValue(15),
                    }}>
                    ${stringToNumber(item.price).toFixed(2)}
                  </Text>
                )}

              {Math.floor((item.discount / item.price) * 100).toFixed(0) !=
                0 && (
                  <View
                    style={{
                      width: w(25),
                      borderRadius: h(50),
                      marginLeft: h(2),
                      backgroundColor: colors.appGray,
                    }}>
                    <Text
                      style={{
                        textAlign: 'center',
                        color: colors.appPurple,
                        fontSize: RFValue(15),
                      }}>
                      {Math.floor((item.discount / item.price) * 100).toFixed(0)}%
                      off
                    </Text>
                  </View>
                )}
            </View>
          </View>
        </TouchableOpacity>

        <View
          style={{
            width: '100%',
            borderBottomColor: colors.lightGray,
            borderBottomWidth: 0.4,
          }}></View>
      </View>
    );
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.commonBackground,
          alignItems: 'center',
        }}>
        <SafeAreaView style={{ flex: 1 }}>
          <AlertComponent
            alertProps={this.state.alertProps}
            setModalVisible={this.setAlertModalVisible}
            onLeftBtnClick={() => {
              this.setAlertModalVisible(false);
            }}
            onRightBtnClick={() => {
              if (this.state.alertProps.alertType === AlertTypesEnum.Logout) {
                this.props.logout();
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
            headingTitle={'About This Deal'}
            titleAlignment={'flex-start'}
            iconR1={'md-cart'}
            iconR1Color={colors.appPurple}
            onIconR1Press={() => {
              navigate(this.props.navigation, ScreenNames.CartScreen);
            }}
          // iconR2={'md-share'}
          // iconR2Color={colors.appPurple}
          // onIconR2Press={() => {
          //   this.onShare('', 'http://thedibbsapp.com/', '');
          // }}
          />

          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                flex: 0.33,
                // backgroundColor: '#901920'
              }}>
              <TouchableOpacity
                style={{
                  // padding: 5,
                  paddingTop: 5,
                  paddingBottom: 2,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => {
                  // goBack(this.props.navigation);
                  navigate(
                    this.props.navigation,
                    ScreenNames.ProductDetailScreen,
                  );
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: '#877a9b',
                    fontWeight: 'bold',
                    fontSize: RFValue(17),
                  }}>
                  Deals
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flex: 0.33,
                // backgroundColor: '#786920'
              }}>
              <TouchableOpacity
                style={{
                  // padding: 5,
                  paddingTop: 5,
                  paddingBottom: 2,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => { }}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: colors.appPurple,
                    fontWeight: 'bold',
                    fontSize: RFValue(17),
                  }}>
                  About
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flex: 0.33,
                // backgroundColor: '#189920'
              }}>
              <TouchableOpacity
                style={{
                  // padding: 5,
                  paddingTop: 5,
                  paddingBottom: 2,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => {
                  navigateWithParams(
                    this.props.navigation,
                    ScreenNames.ProductLocationScreen,
                    {
                      productDetails: this.state.productDetails,
                    },
                  );
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: '#877a9b',
                    fontWeight: 'bold',
                    fontSize: RFValue(17),
                  }}>
                  Location
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{
              height: 1,
              width: w(90),
              marginTop: h(0),
              marginLeft: w(5),
              marginRight: w(5),
              backgroundColor: colors.black,
            }}></View>

          {!!this.state.productDetails &&
            !!this.state.productDetails.varData &&
            this.state.productDetails.varData.length > 0 ? (
            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
              <ScrollView
                style={{ flex: 1, marginBottom: RFValue(10) }}
                // style={{maxHeight: h(12)}}
                showsVerticalScrollIndicator={true}>
                <View
                  style={{
                    width: w(100),
                    alignItems: 'center',
                    paddingBottom: RFValue(30),
                  }}>
                  {!!this.state.productDetails.store_info && (
                    <Card
                      containerStyle={{
                        width: '90%',
                        backgroundColor: colors.white,
                        padding: 10,
                        marginTop: 15,
                        elevation: 20,
                        cardMaxElevation: 20,
                        borderRadius: 10,
                      }}>
                      <Text
                        style={{
                          fontWeight: 'bold',
                          fontSize: 20,
                          letterSpacing: 1,
                          color: colors.appPurple,
                          textTransform: 'capitalize',
                          fontSize: RFValue(20),
                        }}>
                        {!!this.state.productDetails.store_info.store_name
                          ? this.state.productDetails.store_info.store_name
                          : ' - '}
                      </Text>

                      <Text
                        style={{
                          color: 'black',
                          fontSize: RFValue(17),
                          marginTop: RFValue(10),
                        }}>
                        {!!this.state.productDetails.store_info.address
                          ? this.state.productDetails.store_info.address
                          : ' - '}
                        {/* asdf asdf a sdf as dfa sdf as df asdf gerw r fw er fw erf werf wer f wrg wtr ge rtg ert be rtb e,asdf asdf a sdf as dfa sdf as df asdf gerw r fw er fw erf werf wer f wrg wtr ge rtg ert be rtb e,asdf asdf a sdf as dfa sdf as df asdf gerw r fw er fw erf werf wer f wrg wtr ge rtg ert be rtb e */}
                      </Text>
                    </Card>
                  )}

                  <Card
                    containerStyle={{
                      width: '90%',
                      backgroundColor: colors.white,
                      padding: 10,
                      marginTop: 15,
                      elevation: 20,
                      cardMaxElevation: 20,
                      borderRadius: 10,
                    }}>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        fontSize: 20,
                        letterSpacing: 1,
                        color: colors.appPurple,
                        textTransform: 'capitalize',
                        fontSize: RFValue(20),
                      }}>
                      Available Deals
                    </Text>
                    <Text style={{ color: 'black', fontSize: RFValue(17) }}>
                      Choose between option(s){' '}
                    </Text>

                    {/* <View
            style={{
              width: '100%',
              height: 1,
              marginTop: h(0),
              backgroundColor: colors.black,
            }}></View> */}

                    <FlatList
                      nestedScrollEnabled={true}
                      style={{
                        maxHeight: h(30),
                        marginTop: h(2),
                        marginBottom: h(2),
                      }}
                      data={this.state.productDetails.varData}
                      horizontal={false}
                      renderItem={({ item, index }) =>
                        this.renderCellIntervalModeItem(item, index)
                      }
                      keyExtractor={(item, index) => item}
                      keyboardShouldPersistTaps="always"
                      contentContainerStyle={{
                        flexGrow: 1,
                      }}
                    />
                    {/* <View
            style={{
              marginTop: h(1),
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              onPress={() => Linking.openURL(`tel:${'+1362849864'}`)}
              activeOpacity={1}
              style={{
                marginRight: w(2),
                marginLeft: w(2),
                borderRadius: w(20),
                width: w(15),
                alignItems: 'center',
                justifyContent: 'center',
                height: w(15),
                backgroundColor: colors.white,
                elevation: 0.5,

                shadowOpacity: 0.4,
                shadowRadius: 2,
                shadowOffset: {
                  height: 1,
                  width: 1,
                },
              }}>
              <Icon
                active
                name="md-call"
                style={{fontSize: RFValue(20), color: '#9584b7'}}
              />
              <Text style={{fontSize: RFValue(8), color: '#9584b7'}}>
                Call now
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                const scheme = Platform.select({
                  ios: 'maps:0,0?q=',
                  android: 'geo:0,0?q=',
                });
                const latLng = `40.7580,73.9855`;
                const label = 'Custom Label';
                const url = Platform.select({
                  ios: `${scheme}${label}@${latLng}`,
                  android: `${scheme}${latLng}(${label})`,
                });

                Linking.openURL(url);
              }}
              activeOpacity={1}
              style={{
                marginRight: w(2),
                marginLeft: w(2),
                borderRadius: w(20),
                width: w(15),
                alignItems: 'center',
                justifyContent: 'center',
                height: w(15),
                backgroundColor: colors.white,
                elevation: 0.5,

                shadowOpacity: 0.4,
                shadowRadius: 2,
                shadowOffset: {
                  height: 1,
                  width: 1,
                },
              }}>
              <Icon
                active
                name="md-paper-plane"
                style={{fontSize: RFValue(20), color: '#9584b7'}}
              />
              <Text style={{fontSize: RFValue(8), color: '#9584b7'}}>
                Direction
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => Linking.openURL('http://thedibbsapp.com/')}
              activeOpacity={1}
              style={{
                marginRight: w(2),
                marginLeft: w(2),
                borderRadius: w(20),
                width: w(15),
                alignItems: 'center',
                justifyContent: 'center',
                height: w(15),
                backgroundColor: colors.white,
                elevation: 0.5,

                shadowOpacity: 0.4,
                shadowRadius: 2,
                shadowOffset: {
                  height: 1,
                  width: 1,
                },
              }}>
              <Icon
                active
                name="md-globe"
                style={{fontSize: RFValue(20), color: '#9584b7'}}
              />
              <Text style={{fontSize: RFValue(8), color: '#9584b7'}}>
                Website
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                this.setState({visibleModalTime: true});
              }}
              activeOpacity={1}
              style={{
                marginRight: w(2),
                marginLeft: w(2),
                borderRadius: w(20),
                width: w(15),
                alignItems: 'center',
                justifyContent: 'center',
                height: w(15),
                backgroundColor: colors.white,
                elevation: 0.5,

                shadowOpacity: 0.4,
                shadowRadius: 2,
                shadowOffset: {
                  height: 1,
                  width: 1,
                },
              }}>
              <Icon
                active
                name="md-timer"
                style={{fontSize: RFValue(20), color: '#9584b7'}}
              />
              <Text style={{fontSize: RFValue(8), color: '#9584b7'}}>
                8am-10pm
              </Text>
            </TouchableOpacity>
          </View> */}
                  </Card>

                  {!!this.state.productDetails.description && (
                    <Card
                      containerStyle={{
                        width: '90%',
                        backgroundColor: colors.white,
                        padding: 10,
                        marginTop: 15,
                        elevation: 20,
                        cardMaxElevation: 20,
                        borderRadius: 10,
                      }}>
                      <Text
                        style={{
                          fontWeight: 'bold',
                          fontSize: 20,
                          letterSpacing: 1,
                          color: colors.appPurple,
                          textTransform: 'capitalize',
                          fontSize: RFValue(20),
                        }}>
                        Description
                      </Text>

                      <Text
                        style={{
                          color: 'black',
                          fontSize: RFValue(17),
                          marginTop: RFValue(20),
                        }}>
                        {!!this.state.productDetails.description
                          ? this.state.productDetails.description
                          : '-'}
                        {/* asdf asdf a sdf as dfa sdf as df asdf gerw r fw er fw erf werf wer f wrg wtr ge rtg ert be rtb e,asdf asdf a sdf as dfa sdf as df asdf gerw r fw er fw erf werf wer f wrg wtr ge rtg ert be rtb e,asdf asdf a sdf as dfa sdf as df asdf gerw r fw er fw erf werf wer f wrg wtr ge rtg ert be rtb e */}
                      </Text>
                    </Card>
                  )}

                  {(!!this.state.productDetails.purchase_valid ||
                    !!this.state.productDetails.appointment ||
                    !!this.state.productDetails.per_person_purchase ||
                    !!this.state.productDetails.return_policy ||
                    true) && (
                      <Card
                        containerStyle={{
                          width: '90%',
                          backgroundColor: colors.white,
                          padding: 10,
                          marginTop: 15,
                          elevation: 20,
                          cardMaxElevation: 20,
                          borderRadius: 10,
                        }}>
                        <Text
                          style={{
                            fontWeight: 'bold',
                            fontSize: 20,
                            letterSpacing: 1,
                            color: colors.appPurple,
                            textTransform: 'capitalize',
                            fontSize: RFValue(20),
                          }}>
                          What You Need To Know
                        </Text>

                        {!!this.state.productDetails.purchase_valid ? (
                          <View>
                            <Text
                              style={{
                                color: 'black',
                                fontSize: RFValue(17),
                                marginTop: RFValue(20),
                              }}>
                              How long is this deal valid for after purchase?
                            </Text>
                            <Text
                              style={{
                                color: 'black',
                                fontSize: RFValue(17),
                                fontWeight: 'bold',
                                marginTop: RFValue(3),
                              }}>
                              {'Valid For ' +
                                this.state.productDetails.purchase_valid +
                                ' Days After Purchase.'}
                            </Text>
                          </View>
                        ) : (
                          <View>
                            <Text
                              style={{
                                color: 'black',
                                fontSize: RFValue(17),
                                marginTop: RFValue(20),
                              }}>
                              How long is this deal valid for after purchase?
                            </Text>
                            <Text
                              style={{
                                color: 'black',
                                fontSize: RFValue(17),
                                fontWeight: 'bold',
                                marginTop: RFValue(3),
                              }}>
                              {'Valid For 180 Days After Purchase.'}
                            </Text>
                          </View>
                        )}

                        {(!!this.state.productDetails.appointment || true) && (
                          <View>
                            <Text
                              style={{
                                color: 'black',
                                fontSize: RFValue(17),
                                marginTop: RFValue(20),
                              }}>
                              Is a reservation or appointed required?
                            </Text>

                            <Text
                              style={{
                                color: 'black',
                                fontSize: RFValue(17),
                                fontWeight: 'bold',
                                marginTop: RFValue(3),
                              }}>
                              {!!this.state.productDetails.appointment &&
                                this.state.productDetails.appointment === 'Y'
                                ? 'Yes it is required'
                                : 'No, it is not required'}
                              .
                            </Text>
                          </View>
                        )}

                        {!!this.state.productDetails.per_person_purchase && (
                          <View>
                            <Text
                              style={{
                                color: 'black',
                                fontSize: RFValue(17),
                                marginTop: RFValue(20),
                              }}>
                              Is there a limit to how many one person can purchase?
                            </Text>
                            <Text
                              style={{
                                color: 'black',
                                fontSize: RFValue(17),
                                fontWeight: 'bold',
                                marginTop: RFValue(3),
                              }}>
                              {this.state.productDetails.per_person_purchase} per
                              person.
                            </Text>
                          </View>
                        )}

                        {!!this.state.productDetails.return_policy && (
                          <View>
                            <Text
                              style={{
                                color: 'black',
                                fontSize: RFValue(17),
                                marginTop: RFValue(20),
                              }}>
                              What is your return policy?
                            </Text>

                            <Text
                              style={{
                                color:
                                  this.state.productDetails.return_policy.includes(
                                    'http',
                                  )
                                    ? '#0645AD'
                                    : 'black',
                                fontSize: RFValue(17),

                                fontWeight: 'bold',
                                marginTop: RFValue(3),
                              }}
                              onPress={() => {
                                if (
                                  this.state.productDetails.return_policy.includes(
                                    'http',
                                  )
                                ) {
                                  Linking.openURL(
                                    this.state.productDetails.return_policy,
                                  );
                                }
                              }}>
                              {this.state.productDetails.return_policy}
                            </Text>
                          </View>
                        )}

                        <Text
                          style={{
                            color: 'black',
                            fontWeight: 'bold',
                            fontSize: RFValue(15),
                            marginTop: RFValue(20),
                          }}>
                          Once your deal is redeemed it is no longer eligible for a
                          refund. By purchasing this deal you hold Dibbs free of any
                          liability and hold the merchant solely responsible for the
                          advertised goods & services. If the promotional value
                          expires after the purchase, the amount paid on Dibbs never
                          expires and will be applied to your account as Dibbs
                          credit.
                        </Text>
                      </Card>
                    )}
                </View>
              </ScrollView>

              <Button
                light
                onPress={() => {
                  this.props.addRemoveProductInCart(
                    this.state.productDetails.varData[
                    this.state.selectedVariation
                    ],
                    this.state.productDetails,
                    CartUpdateActionEnum.Add,
                  );
                }}
                rounded
                style={{
                  justifyContent: 'center',
                  marginBottom: RFValue(10),

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
                  DIBBS
                </Text>
              </Button>
            </View>
          ) : (
            <View
              style={{
                flex: 1,
                width: w(100),
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{ fontSize: RFValue(22), fontWeight: 'bold' }}>
                No options available now
              </Text>
            </View>
          )}
        </SafeAreaView>
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { appName, appState } = state.authReducer;

  return {
    appName,
    appState,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
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

export default connect(mapStateToProps, mapDispatchToProps)(ProductAboutScreen);
