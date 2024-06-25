import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {height as h} from 'react-native-dimension';
import {RFValue} from 'react-native-responsive-fontsize';
import colors from '../helpers/colors';

class TextInputWithLabel extends Component {
  state = {
    showProtectedInfo: false,
  };
  constructor(props) {
    super(props);
  }
  render() {
    const {
      value,

      placeHolder,

      placeholderTextColor,

      editable,

      outerContainerStyles,

      inputContainerStyles,
      inputStyles,
    } = this.props;

    return (
      <View
        style={[
          styles.OuterContainer,
          {marginVertical: h(0)},
          outerContainerStyles,
          {
            // backgroundColor: 'blue',
          },
        ]}>
        <View
          style={[
            styles.InputContainer,
            {borderWidth: 0.3, borderRadius: h(4)},
            inputContainerStyles,
          ]}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={[
                styles.inputStyles,
                {
                  color: ((!!value)?colors.appTextColor:(placeholderTextColor ? placeholderTextColor : colors.lightGray)),
                  width: '89%',
                  height: h(7),
                  fontSize: RFValue(20),
                  marginLeft: h(4),
                  marginRight: h(1),
                  textAlignVertical: 'center',

                },
                inputStyles,
              ]}
              // value={value}
              // placeholder={placeHolder}
              // placeholderTextColor={
              //   placeholderTextColor ? placeholderTextColor : colors.lightGray
              // }
              // pointerEvents={'none'}
            >{(!!value)?(value):(placeHolder)}</Text>
          </View>
        </View>
      </View>
    );
  }
}

export default TextInputWithLabel;

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
