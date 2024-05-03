// import Picker from '@gregfrench/react-native-wheel-picker';
import React, { useState } from 'react';
import {
  Modal, StyleSheet,


  Text, View
} from 'react-native';
import { height as h, width as w } from "react-native-dimension";
import ButtonFill from '../CustomComponents/ButtomFill';
import colors from './colors';
import { RFValue } from 'react-native-responsive-fontsize';

// var PickerItem = Picker.Item;

const TimePickerDialog = props => {


  const [selectedHoursWorkTime, setSelectedHoursWorkTime] = useState(0);
  const [selectedMinutesWorkTime, setSelectedMinutesWorkTime] = useState(0);
  const [selectedSecWorkTime, setSelectedSecWorkTime] = useState(0);

  const [wheelSelectorItems, setWheelSelectorItems] = useState(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59"]);

  const {
    show,
    ...attributes
  } = props;


  return (
    <Modal
      transparent={true}
      animationType={'none'}
      visible={show}
      onRequestClose={() => { console.log('close modal') }}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>

          <View style={{ width: "100%", flex: 0.7, marginTop: 20 }}>

            <View style={{ justifyContent: "center", alignItems: "center", marginBottom: 30 }}>
              <Text style={[{ color: colors.appTextColor }, { color: colors.appTextColor, fontSize: RFValue(26), fontFamily: "SFProText-Medium" }]}>Select Time</Text>
            </View>

            {!!wheelSelectorItems && wheelSelectorItems.length > 0 &&
              <View>

                <View style={{ flexDirection: "row" }}>

                  <View style={{ flex: 0.33, height: 200 }}>

                    <View style={{
                      marginTop: 20,
                      justifyContent: "center",
                      alignItems: "center"
                    }}>
                      <Text style={[{ color: colors.appTextColor }, { color: colors.appTextColor, fontSize: RFValue(14), fontFamily: "SFProText-Medium" }]}>Hours</Text>
                    </View>
                    {/* <Picker style={{ flex: 1, height: 120, marginTop: 20 }}
                      lineColor="#000000" //to set top and bottom line color (Without gradients)
                      lineGradientColorFrom="#000000" //to set top and bottom starting gradient line color
                      lineGradientColorTo="#000000" //to set top and bottom ending gradient
                      selectedValue={selectedHoursWorkTime}
                      itemStyle={{ color: "#000000", fontSize: RFValue(26), fontWeight: "bold" }}
                      onValueChange={(index) => {
                        setSelectedHoursWorkTime(index)
                      }}>
                      {wheelSelectorItems.map((value, i) => (
                        <PickerItem label={value} value={i} key={i} />
                      ))}
                    </Picker> */}
                  </View>

                  <View style={{ flex: 0.33 }}>

                    <View style={{
                      marginTop: 20,
                      justifyContent: "center",
                      alignItems: "center"
                    }}>
                      <Text style={[{ color: colors.appTextColor }, { color: colors.appTextColor, fontSize: RFValue(14), fontFamily: "SFProText-Medium" }]}>Minutes</Text>
                    </View>
                    {/* <Picker style={{ flex: 1, marginTop: 20 }}
                      lineColor="#000000" //to set top and bottom line color (Without gradients)
                      lineGradientColorFrom="#000000" //to set top and bottom starting gradient line color
                      lineGradientColorTo="#000000" //to set top and bottom ending gradient
                      selectedValue={selectedMinutesWorkTime}
                      itemStyle={{ color: "#000000", fontSize: RFValue(26), fontWeight: "bold" }}
                      onValueChange={(index) => {
                        setSelectedMinutesWorkTime(index)
                      }}>
                      {wheelSelectorItems.map((value, i) => (
                        <PickerItem label={value} value={i} key={i} />
                      ))}
                    </Picker> */}
                  </View>

                  <View style={{ flex: 0.33 }}>

                    <View style={{
                      marginTop: 20,
                      justifyContent: "center",
                      alignItems: "center"
                    }}>
                      <Text style={[{ color: colors.appTextColor }, { color: colors.appTextColor, fontSize: RFValue(14), fontFamily: "SFProText-Medium" }]}>Seconds</Text>
                    </View>
                    {/* <Picker style={{ flex: 1, marginTop: 20 }}
                      lineColor="#000000" //to set top and bottom line color (Without gradients)
                      lineGradientColorFrom="#000000" //to set top and bottom starting gradient line color
                      lineGradientColorTo="#000000" //to set top and bottom ending gradient
                      selectedValue={selectedSecWorkTime}
                      itemStyle={{ color: "#000000", fontSize: RFValue(26), fontWeight: "bold" }}
                      onValueChange={(index) => {
                        // this.onSecondsPickerSelect(index)
                        setSelectedSecWorkTime(index)
                      }}>
                      {wheelSelectorItems.map((value, i) => (
                        <PickerItem label={value} value={i} key={i} />
                      ))}
                    </Picker> */}
                  </View>
                </View>
              </View>
            }

          </View>

          <View
            style={[
              {
                flex: 0.3,
                width: "90%",
                justifyContent: "flex-end",
                marginBottom: 40,
              },
            ]}>
            <ButtonFill
              btnTitle={"SAVE"}

              onPress={() => {
                props.onSubmitTime({
                  hrs: selectedHoursWorkTime,
                  mins: selectedMinutesWorkTime,
                  secs: selectedSecWorkTime
                })
              }}
            />
          </View>

        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalBackground: {
    width: w(100),
    height: h(100),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1C1C1EAA'
  },
  activityIndicatorWrapper: {
    backgroundColor: colors.intervalCellBackground,
    width: w(90),
    height: h(60),
    borderRadius: 10,
    flexDirection: 'column',
    alignItems: "center"

  }
});

export default TimePickerDialog;