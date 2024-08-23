import {Button} from 'native-base';
import React, {Component} from 'react';
import {
  Image,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Share,
  View,
  Platform,
} from 'react-native';
import {height as h, width as w} from 'react-native-dimension';
import {AccessToken, LoginButton} from 'react-native-fbsdk';
import {RFValue} from 'react-native-responsive-fontsize';
import {SafeAreaView} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
import {titles} from '../../../constants/Localization';
import {ScreenNames} from '../../../constants/ScreenNames';
import HeaderCenter from '../../../CustomComponents/Header/HeaderCenter';
import AlertComponent from '../../../helpers/AlertComponent';
import colors from '../../../helpers/colors';
import {APP_URLS, LoginTypeEnum} from '../../../helpers/enum';
import FullScreenLoader from '../../../helpers/FullScreenLoader';
import {backImage, dibbsLogo} from '../../../helpers/Images';
import SocialButton from '../../../helpers/SocialButton';
import TextInputWithLabel from '../../../helpers/TextInputWithLabel';
import {goBack, headingAlert, navigate} from '../../../helpers/Util';
import {loginUser} from '../../../redux/actions/authActions';

class ShareAppScreen extends Component {
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

    email: '',
    password: '',
  };

  constructor(props) {
    super(props);

    this.emailRef = React.createRef();
    this.passwordRef = React.createRef();
  }

  componentDidMount() {
    //onSuccess
    //this.props.route.params.callBackCustomLogin(obj);
    //this.props.navigation.goBack(null);
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.isAuthenticated !== prevProps.isAuthenticated &&
      this.props.isAuthenticated === true &&
      this.props.loginType === LoginTypeEnum.LOGIN
    ) {
      goBack(this.props.navigation);
    }

    if (
      this.props.authenticationError !== prevProps.authenticationError &&
      this.props.authenticationError !== ''
    ) {
      this.showAlertModal('Error', this.props.authenticationError);
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
    const {email, password} = this.state;
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

    if (email === '') {
      this.showAlertModal('Validation Error', 'Please enter your email!');
      return false;
    } else if (reg.test(email) === false) {
      this.showAlertModal('Validation Error', 'Email is invalid!');
      return false;
    }

    if (password === '') {
      this.showAlertModal('Validation Error', 'Please enter your password!');
      return false;
    }
    // else if (password.length < 6) {
    //   this.showAlertModal('Validation Error', 'Password can't be less than 6 digits!');
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
    const {isVerifying} = this.props;

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
          <HeaderCenter
            titleText={'Share App'}
            cardStyle={true}
            leftImageSource={backImage}
            onPressLeftButton={() => {
              this.props.navigation.goBack(null);
            }}
            leftType="image"
          />
          <ScrollView
            // contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
            style={{marginBottom: h(3)}}
            keyboardShouldPersistTaps="always">
            <View
              style={{
                height: h(90),
                alignItems: 'center',
                backgroundColor: '#f8f2feEE',
              }}>
              <Text
                style={{
                  fontSize: RFValue(20),
                  fontWeight: 'bold',
                  letterSpacing: 1,
                  alignSelf: 'center',
                  textTransform: 'uppercase',
                  marginTop: h(10),
                }}>
                Refferal Code
              </Text>

              <Text
                style={{
                  fontSize: RFValue(20),
                  fontWeight: 'bold',
                  letterSpacing: 1,
                  alignSelf: 'center',
                  textTransform: 'uppercase',
                }}>
                {this.props.referralCode}
              </Text>

              <View style={{marginTop: h(20)}}>
                <Button
                  light
                  onPress={() => {
                    // const title =
                    //   'Download the Dibbs app from the Play Store: ' +
                    //   this.props.appUrl;

                    const title = 'Welcome to Dibbs';

                    const data =
                      title +
                      '\n\n' +
                      'Use this referral code during sign up: ' +
                      this.props.referralCode +
                      ('\n\niOS: ' +
                        APP_URLS.appURLiOSBetaTesting +
                        '\n\nAndroid: ' +
                        APP_URLS.appURLandroid) +
                      '\n\nWebsite: https://thedibbsapp.com';

                    const url = 'https://thedibbsapp.com';
                    this.onShare(title, data, url);
                  }}
                  rounded
                  style={styles.btnStyle}
                  // iconLeft
                >
                  <Text style={styles.textStyle}>Share with others</Text>
                </Button>
              </View>
            </View>
          </ScrollView>
        </View>

        <FullScreenLoader
          title={titles.fullScreenLoaderTitle}
          loading={isVerifying}
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
    width: '50%',
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
  } = state.authReducer;

  const {referralCode, appUrl} = state.productReducer;

  return {
    appName,
    isVerifying,
    isAuthenticated,
    loginType,
    authenticationError,
    referralCode,
    appUrl,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    loginUser: (email, password) => dispatch(loginUser(email, password)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ShareAppScreen);
