import React, { Component } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';
import { connect } from 'react-redux';
import HeaderCenter from '../../../CustomComponents/Header/HeaderCenter';
import colors from '../../../helpers/colors';
import { backImage } from '../../../helpers/Images';

class AboutScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showIndicator: true,
    };
  }

  componentDidMount() {}

  componentDidUpdate(prevProps) {}

  render() {
    const INJECTEDJAVASCRIPT =
      "const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=0.99, user-scalable=0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); ";

    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: colors.commonBackground,
        }}>
        <HeaderCenter
          titleText={'About'}
          cardStyle={true}
          leftImageSource={backImage}
          onPressLeftButton={() => {
            this.props.navigation.goBack(null);
          }}
          leftType="image"
        />
        <View style={{flex: 1}}>
          <WebView
            style={{flex: 1}}
            source={{uri: 'https://thedibbsapp.com/'}}
            onLoad={() => {
              this.setState({
                showIndicator: false,
              });
            }}
            scalesPageToFit={false}
            injectedJavaScript={INJECTEDJAVASCRIPT}
            scrollEnabled
          />

          {this.state.showIndicator && (
            <View
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <ActivityIndicator
                style={{width: 50, height: 50}}
                size="large"
                color={colors.appPurple}
              />
            </View>
          )}
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
    updatingSettingsError,
  } = state.authReducer;

  return {
    appName,
    loginType,
    isUpdatingSettings,
    settingsUpdatedSuccessfully,
    notificationSettingsCurrentValue,
    updatingSettingsError,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(AboutScreen);
