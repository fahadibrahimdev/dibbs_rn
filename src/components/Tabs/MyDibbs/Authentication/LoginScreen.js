import {Button} from 'native-base';
import React, {Component} from 'react';
import {
  Image,
  Keyboard,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {height as h, width as w} from 'react-native-dimension';
import {AccessToken, LoginButton} from 'react-native-fbsdk';
import {RFValue} from 'react-native-responsive-fontsize';
import {SafeAreaView} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
import {titles} from '../../../../constants/Localization';
import {ScreenNames} from '../../../../constants/ScreenNames';
import HeaderCenter from '../../../../CustomComponents/Header/HeaderCenter';
import AlertComponent from '../../../../helpers/AlertComponent';
import colors from '../../../../helpers/colors';
import {AsyncKeysEnum, LoginTypeEnum} from '../../../../helpers/enum';
import FullScreenLoader from '../../../../helpers/FullScreenLoader';
import {backImage, dibbsLogo} from '../../../../helpers/Images';
import {AsyncGetViaKey} from '../../../../helpers/LocalStorage/AsyncStorage';
import SocialButton from '../../../../helpers/SocialButton';
import TextInputWithLabel from '../../../../helpers/TextInputWithLabel';
import {goBack, navigate} from '../../../../helpers/Util';
import {loginUser, setDeviceToken} from '../../../../redux/actions/authActions';
import analytics from '@react-native-firebase/analytics';

class LoginScreen extends Component {
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

    if (Platform.OS === 'ios') {
      AsyncGetViaKey(AsyncKeysEnum.DEVICE_TOKEN).then(obj => {
        if (!!obj) {
          this.props.setDeviceToken({
            deviceToken: obj.deviceToken,
          });
        } else {
        }
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.isAuthenticated !== prevProps.isAuthenticated &&
      this.props.isAuthenticated === true &&
      this.props.loginType === LoginTypeEnum.LOGIN
    ) {
      let analyticsTitle =
        Platform.OS === 'android'
          ? 'MobileAppLoginAndroid'
          : 'MobileAppLoginIOS';
          
      this.onAnalyticsLogin(analyticsTitle, {
        gender: 'male',

      });
      goBack(this.props.navigation);
    }

    if (
      this.props.authenticationError !== prevProps.authenticationError &&
      this.props.authenticationError !== ''
    ) {
      this.showAlertModal('Error', this.props.authenticationError);
    }
  }

  onAnalyticsLogin = async (title, body) => {
    try {
      await analytics().logEvent(title, body);
    } catch (error) {}
  };

  // onAnalytics = async () => {
  //   try {
  //     await analytics().logEvent('MobileAppLoginIOS', {
  //       id: 3745092,
  //       // item: 'mens grey t-shirt',
  //       // description: ['round neck', 'long sleeved'],
  //       // size: 'L',
  //     });
  //   } catch (error) {}
  // };

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

        <HeaderCenter
          titleText={'LOGIN'}
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
          <Image
            // style={styles.stretch}
            style={{
              height: h(20),
              width: h(30),
              alignSelf: 'center',
              resizeMode: 'contain',
            }}
            source={dibbsLogo}
          />

          <Text
            style={{
              fontSize: RFValue(12),
              letterSpacing: 1,
              alignSelf: 'center',
              textTransform: 'uppercase',
              color: colors.appTextColor
            }}>
            SIGN IN TO SCORE ONE OF A KIND DEALS!
          </Text>

          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            {/* <Input placeholder="Username"  onChangeText={userEmail => this.setState({userEmail})} /> */}

            {/* <Text style={{
                        textAlign: 'center', color: colors.appTextColor,
                        fontFamily: (Platform.OS === 'android') ? ('digital-7 (italic)') : ('Digital-7Italic'),
                        fontSize: RFValue(60),

                    }}>Login</Text> */}

            <TextInputWithLabel
              label={'Email*'}
              keyboardType={'email-address'}
              autoCapitalize={'none'}
              value={this.state.email}
              onChange={text => {
                this.setState({
                  email: text,
                });
              }}
              placeHolder={'Email'}
              outerContainerStyles={{width: '80%'}}
              ref={this.emailRef}
              returnKeyType={'next'}
              nextRef={this.passwordRef}
            />

            <TextInputWithLabel
              label={'password*'}
              value={this.state.password}
              onChange={text => {
                this.setState({
                  password: text,
                });
              }}
              placeHolder={'Enter your Password'}
              outerContainerStyles={{width: '80%'}}
              secureTextEntry={true}
              ref={this.passwordRef}
              returnKeyType={'done'}
            />

            <TouchableOpacity
              style={{alignSelf: 'flex-end'}}
              onPress={() => {
                navigate(
                  this.props.navigation,
                  ScreenNames.ForgotPasswordScreen,
                );
              }}>
              <Text
                style={[
                  styles.loginText,
                  {
                    color: colors.appPurple,
                    fontSize: RFValue(13),
                    alignSelf: 'flex-end',
                    marginRight: h(5),
                    marginTop: h(3),
                  },
                ]}>
                Forgot Password
              </Text>
            </TouchableOpacity>

            {false && (
              <Text
                style={{
                  fontSize: RFValue(12),
                  marginTop: h(3),
                  padding: h(1),
                  textAlign: 'center',
                  marginHorizontal: h(5),
                  color: colors.appTextColor
                }}>
                By clicking on option below I agree in the &nbsp;
                <Text
                  style={[
                    styles.loginText,
                    {
                      color: colors.appPurple,
                      fontSize: RFValue(13),
                      textDecorationLine: 'underline',
                    },
                  ]}>
                  Terms of Use
                </Text>
                &nbsp; and have read the &nbsp;
                <Text
                  style={[
                    styles.loginText,
                    {
                      color: colors.appPurple,
                      fontSize: RFValue(12),
                      textDecorationLine: 'underline',
                    },
                  ]}>
                  Privacy Statement
                </Text>
              </Text>
            )}
          </View>

          <Button
            light
            // onPress={()=>logIn()}
            onPress={() => {
              Keyboard.dismiss();
              if (this.validate()) {
                this.props.loginUser(this.state.email, this.state.password);
              }
            }}
            // onPress={()=>this.props.login({this.state.userEmail})}
            rounded
            style={styles.btnStyle}
            // iconLeft
          >
            <Text style={styles.textStyle}>Sign In</Text>
          </Button>

          {/* <Button
            light
            // onPress={()=>logIn()}
            onPress={() => {
              Keyboard.dismiss();
              this.onAnalytics();
            }}
            // onPress={()=>this.props.login({this.state.userEmail})}
            rounded
            style={styles.btnStyle}
            // iconLeft
          >
            <Text style={styles.textStyle}>Test Analytics</Text>
          </Button> */}

          <TouchableOpacity
            style={{alignSelf: 'center'}}
            onPress={() => {
              navigate(this.props.navigation, ScreenNames.SignUpScreen);
            }}>
            <Text
              style={[
                styles.loginText,
                {
                  color: colors.appPurple,
                  fontSize: RFValue(13),
                  alignSelf: 'flex-end',
                  marginTop: h(4),
                },
              ]}>
              Create New Account?
            </Text>
          </TouchableOpacity>

          <View
            style={{
              alignSelf: 'center',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: RFValue(12),
                marginTop: h(3),
                padding: h(0.5),
                textAlign: 'center',
                marginHorizontal: h(5),
                color: colors.appTextColor
              }}>
              By signing in you agree to our &nbsp;
            </Text>

            <View style={{flexDirection: 'row', padding: h(0.5)}}>
              <TouchableOpacity
                onPress={() => {
                  navigate(
                    this.props.navigation,
                    ScreenNames.TermsAndConditionsScreen,
                  );
                }}>
                <Text
                  style={[
                    styles.loginText,
                    {
                      color: colors.appPurple,
                      fontSize: RFValue(12),
                      textDecorationLine: 'underline',
                    },
                  ]}>
                  Terms of use
                </Text>
              </TouchableOpacity>

              <Text
                style={{
                  fontSize: RFValue(12),
                  textAlign: 'center',
                  color: colors.appTextColor
                }}>
                &nbsp; and to our &nbsp;
              </Text>

              <TouchableOpacity
                onPress={() => {
                  navigate(
                    this.props.navigation,
                    ScreenNames.PrivacyPolicyScreen,
                  );
                }}>
                <Text
                  style={[
                    styles.loginText,
                    {
                      color: colors.appPurple,
                      fontSize: RFValue(12),
                      textDecorationLine: 'underline',
                    },
                  ]}>
                  Privacy Policy.
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {false && (
            <SocialButton
              color="#3c53c8"
              icon="facebook-with-circle"
              name="Facebook"
              onPress={() => {
                this.showAlertModal(
                  'TODO',
                  'This feature is currently inprogress!',
                );
              }}
              containerStyle={{
                marginTop: h(2),
                height: h(6.5),
                width: '50%',
                alignSelf: 'center',
              }}
            />
          )}

          {false && (
            <LoginButton
              style={{height: 0, width: 0}}
              // style={{ display: 'none'}}
              onLoginFinished={(error, result) => {
                if (error) {
                  console.log('login has error: ' + result.error);
                } else if (result.isCancelled) {
                  console.log('login is cancelled.');
                } else {
                  AccessToken.getCurrentAccessToken().then(data => {
                    console.log(data.accessToken.toString());
                  });
                }
              }}
              onLogoutFinished={() => console.log('logout.')}
            />
          )}
        </ScrollView>

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
  return {
    appName,
    isVerifying,
    isAuthenticated,
    loginType,
    authenticationError,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    loginUser: (email, password) => dispatch(loginUser(email, password)),
    setDeviceToken: obj => dispatch(setDeviceToken(obj)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
