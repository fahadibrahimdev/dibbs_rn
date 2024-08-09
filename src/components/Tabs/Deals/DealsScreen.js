import moment from 'moment';
import React, {Component} from 'react';
import {
  FlatList,
  Image as Image_ReactNative,
  Platform,
  RefreshControl,
  SafeAreaView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {height as h, width as w} from 'react-native-dimension';
import FastImage from 'react-native-fast-image';
import {createImageProgress} from 'react-native-image-progress';
import {PERMISSIONS, RESULTS, request} from 'react-native-permissions';
import ProgressBar from 'react-native-progress/Circle';
import {RFValue} from 'react-native-responsive-fontsize';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';
import {strings, titles} from '../../../constants/Localization';
import {ScreenNames, TabScreenNames} from '../../../constants/ScreenNames';
import AlertComponent from '../../../helpers/AlertComponent';
import FullScreenLoader from '../../../helpers/FullScreenLoader';
import HeaderCompoenent from '../../../helpers/HeaderCompoenent';
import {dibbsLogo} from '../../../helpers/Images';
import SearchBar from '../../../helpers/SearchBar';
import {
  goBack,
  navigate,
  navigateWithParams,
  stringToNumber,
} from '../../../helpers/Util';
import colors from '../../../helpers/colors';
import {AlertTypesEnum} from '../../../helpers/enum';
import {
  removeProduct,
  saveProduct,
  searchDeals,
  setSearchProducts,
} from '../../../redux/actions/productActions';
const Image = createImageProgress(FastImage);

class DealsScreen extends Component {
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

    categoryID: 0,
    searchText: '',
    filteredData: [],
  };

  constructor(props) {
    super(props);
  }

  checkApplicationPermission = async () => {
    console.log('permission fun called.');
    const permissionPn = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
    if (permissionPn == RESULTS.BLOCKED) {
      Alert.alert(
        'Alert',
        'Notification perissions denied and not requestable anymore. Please allow permission from settings.',
        [
          {
            text: 'OK',
            onPress: () => {},
          },
        ],
      );
    }
  };

  //   checkApplicationPermission = async () => {
  //     if (Platform.OS === 'android') {
  //       try {
  //         await PermissionsAndroid.request(
  //           PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
  //         );
  //       } catch (error) {
  //         console.log("Notification Permisions err: ", error);
  //       }
  //     }
  // }

  componentDidMount() {
    console.log('Fahad PROPS: ', this.props.route);

    const pCategoryID =
      !!this.props.route.params && !!this.props.route.params.categoryId
        ? this.props.route.params.categoryId
        : 0;

    this.setState({categoryID: pCategoryID});

    this.props.searchDeals('', pCategoryID);

    if (Platform.OS === 'android') {
      this.checkApplicationPermission();
    }
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.searchedDeals.length !== prevProps.searchedDeals.length
      // || this.props.searchedDeals.length !== this.state.filteredData.length
    ) {
      this.startSearch(this.state.searchText);
    }

    if (
      this.props.isAuthenticated !== prevProps.isAuthenticated &&
      this.props.isAuthenticated === true
    ) {
      this.onRefresh();
    }

    if (
      this.props.productSavedSuccessfully !==
        prevProps.productSavedSuccessfully &&
      this.props.productSavedSuccessfully === true
    ) {
      this.startSearch(this.state.searchText);
      // this.showAlertModal('Success', 'Product Added Successfully!');
    }

    if (
      this.props.productDeletedSuccessfully !==
        prevProps.productDeletedSuccessfully &&
      this.props.productDeletedSuccessfully === true
    ) {
      this.startSearch(this.state.searchText);
      // this.showAlertModal('Success', 'Product Deleted Successfully!');
    }

    if (
      this.props.productSaveError !== prevProps.productSaveError &&
      this.props.productSaveError !== ''
    ) {
      this.showAlertModal('Error', this.props.productSaveError);
    }

    if (
      this.props.productDeleteError !== prevProps.productDeleteError &&
      this.props.productDeleteError !== ''
    ) {
      this.showAlertModal('Error', this.props.productDeleteError);
    }

    // // This code might be extra (only use fully while debugging)
    // if (
    //   this.props.searchedDeals.length === prevProps.searchedDeals.length &&
    //   this.props.allDealsFetched !== prevProps.allDealsFetched
    // ) {
    //   this.startSearch(this.state.searchText);
    // }
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

  startSearch(searchText) {
    if (searchText === '') {
      this.setState({
        filteredData: this.props.searchedDeals,
      });
    } else {
      const newFilteredData = this.props.searchedDeals.filter(
        obj =>
          obj.product_name.toLowerCase().indexOf(searchText.toLowerCase()) >= 0,
      );

      const adjustedNewFilteredData = newFilteredData.map(itemObj => {
        itemObj.isImageLoaded = false;

        return itemObj;
      });
      this.setState({
        filteredData: adjustedNewFilteredData,
      });
    }
  }

  onRefresh = () => {
    this.props.searchDeals('', this.state.categoryID);
  };

  renderCellItem = (item, index) => {
    var formattedAddress = ' - ';

    if (!!item.store_info && !!item.store_info.address) {
      const splitAddress = item.store_info.address.split(', ');

      if (splitAddress.length > 2) {
        formattedAddress = splitAddress[1] + ', ' + splitAddress[2];
      } else {
        formattedAddress = ' - ';
      }
    }

    return (
      <TouchableOpacity
        key={'dealscreen' + index}
        style={{
          width: '90%',

          alignSelf: 'center',
          marginTop: h(2),
          borderRadius: h(2),
          borderColor: colors.black,
          borderWidth: 0.5,
          backgroundColor: colors.white,
          elevation: h(1),
        }}
        activeOpacity={0.8}
        onPress={() => {
          navigateWithParams(
            this.props.navigation,
            ScreenNames.ProductDetailScreen,
            {
              productDetails: item,
            },
          );
        }}>
        <View
          style={{
            height: RFValue(200),
            flex: 0.65,
            borderTopLeftRadius: h(2),
            borderTopRightRadius: h(2),
            backgroundColor: '#115588',
          }}>
          <View style={{justifyContent: 'center'}}>
            {!!item.images && item.images.length > 0 ? (
              <Image
                source={{
                  // uri: APP_CONSTANTS.IMAGE_BASE_URL + item.images[0].image_full,
                  uri: item.images[0].image_full,
                }}
                indicator={ProgressBar}
                style={{
                  width: '100%',
                  height: '100%',
                }}
                imageStyle={{
                  borderTopLeftRadius: h(2),
                  borderTopRightRadius: h(2),
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
                  borderTopRightRadius: h(2),
                }}
              />
            )}
          </View>

          <View
            style={{
              width: '100%',
              position: 'absolute',
              paddingLeft: 10,
              paddingRight: 10,
              paddingTop: 7,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
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
                  if (item.mySavedProduct === 'Y') {
                    this.props.removeProduct(item.product_id);
                  } else {
                    this.props.saveProduct(item.product_id);
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
                  item.mySavedProduct === 'Y' ? 'md-heart' : 'heart-outline'
                }
                size={h(4)}
                color="#502a7e"
              />
            </TouchableOpacity>

            <View>
              {(moment(item.end_date).diff(moment(), 'days') === 0 ||
                moment(item.end_date).diff(moment(), 'days') < 4) && (
                <View
                  style={{
                    backgroundColor: '#000000AA',
                    padding: RFValue(5),
                    borderRadius: RFValue(100),
                  }}>
                  <Text
                    numberOfLines={1}
                    style={{
                      // textAlign: 'right',
                      color: 'white',
                      // backgroundColor: "#889911",
                      fontSize: RFValue(10),
                    }}>
                    {moment(item.end_date).diff(moment(), 'days') === 0
                      ? 'Last Day To Get This Deal.'
                      : moment(item.end_date).diff(moment(), 'days') < 4
                      ? moment(item.end_date).diff(moment(), 'days') +
                        ' Day(s) Left To Get This Deal.'
                      : ''}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
        <View
          style={{
            flex: 0.35,
            justifyContent: 'space-between',
            borderBottomLeftRadius: h(2),
            borderBottomRightRadius: h(2),
            marginTop: h(1),
            marginBottom: h(1),
            paddingLeft: h(2),
            paddingRight: h(2),
            backgroundColor: colors.white,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              numberOfLines={2}
              style={{
                flex: 1,
                fontWeight: '400',
                fontSize: RFValue(22),
                color: '#22044e',
                textTransform: 'capitalize',
              }}>
              {!!item.store_info && item.store_info.store_name
                ? item.store_info.store_name
                : ' - '}
            </Text>
          </View>

          <Text
            numberOfLines={1}
            style={{color: 'black', fontSize: RFValue(16)}}>
            {formattedAddress}
          </Text>

          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                color: colors.appPurple,
                fontWeight: 'bold',
                fontSize: RFValue(15),
              }}>
              ${stringToNumber(item.price - item.discount).toFixed(2)}
            </Text>
            {Math.floor(
              (stringToNumber(item.discount) / stringToNumber(item.price)) *
                100,
            ).toFixed(0) != 0 && (
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

            {Math.floor(
              (stringToNumber(item.discount) / stringToNumber(item.price)) *
                100,
            ).toFixed(0) != 0 && (
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
                  {Math.floor(
                    (stringToNumber(item.discount) /
                      stringToNumber(item.price)) *
                      100,
                  ).toFixed(0)}
                  % off
                </Text>
              </View>
            )}
          </View>
          <Text
            style={{color: 'black', fontSize: RFValue(16)}}
            numberOfLines={1}>
            {!!item.varData && !!item.varData[0].name
              ? item.varData[0].name
              : ' - '}
          </Text>
        </View>
      </TouchableOpacity>
    );
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
                navigate(this.props.navigation, TabScreenNames.MyDibbs);
              }

              this.setAlertModalVisible(false);
            }}
            width={w(85)}
          />
          <HeaderCompoenent
            headingTitle={strings.featuredDeals}
            useBackFeature={!!this.state.categoryID}
            // iconL1={'arrow-back'}
            onIconL1Press={() => {
              goBack(this.props.navigation);
            }}
            iconR1={'cart'}
            onIconR1Press={() => {
              navigate(this.props.navigation, ScreenNames.CartScreen);
            }}
            iconR2={'md-person'}
            onIconR2Press={() => {
              navigate(this.props.navigation, TabScreenNames.MyDibbs);
            }}
          />

          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <SearchBar
              label={'Search*'}
              autoCapitalize={'none'}
              value={this.state.searchText}
              showIcon={true}
              onChange={text => {
                this.setState({
                  searchText: text,
                });

                this.startSearch(text);
              }}
              placeHolder={'Search Here'}
              outerContainerStyles={{width: '90%'}}
              returnKeyType={'done'}
            />
          </View>

          <View style={{flex: 1}}>
            {!this.props.isSearchingDeals &&
              this.props.searchedDeals.length === 0 && (
                <View
                  style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={{fontSize: RFValue(22), fontWeight: 'bold'}}>
                    No product available right now!
                  </Text>
                </View>
              )}

            <FlatList
              removeClippedSubviews={false}
              data={this.state.filteredData}
              horizontal={false}
              style={{marginTop: h(2), marginBottom: h(2)}}
              contentContainerStyle={{paddingBottom: h(3)}}
              renderItem={({item, index}) => this.renderCellItem(item, index)}
              keyExtractor={(item, index) => 'dealFlat' + index}
              keyboardShouldPersistTaps="always"
              refreshControl={
                <RefreshControl
                  tintColor={colors.appPurple}
                  title={'Refreshing...'}
                  titleColor={colors.appPurple}
                  refreshing={this.props.isSearchingDeals}
                  onRefresh={this.onRefresh}
                />
              }
            />
          </View>

          <FullScreenLoader
            title={titles.fullScreenLoaderTitle}
            loading={this.props.isSavingProduct || this.props.isDeletingProduct}
          />
        </SafeAreaView>
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const {appName, isAuthenticated} = state.authReducer;
  const {
    isSearchingDeals,
    allDealsFetched,
    searchedDeals,
    isSavingProduct,
    productSavedSuccessfully,
    productSaveError,
    isDeletingProduct,
    productDeletedSuccessfully,
    productDeleteError,
    appUrl,
  } = state.productReducer;

  return {
    appName,
    isAuthenticated,
    isSearchingDeals,
    allDealsFetched,
    searchedDeals,
    isSavingProduct,
    productSavedSuccessfully,
    productSaveError,
    isDeletingProduct,
    productDeletedSuccessfully,
    productDeleteError,
    appUrl,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    searchDeals: (keyword, categoryID) =>
      dispatch(searchDeals(keyword, categoryID)),
    setSearchProducts: data => dispatch(setSearchProducts(data)),
    saveProduct: productID => dispatch(saveProduct(productID)),
    removeProduct: productID => dispatch(removeProduct(productID)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DealsScreen);
