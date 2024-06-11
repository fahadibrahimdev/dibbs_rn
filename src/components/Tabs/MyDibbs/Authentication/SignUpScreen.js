import { Picker } from '@react-native-picker/picker';
import { CommonActions } from '@react-navigation/native';
import { Button } from 'native-base';
import React, { Component } from 'react';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { height as h, width as w } from 'react-native-dimension';
import { AccessToken, LoginButton } from 'react-native-fbsdk';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { RFValue } from 'react-native-responsive-fontsize';
import { SafeAreaView } from 'react-native-safe-area-context';
import { connect } from 'react-redux';
import HeaderCenter from '../../../../CustomComponents/Header/HeaderCenter';
import { titles } from '../../../../constants/Localization';
import { ScreenNames } from '../../../../constants/ScreenNames';
import AlertComponent from '../../../../helpers/AlertComponent';
import FullScreenLoader from '../../../../helpers/FullScreenLoader';
import { backImage, dibbsLogo } from '../../../../helpers/Images';
import SocialButton from '../../../../helpers/SocialButton';
import TextInputWithLabel from '../../../../helpers/TextInputWithLabel';
import { navigate } from '../../../../helpers/Util';
import colors from '../../../../helpers/colors';
import { LoginTypeEnum } from '../../../../helpers/enum';
import { registerUser } from '../../../../redux/actions/authActions';
import AppDropDown from '../../../../helpers/AppDropDown';


class SignUpScreen extends Component {
  state = {
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

    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreementAccepted: false,

    selectedGender: null
  };

  constructor(props) {
    super(props);

    this.firstNameRef = React.createRef();
    this.lastNameRef = React.createRef();
    this.emailRef = React.createRef();
    this.passwordRef = React.createRef();
    this.confirmPasswordRef = React.createRef();

    this.genderRef = React.createRef();

  }

  componentDidMount() { }

  componentDidUpdate(prevProps) {
    if (
      this.props.isAuthenticated !== prevProps.isAuthenticated &&
      this.props.isAuthenticated === true &&
      this.props.loginType === LoginTypeEnum.REGISTER
    ) {
      this.props.navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: ScreenNames.RefferalScreen }],
        }),
      );
    }

    if (
      this.props.registerError !== prevProps.registerError &&
      this.props.registerError !== ''
    ) {
      this.showAlertModal('Error', this.props.registerError);
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

  openDropdown = visible => {

    // console.log()
    this.genderRef.current.focus();
  };

  closeDropdown = visible => {
    this.genderRef.current.blur();
  };
  // </Alert Functions>

  validate = () => {
    const { firstName, lastName, email, password, confirmPassword } = this.state;
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

    if (firstName === '') {
      this.showAlertModal('Validation Error', 'Please enter your first name!');
      return false;
    }

    if (lastName === '') {
      this.showAlertModal('Validation Error', 'Please enter your last name!');
      return false;
    }

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
    //  else if (password.length < 6) {
    //   this.showAlertModal('Validation Error', 'Password can\'t be less than 6 digits!');
    //   return false;
    // }

    if (confirmPassword !== password) {
      this.showAlertModal('Validation Error', 'Password mismatch!');
      return false;
    }

    return true;
  };



  render() {
    const { isCreatingUser } = this.props;

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
          titleText={'SIGNUP'}
          cardStyle={true}
          leftImageSource={backImage}
          onPressLeftButton={() => {
            this.props.navigation.goBack(null);
          }}
          leftType="image"
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}>
          <ScrollView
            // contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
            style={{ marginBottom: RFValue(3) }}
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
                color: colors.appTextColor,
              }}>
              SIGN UP TO SCORE ONE OF A KIND DEALS!
            </Text>

            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <TextInputWithLabel
                label={'FirstName*'}
                value={this.state.firstName}
                onChange={text => {
                  this.setState({
                    firstName: text,
                  });
                }}
                placeHolder={'First Name'}
                outerContainerStyles={{ width: '80%' }}
                ref={this.firstNameRef}
                returnKeyType={'next'}
                nextRef={this.lastNameRef}
              />

              <TextInputWithLabel
                label={'LastName*'}
                value={this.state.lastName}
                onChange={text => {
                  this.setState({
                    lastName: text,
                  });
                }}
                placeHolder={'Last Name'}
                outerContainerStyles={{ width: '80%' }}
                ref={this.lastNameRef}
                returnKeyType={'next'}
                nextRef={this.emailRef}
              />

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
                placeHolder={'Enter your Email'}
                outerContainerStyles={{ width: '80%' }}
                ref={this.emailRef}
                returnKeyType={'next'}
                nextRef={this.passwordRef}
              />

              <TextInputWithLabel
                label={'Password*'}
                value={this.state.password}
                onChange={text => {
                  this.setState({
                    password: text,
                  });
                }}
                placeHolder={'Password'}
                outerContainerStyles={{ width: '80%' }}
                secureTextEntry={true}
                ref={this.passwordRef}
                returnKeyType={'next'}
                nextRef={this.confirmPasswordRef}
              />

              <TextInputWithLabel
                label={'Confirm Password*'}
                value={this.state.confirmPassword}
                onChange={text => {
                  this.setState({
                    confirmPassword: text,
                  });
                }}
                placeHolder={'Confirm Password'}
                outerContainerStyles={{ width: '80%' }}
                secureTextEntry={true}
                ref={this.confirmPasswordRef}
                returnKeyType={'done'}
              />

              <TouchableOpacity style={{

      // backgroundColor:'green',      
      width:300,
      height:90,
      // fontSize: RFValue(2),
    
    
      
              }}
                activeOpacity={0.9}
                onPress={() => {
                  this.openDropdown()
                }}>


                <AppDropDown
                  label={'*'}
                  
                  width= '80%'
                  value={this.state.selectedGender}

                  placeHolder={'Gender'}
                  
                  // outerContainerStyles={{ width: '90%' }}
                  ref={this.genderRef}
                  returnKeyType={'next'}
                  editable={false}
                />
              </TouchableOpacity>

              <Text
                style={{
                  fontSize: RFValue(12),
                  marginTop: h(3),
                  padding: h(0.5),
                  textAlign: 'center',
                  marginHorizontal: h(5),
                  color:colors.appTextColor,
                }}>
                By clicking on the sign up option below you
              </Text>

              <View style={{ flexDirection: 'row', padding: h(0.5) }}>
                <Text>&nbsp; agree to our &nbsp;</Text>

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
                    Terms
                  </Text>
                </TouchableOpacity>

                <Text
                  style={{
                    fontSize: RFValue(12),
                    textAlign: 'center',
                  }}>
                  &nbsp; and to the &nbsp;
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

            <Button
              light
              // onPress={()=>logIn()}
              onPress={() => {
                Keyboard.dismiss();

                if (this.validate()) {
                  this.props.registerUser(
                    this.state.firstName,
                    this.state.lastName,
                    this.state.email,
                    this.state.password,
                  );
                }
              }}
              // onPress={()=>this.props.login({this.state.userEmail})}
              rounded
              style={styles.btnStyle}
            // iconLeft
            >
              {/* <Icon name={this.props.iconName} style={this.props.IconStyle}/> */}
              {/* <Icon name={this.props.iconName} style={{textAlign:"right"}}/> */}
              <Text style={styles.textStyle}>Sign Up</Text>
            </Button>

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
                style={{ height: 0, width: 0 }}
                // style={{display: 'none'}}
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
        </KeyboardAvoidingView>


        <Picker
          ref={this.genderRef}
          selectedValue={this.state.selectedGender}
          onValueChange={(itemValue, itemIndex) => {

            console.log("Fahad item value: ", itemValue);
            this.setState({
              selectedGender: itemValue,
            })
          }
          }>

          <Picker.Item label="Male" value="Male" />
          <Picker.Item label="Female" value="Female" />
          <Picker.Item label="Others" value="Others" />
        </Picker>

        <FullScreenLoader
          title={titles.fullScreenLoaderTitle}
          loading={isCreatingUser}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  btnStyle: {
    justifyContent: 'center',
    marginTop: h(2),
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
  const { appName, isCreatingUser, isAuthenticated, loginType, registerError } =
    state.authReducer;
  return {
    appName,
    isCreatingUser,
    isAuthenticated,
    loginType,
    registerError,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    registerUser: (first_name, last_name, email, password) =>
      dispatch(registerUser(first_name, last_name, email, password)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUpScreen);
