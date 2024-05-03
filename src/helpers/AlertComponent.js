import { Button } from 'native-base';
import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,

  View
} from 'react-native';
import { height as h } from 'react-native-dimension';
import { RFValue } from 'react-native-responsive-fontsize';
import colors from './colors';

const AlertComponent = ({...props}) => {
  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={props.alertProps.alertModalVisible}
      onRequestClose={() => {
        console.log('Click screen to close.');
      }}>
      <View style={styles.container}>
        <View style={[styles.main_view, {width: props.width, padding: 5}]}>
          <View
            style={{
              marginHorizontal:20,
              marginTop:10,
            }}>
            <Text
              style={[
                styles.headerText,
                {
                  fontSize: RFValue(20),
                  justifyContent: 'center',
                  alignItems: 'center',
                },
              ]}
              numberOfLines={1}>
              {props.alertProps.alertHeading}
            </Text>
          </View>

          <Text
            style={[
              styles.msgText,
              {
                fontSize: RFValue(17),
                marginTop: 15,
                marginBottom: 15, 
                marginHorizontal:20,
                justifyContent: 'center',
                alignItems: 'center',
              },
            ]}>
            {props.alertProps.alertMsg}
          </Text>
          <View
            style={{
              paddingBottom:10,
              marginHorizontal:20,
              flexDirection: 'row',
              justifyContent: 'space-evenly'
            }}>
            {props.alertProps.showLeftButton && (
              <View style={{
                flex:1,marginRight:10}}>
                <Button
                  light
                  onPress={() => {
                    props.onLeftBtnClick()
                  }}
                  rounded
                  style={{
                    backgroundColor: props.alertProps.leftBtnDestructive?(colors.redDestructive):((!!props.alertProps.leftBtnColor)?(props.alertProps.leftBtnColor):(colors.lightGray)) ,
                    // height: h(6.5),
                    // width: '90%',
                    // alignSelf: 'center',
                    paddingVertical:10,
                  }}>
                  <Text
                    style={{
                      width: '100%',
                      textAlign: 'center',
                      fontSize: RFValue(13),
                      color: colors.black,
                      fontWeight: 'bold',
                    }}>
                    {props.alertProps.leftBtnText}
                  </Text>
                </Button>
              </View>
            )}

            {props.alertProps.showRightButton && (
              <View style={{flex:1 ,marginLeft:10}}>
                <Button
                  light
                  onPress={() => {
                    props.onRightBtnClick()
                  }}
                  rounded
                  style={{
                    backgroundColor: props.alertProps.rightBtnDestructive?(colors.redDestructive):((!!props.alertProps.rightBtnColor)?(props.alertProps.rightBtnColor):(colors.skyBlue)),
                    // height: h(6.5),
                    // width: '90%',
                    // flex:0.5,
                    // alignSelf: 'center',
                    paddingVertical:10,
                  }}>
                  <Text
                    style={{
                      width: '100%',
                      textAlign: 'center',
                      fontSize: RFValue(13),
                      color: colors.black,
                      fontWeight: 'bold',
                    }}>
                    {props.alertProps.rightBtnText}
                  </Text>
                </Button>
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(52, 52, 52, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  main_view: {
    backgroundColor: colors.white,
    borderRadius: 6,
    alignItems: 'center',
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  headerText: {
    color: colors.black,
    textAlign: 'center',
    fontWeight: 'bold',
    // fontFamily: 'SFProText-Medium',
  },
  msgText: {
    color: colors.black,
    textAlign: 'center',
    fontWeight: 'normal',
    // fontFamily: 'SFProText-Medium',
  }
});

export default AlertComponent;
