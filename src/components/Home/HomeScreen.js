import React, {Component} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {connect} from 'react-redux';
import {ScreenNames} from '../../constants/ScreenNames';
import Style from './homeScreenStyles';

class HomeScreen extends Component {
  componentDidMount() {
    this.props.navigation.replace(ScreenNames.BottomNavigator);
  }

  render() {
    return (
      <View style={Style.container}>
        <Text style={{textAlign: 'center', fontFamily: 'SFProText-Medium'}}>
          Home
        </Text>

        <TouchableOpacity
          style={Style.btn}
          onPress={() => {
            this.props.navigation.replace(ScreenNames.BottomNavigator);
          }}>
          <Text>Start</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const {appName} = state.authReducer;
  return {
    appName,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
