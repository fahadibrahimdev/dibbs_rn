import React, { Component } from 'react';
import { Image } from 'react-native';
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { height as h } from 'react-native-dimension';
import { RFValue } from 'react-native-responsive-fontsize';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from './colors';

class HeaderBackCompoenent extends Component {
  state = {};
  constructor(props) {
    super(props);
  }

  render() {
    const {
      titleText,
      cardStyle,
      leftType,
      leftImageColor,
      onPressLeftButton,
      leftImageSource,
      leftImageStyle,
      leftButtonStyle,

      headingTitle,
      titleAlignment,

      iconR1,
      iconR1Color,
      onIconR1Press,

      iconR2,
      iconR2Color,
      onIconR2Press,
    } = this.props;

    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: !!titleAlignment ? titleAlignment : 'flex-start',
          alignItems: 'center',
          marginBottom: h(1),
          // backgroundColor: "#001199"
        }}>
        {onPressLeftButton && (
          <TouchableOpacity
            style={[
              {
                left: 0,
                //   height: 50,
                //   width: 50,

                alignSelf: 'center',
                borderRadius: 20,
                justifyContent: 'center',
                // marginRight:40,
                // backgroundColor: "#112211"
              },
              leftButtonStyle,
            ]}
            onPress={() => onPressLeftButton()}>
            {leftType === 'image' ? (
              <Image
                source={leftImageSource ? leftImageSource : backImage}
                resizeMode="contain"
                style={[
                  {
                    height: 24,
                    width: 24,
                    alignSelf: 'center',
                    marginRight: 15,
                    marginLeft: 16,
                    tintColor: (!!leftImageColor) ? (leftImageColor) : (colors.appPurple),
                  },
                  leftImageStyle,
                ]}
              />
            ) : (
              <Text
                style={{
                  color: colors.appPurple,
                  alignSelf: 'center',
                  fontFamily: 'SFProText-Medium',
                }}>
                Back
              </Text>
            )}
          </TouchableOpacity>
        )}

        <Text
          style={{
            color: colors.appPurple,
            fontSize: RFValue(18),
            padding: h(1),
            fontFamily: 'SFProText-Medium',
          }}>
          {headingTitle}
        </Text>

        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            justifyContent: 'flex-end',
            alignSelf: 'center',
            paddingRight: h(2),
          }}>
          {!!iconR1 && (
            <TouchableOpacity
              style={{
                alignSelf: 'flex-end',
              }}
              onPress={() => {
                onIconR1Press();
              }}>
              <Ionicons name={iconR1} size={h(3)} color={(!!iconR1Color) ? (iconR1Color) : (colors.appPurple)} />
            </TouchableOpacity>
          )}

          {!!iconR2 && (
            <TouchableOpacity
              style={{
                alignSelf: 'flex-end',
                marginLeft: h(2),
              }}
              onPress={() => {
                onIconR2Press();
              }}>
              <Ionicons name={iconR2} size={h(3)} color={(!!iconR2Color) ? (iconR2Color) : (colors.appPurple)} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
}

export default HeaderBackCompoenent;

const styles = StyleSheet.create({
  OuterContainer: {
    width: '90%',
  },
  InputContainer: {
    borderColor: colors.appPurple,
  },
  labelStyles: {
    color: colors.black,
  },
  inputStyles: {
    color: colors.black,
  },
});
