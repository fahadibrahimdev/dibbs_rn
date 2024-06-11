import React, {Component} from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {height as h} from 'react-native-dimension';
import {TextInputMask} from 'react-native-masked-text';
import {RFValue} from 'react-native-responsive-fontsize';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../helpers/colors';

class TextInputWithLabel extends Component {
  state = {
    showProtectedInfo: false,
  };
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
    this.maskInputRef = React.createRef();
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
          {marginVertical: h(0)},
          outerContainerStyles,
        ]}>
        {/* <Text style={[styles.labelStyles,{fontSize: RFValue(12)},labelStyles]}>{label}</Text> */}
        <View
          style={[
            styles.InputContainer,
            {borderWidth: 0.3, marginTop: h(2), borderRadius: h(4)},
            
            inputContainerStyles,
          ]}>
          {!applyMask ? (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TextInput
                style={[
                  styles.inputStyles,
                  {
                    width: secureTextEntry ? '75%' : '85%',
                    height: h(7),
                    fontSize: RFValue(20),
                    marginLeft: h(4),
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
                secureTextEntry={
                  secureTextEntry && !this.state.showProtectedInfo
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
                            : () => {}
                          : () => {}
                }
              />

              {secureTextEntry && (
                <View
                  style={{flex: 1, alignItems: 'flex-end', marginRight: h(1)}}
                  >
                  <TouchableOpacity
                    style={[
                      {
                        width: h(5),
                        height: h(5),
                        // justifyContent: 'center',
                        // alignItems: 'center',
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
                      name={this.state.showProtectedInfo ? 'eye-off' : 'eye'}
                      size={h(4)}
                      color={colors.appPurple}
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ) : (
            <TextInputMask
              type={'custom'}
              options={{
                mask: mask,
              }}
              value={value}
              onChangeText={onChange}
              style={[
                styles.inputStyles,
                {
                  height: h(20),
                  width: '100%',
                  fontSize: RFValue(2),
                  marginHorizontal: h(15),
                },
                inputStyles,
              ]}
              placeholder={placeHolder}
              onEndEditing={onEndEditing}
              onPressIn={onPressIn}
              onPressOut={onPressOut}
              onFocus={onFocus}
              onKeyPress={onKeyPress}
              placeholderTextColor={
                placeholderTextColor ? placeholderTextColor : colors.black
              }
              secureTextEntry={secureTextEntry}
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
              ref={this.maskInputRef}
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
                          : () => {}
                        : () => {}
              }
            />
          )}
        </View>
      </KeyboardAvoidingView>
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
