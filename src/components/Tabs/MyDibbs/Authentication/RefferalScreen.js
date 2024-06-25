import { Button } from 'native-base';
import React, { Component } from 'react';
import {
  Image,
  Keyboard,
  ScrollView, Share, StyleSheet,
  Text, View
} from 'react-native';
import { height as h, width as w } from 'react-native-dimension';
import { RFValue } from 'react-native-responsive-fontsize';
import { SafeAreaView } from 'react-native-safe-area-context';
import { connect } from 'react-redux';
import { titles } from '../../../../constants/Localization';
import { ScreenNames } from '../../../../constants/ScreenNames';
import AlertComponent from '../../../../helpers/AlertComponent';
import colors from '../../../../helpers/colors';
import { AlertTypesEnum } from '../../../../helpers/enum';
import FullScreenLoader from '../../../../helpers/FullScreenLoader';
import { dibbsLogo } from '../../../../helpers/Images';
import TextInputWithLabel from '../../../../helpers/TextInputWithLabel';
import {
  submitRefferalCode
} from '../../../../redux/actions/authActions';

class RefferalScreen extends Component {
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

    referralCode: '',
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  componentDidUpdate(prevProps) {
    if (
      this.props.referralCodeSubmittedSuccessfully !==
        prevProps.referralCodeSubmittedSuccessfully &&
      this.props.referralCodeSubmittedSuccessfully === true
    ) {
      this.showAlertModal(
        'Success',
        'Refferal Code submitted successfully.',
        AlertTypesEnum.RefferalCode,
      );
    }

    if (
      this.props.referralCodeSubmitError !==
        prevProps.referralCodeSubmitError &&
      this.props.referralCodeSubmitError !== ''
    ) {
      this.showAlertModal('Error', this.props.referralCodeSubmitError);
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

  validate = () => {
    const {referralCode} = this.state;
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

    if (!!referralCode === false) {
      this.showAlertModal(
        'Validation Error',
        'Please enter your Refferal Code!',
      );
      return false;
    }
    // else if (referralCode.length !== 5) {
    //   this.showAlertModal('Validation Error', 'Refferal Code is invalid!');
    //   return false;
    // }

    return true;
  };

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
    const {isSubmittingRefferalCode} = this.props;

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

            if (
              this.state.alertProps.alertType === AlertTypesEnum.RefferalCode
            ) {
              this.props.navigation.replace(ScreenNames.BottomNavigator);
            }
          }}
          width={w(85)}
        />

        <View style={{position: 'absolute'}}>
          <Image
            // style={styles.stretch}
            style={{
              width: w(100),
              height: h(100),
              alignSelf: 'center',
              resizeMode: 'cover',
            }}
            source={dibbsLogo}
          />
        </View>
        <View style={{flex: 1}}>
          <ScrollView
            // contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
            style={{marginBottom: h(3)}}
            keyboardShouldPersistTaps="always">
            <View
              style={{
                height: h(90),
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#f8f2feEE',
              }}>
              <Text
                style={{
                  fontSize: RFValue(20),
                  letterSpacing: 1,
                  alignSelf: 'center',
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  color: colors.appTextColor
                }}>
                YOUR ACCOUNT WAS CREATED SUCCESSFULLY
              </Text>

              <Text
                style={{
                  fontSize: RFValue(12),
                  letterSpacing: 1,
                  alignSelf: 'center',
                  textAlign: 'center',
                  // textTransform: 'uppercase',
                  marginTop: h(10),
                  color: colors.appTextColor
                }}>
                Did a friend invite you? Give them credit by using their
                referral code.
              </Text>

              <TextInputWithLabel
                label={'Refferal Code*'}
                value={this.state.referralCode}
                onChange={text => {
                  this.setState({
                    referralCode: text,
                  });
                }}
                placeHolder={'Enter Refferal Code'}
                placeholderTextColor={'#707372'}
                outerContainerStyles={{width: '80%'}}
                returnKeyType={'done'}
              />

              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingLeft: w(5),
                  paddingRight: w(5),
                }}>
                <Button
                  light
                  onPress={() => {
                    Keyboard.dismiss();
                    this.props.navigation.replace(ScreenNames.BottomNavigator);
                  }}
                  rounded
                  style={styles.btnStyle}
                  // iconLeft
                >
                  <Text style={styles.textStyle}>Skip</Text>
                </Button>

                <Button
                  light
                  onPress={() => {
                    Keyboard.dismiss();
                    if (this.validate()) {
                      this.props.submitRefferalCode(this.state.referralCode);
                    }
                  }}
                  rounded
                  style={styles.btnStyle}
                  // iconLeft
                >
                  <Text style={styles.textStyle}>Submit</Text>
                </Button>
              </View>
            </View>
          </ScrollView>
        </View>

        <FullScreenLoader
          title={titles.fullScreenLoaderTitle}
          loading={isSubmittingRefferalCode}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  btnStyle: {
    justifyContent: 'center',
    marginTop: h(5),
    backgroundColor: colors.lightGray,
    height: h(6.5),
    width: '40%',
    alignSelf: 'center',
  },
  textStyle: {
    width: '100%',
    textAlign: 'center',
    fontSize: RFValue(15),
    color: 'black',
    fontWeight: 'bold',
  },
  loginText: {
    fontSize: RFValue(14),
    color: 'blue',
    textDecorationColor: 'blue',
  },
});

const mapStateToProps = (state, ownProps) => {
  const {
    appName,
    isVerifying,
    isAuthenticated,
    loginType,
    authenticationError,

    isSubmittingRefferalCode,
    referralCodeSubmittedSuccessfully,
    referralCodeSubmitError,
  } = state.authReducer;

  const {referralCode} = state.productReducer;

  return {
    appName,
    isVerifying,
    isAuthenticated,
    loginType,
    authenticationError,
    isSubmittingRefferalCode,
    referralCodeSubmittedSuccessfully,
    referralCodeSubmitError,
    referralCode,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    submitRefferalCode: referralCode =>
      dispatch(submitRefferalCode(referralCode)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RefferalScreen);
