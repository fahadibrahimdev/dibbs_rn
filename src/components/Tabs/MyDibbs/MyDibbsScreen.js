import React, {Component} from 'react';
import {
  FlatList,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {height as h, width as w} from 'react-native-dimension';
import {RFValue} from 'react-native-responsive-fontsize';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';
import {strings, titles} from '../../../constants/Localization';
import {ScreenNames} from '../../../constants/ScreenNames';
import AlertComponent from '../../../helpers/AlertComponent';
import colors from '../../../helpers/colors';
import {AlertTypesEnum} from '../../../helpers/enum';
import HeaderCompoenent from '../../../helpers/HeaderCompoenent';
import {navigate, navigateWithParams} from '../../../helpers/Util';
import {logout} from '../../../redux/actions/authActions';
import DeviceInfo from 'react-native-device-info';

class MyDibbsScreen extends Component {
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

      intervalModeList: [
        {
          name: 'Notification Settings',
          code: 'Notifications',
          icon: 'notifications',
        },
        {name: 'Customer Support', code: 'Support', icon: 'person'},
        {name: 'About DIBBS', code: 'About', icon: 'information-circle'},
        {name: 'Feature A Deal On DIBBS', code: 'Features', icon: 'cube'},
        {name: 'Frequently asked questions', code: 'FAQs', icon: 'chatbubbles'},
      ],
      intervalModeWithLogoutList: [
        {
          name: 'Notification Settings',
          code: 'Notifications',
          icon: 'notifications',
        },
        {name: 'Customer Support', code: 'Support', icon: 'person'},
        {name: 'About DIBBS', code: 'About', icon: 'information-circle'},
        {name: 'Share App', code: 'ShareApp', icon: 'md-share'},
        {name: 'Feature A Deal On DIBBS', code: 'Features', icon: 'cube'},
        {name: 'Frequently asked questions', code: 'FAQs', icon: 'chatbubbles'},
        {
          name: 'Logout',
          code: 'LOGOUT',
          icon: 'log-out',
          color: colors.redDestructive,
        },
      ],
    };
  }

  componentDidMount() {}

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

  //REMARK: - Actions
  btnActionLoginSignup = () => {
    if (this.props.isAuthenticated) {
    } else {
      navigateWithParams(this.props.navigation, ScreenNames.LoginScreen, {
        callBackCustomLogin: this.callBackCustomLogin,
      });
    }
  };

  alertForLogout() {
    this.showAlertModal(
      'Alert',
      titles.logout,
      AlertTypesEnum.Logout,
      true,
      'Cancel',
      false,
      true,
      'Logout',
      true,
    );
  }

  btnActionAddIntverals = () => {
    // navigateWithParams(this.props.navigation, ScreenNames.AddAndEditIntervalScreen, {
    //     intervalList: this.state.intervalModeList,
    //     addFlag: true,
    //     callBackCustomIntervalAdded: this.callBackCustomIntervalAdded,
    // });
  };

  btnActionIntervalDetail = (item, index) => {
    // navigateWithParams(this.props.navigation, ScreenNames.DetailIntervalMode, { item: item });

    if (item.code === 'FAQs') {
      navigate(this.props.navigation, ScreenNames.FAQsScreen);
    } else if (item.code === 'Notifications') {
      navigate(this.props.navigation, ScreenNames.NotificationSettingsScreen);
    } else if (item.code === 'Support') {
      if (this.props.isAuthenticated) {
        navigate(this.props.navigation, ScreenNames.CustomerSupportScreen);
      } else {
        this.showAlertModal('Alert', titles.loginRequired);
      }
    } else if (item.code === 'Features') {
      navigate(this.props.navigation, ScreenNames.FeaturesScreen);
    } else if (item.code === 'About') {
      navigate(this.props.navigation, ScreenNames.AboutScreen);
    } else if (item.code === 'ShareApp') {
      navigate(this.props.navigation, ScreenNames.ShareAppScreen);
    } else if (item.code === 'LOGOUT') {
      this.alertForLogout();
    }
  };

  //RMEARK: - CallBacks
  callBackCustomLogin = item => {};

  //REMARK: - Separator Line
  renderSeparator = styleProps => {
    return (
      <View
        style={[
          {
            height: 0.3,
            backgroundColor: colors.lightGray,
            marginLeft: 0,
            marginRight: 0,
          },
          styleProps,
        ]}
      />
    );
  };
  //REMARK: - Different Modes Interval Flat List
  renderIntervalModeFlatList() {
    return (
      <View
        style={{
          marginTop: h(1),
          backgroundColor: colors.intervalCellBackground,
        }}>
        <FlatList
          data={
            !this.props.isAuthenticated
              ? this.state.intervalModeList
              : this.state.intervalModeWithLogoutList
          }
          horizontal={false}
          renderItem={({item, index}) =>
            this.renderCellIntervalModeItem(item, index)
          }
          keyExtractor={(item, index) => item + index}
          keyboardShouldPersistTaps="always"
        />
      </View>
    );
  }
  renderCellIntervalModeItem = (item, index) => {
    return (
      <View
        key={'MyDibbsScreen' + index}
        style={{
          justifyContent: 'center',
          marginLeft: h(1),
          borderBottomWidth: 1,
          paddingBottom: h(1.5),
        }}>
        <TouchableOpacity
          onPress={this.btnActionIntervalDetail.bind(this, item, index)}>
          <View
            style={{
              marginTop: h(1),
              marginLeft: h(1),
              flexDirection: 'row',
              alignItems: 'center',
              width: '100%',
            }}>
            <Ionicons
              name={item.icon}
              size={h(3)}
              color={!!item.color ? item.color : colors.black}
            />

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
                {item.name}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    const {isAuthenticated, userInfo} = this.props;

    let appVersion = '';
    if (Platform.OS === 'ios') {
      appVersion =
        DeviceInfo.getVersion() + ' (' + DeviceInfo.getBuildNumber() + ')';
    } else {
      appVersion = DeviceInfo.getVersion();
    }
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
            if (this.state.alertProps.alertType === AlertTypesEnum.Logout) {
              this.props.logout();
            }

            this.setAlertModalVisible(false);
          }}
          width={w(85)}
        />
        <HeaderCompoenent
          headingTitle={strings.myDibbs}
          titleAlignment={'center'}
          iconR1={'md-cart'}
          onIconR1Press={() => {
            navigate(this.props.navigation, ScreenNames.CartScreen);
          }}
          // iconR2={'md-share'}
          // onIconR2Press={() => {
          //   this.btnActionAddIntverals();
          // }}
        />
        <ScrollView keyboardShouldPersistTaps="always">
          {/* <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: h(1),
              padding: h(1),
            }}>
            <Text
              style={{
                color: colors.appTextColor,
                fontSize: RFValue(20),
                fontFamily: 'SFProText-Medium',
              }}>
              {strings.myDibbs}
            </Text>

            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                position: 'absolute',
                justifyContent: 'flex-end',
              }}>
              <TouchableOpacity
                style={{
                  alignSelf: 'flex-end',
                }}
                onPress={this.btnActionAddIntverals}>
                <Ionicons name="md-cart" size={h(4)} color={colors.black} />
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  alignSelf: 'flex-end',
                  marginLeft: h(2),
                }}
                onPress={this.btnActionAddIntverals}>
                <Ionicons name="md-share" size={h(4)} color={colors.black} />
              </TouchableOpacity>
            </View>
          </View> */}

          <View>
            <TouchableOpacity onPress={this.btnActionLoginSignup}>
              <Text
                style={{
                  width: '100%',
                  textAlign: 'center',
                  color: colors.appTextColor,
                  fontSize: RFValue(22),
                  marginTop: h(2),
                  backgroundColor: colors.cellColor,
                  paddingVertical: h(0.5),
                  fontFamily: 'SFProText-Medium',
                }}>
                {isAuthenticated
                  ? userInfo.first_name + ' ' + userInfo.last_name
                  : strings.loginSignup}
              </Text>
              {isAuthenticated && (
                <Text
                  style={{
                    width: '100%',
                    textAlign: 'center',
                    color: colors.appTextColor,
                    fontSize: RFValue(15),
                    paddingBottom: h(0.5),
                    backgroundColor: colors.cellColor,
                  }}>
                  {userInfo.email}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {isAuthenticated && (
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                width: '100%',
                backgroundColor: colors.cellColor,
                marginTop: h(2),
                alignItems: 'center',
                paddingVertical: h(0.5),
              }}
              onPress={() => {
                navigate(this.props.navigation, ScreenNames.MyOrdersScreen);
              }}>
              <Ionicons
                style={{marginLeft: h(2)}}
                name={'receipt-sharp'}
                size={h(3)}
                color={colors.black}
              />

              <Text
                style={{
                  color: colors.appTextColor,
                  fontSize: RFValue(22),
                  marginLeft: h(2),
                  fontFamily: 'SFProText-Medium',
                }}>
                View My Deals
              </Text>
            </TouchableOpacity>
          )}

          <View>
            <Text
              style={{
                textAlign: 'left',
                color: colors.appTextColor,
                fontSize: RFValue(20),
                marginLeft: h(2),
                marginTop: h(4),
                fontFamily: 'SFProText-Medium',
              }}>
              {strings.mySettings}
            </Text>
          </View>
          {this.renderIntervalModeFlatList()}
          <View
            style={{
              // flex: 1,
              // justifyContent: 'center',
              alignItems: 'center',
              marginTop: 20,
            }}>
            <Text
              style={{
                color: 'black',
                fontSize: 15,
                fontWeight: 'bold',
              }}>
              Version:{` ${appVersion}`}
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const {appName, appState, isAuthenticated, userInfo} = state.authReducer;
  return {
    appName,
    appState,
    isAuthenticated,
    userInfo,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    logout: () => dispatch(logout()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyDibbsScreen);
