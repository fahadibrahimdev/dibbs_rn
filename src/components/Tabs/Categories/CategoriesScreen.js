import {Button, Header, Icon, Input, Item} from 'native-base';
import React, {Component} from 'react';
import {
  FlatList,
  RefreshControl,
  Share,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  TouchableHighlightBase,
} from 'react-native';
import {height as h, width as w} from 'react-native-dimension';
import {RFValue} from 'react-native-responsive-fontsize';
import {connect} from 'react-redux';
import {strings, titles} from '../../../constants/Localization';
import {ScreenNames, TabScreenNames} from '../../../constants/ScreenNames';
import AlertComponent from '../../../helpers/AlertComponent';
import colors from '../../../helpers/colors';
import {AlertTypesEnum, AsyncKeysEnum, CALL_STATE} from '../../../helpers/enum';
import FullScreenLoader from '../../../helpers/FullScreenLoader';
import HeaderCompoenent from '../../../helpers/HeaderCompoenent';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  AsyncGetViaKey,
  AsyncStoreViaKey,
} from '../../../helpers/LocalStorage/AsyncStorage';
import {navigate, navigateWithParams} from '../../../helpers/Util';
import {
  categoriesInfoAPI,
  categoriesInfoIdle,
  clearSearchProductsInfo,
  searchProducts,
} from '../../../redux/actions/productActions';

class CategoriesScreen extends Component {
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

    searchText: '',
    filteredData: [],

    recentSearch: [],
    indexToRemove: -1,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.categoriesInfoAPI();
    // AsyncGetViaKey(AsyncKeysEnum.RECENT_SEAARCH).then(obj => {
    //   if (!!obj) {
    //     this.setState({ recentSearch: obj });
    //   } else {
    //   }
    // });
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.appCategoriesRedux.state === CALL_STATE.SUCCESS ||
      this.props.appCategoriesRedux.state === CALL_STATE.ERROR ||
      this.props.appCategoriesRedux.state === CALL_STATE.IDLE
    ) {
      if (this.props.appCategoriesRedux.state !== CALL_STATE.IDLE) {
        this.props.categoriesInfoIdle();
      }

      if (
        !!this.props.userInfo.token &&
        this.props.appCategoriesRedux.state === CALL_STATE.IDLE &&
        this.props.appCategoriesRedux.payload.length === 0
      ) {
        this.props.categoriesInfoAPI();
      }
    }

    if (
      this.props.searchedProducts.length !== prevProps.searchedProducts.length
    ) {
      this.startSearch(this.state.searchText);
    }

    // This code might be extra (only use fully while debugging)
    if (
      this.props.searchedProducts.length ===
        prevProps.searchedProducts.length &&
      this.props.allProductsFetched !== prevProps.allProductsFetched
    ) {
      this.startSearch(this.state.searchText);
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

  alertToRemoveRecent() {
    this.showAlertModal(
      'Alert',
      'Are you sure you want to remove recent search!',
      AlertTypesEnum.RemoveRecent,
      true,
      'Cancel',
      false,
      true,
      'Remove',
      false,
      colors.lightGray,
      colors.redDestructive,
    );
  }

  startSearch(searchText) {
    if (searchText === '') {
      this.setState({
        filteredData: this.props.searchedProducts,
      });
    } else {
      const newFilteredData = this.props.searchedProducts.filter(
        obj =>
          obj.product_name.toLowerCase().indexOf(searchText.toLowerCase()) >= 0,
      );

      this.setState({
        filteredData: newFilteredData.map(itemObj => {
          itemObj.isImageLoaded = false;

          return itemObj;
        }),
      });
    }
  }

  onRefresh = () => {
    if (!!this.state.searchText) {
      this.props.searchProducts(this.state.searchText);
    }
  };

  renderCellItem = (item, index) => {
    return (
      <View
        style={{
          marginTop: RFValue(2),
          marginBottom: RFValue(2),
        }}>
        <TouchableOpacity
          style={{
            width: '100%',
            alignSelf: 'center',
            paddingTop: RFValue(20),
            paddingBottom: RFValue(20),
            backgroundColor: colors.white,
            elevation: h(1),
          }}
          activeOpacity={0.8}
          onPress={() => {
            navigateWithParams(
              this.props.navigation,
              ScreenNames.CategoriesDealsNavigator,
              {
                categoryId: item.id,
                categoryName: item.name,
              },
            );
          }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 10,
            }}>
            <View style={{width: '10%'}}></View>
            <Text
              style={{
                width: '80%',
                textAlign: 'center',
                fontWeight: '400',
                fontSize: RFValue(20),
                color: colors.black,
                textTransform: 'capitalize',
              }}>
              {item.name}
            </Text>
            <View style={{width: '10%', justifyContent: 'center'}}>
              <Ionicons
                name={'chevron-forward'}
                size={h(4)}
                color={colors.appPurple}
              />
            </View>
          </View>
          {/* <View
          style={{
            marginLeft: 30,
            backgroundColor: colors.black,
            height: 1,
          }}></View> */}
        </TouchableOpacity>
      </View>
    );
  };

  renderCellRecentItem = (item, index) => {
    return (
      <TouchableOpacity
        style={{
          width: '100%',
          alignSelf: 'center',
          backgroundColor: colors.lightGray,
          elevation: h(1),
        }}
        activeOpacity={0.8}
        onPress={() => {
          this.setState({searchText: item.title});
          this.props.searchProducts(item.title);
        }}
        onLongPress={() => {
          this.setState({indexToRemove: index});

          this.alertToRemoveRecent();
        }}>
        <View style={{marginLeft: 20, padding: 10}}>
          <Text
            style={{
              fontWeight: '400',
              fontSize: RFValue(16),
              color: colors.black,
              textTransform: 'capitalize',
            }}>
            {item.title}
          </Text>
        </View>
        {/* <View style={{marginLeft: 30, backgroundColor: colors.black, height: 1}}></View> */}
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
        <AlertComponent
          alertProps={this.state.alertProps}
          setModalVisible={this.setAlertModalVisible}
          onLeftBtnClick={() => {
            this.setAlertModalVisible(false);
          }}
          onRightBtnClick={() => {
            if (this.state.alertProps.alertType === AlertTypesEnum.GuestUser) {
              navigate(this.props.navigation, TabScreenNames.MyDibbs);
            } else if (
              this.state.alertProps.alertType === AlertTypesEnum.RemoveRecent
            ) {
              var currentRecentSearch = this.state.recentSearch;

              currentRecentSearch.splice(this.state.indexToRemove, 1);

              this.setState({recentSearch: currentRecentSearch});

              AsyncStoreViaKey(
                AsyncKeysEnum.RECENT_SEAARCH,
                currentRecentSearch,
              );
            }

            this.setAlertModalVisible(false);
          }}
          width={w(85)}
        />

        <HeaderCompoenent
          headingTitle={strings.categories}
          iconR1={'cart'}
          onIconR1Press={() => {
            navigate(this.props.navigation, ScreenNames.CartScreen);
          }}
        />

        {this.props.appCategoriesRedux.payload.length === 0 &&
          this.props.appCategoriesRedux.state !== CALL_STATE.FETCHING && (
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
                  {/* <View
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
                    <Ionicons name="heart" color="#502a7e" size={h(7)} />
                  </View>
                </View> */}
                  <View
                    style={{
                      justifyContent: 'center',
                      borderColor: 'transparent',
                      marginTop: h(3),
                    }}>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: RFValue(22),
                        fontWeight: 'bold',
                      }}>
                      Login is required
                    </Text>
                  </View>
                  {/* <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderColor: 'transparent',
                    // backgroundColor: "#991100"
                  }}>
                  <Text style={{ fontSize: RFValue(12), color: 'black' }}>
                    Tap the heart icon to add any deals{' '}
                  </Text>
                </View> */}

                  <Button
                    light
                    onPress={() => {
                      navigate(this.props.navigation, TabScreenNames.MyDibbs);
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
                      {TabScreenNames.MyDibbs}
                    </Text>
                  </Button>
                </View>
              </View>
            </View>
          )}

        {this.props.appCategoriesRedux.payload.length > 0 && (
          <ScrollView keyboardShouldPersistTaps="always">
            <View style={{flex: 1}}>
              <View>
                <FlatList
                  removeClippedSubviews={false}
                  data={this.props.appCategoriesRedux.payload}
                  horizontal={false}
                  renderItem={({item, index}) =>
                    this.renderCellItem(item, index)
                  }
                  keyExtractor={(item, index) => item}
                  keyboardShouldPersistTaps="always"
                />
              </View>
            </View>
          </ScrollView>
        )}

        <FullScreenLoader
          title={titles.fullScreenLoaderTitle}
          loading={this.props.appCategoriesRedux.state === CALL_STATE.FETCHING}
        />
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const {appName, isAuthenticated, userInfo} = state.authReducer;
  const {
    isSearchingProducts,
    productsSearchedSuccessfully,
    allProductsFetched,
    searchedProducts,
    isSavingProduct,
    productSavedSuccessfully,
    productSaveError,
    isDeletingProduct,
    productDeletedSuccessfully,
    productDeleteError,
    appCategoriesRedux,
  } = state.productReducer;

  return {
    appName,
    isAuthenticated,
    userInfo,
    isSearchingProducts,
    productsSearchedSuccessfully,
    allProductsFetched,
    searchedProducts,
    isSavingProduct,
    productSavedSuccessfully,
    productSaveError,
    isDeletingProduct,
    productDeletedSuccessfully,
    productDeleteError,
    appCategoriesRedux,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    categoriesInfoAPI: () => dispatch(categoriesInfoAPI()),
    categoriesInfoIdle: () => dispatch(categoriesInfoIdle()),
    searchProducts: keyword => dispatch(searchProducts(keyword)),
    clearSearchProductsInfo: () => dispatch(clearSearchProductsInfo()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CategoriesScreen);
