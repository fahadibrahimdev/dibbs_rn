import { Switch } from 'native-base';
import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { height as h, width as w } from 'react-native-dimension';
import { RFValue } from 'react-native-responsive-fontsize';
import { SafeAreaView } from 'react-native-safe-area-context';
import { connect } from 'react-redux';
import { titles } from '../../../constants/Localization';
import HeaderCenter from '../../../CustomComponents/Header/HeaderCenter';
import AlertComponent from '../../../helpers/AlertComponent';
import colors from '../../../helpers/colors';
import { LoginTypeEnum } from '../../../helpers/enum';
import FullScreenLoader from '../../../helpers/FullScreenLoader';
import { backImage } from '../../../helpers/Images';
import { updateSettings } from '../../../redux/actions/authActions';

class NotificationSettingsScreen extends Component {
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

      switchFlag: true,
    };
  }

  componentDidMount() {
    this.setState({
      switchFlag: this.props.notificationSettingsCurrentValue,
    });
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.isUpdatingSettings !== prevProps.isUpdatingSettings &&
      this.props.isUpdatingSettings === false
    ) {
      this.setState({switchFlag: this.props.notificationSettingsCurrentValue});
    }

    if (
      this.props.updatingSettingsError !== prevProps.updatingSettingsError &&
      this.props.updatingSettingsError !== ''
    ) {
      
      this.showAlertModal('Error', this.props.updatingSettingsError);
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

  render() {
    return (
      <SafeAreaView
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
            this.setAlertModalVisible(false);
          }}
          width={w(85)}
        />
        <HeaderCenter
          titleText={'Notification'}
          cardStyle={true}
          leftImageSource={backImage}
          onPressLeftButton={() => {
            this.props.navigation.goBack(null);
          }}
          leftType="image"
        />

        <Text
          style={{
            marginLeft: RFValue(15),
            marginTop: RFValue(30),
            fontSize: RFValue(15),
          }}>
          Push Notifications
        </Text>

        <View
          style={{
            width: '99%',
            alignSelf: 'center',
            marginTop: h(2),
            borderRadius: 3,
            borderColor: colors.black,
            borderWidth: 0.5,
            backgroundColor: colors.white,
            elevation: h(1),
          }}>
          <View style={{padding: RFValue(15)}}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{fontSize: RFValue(15), fontWeight: 'bold'}}>
                Allow Notification
              </Text>
              <Switch
                // trackColor={{ false: "#767577", true: "#81b0ff" }}
                // thumbColor={true ? "#f5dd4b" : "#f4f3f4"}
                // ios_backgroundColor="#3e3e3e"
                onValueChange={value => {
                  this.setState({
                    switchFlag: value,
                  });
                  this.props.updateSettings(value === true ? 'Y' : 'N');
                }}
                value={
                  this.props.loginType === LoginTypeEnum.NONE
                    ? true
                    : this.state.switchFlag
                }
                disabled={this.props.loginType === LoginTypeEnum.NONE}
              />
            </View>
            <Text style={{fontSize: RFValue(15), marginTop: RFValue(20)}}>
              Receive personalized notification from DIBBS including deals and
              promotions
            </Text>
          </View>

          <FullScreenLoader
            title={titles.fullScreenLoaderTitle}
            loading={this.props.isUpdatingSettings}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const {
    appName,
    loginType,
    isUpdatingSettings,
    settingsUpdatedSuccessfully,
    notificationSettingsCurrentValue,
    updatingSettingsError
  } = state.authReducer;

  return {
    appName,
    loginType,
    isUpdatingSettings,
    settingsUpdatedSuccessfully,
    notificationSettingsCurrentValue,
    updatingSettingsError
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    updateSettings: notificattionFlag =>
      dispatch(updateSettings(notificattionFlag)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NotificationSettingsScreen);
