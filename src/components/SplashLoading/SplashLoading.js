import LottieView from 'lottie-react-native';
import React, {Component} from 'react';
import {Image, View} from 'react-native';
import {height as h, width as w} from 'react-native-dimension';
import {connect} from 'react-redux';
import {ScreenNames} from '../../constants/ScreenNames';
import {AsyncKeysEnum} from '../../helpers/enum';
import {splashScreen} from '../../helpers/Images';
import {AsyncGetViaKey} from '../../helpers/LocalStorage/AsyncStorage';
import {
  setAppAuthState,
  setDeviceToken,
  setReferralCode,
} from '../../redux/actions/authActions';
import Style from './splashLoadingStyles';

class SplashLoading extends Component {
  componentDidMount() {
    AsyncGetViaKey(AsyncKeysEnum.AUTH_INFO).then(obj => {
      if (!!obj) {
        if (!!obj && obj.isAuthenticated) {
          this.props.setAppAuthState(obj);
          this.props.setReferralCode(obj);

          setTimeout(() => {
            // this.props.navigation.replace(ScreenNames.HomeScreen);
            this.props.navigation.replace(ScreenNames.BottomNavigator);
          }, 1000 * 1);
        }
      } else {
        setTimeout(() => {
          // this.props.navigation.replace(ScreenNames.HomeScreen);
          this.props.navigation.replace(ScreenNames.BottomNavigator);
        }, 1000 * 1);
      }
    });

    AsyncGetViaKey(AsyncKeysEnum.DEVICE_TOKEN).then(obj => {
      if (!!obj) {
        this.props.setDeviceToken({
          deviceToken: obj.deviceToken,
        });
      } else {
      }
    });
  }

  componentDidUpdate(prevProps) {}

  render() {
    return (
      <View style={{width: '100%', height: '100%'}}>
        <Image
          // style={styles.stretch}
          style={{
            height: '100%',
            width: '100%',
          }}
          source={splashScreen}
        />

        {/* <View
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <LottieView
            style={{width: w(40), height: h(10), alignSelf: 'center'}}
            ref={animation => {
              this.animation2 = animation;
            }}
            source={require('../../animations/loading-dots-with-changing-color.json')}
            loop={true}
            autoPlay={true}
          />
        </View> */}
      </View>
    );
  }
}

const mapStateToProps = null;

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setAppAuthState: obj => dispatch(setAppAuthState(obj)),
    setDeviceToken: obj => dispatch(setDeviceToken(obj)),
    setReferralCode: obj => dispatch(setReferralCode(obj)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SplashLoading);
