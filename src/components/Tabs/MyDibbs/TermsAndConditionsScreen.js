import React, { Component } from 'react';
import { Platform, View } from 'react-native';
import { height as h, width as w } from 'react-native-dimension';
import Pdf from 'react-native-pdf';
import { SafeAreaView } from 'react-native-safe-area-context';
import { connect } from 'react-redux';
import HeaderCenter from '../../../CustomComponents/Header/HeaderCenter';
import colors from '../../../helpers/colors';
import { backImage } from '../../../helpers/Images';

class TermsAndConditionsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showIndicator: true,
    };
  }

  componentDidMount() {}

  componentDidUpdate(prevProps) {}

  render() {
    const source =
      Platform.OS === 'ios'
        ? require('../../../../assets/pdf/termsAndConditions.pdf')
        : {
            uri: 'bundle-assets://pdf/termsAndConditions.pdf',
          };

    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: colors.commonBackground,
        }}>
        <HeaderCenter
          titleText={'Terms of Use'}
          cardStyle={true}
          leftImageSource={backImage}
          onPressLeftButton={() => {
            this.props.navigation.goBack(null);
          }}
          leftType="image"
        />
        <View style={{flex: 1}}>
          <Pdf
            source={source}
            onLoadComplete={(numberOfPages, filePath) => {
              console.log(`Number of pages: ${numberOfPages}`);
            }}
            onPageChanged={(page, numberOfPages) => {
              console.log(`Current page: ${page}`);
            }}
            onError={error => {
              console.log(error);
            }}
            onPressLink={uri => {
              console.log(`Link pressed: ${uri}`);
            }}
            style={{
              flex: 1,
              width: w(100),
              height: h(100),
            }}
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TermsAndConditionsScreen);
