import React, { Component } from 'react';
import {
  Image,
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
import { backImage } from './Images';

class HeaderCompoenent extends Component {
  state = {};
  constructor(props) {
    super(props);
  }

  render() {
    const {
      headingTitle,
      titleAlignment,

      useBackFeature,
      iconL1,
      onIconL1Press,

      iconR1,
      onIconR1Press,

      iconR2,
      onIconR2Press,
    } = this.props;

    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: !!titleAlignment ? titleAlignment : 'flex-start',
          alignItems: 'center',
          marginBottom: h(1),
          marginHorizontal: (useBackFeature) ? 0 : 20,
        }}>

        {useBackFeature && (
          <TouchableOpacity
            style={{
              alignSelf: 'center',
            }}
            onPress={() => {
              onIconL1Press();
            }}>
            {!!iconL1 ? (<Ionicons name={iconL1} size={h(3)} color={colors.appPurple} />) : (
              <Image
                source={backImage}
                resizeMode="contain"
                style={[
                  {
                    height: 24,
                    width: 24,
                    alignSelf: 'center',
                    marginRight: 15,
                    marginLeft: 16,
                    tintColor: (colors.appPurple),
                  },
                ]}
              />
            )
            }

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
            marginRight: useBackFeature ? (20) : 0
          }}>
          {!!iconR1 && (
            <TouchableOpacity
              style={{
                alignSelf: 'flex-end',
              }}
              onPress={() => {
                onIconR1Press();
              }}>
              <Ionicons name={iconR1} size={h(3)} color={colors.appPurple} />
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
              <Ionicons name={iconR2} size={h(3)} color={colors.appPurple} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
}

export default HeaderCompoenent;

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
