import { Icon } from 'native-base';
import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import colors from '../helpers/colors';

export default class IncrementDecrementButton extends Component {
  state = {};

  render() {
    const {viewStyle, textStyle, greyColor} = styles;
    return (
      <View
        style={{
          flexDirection: 'row',

          alignSelf: 'flex-end',
          justifyContent: 'center',
          alignItems: 'center',
          borderTopRightRadius: RFValue(10),
          borderBottomRightRadius: RFValue(10),
          borderTopLeftRadius: RFValue(10),
          borderBottomLeftRadius: RFValue(10),
          flexWrap: 'wrap',
          backgroundColor: !!this.props.buttonColor
            ? this.props.buttonColor
            : colors.gray,
        }}>
        <TouchableOpacity
          style={[
            {
              width: RFValue(35),
              height: RFValue(35),
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}
          onPress={this.props.decrementPressed}
          disabled={this.props.disabledButton}>
          <Icon
            name="remove-circle-outline"
            style={{
              color: colors.white,
              fontSize: RFValue(30),
              marginLeft: RFValue(3),
            }}
          />
        </TouchableOpacity>
        <Text
          style={{
            paddingLeft: RFValue(5),
            paddingRight: RFValue(5),
            paddingTop: RFValue(2),
            paddingBottom: RFValue(2),
            fontSize: RFValue(19),
            backgroundColor: colors.white,
            color: colors.appTextColor
          }}>
          {this.props.currentValue}
        </Text>
        <TouchableOpacity
          style={[
            {
              width: RFValue(35),
              height: RFValue(35),
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}
          onPress={this.props.incrementPressed}
          disabled={this.props.disabledButton}>
          <Icon
            name="add-circle-outline"
            style={{
              color: colors.white,
              fontSize: RFValue(30),
              marginLeft: RFValue(3),
            }}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  greyColor: {
    backgroundColor: colors.lightGrey,
  },
  viewStyle: {
    backgroundColor: colors.appButtonSelectedBackgroundColor,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    borderRadius: 4,
  },

  textStyle: {
    letterSpacing: 1.22,
    fontSize: RFValue(15),
    // fontWeight: 'bold',
  },
});
