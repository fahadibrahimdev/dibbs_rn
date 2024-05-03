import React, { Component } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import colors from '../helpers/colors';
import { RFValue } from 'react-native-responsive-fontsize';

export default class ButtonFill extends Component {
    state = {
        disabledButton: false,
    };

    render() {
        const { viewStyle, textStyle, greyColor } = styles;
        return (
            <TouchableOpacity
                style={[
                    viewStyle,
                    this.props.style,
                    this.props.disabledButton ? greyColor : null,
                    this.props.tintColor,
                ]}
                onPress={this.props.onPress}
                disabled={this.props.disabledButton}>
                {this.props.isLeftImageShow ?
                    <Image
                        style={{ marginRight: 5 }, [this.props.imageStyle]}
                        source={this.props.source}
                        resizeMode="contain"
                    /> : null
                }
                <Text
                    style={[
                        textStyle,
                        {fontFamily: "SFProText-Medium", color: colors.appButtonSelectedTextColor},
                        this.props.btnStyle
                        
                    ]}
                    numberOfLines={this.props.numberOfLines}
                >
                    {this.props.btnTitle}
                </Text>
            </TouchableOpacity>
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
