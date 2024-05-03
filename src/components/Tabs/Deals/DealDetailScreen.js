import React, { Component } from 'react';
import { Linking, ScrollView, Text, View } from 'react-native';
import { height as h, width as w } from 'react-native-dimension';
import { Card } from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import { createImageProgress } from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Circle';
import { RFValue } from 'react-native-responsive-fontsize';
import { SafeAreaView } from 'react-native-safe-area-context';
import { connect } from 'react-redux';
import { APP_CONSTANTS } from '../../../constants/APIs';
import AlertComponent from '../../../helpers/AlertComponent';
import colors from '../../../helpers/colors';
import { AlertTypesEnum } from '../../../helpers/enum';
import HeaderBackCompoenent from '../../../helpers/HeaderBackCompoenent';
import { backImage } from '../../../helpers/Images';
const Image = createImageProgress(FastImage);

class DealDetailScreen extends Component {
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

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.commonBackground }}>
        <View
          style={{
            flex: 1,
            backgroundColor: colors.commonBackground,
            alignItems: 'center',
          }}>
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
            headingTitle={'Detail'}
            titleAlignment={'flex-start'}
          />

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
                {!!this.state.productDetails &&
                  !!this.state.productDetails.product &&
                  !!this.state.productDetails.product.prodData.store_info && (
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
                      {!!this.state.productDetails &&
                        !!this.state.productDetails.product &&
                        !!this.state.productDetails.product.prodData.images &&
                        this.state.productDetails.product.prodData.images
                          .length > 0 && (
                          <Image
                            source={{
                              uri: this.state.productDetails.product.prodData
                                .images[0].image_full
                            }}
                            indicator={ProgressBar}
                            style={{
                              width: '100%',
                              height: h(20),
                            }}
                            imageStyle={{
                              backgroundColor: '#281656',
                              // borderBottomLeftRadius: h(7),
                              // borderBottomRightRadius: h(7),
                              resizeMode: 'cover',
                            }}
                          />
                        )}

                      <Text
                        style={{
                          fontWeight: 'bold',
                          fontSize: 20,
                          letterSpacing: 1,
                          color: colors.appPurple,
                          textTransform: 'capitalize',
                          fontSize: RFValue(20),
                        }}>
                        {!!this.state.productDetails &&
                          !!this.state.productDetails.product &&
                          !!this.state.productDetails.product.prodData.store_info
                            .store_name
                          ? this.state.productDetails.product.prodData
                            .store_info.store_name
                          : ' - '}
                      </Text>

                      <Text
                        style={{
                          color: 'black',
                          fontSize: RFValue(17),
                          marginTop: RFValue(10),
                        }}>
                        {!!this.state.productDetails &&
                          !!this.state.productDetails.product &&
                          !!this.state.productDetails.product.prodData.store_info
                            .address
                          ? this.state.productDetails.product.prodData
                            .store_info.address
                          : ' - '}
                      </Text>

                      {!!this.state.productDetails &&
                        !!this.state.productDetails.product &&
                        !!this.state.productDetails.product.prodData.store_info
                          .phone && (
                          <View>
                            <Text
                              style={{
                                fontWeight: 'bold',
                                fontSize: 20,
                                letterSpacing: 1,
                                color: colors.appPurple,
                                textTransform: 'capitalize',
                                fontSize: RFValue(20),
                                marginTop: RFValue(10),
                              }}>
                              Phone
                            </Text>

                            <Text
                              style={{
                                color: 'black',
                                fontSize: RFValue(17),
                                marginTop: RFValue(2),
                              }}>
                              {
                                this.state.productDetails.product.prodData
                                  .store_info.phone
                              }
                            </Text>
                          </View>
                        )}

                      {!!this.state.productDetails &&
                        !!this.state.productDetails.variations &&
                        !!this.state.productDetails.variations.name && (
                          <View>
                            <Text
                              style={{
                                fontWeight: 'bold',
                                fontSize: 20,
                                letterSpacing: 1,
                                color: colors.appPurple,
                                textTransform: 'capitalize',
                                fontSize: RFValue(20),
                                marginTop: RFValue(10),
                              }}>
                              Your Dibbs Deal
                            </Text>

                            <Text
                              style={{
                                color: 'black',
                                fontSize: RFValue(17),
                                marginTop: RFValue(2),
                              }}>
                              {this.state.productDetails.variations.name}
                            </Text>
                          </View>
                        )}
                    </Card>
                  )}

                {!!this.state.productDetails &&
                  !!this.state.productDetails.product &&
                  !!this.state.productDetails.product.prodData.description && (
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
                        {!!this.state.productDetails.product.prodData
                          .description
                          ? this.state.productDetails.product.prodData
                            .description
                          : '-'}
                      </Text>
                    </Card>
                  )}

                {!!this.state.productDetails &&
                  !!this.state.productDetails.product &&
                  (!!this.state.productDetails.product.prodData
                    .purchase_valid ||
                    !!this.state.productDetails.product.prodData.appointment ||
                    !!this.state.productDetails.product.prodData
                      .per_person_purchase ||
                    !!this.state.productDetails.product.prodData
                      .return_policy ||
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

                      {!!this.state.productDetails.product.prodData
                        .purchase_valid ? (
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
                              this.state.productDetails.product.prodData
                                .purchase_valid +
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

                      {(!!this.state.productDetails.product.prodData
                        .appointment ||
                        true) && (
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
                              {!!this.state.productDetails.product.prodData
                                .appointment &&
                                this.state.productDetails.product.prodData
                                  .appointment === 'Y'
                                ? 'Yes it is required'
                                : 'No, it is not required'}
                              .
                            </Text>
                          </View>
                        )}

                      {!!this.state.productDetails.product.prodData
                        .per_person_purchase && (
                          <View>
                            <Text
                              style={{
                                color: 'black',
                                fontSize: RFValue(17),
                                marginTop: RFValue(20),
                              }}>
                              Is there a limit to how many one person can
                              purchase?
                            </Text>
                            <Text
                              style={{
                                color: 'black',
                                fontSize: RFValue(17),
                                fontWeight: 'bold',
                                marginTop: RFValue(3),
                              }}>
                              {
                                this.state.productDetails.product.prodData
                                  .per_person_purchase
                              }{' '}
                              per person.
                            </Text>
                          </View>
                        )}

                      {!!this.state.productDetails.product.prodData
                        .return_policy && (
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
                                  this.state.productDetails.product.prodData.return_policy.includes(
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
                                  this.state.productDetails.product.prodData.return_policy.includes(
                                    'http',
                                  )
                                ) {
                                  Linking.openURL(
                                    this.state.productDetails.product.prodData
                                      .return_policy,
                                  );
                                }
                              }}>
                              {
                                this.state.productDetails.product.prodData
                                  .return_policy
                              }
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
                        Once your deal is redeemed it is no longer eligible for
                        a refund. By purchasing this deal you hold Dibbs free of
                        any liability and hold the merchant solely responsible
                        for the advertised goods & services. If the promotional
                        value expires after the purchase, the amount paid on
                        Dibbs never expires and will be applied to your account
                        as Dibbs credit.
                      </Text>
                    </Card>
                  )}
              </View>
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
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
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(DealDetailScreen);
