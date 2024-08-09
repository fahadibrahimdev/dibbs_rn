import moment from 'moment';
import {Button, Icon} from 'native-base';
import React, {Component} from 'react';
import {
  FlatList,
  Image as Image_ReactNative,
  Linking,
  Modal,
  Platform,
  SafeAreaView,
  Share,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import {height as h, width as w} from 'react-native-dimension';
import {Card} from 'react-native-elements';
// import Image from 'react-native-image-progress';

import FastImage from 'react-native-fast-image';
import {createImageProgress} from 'react-native-image-progress';
import ImageSlider from 'react-native-image-slider';
import ProgressBar from 'react-native-progress/Circle';
import {RFValue} from 'react-native-responsive-fontsize';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';
import {titles} from '../../../constants/Localization';
import {ScreenNames, TabScreenNames} from '../../../constants/ScreenNames';
import AlertComponent from '../../../helpers/AlertComponent';
import FullScreenLoader from '../../../helpers/FullScreenLoader';
import HeaderBackCompoenent from '../../../helpers/HeaderBackCompoenent';
import {backImage, dibbsLogo} from '../../../helpers/Images';
import {
  navigate,
  navigateWithParams,
  navigationPOP,
  stringToNumber,
} from '../../../helpers/Util';
import colors from '../../../helpers/colors';
import {
  AlertTypesEnum,
  APP_URLS,
  CartUpdateActionEnum,
} from '../../../helpers/enum';
import {addRemoveProductInCart} from '../../../redux/actions/cartActions';
import {
  removeProduct,
  saveProduct,
} from '../../../redux/actions/productActions';
const Image = createImageProgress(FastImage);

const storeTimmings = [
  {
    key: 0,
    data: 'Sunday: Closed.',
  },
  {
    key: 1,
    data: 'Monday: Closed.',
  },
  {
    key: 2,
    data: 'Tuesday: Closed.',
  },
  {
    key: 3,
    data: 'Wednesday: Closed.',
  },
  {
    key: 4,
    data: 'Thursday: Closed.',
  },
  {
    key: 5,
    data: 'Friday: Closed.',
  },
  {
    key: 6,
    data: 'Saturday: Closed.',
  },
];

class ProductDetailScreen extends Component {
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
      imagesArray: [],
      selectedVariation: 0,
      visibleModalTime: false,

      activeSlide: 0,
    };
  }

  componentDidMount() {
    const productDetails = this.props.route.params.productDetails;

    this.setProductInfo(productDetails);
  }

  setProductInfo(productDetailParam) {
    var imagesArray = [];

    if (!!productDetailParam.images) {
      imagesArray = productDetailParam.images.map(obj => {
        return obj.image_full;
      });
    }

    this.setState({
      productDetails: !!productDetailParam ? productDetailParam : {},
      imagesArray: imagesArray,
    });
  }

  componentDidUpdate(prevProps) {
    if (
      !!this.props.route.params &&
      !!this.props.route.params.productDetails &&
      this.state.productDetails.product_id !==
        this.props.route.params.productDetails.product_id
    ) {
      const productDetails = this.props.route.params.productDetails;

      var imagesArray = [];

      if (!!productDetails.images) {
        imagesArray = productDetails.images.map(obj => {
          return obj.image_full;
        });
      }

      this.setState({
        productDetails: !!productDetails ? productDetails : {},
        imagesArray: imagesArray,
      });
    }

    if (
      this.props.appState !== prevProps.appState
      // && this.props.appState === UserTypeEnum.GUEST
    ) {
      navigationPOP(this.props.navigation, 10);
      //navigate(this.props.navigation, ScreenNames.DealsScreen);
    }

    if (
      this.props.productSavedSuccessfully !==
        prevProps.productSavedSuccessfully &&
      this.props.productSavedSuccessfully === true
    ) {
      var productDetails = this.state.productDetails;
      productDetails.mySavedProduct = 'Y';

      this.setState({
        productDetails: productDetails,
      });
    }

    if (
      this.props.productDeletedSuccessfully !==
        prevProps.productDeletedSuccessfully &&
      this.props.productDeletedSuccessfully === true
    ) {
      var productDetails = this.state.productDetails;
      productDetails.mySavedProduct = 'N';

      this.setState({
        productDetails: productDetails,
      });
    }

    if (this.props.totalPrice !== prevProps.totalPrice) {
      navigateWithParams(this.props.navigation, ScreenNames.CartScreen, {
        setProductDetail: this.setProductInfo.bind(this),
      });
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

  renderModalTime = () => {
    var OldTimeString =
      !!this.state.productDetails.store_info &&
      !!this.state.productDetails.store_info.start_time &&
      !!this.state.productDetails.store_info.end_time
        ? moment(
            this.state.productDetails.store_info.start_time.substring(0, 2),
            'hh',
          ).format('h a') +
          ' - ' +
          moment(
            this.state.productDetails.store_info.end_time.substring(0, 2),
            'hh',
          ).format('h a')
        : '';

    var newStringList = [];

    var newTimeString = 'Closed';

    if (
      !!this.state.productDetails.store_info &&
      !!this.state.productDetails.store_info.store_timings
    ) {
      var timmings = this.state.productDetails.store_info.store_timings;

      for (let i = 0; i <= 6; i++) {
        switch (i) {
          case 0: {
            console.log('Sunday ->');
            newTimeString = 'Sun';

            if (timmings.sun_close === 'N') {
              if (!!timmings.sun_start && !!timmings.sun_end) {
                var startT = moment(
                  timmings.sun_start.substring(0, 5),
                  'hh:mm',
                ).format('hh:mm a');

                var endT = moment(
                  timmings.sun_end.substring(0, 5),
                  'hh:mm A',
                ).format('hh:mm a');

                newTimeString = startT + ' - ' + endT;

                storeTimmings[0].data =
                  'Sunday: ' + startT + ' - ' + endT + '.';
                // storeTimmings[0].data = startT;
              } else {
                newTimeString = 'Closed';
              }
            } else {
              newTimeString = 'Closed';
            }
            break;
          }

          case 1: {
            console.log('Monday ->');
            newTimeString = 'Mon';

            if (timmings.mon_close === 'N') {
              if (!!timmings.mon_start && !!timmings.mon_end) {
                var startT = moment(
                  timmings.mon_start.substring(0, 5),
                  'hh:mm',
                ).format('hh:mm a');

                var endT = moment(
                  timmings.mon_end.substring(0, 5),
                  'hh:mm A',
                ).format('hh:mm a');

                newTimeString = startT + ' - ' + endT;

                storeTimmings[1].data =
                  'Monday: ' + startT + ' - ' + endT + '.';
              } else {
                newTimeString = 'Closed';
              }
            } else {
              newTimeString = 'Closed';
            }
            break;
          }

          case 2: {
            console.log('Tuesday ->');
            newTimeString = 'Tue';

            if (timmings.tue_close === 'N') {
              if (!!timmings.tue_start && !!timmings.tue_end) {
                var startT = moment(
                  timmings.tue_start.substring(0, 5),
                  'hh:mm',
                ).format('hh:mm a');

                var endT = moment(
                  timmings.tue_end.substring(0, 5),
                  'hh:mm A',
                ).format('hh:mm a');

                newTimeString = startT + ' - ' + endT;

                storeTimmings[2].data =
                  'Tuesday: ' + startT + ' - ' + endT + '.';
              } else {
                newTimeString = 'Closed';
              }
            } else {
              newTimeString = 'Closed';
            }
            break;
          }
          case 3: {
            console.log('Wednesday ->');
            newTimeString = 'Wed';

            if (timmings.wed_close === 'N') {
              if (!!timmings.wed_start && !!timmings.wed_end) {
                var startT = moment(
                  timmings.wed_start.substring(0, 5),
                  'hh:mm',
                ).format('hh:mm a');

                var endT = moment(
                  timmings.wed_end.substring(0, 5),
                  'hh:mm A',
                ).format('hh:mm a');

                newTimeString = startT + ' - ' + endT;

                storeTimmings[3].data =
                  'Wednesday: ' + startT + ' - ' + endT + '.';
              } else {
                newTimeString = 'Closed';
              }
            } else {
              newTimeString = 'Closed';
            }
            break;
          }
          case 4: {
            console.log('Thursday ->');
            newTimeString = 'Thu';

            if (timmings.thur_close === 'N') {
              if (!!timmings.thur_start && !!timmings.thur_end) {
                var startT = moment(
                  timmings.thur_start.substring(0, 5),
                  'hh:mm',
                ).format('hh:mm a');

                var endT = moment(
                  timmings.thur_end.substring(0, 5),
                  'hh:mm A',
                ).format('hh:mm a');

                newTimeString = startT + ' - ' + endT;

                storeTimmings[4].data =
                  'Thursday: ' + startT + ' - ' + endT + '.';
              } else {
                newTimeString = 'Closed';
              }
            } else {
              newTimeString = 'Closed';
            }
            break;
          }
          case 5: {
            console.log('Friday ->');
            newTimeString = 'Fri';

            if (timmings.fri_close === 'N') {
              if (!!timmings.fri_start && !!timmings.fri_end) {
                var startT = moment(
                  timmings.fri_start.substring(0, 5),
                  'hh:mm',
                ).format('hh:mm a');

                var endT = moment(
                  timmings.fri_end.substring(0, 5),
                  'hh:mm A',
                ).format('hh:mm a');

                newTimeString = startT + ' - ' + endT;

                storeTimmings[5].data =
                  'Friday: ' + startT + ' - ' + endT + '.';
              } else {
                newTimeString = 'Closed';
              }
            } else {
              newTimeString = 'Closed';
            }

            break;
          }
          case 6: {
            console.log('Saturday ->');
            newTimeString = 'Sat';

            if (timmings.sat_close === 'N') {
              if (!!timmings.sat_start && !!timmings.sat_end) {
                var startT = moment(
                  timmings.sat_start.substring(0, 5),
                  'hh:mm',
                ).format('hh:mm a');

                var endT = moment(
                  timmings.sat_end.substring(0, 5),
                  'hh:mm A',
                ).format('hh:mm a');

                newTimeString = startT + ' - ' + endT;

                storeTimmings[6].data =
                  'Saturday: ' + startT + ' - ' + endT + '.';
              } else {
                newTimeString = 'Closed';
              }
            } else {
              newTimeString = 'Closed';
            }
            break;
          }

          default:
            newTimeString = 'Mon';
            break;
        }
      }
    }

    var newStoreTimmings = '';

    // storeTimmings.map(obj => {
    //   newStoreTimmings = newStoreTimmings + obj.data + '\n';
    // });

    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          backgroundColor: 'rgba(52, 52, 52, 0.4)',
        }}>
        <View
          style={{
            backgroundColor: colors.white,
            borderRadius: 6,
            flexDirection: 'column',
            alignItems: 'center',
            marginRight: w(5),
            marginLeft: w(5),
            paddingBottom: h(1),
          }}>
          <Text
            style={{fontSize: RFValue(25), fontWeight: 'bold', color: 'black'}}>
            {!!this.state.productDetails.store_info &&
            !!this.state.productDetails.store_info.store_name
              ? this.state.productDetails.store_info.store_name
              : 'Resturant name'}
          </Text>
          <Text
            style={{
              color: 'black',
              fontSize: RFValue(13),
              textAlign: 'center',
              marginLeft: RFValue(5),
              marginRight: RFValue(5),
            }}>
            {!!this.state.productDetails.store_info &&
            !!this.state.productDetails.store_info.address
              ? this.state.productDetails.store_info.address
              : '-'}
          </Text>
          <Text
            style={{
              color: 'gray',
              fontSize: RFValue(15),
              textAlign: 'center',
              marginLeft: RFValue(5),
              marginRight: RFValue(5),
            }}>
            {!!this.state.productDetails.store_info &&
            !!this.state.productDetails.store_info.description
              ? this.state.productDetails.store_info.description
              : ' - '}
          </Text>
          <View
            style={{
              width: '80%',
              borderBottomColor: 'black',
              borderBottomWidth: 1,
              marginTop: '5%',
              marginBottom: '5%',
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'flex-start',
              }}>
              <Icon
                name="md-time"
                style={{color: 'gray', fontSize: RFValue(18)}}
              />
              <Text
                style={{
                  fontSize: RFValue(15),
                  fontWeight: 'bold',
                  color: 'black',
                }}>
                Business working hours
              </Text>
            </View>
          </View>

          <View style={{justifyContent: 'flex-start'}}>
            {storeTimmings.map(obj => {
              const mString = obj.data.split(':');
              const mDay = mString[0] + ':';
              const mDuration = obj.data.substring(obj.data.indexOf(':') + 1);
              // const mDuration = mString[1];
              return (
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: RFValue(14),
                      color: 'black',
                    }}>
                    {mDay}
                  </Text>
                  <Text style={{fontSize: RFValue(14), color: 'black'}}>
                    {mDuration}
                  </Text>
                </View>
              );
            })}
          </View>

          <View
            style={{
              width: '100%',
              position: 'absolute',
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
            }}>
            <TouchableOpacity
              style={{
                height: h(5),
                width: h(5),

                borderRadius: 20,
                marginRight: w(0.2),
              }}
              onPress={() => {
                this.setState({visibleModalTime: false});
              }}>
              <Ionicons
                name="md-close-circle"
                size={h(4)}
                color={colors.redColor}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  renderCellIntervalModeItem = (item, index) => {
    return (
      <View
        style={{
          marginLeft: h(1),
          paddingBottom: h(2),
        }}>
        <TouchableOpacity
          style={{flexDirection: 'row'}}
          onPress={() => {
            this.setState({selectedVariation: index});
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

          <View style={{flex: 1, marginLeft: w(2)}}>
            <Text
              style={{
                textTransform: 'capitalize',
                fontSize: RFValue(17),
                color: colors.appTextColor,
              }}>
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

  _renderItem = ({item, index}) => {
    return (
      <View style={{width: '100%', height: '100%'}}>
        <Image
          source={{
            uri: item.image_full,
          }}
          indicator={ProgressBar}
          style={{
            width: '100%',
            height: '100%',
          }}
          imageStyle={{
            backgroundColor: '#281656',
            borderBottomLeftRadius: h(7),
            borderBottomRightRadius: h(7),
            resizeMode: 'cover',
          }}
        />
      </View>
    );
  };

  render() {
    var OldTimeString =
      !!this.state.productDetails.store_info &&
      !!this.state.productDetails.store_info.start_time &&
      !!this.state.productDetails.store_info.end_time
        ? moment(
            this.state.productDetails.store_info.start_time.substring(0, 2),
            'hh',
          ).format('h a') +
          ' - ' +
          moment(
            this.state.productDetails.store_info.end_time.substring(0, 2),
            'hh',
          ).format('h a')
        : '';

    var newTimeString = 'Closed';

    if (
      !!this.state.productDetails.store_info &&
      !!this.state.productDetails.store_info.store_timings
    ) {
      var timmings = this.state.productDetails.store_info.store_timings;

      switch (moment().weekday()) {
        case 0: {
          console.log('Sunday ->');
          newTimeString = 'Sun';

          if (timmings.sun_close === 'N') {
            if (!!timmings.sun_start && !!timmings.sun_end) {
              var startT = moment(
                timmings.sun_start.substring(0, 2),
                'hh',
              ).format('h a');

              var endT = moment(timmings.sun_end.substring(0, 2), 'hh').format(
                'h a',
              );

              newTimeString = startT + ' - ' + endT;
            } else {
              newTimeString = 'Closed';
            }
          } else {
            newTimeString = 'Closed';
          }
          break;
        }

        case 1: {
          console.log('Monday ->');
          newTimeString = 'Mon';

          if (timmings.mon_close === 'N') {
            if (!!timmings.mon_start && !!timmings.mon_end) {
              var startT = moment(
                timmings.mon_start.substring(0, 2),
                'hh',
              ).format('h a');

              var endT = moment(timmings.mon_end.substring(0, 2), 'hh').format(
                'h a',
              );

              newTimeString = startT + ' - ' + endT;
            } else {
              newTimeString = 'Closed';
            }
          } else {
            newTimeString = 'Closed';
          }
          break;
        }

        case 2: {
          console.log('Tuesday ->');
          newTimeString = 'Tue';

          if (timmings.tue_close === 'N') {
            if (!!timmings.tue_start && !!timmings.tue_end) {
              var startT = moment(
                timmings.tue_start.substring(0, 2),
                'hh',
              ).format('h a');

              var endT = moment(timmings.tue_end.substring(0, 2), 'hh').format(
                'h a',
              );

              newTimeString = startT + ' - ' + endT;
            } else {
              newTimeString = 'Closed';
            }
          } else {
            newTimeString = 'Closed';
          }
          break;
        }
        case 3: {
          console.log('Wednesday ->');
          newTimeString = 'Wed';

          if (timmings.wed_close === 'N') {
            if (!!timmings.wed_start && !!timmings.wed_end) {
              var startT = moment(
                timmings.wed_start.substring(0, 2),
                'hh',
              ).format('h a');

              var endT = moment(timmings.wed_end.substring(0, 2), 'hh').format(
                'h a',
              );

              newTimeString = startT + ' - ' + endT;
            } else {
              newTimeString = 'Closed';
            }
          } else {
            newTimeString = 'Closed';
          }
          break;
        }
        case 4: {
          console.log('Thursday ->');
          newTimeString = 'Thu';

          if (timmings.thur_close === 'N') {
            if (!!timmings.thur_start && !!timmings.thur_end) {
              var startT = moment(
                timmings.thur_start.substring(0, 2),
                'hh',
              ).format('h a');

              var endT = moment(timmings.thur_end.substring(0, 2), 'hh').format(
                'h a',
              );

              newTimeString = startT + ' - ' + endT;
            } else {
              newTimeString = 'Closed';
            }
          } else {
            newTimeString = 'Closed';
          }
          break;
        }
        case 5: {
          console.log('Friday ->');
          newTimeString = 'Fri';

          if (timmings.fri_close === 'N') {
            if (!!timmings.fri_start && !!timmings.fri_end) {
              var startT = moment(
                timmings.fri_start.substring(0, 2),
                'hh',
              ).format('h a');

              var endT = moment(timmings.fri_end.substring(0, 2), 'hh').format(
                'h a',
              );

              newTimeString = startT + ' - ' + endT;
            } else {
              newTimeString = 'Closed';
            }
          } else {
            newTimeString = 'Closed';
          }

          break;
        }
        case 6: {
          console.log('Saturday ->');
          newTimeString = 'Sat';

          if (timmings.sat_close === 'N') {
            if (!!timmings.sat_start && !!timmings.sat_end) {
              var startT = moment(
                timmings.sat_start.substring(0, 2),
                'hh',
              ).format('h a');

              var endT = moment(timmings.sat_end.substring(0, 2), 'hh').format(
                'h a',
              );

              newTimeString = startT + ' - ' + endT;
            } else {
              newTimeString = 'Closed';
            }
          } else {
            newTimeString = 'Closed';
          }
          break;
        }

        default:
          newTimeString = 'Mon';
          break;
      }
    }

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
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.visibleModalTime}
            onRequestClose={() => {
              console.log('Click screen to close.');
            }}>
            {this.renderModalTime()}
          </Modal>

          <View style={{flex: 1}}>
            <View
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                // backgroundColor: '#118866',
              }}>
              <View style={{width: '100%', height: '40%'}}>
                {!!this.state.productDetails &&
                !!this.state.productDetails.images &&
                this.state.productDetails.images.length > 0 ? (
                  <View
                    style={{
                      width: '100%',
                      height: '100%',
                      resizeMode: 'cover',
                      borderBottomLeftRadius: h(7),
                      borderBottomRightRadius: h(7),
                    }}>
                    {/* <SliderBox
                    style={{
                      width: '100%',
                      height: '100%',
                      resizeMode: 'cover',
                      borderBottomLeftRadius: h(7),
                      borderBottomRightRadius: h(7),
                    }}
                    images={this.state.imagesArray}
                    onCurrentImagePressed={index =>
                      console.warn(`image ${index} pressed`)
                    }
                    dotColor="#FFFFFF"
                    inactiveDotColor="#90A4AE"
                    paginationBoxVerticalPadding={h(3)}
                    autoplay
                    circleLoop
                    autoplayDelay={5000}
                  /> */}

                    <ImageSlider
                      style={{
                        borderBottomLeftRadius: h(7),
                        borderBottomRightRadius: h(7),
                        backgroundColor: '#11558800',
                      }}
                      loopBothSides
                      autoPlayWithInterval={3000}
                      images={this.state.imagesArray}
                      customSlide={({index, item, style, width}) => {
                        //console.log('Fahad url: ', item);
                        return (
                          // It's important to put style here because it's got offset inside
                          <View
                            key={'list1:' + index}
                            style={[
                              style,
                              {
                                flex: 1,
                                resizeMode: 'cover',
                                borderBottomLeftRadius: h(7),
                                borderBottomRightRadius: h(7),
                                backgroundColor: '#115588',
                              },
                            ]}>
                            <Image
                              source={{
                                uri: item,
                              }}
                              indicator={ProgressBar}
                              style={{
                                width: '100%',
                                height: '100%',
                                borderBottomLeftRadius: h(7),
                                borderBottomRightRadius: h(7),
                                backgroundColor: '#115588',
                              }}
                              imageStyle={{
                                width: '100%',
                                height: '100%',
                                // borderTopLeftRadius: h(2),
                                // borderTopRightRadius: h(2),
                                resizeMode: 'cover',
                                borderBottomLeftRadius: h(7),
                                borderBottomRightRadius: h(7),
                                backgroundColor: '#115588',
                              }}
                            />
                          </View>
                        );
                      }}
                      customButtons={(position, move) => (
                        <View
                          style={{
                            // marginBottom: (RFValue(100) * (-1))
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            flexDirection: 'row',

                            // backgroundColor: "#995544",
                            justifyContent: 'center',
                            alignItems: 'flex-end',
                            alignSelf: 'flex-end',
                            paddingBottom: RFValue(40),
                          }}
                          pointerEvents={'none'}>
                          {this.state.imagesArray.map((image, index) => {
                            return (
                              <TouchableHighlight
                                key={'list2:' + index}
                                underlayColor="#ccc"
                                onPress={() => {
                                  // move(index)
                                }}
                                style={
                                  {
                                    // backgroundColor: '#221982',
                                  }
                                }>
                                <View
                                  style={{
                                    width: RFValue(6),
                                    height: RFValue(6),
                                    borderRadius: RFValue(50),
                                    margin: RFValue(5),
                                    backgroundColor:
                                      position === index
                                        ? '#FFFFFF'
                                        : '#555555',
                                  }}></View>
                                {/* <Text style={position === index && {}}>
                                {index + 1}
                              </Text> */}
                              </TouchableHighlight>
                            );
                          })}
                        </View>
                      )}
                    />

                    {/* <Carousel
                    style={{zIndex: 10}}
                    ref={c => {
                      this._carousel = c;
                    }}
                    data={this.state.productDetails.images}
                    renderItem={this._renderItem}
                    sliderWidth={w(100)}
                    itemWidth={w(100)}
                    onSnapToItem={index => this.setState({activeSlide: index})}
                  />
                  <View
                    style={{
                      position: 'absolute',
                      zIndex: 1,
                      width: w(100),
                      justifyContent: 'flex-start',
                    }}>
                    <Pagination
                      dotsLength={this.state.productDetails.images.length}
                      activeDotIndex={this.state.activeSlide}
                      containerStyle={{backgroundColor: '#6d727866'}}
                      dotStyle={{
                        width: 20,
                        height: 10,
                        borderRadius: 5,

                        backgroundColor: '#000000',
                      }}
                      inactiveDotStyle={{
                        // Define styles for inactive dots here
                        backgroundColor: '#FFFFFF',
                      }}
                      inactiveDotOpacity={0.3}
                      inactiveDotScale={0.4}
                    />
                  </View> */}
                  </View>
                ) : (
                  <Image_ReactNative
                    source={dibbsLogo}
                    style={{
                      width: '100%',
                      height: '100%',
                      resizeMode: 'cover',
                      backgroundColor: '#281656',
                      borderBottomLeftRadius: h(7),
                      borderBottomRightRadius: h(7),
                    }}
                  />
                )}
              </View>
              <View
                style={{
                  width: '100%',
                  height: '70%',
                  marginTop: h(8) * -1,
                  // backgroundColor: '#885511',
                }}>
                <View
                  style={{
                    width: '100%',
                    height: '100%',
                    // backgroundColor: '#991100',
                  }}>
                  <View
                    style={{
                      width: '100%',
                      paddingLeft: 10,
                      paddingRight: w(6),
                      paddingTop: 0,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      // backgroundColor: "#885522"
                    }}>
                    <View>
                      <View
                        style={{
                          backgroundColor: '#000000AA',
                          padding: RFValue(5),
                          borderRadius: RFValue(100),
                        }}>
                        <Text
                          numberOfLines={1}
                          style={{
                            textAlign: 'right',
                            color: 'white',
                            fontSize: RFValue(9),
                            fontWeight: 'bold',
                            // backgroundColor: "#667711"
                          }}>
                          {moment(this.state.productDetails.end_date).diff(
                            moment(),
                            'days',
                          ) === 0
                            ? 'Last Day To Get This Deal.'
                            : moment(this.state.productDetails.end_date).diff(
                                moment(),
                                'days',
                              ) < 4
                            ? moment(this.state.productDetails.end_date).diff(
                                moment(),
                                'days',
                              ) + ' Day(s) Left To Get This Deal.'
                            : ''}
                        </Text>
                      </View>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                      }}>
                      <TouchableOpacity
                        style={{
                          height: h(5),
                          width: h(5),
                          backgroundColor: 'white',
                          borderRadius: RFValue(20),
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: w(3),
                        }}
                        onPress={() => {
                          const data =
                            this.state.productDetails.product_name +
                            '\n\n' +
                            (!!this.state.productDetails.description
                              ? this.state.productDetails.description
                              : ' - ') +
                            ('\n\niOS: ' +
                              APP_URLS.appURLiOSBetaTesting +
                              '\n\nAndroid: ' +
                              APP_URLS.appURLandroid) +
                            '\n\nWebsite: ' +
                            (Platform.OS === 'android'
                              ? 'https://thedibbsapp.com'
                              : '');

                          this.onShare(
                            this.state.productDetails.product_name,
                            data,
                            'https://thedibbsapp.com',
                          );
                        }}>
                        <Ionicons
                          name="arrow-redo"
                          size={h(4)}
                          color="#eda152"
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={{
                          height: h(5),
                          width: h(5),
                          backgroundColor: 'white',
                          borderRadius: RFValue(20),
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        onPress={() => {
                          if (this.props.isAuthenticated) {
                            if (
                              this.state.productDetails.mySavedProduct === 'Y'
                            ) {
                              this.props.removeProduct(
                                this.state.productDetails.product_id,
                              );
                            } else {
                              this.props.saveProduct(
                                this.state.productDetails.product_id,
                              );
                            }
                          } else {
                            this.showAlertModal(
                              'Alert',
                              titles.guestUserSaveMsg,
                              AlertTypesEnum.GuestUser,
                              true,
                              'Cancel',
                              true,
                              true,
                              'Login',
                              false,
                            );
                          }
                        }}>
                        <Ionicons
                          name={
                            this.state.productDetails.mySavedProduct === 'Y'
                              ? 'md-heart'
                              : 'heart-outline'
                          }
                          size={h(4)}
                          color={colors.appPurple}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  {/* <ScrollView keyboardShouldPersistTaps="always"> */}
                  <View style={{flex: 1, alignItems: 'center'}}>
                    <Card
                      containerStyle={{
                        width: '90%',
                        backgroundColor: colors.white,
                        padding: 10,
                        marginTop: 5,
                        elevation: 20,
                        cardMaxElevation: 20,
                        borderRadius: 10,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text
                          numberOfLines={3}
                          ellipsizeMode={'tail'}
                          style={{
                            flex: 1,
                            fontWeight: 'bold',
                            fontSize: RFValue(18),

                            color: colors.appPurple,
                            textTransform: 'capitalize',
                          }}>
                          {this.state.productDetails.product_name}
                        </Text>
                      </View>
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
                            onPress={() => {}}>
                            <Text
                              style={{
                                textAlign: 'center',
                                color: colors.appPurple,
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
                          width: '100%',
                          height: 1,
                          marginTop: h(0),
                          backgroundColor: colors.black,
                        }}></View>

                      <FlatList
                        style={{
                          maxHeight: h(23),

                          marginTop: RFValue(5),
                          marginBottom: RFValue(5),
                        }}
                        data={this.state.productDetails.varData}
                        horizontal={false}
                        renderItem={({item, index}) =>
                          this.renderCellIntervalModeItem(item, index)
                        }
                        keyExtractor={(item, index) => item}
                        keyboardShouldPersistTaps="always"
                      />
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                        }}>
                        {!!this.state.productDetails.store_info &&
                          !!this.state.productDetails.store_info.phone && (
                            <TouchableOpacity
                              onPress={() => {
                                Linking.openURL(
                                  `tel:${this.state.productDetails.store_info.phone}`,
                                );
                              }}
                              activeOpacity={1}
                              style={{
                                marginRight: w(2),
                                marginLeft: w(2),
                                borderRadius: w(20),
                                width: w(17),
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: w(17),
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
                                style={{
                                  fontSize: RFValue(20),
                                  color: colors.appPurple,
                                }}
                              />
                              <Text
                                style={{
                                  fontSize: RFValue(8),
                                  color: colors.appPurple,
                                }}>
                                Call now
                              </Text>
                            </TouchableOpacity>
                          )}

                        {!!this.state.productDetails.store_info &&
                          !!this.state.productDetails.store_info.location && (
                            <TouchableOpacity
                              onPress={() => {
                                const scheme = Platform.select({
                                  ios: 'maps:?q=',
                                  android: 'geo:0,0?q=',
                                });

                                const latLng =
                                  this.state.productDetails.store_info.location;
                                const label =
                                  !!this.state.productDetails.store_info &&
                                  !!this.state.productDetails.store_info
                                    .store_name
                                    ? this.state.productDetails.store_info
                                        .store_name
                                    : 'Resturant name';

                                const url = Platform.select({
                                  ios: `${scheme}${encodeURIComponent(
                                    label,
                                  )}&ll=${latLng}`,
                                  android: `${scheme}${latLng}(${label})`,
                                });

                                Linking.openURL(url).catch(err =>
                                  console.error('An error occurred', err),
                                );
                              }}
                              activeOpacity={1}
                              style={{
                                marginRight: w(2),
                                marginLeft: w(2),
                                borderRadius: w(20),
                                width: w(17),
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: w(17),
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
                                style={{
                                  fontSize: RFValue(20),
                                  color: colors.appPurple,
                                }}
                              />
                              <Text
                                style={{
                                  fontSize: RFValue(8),
                                  color: colors.appPurple,
                                }}>
                                Direction
                              </Text>
                            </TouchableOpacity>
                          )}

                        {!!this.state.productDetails.store_info &&
                          !!this.state.productDetails.store_info.website && (
                            <TouchableOpacity
                              onPress={() => {
                                const mUrl =
                                  this.state.productDetails.store_info.website;
                                if (mUrl.includes('http')) {
                                  // Linking.openURL(mUrl);

                                  navigateWithParams(
                                    this.props.navigation,
                                    ScreenNames.WebSiteScreen,
                                    {
                                      url: mUrl,
                                    },
                                  );
                                } else {
                                  navigateWithParams(
                                    this.props.navigation,
                                    ScreenNames.WebSiteScreen,
                                    {
                                      url: 'https://' + mUrl,
                                    },
                                  );
                                  // Linking.openURL('https://' + mUrl);
                                }
                              }}
                              activeOpacity={1}
                              style={{
                                marginRight: w(2),
                                marginLeft: w(2),
                                borderRadius: w(20),
                                width: w(17),
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: w(17),
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
                                style={{
                                  fontSize: RFValue(20),
                                  color: colors.appPurple,
                                }}
                              />
                              <Text
                                style={{
                                  fontSize: RFValue(8),
                                  color: colors.appPurple,
                                }}>
                                Website
                              </Text>
                            </TouchableOpacity>
                          )}

                        {!!this.state.productDetails.store_info &&
                          !!this.state.productDetails.store_info.start_time &&
                          !!this.state.productDetails.store_info.end_time && (
                            <TouchableOpacity
                              onPress={() => {
                                this.setState({visibleModalTime: true});
                              }}
                              activeOpacity={1}
                              style={{
                                marginRight: w(2),
                                marginLeft: w(2),
                                borderRadius: w(20),
                                width: w(17),
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: w(17),
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
                                style={{
                                  fontSize: RFValue(20),
                                  color: colors.appPurple,
                                }}
                              />
                              <Text
                                style={{
                                  fontSize: RFValue(8),
                                  color: colors.appPurple,
                                }}>
                                {newTimeString}
                              </Text>
                            </TouchableOpacity>
                          )}
                      </View>
                    </Card>

                    {/* <View
                  style={{width: h(20), height: h(20), backgroundColor: colors.white, shadowColor: "#000000",
                  shadowOpacity: 0.8,
                  shadowRadius: 2,
                  shadowOffset: {
                    height: 1,
                    width: 1
                  }}}
                  >
                  </View> */}

                    <Button
                      light
                      onPress={() => {
                        if (
                          !!this.state.productDetails.varData &&
                          this.state.productDetails.varData.length > 0
                        ) {
                          this.props.addRemoveProductInCart(
                            this.state.productDetails.varData[
                              this.state.selectedVariation
                            ],
                            this.state.productDetails,
                            CartUpdateActionEnum.Add,
                          );
                        } else {
                          alert('No Variation provided. Please contact admin!');
                        }
                      }}
                      rounded
                      style={{
                        justifyContent: 'center',
                        marginTop: RFValue(10),
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
                  {/* </ScrollView> */}
                </View>
              </View>
            </View>

            <View style={{marginTop: h(1)}}>
              <HeaderBackCompoenent
                cardStyle={true}
                leftImageSource={backImage}
                onPressLeftButton={() => {
                  this.props.navigation.goBack(null);
                }}
                leftType="image"
                leftImageColor={colors.white}
                headingTitle={''}
                titleAlignment={'flex-start'}
                iconR1={'md-cart'}
                iconR1Color={colors.white}
                onIconR1Press={() => {
                  navigateWithParams(
                    this.props.navigation,
                    ScreenNames.CartScreen,
                    {
                      setProductDetail: this.setProductInfo.bind(this),
                    },
                  );
                }}
              />
            </View>
          </View>

          <FullScreenLoader
            title={titles.fullScreenLoaderTitle}
            loading={this.props.isUpdatingCartInfo}
          />
        </SafeAreaView>
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const {appName, appState, isAuthenticated} = state.authReducer;

  const {productSavedSuccessfully, productDeletedSuccessfully, appUrl} =
    state.productReducer;

  const {isUpdatingCartInfo, cartInfoUpdatedSuccessFully, totalPrice} =
    state.cartReducer;

  return {
    appName,
    appState,
    isAuthenticated,
    productSavedSuccessfully,
    productDeletedSuccessfully,
    appUrl,
    isUpdatingCartInfo,
    cartInfoUpdatedSuccessFully,
    totalPrice,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    saveProduct: productID => dispatch(saveProduct(productID)),
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProductDetailScreen);
