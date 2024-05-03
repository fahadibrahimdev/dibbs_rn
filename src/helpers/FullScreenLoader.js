import LottieView from 'lottie-react-native';
import React from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { height as h, width as w } from 'react-native-dimension';

const FullScreenLoader = props => {
  const {loading, ...attributes} = props;

  return (
    <Modal
      transparent={true}
      animationType={'none'}
      visible={loading}
      onRequestClose={() => {
        console.log('close modal');
      }}>
      <View style={styles.modalBackground}>
        <View
          style={[
            styles.activityIndicatorWrapper,
            {width: w(80), height: h(50)},
          ]}>
          <LottieView
            style={{width: w(40), height: h(10), alignSelf: 'center'}}
            source={require('../animations/loading-dots-with-changing-color.json')}
            loop={true}
            autoPlay={true}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFFCC',
  },
  activityIndicatorWrapper: {
    // backgroundColor: "#FFFFFFCC",
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

export default FullScreenLoader;
