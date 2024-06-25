import {Button} from 'native-base';
import React, {Component} from 'react';
import {
  Linking,
  SafeAreaView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {height as h, width as w} from 'react-native-dimension';
import {Card} from 'react-native-elements';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import {RFValue} from 'react-native-responsive-fontsize';
import {connect} from 'react-redux';
import {ScreenNames} from '../../../constants/ScreenNames';
import AlertComponent from '../../../helpers/AlertComponent';
import colors from '../../../helpers/colors';
import {AlertTypesEnum} from '../../../helpers/enum';
import HeaderBackCompoenent from '../../../helpers/HeaderBackCompoenent';
import {backImage} from '../../../helpers/Images';
import {
  navigate,
  navigateWithParams,
  stringToNumber,
} from '../../../helpers/Util';

class ProductLocationScreen extends Component {
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
      lat: 0,
      lng: 0,
      selectedVariation: 0,
    };
  }

  componentDidMount() {
    const productDetails = this.props.route.params.productDetails;

    var lat = 37.78825;
    var lng = -122.4324;

    if (!!productDetails.store_info && !!productDetails.store_info.location) {
      var locations = productDetails.store_info.location.split(',');

      lat = stringToNumber(locations[0]);
      lng = stringToNumber(locations[1]);
    }

    console.log('Fahad Lat: ', lat);
    console.log('Fahad Lng: ', lng);

    this.setState({
      productDetails: !!productDetails ? productDetails : {},
      lat: lat,
      lng: lng,
    });
  }

  componentDidUpdate(prevProps) {}

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
    const {productDetails} = this.state;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.commonBackground,
          alignItems: 'center',
        }}>
        <SafeAreaView style={{flex: 1}}>
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
            headingTitle={'Deal Location'}
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
                onPress={() => {
                  navigateWithParams(
                    this.props.navigation,
                    ScreenNames.ProductAboutScreen,
                    {
                      productDetails: productDetails,
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
                onPress={() => {}}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: colors.appPurple,
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

          <View>
            {!!productDetails.store_info &&
              !!productDetails.store_info.address && (
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
                    Address
                  </Text>

                  <Text
                    style={{
                      color: 'black',
                      fontSize: RFValue(17),
                      marginTop: RFValue(10),
                    }}>
                    {!!productDetails.store_info.address
                      ? productDetails.store_info.address
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
              <MapView
                provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                style={{width: '100%', height: h(50)}}
                region={{
                  latitude: this.state.lat,
                  longitude: this.state.lng,
                  latitudeDelta: 0.015,
                  longitudeDelta: 0.015,
                }}>
                <Marker
                  key={0}
                  coordinate={{
                    latitude: this.state.lat,
                    longitude: this.state.lng,
                  }}
                  title={
                    !!productDetails.store_info &&
                    !!productDetails.store_info.store_name
                      ? productDetails.store_info.store_name
                      : 'Store'
                  }
                  description={
                    !!productDetails.store_info &&
                    !!productDetails.store_info.address
                      ? productDetails.store_info.address
                      : '-'
                  }
                />
              </MapView>

              <Button
                light
                small
                onPress={() => {
                  const scheme = Platform.select({
                    ios: 'maps:?q=',
                    android: 'geo:0,0?q=',
                  });

                  const latLng = this.state.productDetails.store_info.location;
                  const label =
                    !!this.state.productDetails.store_info &&
                    !!this.state.productDetails.store_info.store_name
                      ? this.state.productDetails.store_info.store_name
                      : 'Resturant name';

                  const url = Platform.select({
                    ios: `${scheme}${encodeURIComponent(label)}&ll=${latLng}`,
                    android: `${scheme}${latLng}(${label})`,
                  });

                  console.log('Fahad 02: ', url);
                  Linking.openURL(url).catch(err =>
                    console.error('An error occurred', err),
                  );
                }}
                rounded
                style={{
                  backgroundColor: colors.lightGray,
                  marginTop: 20,
                  alignSelf: 'center',
                }}>
                <Text
                  style={{
                    width: '60%',
                    textAlign: 'center',
                    fontSize: RFValue(12),
                    color: 'black',
                    fontWeight: 'bold',
                  }}>
                  Get Directions
                </Text>
              </Button>
            </Card>
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const {appName, appState} = state.authReducer;

  return {
    appName,
    appState,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProductLocationScreen);
