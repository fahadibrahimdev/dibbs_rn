import {Button} from 'native-base';
import React, {Component} from 'react';
import {Alert, Image, Keyboard, ScrollView, StyleSheet, Text, View} from 'react-native';
import {height as h, width as w} from 'react-native-dimension';
import {RFValue} from 'react-native-responsive-fontsize';
import {SafeAreaView} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
import {titles} from '../../../../constants/Localization';
import HeaderCenter from '../../../../CustomComponents/Header/HeaderCenter';
import AlertComponent from '../../../../helpers/AlertComponent';
import colors from '../../../../helpers/colors';
import { AlertTypesEnum } from '../../../../helpers/enum';
import FullScreenLoader from '../../../../helpers/FullScreenLoader';
import {backImage, dibbsLogo} from '../../../../helpers/Images';
import TextInputWithLabel from '../../../../helpers/TextInputWithLabel';
import {goBack, headingAlert} from '../../../../helpers/Util';
import {forgotPassword} from '../../../../redux/actions/authActions';

class ForgotPasswordScreen extends Component {
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
  };

  constructor(props) {
    super(props);

    this.emailRef = React.createRef();
  }

  componentDidMount() {}

  componentDidUpdate(prevProps) {
    if (
      this.props.successfullyEmailSentForgotPassword !==
        prevProps.successfullyEmailSentForgotPassword &&
      this.props.successfullyEmailSentForgotPassword === true
    ) {

      this.showAlertModal('Success', titles.forgotPassword, AlertTypesEnum.ForgotPasswordSuccess)
    }

    if(this.props.forgotPasswordError !== prevProps.forgotPasswordError && this.props.forgotPasswordError !== '') {
      this.showAlertModal('Error', this.props.forgotPasswordError);
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
    const {email} = this.state;
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

    if (email === '') {
      this.showAlertModal('Validation Error', 'Please enter your email!');
      return false;
    } else if (reg.test(email) === false) {
      this.showAlertModal('Validation Error', 'Email is invalid!');
      return false;
    } else {
      console.log('Email is Correct');
    }

    return true;
  };

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

            if (this.state.alertProps.alertType === AlertTypesEnum.ForgotPasswordSuccess) {
              goBack(this.props.navigation);
            }

            this.setAlertModalVisible(false);
          }}
          width={w(85)}
        />

        <HeaderCenter
          titleText={'FORGOT PASSWORD'}
          cardStyle={true}
          leftImageSource={backImage}
          onPressLeftButton={() => {
            this.props.navigation.goBack(null);
          }}
          leftType="image"
        />
        <ScrollView
          // contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}
          style={{marginBottom: h(3)}}
          keyboardShouldPersistTaps="always">
          <Image
            style={{
              height: h(20),
              width: h(30),
              alignSelf: 'center',
              resizeMode: 'contain',
            }}
            source={dibbsLogo}
          />

          <View style={{justifyContent: 'center', alignItems: 'center'}}>
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
              outerContainerStyles={{width: '80%'}}
              ref={this.emailRef}
              returnKeyType={'done'}
            />
          </View>

          <Button
            light
            // onPress={()=>logIn()}
            onPress={() => {
              Keyboard.dismiss();
              if (this.validate()) {
                this.props.forgotPassword(this.state.email);
              }
            }}
            // onPress={()=>this.props.login({this.state.userEmail})}
            rounded
            style={styles.btnStyle}
            // iconLeft
          >
            {/* <Icon name={this.props.iconName} style={this.props.IconStyle}/> */}
            {/* <Icon name={this.props.iconName} style={{textAlign:"right"}}/> */}
            <Text style={styles.textStyle}>Submit</Text>
          </Button>
        </ScrollView>

        <FullScreenLoader title={titles.fullScreenLoaderTitle} loading={this.props.isSendingForgotPasswrod} />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  btnStyle: {
    justifyContent: 'center',
    marginTop: h(4),
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
});

const mapStateToProps = (state, ownProps) => {
  const {
    appName,
    isSendingForgotPasswrod,
    successfullyEmailSentForgotPassword,
    forgotPasswordError,
  } = state.authReducer;
  return {
    appName,
    isSendingForgotPasswrod,
    successfullyEmailSentForgotPassword,
    forgotPasswordError,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    forgotPassword: email => dispatch(forgotPassword(email)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ForgotPasswordScreen);
