import React, {Component} from 'react';
import {Text, TouchableHighlight, View} from 'react-native';
import {height as h} from 'react-native-dimension';
import FastImage from 'react-native-fast-image';
import ImageSlider from 'react-native-image-slider';
import ProgressBar from 'react-native-progress/Circle';
import {SafeAreaView} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
import HeaderCenter from '../../../CustomComponents/Header/HeaderCenter';
import colors from '../../../helpers/colors';
import {backImage} from '../../../helpers/Images';

import {CommonActions} from '@react-navigation/native';
import {Button} from 'native-base';
import {createImageProgress} from 'react-native-image-progress';
import {RFValue} from 'react-native-responsive-fontsize';
import {ScreenNames} from '../../../constants/ScreenNames';
import {AsyncKeysEnum} from '../../../helpers/enum';
import {AsyncStoreViaKey} from '../../../helpers/LocalStorage/AsyncStorage';

const Image = createImageProgress(FastImage);

class IntroScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fullScreenMode: false,
      imagesArray: [],
      currentPosition: 0,
    };
  }

  componentDidMount() {
    const fullScreenModeProp =
      !!this.props.route.params && !!this.props.route.params.fullScreenModeProp
        ? this.props.route.params.fullScreenModeProp
        : false;
    this.setState({
      fullScreenMode: fullScreenModeProp,
      imagesArray: [
        require('./../../../assets/images/startup_screen/1.png'),
        require('./../../../assets/images/startup_screen/2.png'),
        require('./../../../assets/images/startup_screen/3.png'),
        require('./../../../assets/images/startup_screen/4.png'),
        require('./../../../assets/images/startup_screen/5.png'),
        require('./../../../assets/images/startup_screen/6.png'),
        require('./../../../assets/images/startup_screen/7.png'),
        require('./../../../assets/images/startup_screen/8.png'),
      ],
    });

    const asyncObject = {
      alreadyLoaded: true,
    };

    AsyncStoreViaKey(AsyncKeysEnum.INTRO_SCREEN, asyncObject);
  }

  imageSliderFunction = () => {
    return (
      <View
        style={{
          flex: 1,
          // backgroundColor: 'red',
        }}>
        <ImageSlider
          style={{
            // borderBottomLeftRadius: h(7),
            // borderBottomRightRadius: h(7),
            backgroundColor: '#11558800',
          }}
          // loopBothSides
          // autoPlayWithInterval={3000}
          images={this.state.imagesArray}
          customSlide={({index, item, style, width}) => {
            return (
              // It's important to put style here because it's got offset inside
              <View
                key={'list1:' + index}
                style={[
                  style,
                  {
                    flex: 1,
                    resizeMode: 'cover',
                    // borderBottomLeftRadius: h(7),
                    // borderBottomRightRadius: h(7),
                    backgroundColor: '#115588',
                  },
                ]}>
                <Image
                  // source={{
                  //   uri: item,
                  // }}
                  source={item}
                  indicator={ProgressBar}
                  style={{
                    width: '100%',
                    height: '100%',
                    // borderBottomLeftRadius: h(7),
                    // borderBottomRightRadius: h(7),
                    backgroundColor: '#115588',
                  }}
                  imageStyle={{
                    width: '100%',
                    height: '100%',
                    // borderTopLeftRadius: h(2),
                    // borderTopRightRadius: h(2),
                    resizeMode: 'cover',
                    // borderBottomLeftRadius: h(7),
                    // borderBottomRightRadius: h(7),
                    backgroundColor: '#115588',
                  }}
                />
              </View>
            );
          }}
          onPositionChanged={position => {
            this.setState({
              currentPosition: position,
            });
          }}
          customButtons={(position, move) => {
            return (
              <View
                style={{
                  // marginBottom: (RFValue(100) * (-1))
                  // position: 'absolute',
                  width: '100%',
                  // height: '100%',
                  // flexDirection: 'row',

                  // backgroundColor: '#995544',
                  justifyContent: 'center',
                  alignItems: 'center',
                  // alignSelf: 'flex-end',
                  // alignSelf: 'baseline'
                  paddingBottom: RFValue(10),
                }}
                // pointerEvents={'none'}
              >
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    // backgroundColor: 'red',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    {this.state.imagesArray.map((image, index) => {
                      return (
                        <TouchableHighlight
                          key={'list2:' + index}
                          underlayColor="#ccc"
                          onPress={() => {
                            // move(index)
                          }}
                          style={
                            {
                              // backgroundColor: '#221982',
                            }
                          }>
                          <View
                            style={{
                              width: RFValue(6),
                              height: RFValue(6),
                              borderRadius: RFValue(50),
                              margin: RFValue(5),
                              backgroundColor:
                                position === index ? '#FFFFFF' : '#555555',
                            }}></View>
                          {/* <Text style={position === index && {}}>
                    {index + 1}
                  </Text> */}
                        </TouchableHighlight>
                      );
                    })}
                  </View>

                  <View
                    style={{
                      position: 'absolute',
                    }}>
                    <View
                      style={{
                        marginTop: this.state.fullScreenMode
                          ? RFValue(35) * -1
                          : RFValue(5) * -1,
                      }}>
                      <Button
                        light
                        onPress={() => {
                          if (position < this.state.imagesArray.length - 1) {
                            this.setState({
                              currentPosition: this.state.currentPosition + 1,
                            });
                          } else {
                            if (this.state.fullScreenMode === false) {
                              this.props.navigation.goBack(null);
                            } else {
                              this.props.navigation.dispatch(
                                CommonActions.reset({
                                  index: 0,
                                  routes: [{name: ScreenNames.BottomNavigator}],
                                }),
                              );
                            }
                          }
                        }}
                        rounded
                        style={{
                          justifyContent: 'center',
                          backgroundColor: colors.lightGray,
                          height: h(6.5),
                          width: '70%',
                          alignSelf: 'center',
                        }}>
                        <Text
                          style={{
                            width: '100%',
                            textAlign: 'center',
                            fontSize: RFValue(15),
                            color: 'black',
                            fontWeight: 'bold',
                          }}>
                          {position < this.state.imagesArray.length - 1
                            ? 'Next'
                            : 'Done'}
                        </Text>
                      </Button>
                    </View>
                  </View>
                </View>
              </View>
            );
          }}
          position={this.state.currentPosition}
        />

        {/* {this.state.currentPosition === this.state.imagesArray.length - 1 && (
          <View
            style={{
              width: '100%',
              height: '100%',
              justifyContent: 'flex-end',
              position: 'absolute',
            }}>
            
          </View>
        )} */}
      </View>
    );
  };

  render() {
    return (
      <View style={{flex: 1}}>
        {this.state.fullScreenMode ? (
          <View
            style={{
              flex: 1,
              // backgroundColor: 'red',
            }}>
            {this.imageSliderFunction()}
          </View>
        ) : (
          <SafeAreaView
            style={{
              flex: 1,
              backgroundColor: colors.commonBackground,
            }}>
            <HeaderCenter
              titleText={'Intro'}
              cardStyle={true}
              leftImageSource={backImage}
              onPressLeftButton={() => {
                this.props.navigation.goBack(null);
              }}
              leftType="image"
            />
            {this.imageSliderFunction()}
          </SafeAreaView>
        )}
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const {} = state.authReducer;

  return {};
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(IntroScreen);
