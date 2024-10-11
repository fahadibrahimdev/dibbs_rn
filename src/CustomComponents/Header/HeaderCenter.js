/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Dimensions, Image, Text, TouchableOpacity, View} from 'react-native';
import colors from '../../helpers/colors';
import {backImage} from '../../helpers/Images';
import {RFValue} from 'react-native-responsive-fontsize';

const HEIGHT = Dimensions.get('screen').height;
const WIDTH = Dimensions.get('screen').width;

const HeaderCenter = ({
  onPressRightButton,
  onPressLeftButton,
  onPressSecondRightButton,
  titleText,
  leftImageSource,
  rightImageSource,
  rightSecondImageSource,
  leftType,
  cardStyle,
  leftButtonStyle,
  leftImageStyle,
  imageUrl,
  homeProfileImage,
  textStyle,
  textAlignStyle,
  isRightMenuShown,
}) => (
  <View>
    <View
      style={[
        {
          flexDirection: 'row',
          justifyContent: 'center',
          width: WIDTH,
          height: HEIGHT / 13 - 20,
          backgroundColor: colors.commonBackground,
          bottom: 0,
        },
        {backgroundColor: colors.commonBackground},
      ]}>
      {onPressLeftButton && (
        <TouchableOpacity
          style={[
            {
              left: 0,
              //   height: 50,
              //   width: 50,
              position: 'absolute',
              alignSelf: 'center',
              borderRadius: 20,
              justifyContent: 'center',
              // marginRight:40,
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
                  tintColor: colors.appPurple,
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
        style={[
          {
            left: 40,
            position: 'absolute',
            alignSelf: 'center',
            color: colors.appPurple,
            textAlign: 'center',
            paddingHorizontal: 10,
            letterSpacing: 1.22,
            marginLeft: 10,
            marginRight: 2,
            fontSize: RFValue(22),
            fontFamily: 'SFProText-Medium',
          },

          textStyle,
          textAlignStyle,
        ]}
        numberOfLines={1}>
        {titleText}
      </Text>
    </View>
  </View>
);
export default HeaderCenter;
