import {Button} from 'native-base';
import React, {Component} from 'react';
import {
  Keyboard,
  ScrollView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {height as h, width as w} from 'react-native-dimension';
import {RFValue} from 'react-native-responsive-fontsize';
import {SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';
import {titles} from '../../../constants/Localization';
import HeaderCenter from '../../../CustomComponents/Header/HeaderCenter';
import AlertComponent from '../../../helpers/AlertComponent';
import colors from '../../../helpers/colors';
import {AlertTypesEnum} from '../../../helpers/enum';
import FullScreenLoader from '../../../helpers/FullScreenLoader';
import {backImage} from '../../../helpers/Images';
import {submitSupportMsg} from '../../../redux/actions/authActions';

class CustomerSupportScreen extends Component {
  constructor(props) {
    super(props);

    this.emailRef = React.createRef();
    this.msgRef = React.createRef();

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
      email: '',
      msg: '',
    };
  }

  componentDidMount() {}

  componentDidUpdate(prevProps) {
    if (
      this.props.supportMsgSubmittedSuccessfully !==
        prevProps.supportMsgSubmittedSuccessfully &&
      this.props.supportMsgSubmittedSuccessfully === true
    ) {
      this.showAlertModal(
        'Success',
        'Thank you for contacting us, please allow up to 48 hours for one of our support representatives to reply.',
        AlertTypesEnum.Support,
      );
    }

    if (
      this.props.submitSupportMsgError !== prevProps.submitSupportMsgError &&
      this.props.submitSupportMsgError !== ''
    ) {
      this.showAlertModal('Error', this.props.submitSupportMsgError);
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
    const {email, msg} = this.state;
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

    // if (email === '') {
    //   this.showAlertModal('Validation Error', 'Please enter your email!');
    //   return false;
    // } else if (reg.test(email) === false) {
    //   this.showAlertModal('Validation Error', 'Email is invalid!');
    //   return false;
    // }

    if (msg === '') {
      this.showAlertModal('Validation Error', 'Please enter your message!');
      return false;
    }

    return true;
  };

  render() {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}>
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

              if (this.state.alertProps.alertType === AlertTypesEnum.Support) {
                this.props.navigation.goBack(null);
              }
            }}
            width={w(85)}
          />
          <HeaderCenter
            titleText={'Customer Support'}
            cardStyle={true}
            leftImageSource={backImage}
            onPressLeftButton={() => {
              this.props.navigation.goBack(null);
            }}
            leftType="image"
          />

          <ScrollView
            contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}
            style={{marginBottom: RFValue(10)}}
            keyboardShouldPersistTaps="always">
            {/* <Text
            style={{
              fontSize: RFValue(12),
              letterSpacing: 1,
              alignSelf: 'center',
              textTransform: 'uppercase',
            }}>
            How can we help?
          </Text> */}
            <Text
              style={{
                fontSize: RFValue(12),
                letterSpacing: 1,
                marginTop: h(2),
                marginLeft: w(5),
                fontWeight: 'bold',
                textTransform: 'uppercase',
                color: colors.appTextColor
              }}>
              Get in touch with our support team
            </Text>
            <View
              style={{
                flex: 1,
                marginTop: h(2),
                marginLeft: w(5),
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
              }}>
              <View style={{width: '100%'}}>
                <View style={{flexDirection: 'row'}}>
                  <Ionicons
                    style={{marginLeft: h(0), marginTop: RFValue(3)}}
                    name={'md-mail'}
                    size={h(3)}
                    color={colors.black}
                  />

                  <TextInput
                    style={[
                      {
                        width: '85%',
                        paddingTop: RFValue(5),
                        paddingBottom: RFValue(5),
                        fontSize: RFValue(14),
                        marginLeft: w(2),
                        marginRight: h(1),
                        color: colors.black,
                      },
                    ]}
                    autoCapitalize={'none'}
                    value={this.props.userInfo.email}
                    maxLength={30}
                    onChangeText={text => {
                      this.setState({
                        email: text,
                      });
                    }}
                    numberOfLines={1}
                    placeholder={'Enter your email address'}
                    placeholderTextColor={colors.graySettled}
                    returnKeyType={'next'}
                    keyboardType={'email-address'}
                    ref={this.emailRef}
                    editable={false}
                    onSubmitEditing={() => {
                      this.msgRef.current.focus();
                    }}
                  />
                </View>

                <View
                  style={{
                    width: '95%',
                    height: h(0.05),
                    backgroundColor: colors.black,
                  }}></View>
              </View>

              <View style={{width: '100%', marginTop: h(2)}}>
                <View style={{flexDirection: 'row'}}>
                  <Ionicons
                    style={{marginLeft: h(0), marginTop: RFValue(3)}}
                    name={'md-text'}
                    size={h(3)}
                    color={colors.black}
                  />
                  <TextInput
                    style={[
                      {
                        width: '85%',
                        paddingTop: RFValue(5),
                        paddingBottom: RFValue(5),
                        fontSize: RFValue(14),
                        marginLeft: w(2),
                        marginRight: h(1),
                        color: colors.black,
                      },
                    ]}
                    autoCapitalize={'sentences'}
                    value={this.state.msg}
                    maxLength={200}
                    onChangeText={text => {
                      this.setState({
                        msg: text,
                      });
                    }}
                    placeholder={'Enter your message for customer support'}
                    placeholderTextColor={colors.graySettled}
                    multiline={true}
                    ref={this.msgRef}
                    keyboardType={'default'}
                  />
                </View>
                <View
                  style={{
                    width: '95%',
                    height: h(0.05),
                    backgroundColor: colors.black,
                  }}></View>
              </View>

              <Button
                light
                onPress={() => {
                  Keyboard.dismiss();
                  if (this.validate()) {
                    // const to = ['fahadibrahimbutt@email.com'] // string or array of email addresses
                    // email(to, {
                    //     // Optional additional arguments
                    //     // cc: ['bazzy@moo.com', 'doooo@daaa.com'], // string or array of email addresses
                    //     // bcc: 'mee@mee.com', // string or array of email addresses
                    //     subject: 'Show how to use',
                    //     body: 'Some body right here'
                    // }).catch(console.error)

                    this.props.submitSupportMsg(
                      !!this.props.userInfo ? this.props.userInfo.email : '',
                      this.state.msg,
                      0,
                    );
                  }
                }}
                rounded
                style={{
                  justifyContent: 'center',
                  marginTop: h(5),
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
                  Send Message
                </Text>
              </Button>
            </View>
          </ScrollView>
          <FullScreenLoader
            title={titles.fullScreenLoaderTitle}
            loading={this.props.isSubmittingSupportMsg}
          />
        </SafeAreaView>
      </TouchableWithoutFeedback>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const {
    appName,
    isSubmittingSupportMsg,
    supportMsgSubmittedSuccessfully,
    submitSupportMsgError,
    userInfo,
  } = state.authReducer;

  return {
    appName,
    isSubmittingSupportMsg,
    supportMsgSubmittedSuccessfully,
    submitSupportMsgError,
    userInfo,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    submitSupportMsg: (email, message, orderId) =>
      dispatch(submitSupportMsg(email, message, orderId)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CustomerSupportScreen);
