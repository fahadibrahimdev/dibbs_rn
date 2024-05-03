import { Button, Text } from 'native-base';
import React, { Component } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { height as h } from 'react-native-dimension';
import { RFValue } from 'react-native-responsive-fontsize';
import colors from './colors';
import { facebookCircle } from './Images';

class SocialButton extends Component {
  render() {
    return (
      <Button
        // onPress={() => alert("Social Button Press")}
        onPress={this.props.onPress}
        rounded
        iconLeft
        style={[
          styles.btnStyle,
          {backgroundColor: this.props.color},
          this.props.containerStyle,
        ]}>
        {/* <Icon name="fab fa-facebook" size={37} color={styles.iconStyle} /> */}
        {/* <Icon size={37} name={this.props.icon} style={styles.iconStyle} /> */}

        <View style={{width: '100%', justifyContent: 'center'}}>
          <Image
            source={facebookCircle}
            style={{
              marginLeft: h(0.5),
              width: h(5),
              height: h(5),
              tintColor: colors.white,
              alignSelf: 'flex-start',
            }}
          />
          <View
            style={{
              width: '100%',
              position: 'absolute',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={styles.textStyle}>{this.props.name}</Text>
          </View>
        </View>
      </Button>
    );
  }
}

const styles = StyleSheet.create({
  btnStyle: {
    marginTop: h(2),
    height: h(6.5),
    justifyContent: 'flex-start',
    backgroundColor: colors.lightGray,
  },
  textStyle: {
    width: '100%',
    textAlign: 'center',
    fontSize: RFValue(15),
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
});

export default SocialButton;
