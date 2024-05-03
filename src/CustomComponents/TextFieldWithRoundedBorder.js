import React, { Component } from 'react';
import {
    Image,
    Platform, StyleSheet,
    Text,
    TextInput, View
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import colors from '../helpers/colors';
import { plusImageBlack } from "../helpers/Images";
import { RFValue } from 'react-native-responsive-fontsize';

export default class TxtFieldWithRoundedBorder extends Component {
    state = {

    };

    constructor(props) {
        super(props);

    }

    componentDidMount() {

    }

    render() {
        const { viewInputStyle, inputStyle, imageStyle } = styles;
        const { props } = this;

        return (
            <View>
                <View style={{ flexDirection: 'row' }}>

                    {this.props.isUpperTextShow ? this.renderText() : null}
                    {this.props.isUpperRightTextShow ? this.renderBtnRightUpperText() : null}

                </View>
                <View
                    style={
                        [
                            {
                                flexDirection: 'row',
                                borderRadius: 5,
                                borderWidth: 1,
                                borderColor: colors.lightGray,
                                justifyContent: 'center',
                                height: 50,
                            },
                            this.props.textFieldViewStyle,
                        ]
                    }>

                    <View
                        style={{ flex: 3, marginTop: 0 }}
                    >
                        <TextInput
                            key="input-phone"
                            style={[
                                inputStyle,
                                { color: colors.appTextColor },

                                {
                                    textAlign: 'left',
                                },
                                this.props.btnTextStyle,
                            ]}
                            onTouchStart={this.props.onTouchStart}
                            borderColor="transparent"
                            onChangeText={this.props.onChangeText}
                            value={this.props.value}
                            placeholder={this.props.placeholderText}
                            autoCorrect={this.props.correctionValue}
                            autoCapitalize={this.props.autoCapitaliseValue}
                            editable={this.props.editableValue}
                            autoFocus={this.props.autoFocus}
                            multiline={this.props.multiline}
                            selectTextOnFocus={this.props.selectTextOnFocusValue}
                            maxLength={this.props.maxLenthValue}
                            returnKeyType={this.props.returnTypeKeyboard}
                            blurOnSubmit={this.props.blurOnSubmitValue}
                            textAlign={this.props.textAlign}
                            placeholderTextColor={colors.lightGray}
                            // textAlign={'right'}
                            onFocus={() => {
                                this.props.onFocus && this.props.onFocus()
                                this.handleFocus
                            }}
                            onBlur={() => {
                                this.props.onBlur && this.props.onBlur()
                                this.handleBlur
                            }}
                            {...props}
                            ref={(input) => props.inputRef && props.inputRef(input)}

                        />

                    </View>

                    {this.props.isImageShow ?
                        this.renderImage() : null}
                    {this.props.rightTextShow === true ? this.renderRightText() : null}

                </View>
            </View>
        );
    }


    renderText() {
        const { textStyle, textViewStyle } = styles;
        return (
            <View style={{ flex: 1, marginTop: 0, marginBottom: 5, flexDirection: 'row' }}>
                <Text style={[textStyle, { color: colors.appTextColor, fontSize: RFValue(20), fontFamily: "SFProText-Medium" }]}>
                    {this.props.isUpperTextTitle}
                </Text>
                {this.props.isCompulsory ? <Text style={{ color: colors.appCompulsoryTextColor, fontFamily: "SFProText-Medium" }}>{' * '}</Text> : null}
            </View>
        );
    }

    renderBtnRightUpperText() {
        const { textStyle, textViewStyle } = styles;
        return (
            this.props.rightImageShow === true ?
                <TouchableOpacity
                    style={{ marginTop: 5, marginBottom: 5, marginRight: 5, flex: 1 }}
                    onPress={this.props.rightTopTitleBtnPressed}
                >
                    <Image
                        style={{
                            width: 18,
                            height: 18,

                        }}
                        source={this.props.imageSource}
                    />

                </TouchableOpacity> :
                <TouchableOpacity
                    style={{ marginTop: 0, marginBottom: 5, flex: 1, flexWrap: 'wrap' }}
                    onPress={this.props.rightTopTitleBtnPressed}
                >
                    <Text style={[textStyle, { fontSize: RFValue(16), fontFamily: "SFProText-Medium" }, this.props.rightTopTextStyle]}>
                        {this.props.isRightUpperTextTitle}
                    </Text>

                </TouchableOpacity>
        );
    }

    renderImage() {
        var icon =
            this.props.imagePath == null
                ? plusImageBlack
                : this.props.imagePath;
        const { imageStyle } = styles;
        return (
            <View style={{ flex: 0.4, marginLeft: 15 }}>
                {
                    this.props.rightImageBtnFlag ? (
                        <TouchableOpacity
                            style={{
                                justifyContent: 'center',
                                alignSelf: 'flex-end',
                            }}
                            onPress={this.props.onPressRightImageBtn}>
                            {Platform.OS === 'ios' ? (
                                <View style={{ flex: 1, justifyContent: 'center' }}>
                                    <Image
                                        style={{
                                            width: 24,
                                            height: 24,
                                            paddingBottom: 10,
                                            paddingTop: 10,
                                            paddingRight: 10,
                                            marginRight: 5,
                                        }}
                                        source={icon}
                                    />
                                </View>
                            ) : (
                                <View style={{ flex: 1, justifyContent: 'center' }}>
                                    <Image
                                        style={[
                                            {
                                                width: 24,
                                                height: 24,
                                                paddingBottom: 10,
                                                paddingTop: 10,
                                                paddingRight: 10,
                                                marginRight: 10,
                                            },
                                            this.props.btnImageStyle,
                                        ]}
                                        source={icon}
                                    />
                                </View>
                            )}
                        </TouchableOpacity>
                    ) :
                        Platform.OS === 'ios' ? (
                            <View
                                style={{
                                    flex: 1,
                                    marginTop: this.props.btnImageStyle ? 8 : 11,
                                    marginBottom: 15,
                                    alignSelf: 'flex-end',
                                    marginRight: 8,
                                }}>
                                <Image
                                    style={{
                                        width: 24,
                                        height: 24,
                                        paddingBottom: 10,
                                        paddingTop: 10,
                                        paddingRight: 10,
                                    }}
                                    source={icon}
                                />
                            </View>
                        ) : (
                            <View
                                style={{
                                    flex: 1,
                                    marginTop: this.props.btnImageStyle ? 8 : 11,
                                    marginBottom: 15,

                                    alignSelf: 'flex-end',
                                    marginRight: 8,
                                }}>
                                <Image

                                    style={[
                                        {
                                            width: 24,
                                            height: 24,
                                            paddingBottom: 10,
                                            paddingTop: 10,
                                            paddingRight: 10,
                                        },
                                        this.props.btnImageStyle,
                                    ]}
                                    source={icon}
                                />
                            </View>
                        )

                }
            </View>
        );
    }

    renderRightText() {
        const { imageStyle } = styles;
        const { TextFieldFontSize, lightFontFamily } = CommonStyles;
        return (
            <View style={{ flex: 0.4 }}>
                {Platform.OS === 'ios' ? (
                    <View
                        style={{
                            flex: 1,
                            marginTop: this.props.btnImageStyle ? 8 : 11,
                            marginBottom: 15,
                            width: 50,
                            alignSelf: 'flex-end',
                            marginRight: 8,
                        }}>
                        <Text
                            style={[
                                this.props.btnImageStyle,
                                {
                                    marginLeft: 10,
                                    color: 'black',
                                    fontSize: RFValue(22),
                                    fontFamily: "SFProText-Medium"
                                },
                            ]}
                            numberOfLines={1}>
                            {this.props.rightText}
                        </Text>
                    </View>
                ) : (
                    <View
                        style={{
                            flex: 1,
                            marginTop: this.props.btnImageStyle ? 8 : 11,
                            marginBottom: 15,
                            width: 50,
                            alignSelf: this.props.btnImageStyle ? 'flex-start' : 'flex-end',
                            marginRight: 8,
                        }}>
                        <Text
                            style={[
                                this.props.btnImageStyle,
                                {
                                    marginLeft: 10,
                                    color: 'black',
                                    fontSize: RFValue(22),
                                    fontFamily: "SFProText-Medium"
                                },
                            ]}
                            numberOfLines={1}>
                            {this.props.rightText === '' ? 'pcs' : this.props.rightText}
                        </Text>
                    </View>
                )}
            </View>
        );
    }

    renderSecondImage() {
        var icon =
            this.props.secondImagePath == null
                ? plusImageBlack
                : this.props.secondImagePath;

        return (
            <View style={{ flex: 1 }}>
                {Platform.OS === 'ios' ? (
                    <View
                        style={{
                            flex: 1,
                            marginTop: 15,
                            width: 15,
                            alignSelf: 'flex-end',
                            marginRight: -27,
                        }}>
                        <Image style={{ alignSelf: 'flex-end' }} source={icon} />
                    </View>
                ) : (
                    <View
                        style={{
                            flex: 1,
                            marginTop: 15,
                            width: 15,
                            alignSelf: 'flex-end',
                            marginRight: -27,
                        }}>
                        <Image style={{ alignSelf: 'flex-end' }} source={icon} />
                    </View>
                )}
            </View>
        );
    }
}


const styles = StyleSheet.create({
    inputStyle: {

        marginLeft: 5,

        marginRight: 5,
        marginTop: -4,

        fontSize: RFValue(22),
        height: 55,
        fontFamily: "SFProText-Medium"
    },
    viewInputStyle: {
        justifyContent: 'center',

    },

    textStyle: {
        color: colors.white,
    },
});
