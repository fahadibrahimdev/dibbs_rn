import { Button, Header, Icon, Input, Item } from 'native-base';
import React, { Component } from 'react';
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
import { height as h, width as w } from 'react-native-dimension';
import { RFValue } from 'react-native-responsive-fontsize';
import { connect } from 'react-redux';
import { strings, titles } from '../../../constants/Localization';
import { ScreenNames, TabScreenNames } from '../../../constants/ScreenNames';
import AlertComponent from '../../../helpers/AlertComponent';
import colors from '../../../helpers/colors';
import { AlertTypesEnum, AsyncKeysEnum } from '../../../helpers/enum';
import FullScreenLoader from '../../../helpers/FullScreenLoader';
import HeaderCompoenent from '../../../helpers/HeaderCompoenent';
import {
  AsyncGetViaKey,
  AsyncStoreViaKey,
} from '../../../helpers/LocalStorage/AsyncStorage';
import { navigate, navigateWithParams } from '../../../helpers/Util';
import {
  clearSearchProductsInfo,
  searchProducts,
} from '../../../redux/actions/productActions';

class SearchScreen extends Component {
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
    AsyncGetViaKey(AsyncKeysEnum.RECENT_SEAARCH).then(obj => {
      if (!!obj) {
        this.setState({ recentSearch: obj });
      } else {
      }
    });
  }

  componentDidUpdate(prevProps) {
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
      <TouchableOpacity
        style={{
          width: '100%',
          alignSelf: 'center',
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
        <View style={{ marginLeft: 20, padding: 10 }}>
          <Text
            style={{
              fontWeight: '400',
              fontSize: RFValue(16),
              color: colors.black,
              textTransform: 'capitalize',
            }}>
            {item.product_name}
          </Text>
        </View>
        <View
          style={{
            marginLeft: 30,
            backgroundColor: colors.black,
            height: 1,
          }}></View>
      </TouchableOpacity>
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
          this.setState({ searchText: item.title });
          this.props.searchProducts(item.title);
        }}
        onLongPress={() => {
          this.setState({ indexToRemove: index });

          this.alertToRemoveRecent();
        }}>
        <View style={{ marginLeft: 20, padding: 10 }}>
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

              this.setState({ recentSearch: currentRecentSearch });

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
          headingTitle={strings.search}
          iconR1={'cart'}
          onIconR1Press={() => {
            navigate(this.props.navigation, ScreenNames.CartScreen);
          }}
        // iconR2={'md-share'}
        // iconR2Color={colors.appPurple}
        // onIconR2Press={() => {
        //   this.onShare('', 'http://thedibbsapp.com/', '');
        // }}
        />

        <View>
          <Header
            searchBar
            rounded
            style={{ height: h(6), backgroundColor: colors.white }}>
            <Item>
              <Icon name="ios-search" style={{ fontSize: RFValue(15) }} />

              <Input
                style={{ fontSize: RFValue(12) }}
                placeholder="Search"
                value={this.state.searchText}
                returnKeyType={'done'}
                onChangeText={searchText => {
                  this.setState({
                    searchText: searchText,
                  });

                  if (!!searchText) {
                    this.props.searchProducts(searchText);
                  } else {
                    this.props.clearSearchProductsInfo();
                  }
                }}
                onSubmitEditing={() => {
                  if (!!this.state.searchText) {
                    var currentRecentSearch = this.state.recentSearch;

                    var results = currentRecentSearch.filter(
                      obj => obj.title === this.state.searchText,
                    );
                    if (results.length === 0) {
                      if (currentRecentSearch.length > 3) {
                        currentRecentSearch.splice(0, 1);
                      }

                      currentRecentSearch.push({ title: this.state.searchText });

                      this.setState({ recentSearch: currentRecentSearch });

                      AsyncStoreViaKey(
                        AsyncKeysEnum.RECENT_SEAARCH,
                        currentRecentSearch,
                      );
                    }
                  }

                  this.onRefresh();
                }}
              />
              <TouchableOpacity
                onPress={() => {
                  this.setState({ searchText: '' });
                  this.props.clearSearchProductsInfo();
                }}>
                <Icon name="md-close-circle" style={{ fontSize: RFValue(15) }} />
              </TouchableOpacity>
            </Item>
            <Button
              transparent
              onPress={() => {
                this.onRefresh();
              }}>
              <Text>Search</Text>
            </Button>
          </Header>
        </View>

        <ScrollView keyboardShouldPersistTaps="always">
          <View style={{ flex: 1 }}>
            {/* {this.props.productsSearchedSuccessfully &&
              !this.props.isSearchingProducts &&
              this.props.searchedProducts.length === 0 && (
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
              )} */}
            <View>
              <FlatList
                removeClippedSubviews={false}
                data={this.state.filteredData}
                horizontal={false}
                renderItem={({ item, index }) => this.renderCellItem(item, index)}
                keyExtractor={(item, index) => item}
                keyboardShouldPersistTaps="always"
              // refreshControl={
              //   <RefreshControl
              //     tintColor={colors.appPurple}
              //     title={'Refreshing...'}
              //     titleColor={colors.appPurple}
              //     refreshing={this.props.isSearchingProducts}
              //     onRefresh={this.onRefresh}
              //   />
              // }
              />

              <View style={{ backgroundColor: colors.lightGray }}>
                <Text
                  style={{
                    fontWeight: '400',
                    fontSize: RFValue(17),
                    fontWeight: 'bold',
                    color: colors.black,
                    textTransform: 'capitalize',
                    marginLeft: 30,
                    paddingVertical: 10,
                  }}>
                  Recent Searches
                </Text>
              </View>

              <FlatList
                removeClippedSubviews={false}
                data={
                  this.state.recentSearch.length > 0
                    ? this.state.recentSearch
                    : [{ title: 'No Recent Searches' }]
                }
                horizontal={false}
                renderItem={({ item, index }) =>
                  this.renderCellRecentItem(item, index)
                }
                keyExtractor={(item, index) => item}
                keyboardShouldPersistTaps="always"
              />
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { appName, isAuthenticated } = state.authReducer;
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
  } = state.productReducer;

  return {
    appName,
    isAuthenticated,
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
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    searchProducts: keyword => dispatch(searchProducts(keyword)),
    clearSearchProductsInfo: () => dispatch(clearSearchProductsInfo()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchScreen);
