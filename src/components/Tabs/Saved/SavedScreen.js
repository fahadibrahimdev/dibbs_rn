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
import Ionicons from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';
import {APP_CONSTANTS} from '../../../constants/APIs';
import {strings, titles} from '../../../constants/Localization';
import {ScreenNames, TabScreenNames} from '../../../constants/ScreenNames';
import colors from '../../../helpers/colors';
import FullScreenLoader from '../../../helpers/FullScreenLoader';
import HeaderCompoenent from '../../../helpers/HeaderCompoenent';
import {dibbsLogo} from '../../../helpers/Images';
import {
  navigate,
  navigateWithParams,
  stringToNumber,
} from '../../../helpers/Util';
import {
  getMySavedProducts,
  removeProduct,
} from '../../../redux/actions/productActions';
const Image = createImageProgress(FastImage);

class SavedScreen extends Component {
  state = {
    filteredData: [],
  };

  componentDidMount() {}

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

  onRefresh = () => {
    this.props.getMySavedProducts();
  };

  renderCellItem = (item, index) => {
    return (
      <View
        style={{
          width: '100%',
          height: h(24),
          marginTop: h(2),
          paddingTop: h(2),
        }}>
        <TouchableOpacity
          style={{
            width: '90%',
            height: h(22),
            alignSelf: 'center',
            borderRadius: h(2),
            borderColor: colors.black,
            borderWidth: 0.5,
            // elevation: h(2),
            backgroundColor: colors.white,
          }}
          activeOpacity={0.8}
          onPress={() => {
            item.prodData.mySavedProduct = 'Y';

            navigateWithParams(
              this.props.navigation,
              ScreenNames.ProductDetailScreen,
              {
                productDetails: item.prodData,
              },
            );
          }}>
          <View style={{width: '100%', height: '100%', flexDirection: 'row'}}>
            <View
              style={{
                flex: 0.3,
                borderTopLeftRadius: h(2),
                borderBottomLeftRadius: h(2),
                backgroundColor: '#115588',
                padding: 0.5,
              }}>
              {!!item.prodData.images && item.prodData.images.length > 0 ? (
                <Image
                  source={{
                    uri: item.prodData.images[0].image_full,
                  }}
                  indicator={ProgressBar}
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                  imageStyle={{
                    backgroundColor: '#281656',
                    resizeMode: 'cover',
                    borderTopLeftRadius: h(2),
                    borderBottomLeftRadius: h(2),
                  }}
                />
              ) : (
                <Image_ReactNative
                  source={dibbsLogo}
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#281656',
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
                paddingLeft: RFValue(5),
                paddingRight: h(0),
              }}>
              <View style={{flex: 1, marginTop: RFValue(10)}}>
                <Text
                  style={{
                    fontWeight: '400',
                    fontSize: RFValue(22),
                    color: '#22044e',
                    textTransform: 'capitalize',
                  }}
                  numberOfLines={1}>
                  {item.prodData.product_name}
                </Text>

                <Text
                  numberOfLines={2}
                  style={{color: 'black', fontSize: RFValue(14)}}>
                  {!!item.prodData.description
                    ? item.prodData.description
                    : ' - '}
                </Text>

                <View
                  style={{
                    flex: 1,
                    justifyContent: 'flex-start',
                    marginTop: RFValue(10),
                    marginBottom: h(1),
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    <Text
                      style={{
                        color: colors.appPurple,
                        fontWeight: 'bold',
                        fontSize: RFValue(15),
                      }}>
                      $
                      {stringToNumber(
                        item.prodData.price - item.prodData.discount,
                      ).toFixed(2)}
                    </Text>

                    {Math.floor(
                      (item.prodData.discount / item.prodData.price) * 100,
                    ).toFixed(0) != 0 && (
                      <Text
                        style={{
                          color: 'black',
                          textDecorationLine: 'line-through',
                          marginLeft: h(1),
                          fontSize: RFValue(15),
                        }}>
                        ${stringToNumber(item.prodData.price).toFixed(2)}
                      </Text>
                    )}
                  </View>
                  {/* <Text style={{color: 'grey'}}>tags</Text> */}

                  <View
                    style={{
                      alignSelf: 'flex-start',
                      marginTop: RFValue(10),
                      marginRight: RFValue(20),
                    }}>
                    {Math.floor(
                      (item.prodData.discount / item.prodData.price) * 100,
                    ).toFixed(0) != 0 && (
                      <View
                        style={{
                          width: w(25),
                          borderRadius: h(50),
                          // marginLeft: h(1),
                          backgroundColor: colors.appGray,
                        }}>
                        <Text
                          style={{
                            textAlign: 'center',
                            color: colors.appPurple,
                            fontSize: RFValue(15),
                          }}>
                          {Math.floor(
                            (item.prodData.discount / item.prodData.price) *
                              100,
                          ).toFixed(0)}
                          % off
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        <View
          style={{
            position: 'absolute',
            alignSelf: 'flex-end',
            // backgroundColor: '#998877',
          }}>
          <TouchableOpacity
            style={{
              height: h(4.5),
              width: h(4.5),
              marginRight: RFValue(2),
              marginTop: RFValue(1),
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'flex-end',
            }}
            onPress={() => {
              this.props.removeProduct(item.prodData.product_id);
            }}>
            <Ionicons name={'md-close-circle'} size={h(4)} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  render() {
    return (
      <View
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
          <HeaderCompoenent
            headingTitle={strings.savedDibbs}
            titleAlignment={'flex-start'}
            iconR1={'md-cart'}
            onIconR1Press={() => {
              navigate(this.props.navigation, ScreenNames.CartScreen);
            }}
            // iconR2={'md-share'}
            // onIconR2Press={() => {
            //   onShare({
            //     title: '',
            //     msg: 'http://thedibbsapp.com/',
            //     url: '',
            //   });
            // }}
          />

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
                          <Ionicons name="heart" color="#502a7e" size={h(7)} />
                        </View>
                      </View>
                      <View
                        style={{
                          justifyContent: 'center',
                          borderColor: 'transparent',
                          marginTop: h(3),
                        }}>
                        <Text
                          style={{fontSize: RFValue(22), fontWeight: 'bold'}}>
                          You haven't Added any deals{' '}
                        </Text>
                      </View>
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderColor: 'transparent',
                        }}>
                        <Text style={{fontSize: RFValue(12), color: 'black'}}>
                          Tap the heart icon to add any deals{' '}
                        </Text>
                      </View>

                      <Button
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
                      </Button>
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
                keyExtractor={(item, index) => item}
                keyboardShouldPersistTaps="always"
                refreshControl={
                  <RefreshControl
                    tintColor={colors.appPurple}
                    title={'Refreshing...'}
                    titleColor={colors.appPurple}
                    refreshing={this.props.isFetchingMySavedProducts}
                    onRefresh={this.onRefresh}
                  />
                }
              />
            )}
          </View>
        </View>

        <FullScreenLoader
          title={titles.fullScreenLoaderTitle}
          loading={this.props.isFetchingMySavedProducts}
        />
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const {appName} = state.authReducer;
  const {
    isFetchingMySavedProducts,
    mySavedProducts,
    mySavedProductsError,
    productDeletedSuccessfully,
  } = state.productReducer;

  return {
    appName,
    isFetchingMySavedProducts,
    mySavedProducts,
    mySavedProductsError,
    productDeletedSuccessfully,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    getMySavedProducts: () => dispatch(getMySavedProducts()),
    removeProduct: productID => dispatch(removeProduct(productID)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SavedScreen);
