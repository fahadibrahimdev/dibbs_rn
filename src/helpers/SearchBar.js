import React, { Component } from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { height as h } from 'react-native-dimension';
import { RFValue } from 'react-native-responsive-fontsize';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from './colors';

class SearchBar extends Component {
  state = {};
  constructor(props) {
    super(props);
  }

  render() {
    const {
      label,
      autoCapitalize,
      value,
      onChange,
      placeHolder,
      onEndEditing,
      onPressIn,
      onPressOut,
      onFocus,
      onKeyPress,
      placeholderTextColor,
      secureTextEntry,
      showIcon,
      spellCheck,
      textAlign,
      keyboardType,
      autoFocus,
      blurOnSubmit,
      defaultValue,
      editable,
      maxLength,
      multiline,
      numberOfLines,
      onBlur,
      outerContainerStyles,
      labelStyles,
      inputContainerStyles,
      inputStyles,
      applyMask,
      mask,
      orientation,
      ref,
      returnKeyType,
      onSubmitEditing,
      nextRef,
    } = this.props;

    return (
      <KeyboardAvoidingView
        style={[
          styles.OuterContainer,
          { marginVertical: h(0) },
          outerContainerStyles,
        ]}>
        {/* <Text style={[styles.labelStyles,{fontSize: RFValue(12)},labelStyles]}>{label}</Text> */}
        <View
          style={[
            styles.InputContainer,
            { borderWidth: 0.3, marginTop: h(2), borderRadius: h(4) },
            inputContainerStyles,
          ]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {showIcon && (
              <View style={{ marginLeft: h(0.5) }}>
                <TouchableOpacity
                  style={[
                    {
                      width: h(5),
                      height: h(5),
                      justifyContent: 'center',
                      alignItems: 'center',
                    },
                  ]}
                  disabled={false}
                  onPress={() => {
                    // alert('clicked!');
                    this.setState({
                      showProtectedInfo: !this.state.showProtectedInfo,
                    });
                  }}
                  activeOpacity={0.6}>
                  <Ionicons
                    name={'md-search'}
                    size={h(4)}
                    color={colors.appPurple}
                  />
                </TouchableOpacity>
              </View>
            )}
            <TextInput
              style={[
                styles.inputStyles,
                {
                  width: showIcon ? '70%' : '85%',
                  height: h(7),
                  fontSize: RFValue(20),
                  marginLeft: h(1),
                  marginRight: h(1),
                },
                inputStyles,
              ]}
              autoCapitalize={autoCapitalize}
              value={value}
              onChangeText={onChange}
              placeholder={placeHolder}
              onEndEditing={onEndEditing}
              onPressIn={onPressIn}
              onPressOut={onPressOut}
              onFocus={onFocus}
              onKeyPress={onKeyPress}
              placeholderTextColor={
                placeholderTextColor ? placeholderTextColor : colors.lightGray
              }
              spellCheck={spellCheck}
              textAlign={textAlign}
              keyboardType={keyboardType}
              autoFocus={autoFocus}
              blurOnSubmit={blurOnSubmit}
              defaultValue={defaultValue}
              editable={editable}
              maxLength={maxLength}
              multiline={multiline}
              numberOfLines={numberOfLines}
              onBlur={onBlur}
              ref={this.inputRef}
              returnKeyType={returnKeyType}
              onSubmitEditing={
                onSubmitEditing
                  ? onSubmitEditing
                  : () =>
                    nextRef
                      ? nextRef.current.inputRef.current
                        ? nextRef.current.inputRef.current.focus()
                        : nextRef.current.maskInputRef.current
                          ? nextRef.current.maskInputRef.current._inputElement.focus()
                          : () => { }
                      : () => { }
              }
            />

            {!!value && (
              <View style={{ flex: 1, alignItems: 'flex-end', marginRight: h(0.5) }}>
                <TouchableOpacity
                  style={[
                    {
                      width: h(5),
                      height: h(5),
                      justifyContent: 'center',
                      alignItems: 'center',
                    },
                  ]}
                  disabled={false}
                  onPress={() => {
                    // alert('clicked!');
                    onChange('');
                  }}
                  activeOpacity={0.6}>
                  <Ionicons
                    name={'md-close-circle'}
                    size={h(4)}
                    color={colors.darkGray}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

export default SearchBar;

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
