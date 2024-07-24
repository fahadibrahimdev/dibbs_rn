import React, {Component} from 'react';
import {
  Dimensions,
  FlatList,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
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

const HEIGHT = Dimensions.get('screen').height;
const WIDTH = Dimensions.get('screen').width;

class IntroScreen extends Component {
  constructor(props) {
    super(props);

    this.flatListRef = React.createRef();

    this.state = {
      fullScreenMode: false,
      imagesArray: [],
      currentPosition: 0,
      orderFromButtons: '',
    };

    this.handleViewableItemsChanged =
      this.handleViewableItemsChanged.bind(this);
  }

  componentDidMount() {
    const fullScreenModeProp =
      !!this.props.route.params && !!this.props.route.params.fullScreenModeProp
        ? this.props.route.params.fullScreenModeProp
        : false;
    this.setState({
      fullScreenMode: fullScreenModeProp,
      imagesArray: [
        {
          img: require('./../../../assets/images/startup_screen/1.png'),
          color: 'red',
        },
        {
          img: require('./../../../assets/images/startup_screen/2.png'),
          color: 'blue',
        },
        {
          img: require('./../../../assets/images/startup_screen/3.png'),
          color: 'green',
        },
        {
          img: require('./../../../assets/images/startup_screen/4.png'),
          color: 'orange',
        },
        {
          img: require('./../../../assets/images/startup_screen/5.png'),
          color: 'orange',
        },
        {
          img: require('./../../../assets/images/startup_screen/6.png'),
          color: 'orange',
        },
        {
          img: require('./../../../assets/images/startup_screen/7.png'),
          color: 'orange',
        },
        {
          img: require('./../../../assets/images/startup_screen/8.png'),
          color: 'orange',
        },
        // require('./../../../assets/images/startup_screen/2.png'),
        // require('./../../../assets/images/startup_screen/3.png'),
        // require('./../../../assets/images/startup_screen/4.png'),
        // require('./../../../assets/images/startup_screen/5.png'),
        // require('./../../../assets/images/startup_screen/6.png'),
        // require('./../../../assets/images/startup_screen/7.png'),
        // require('./../../../assets/images/startup_screen/8.png'),
      ],
    });

    const asyncObject = {
      alreadyLoaded: true,
    };

    AsyncStoreViaKey(AsyncKeysEnum.INTRO_SCREEN, asyncObject);
  }

  componentDidUpdate(prevProps) {}

  handleViewableItemsChanged = ({viewableItems}) => {
    const firstVisibleItemIndex = viewableItems[0]?.index;
    this.setState({currentPosition: firstVisibleItemIndex});
  };

  goToNextSlide = () => {
    console.log('Next Slide: ', this.state.currentPosition);
    if (this.flatListRef.current) {
      // this.flatListRef.current.scrollToIndex(this.state.currentPosition + 1);
      // this.setState({
      //   orderFromButtons: 'next',
      //   currentPosition: this.state.currentPosition + 1,
      // });

      const index = this.state.currentPosition + 1;
      console.log('Fahad next value I: ', index);
      this.flatListRef.current.scrollToIndex({index});
    }
  };

  goToPreviousSlide = () => {
    console.log('Previous Slide: ', this.state.currentPosition);
    if (this.flatListRef.current) {
      // this.flatListRef.current.scrollToIndex(this.state.currentPosition - 1);
      // this.setState({
      //   orderFromButtons: 'previous',
      //   currentPosition: this.state.currentPosition - 1,
      // });
      const index = this.state.currentPosition - 1;
      console.log('Fahad next value D: ', index);
      this.flatListRef.current.scrollToIndex({index});
    }
  };

  imageSliderFunction = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
        }}>
        <FlatList
          ref={this.flatListRef}
          data={this.state.imagesArray}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          pagingEnabled={true}
          renderItem={({item, index}) => {
            return (
              <View
                style={{
                  width: WIDTH,
                  // height: HEIGHT,
                  backgroundColor: item.color,
                }}>
                <View
                  key={'list1:' + index}
                  style={[
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
                    source={item.img}
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
                      // resizeMode: 'contain',
                      // borderBottomLeftRadius: h(7),
                      // borderBottomRightRadius: h(7),
                      backgroundColor: '#115588',
                    }}
                    resizeMode="stretch"
                    // resizeMode="contain"
                  />
                </View>
              </View>
            );
          }}
          onViewableItemsChanged={this.handleViewableItemsChanged}
        />
        <View
          style={{
            position: 'absolute',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 10,
            paddingVertical: 5,
            // alignSelf: 'flex-end',
            // backgroundColor: 'red',
            width: '100%',
            // height: 50,
          }}>
          <Button
            light
            onPress={() => {
              if (this.state.currentPosition > 0) {
                this.goToPreviousSlide();
              }
            }}
            rounded
            disabled={this.state.currentPosition < 1}
            style={{
              justifyContent: 'center',
              backgroundColor: colors.lightGray,
              // height: h(6.5),
              width: '25%',
              alignSelf: 'center',
            }}>
            <Text
              style={{
                width: '100%',
                textAlign: 'center',
                fontSize: RFValue(10),
                color: this.state.currentPosition < 1 ? 'gray' : 'black',
                fontWeight: 'bold',
              }}>
              {'Previous'}
            </Text>
          </Button>

          <View
            style={{
              flexDirection: 'row',
              borderRadius: 20,
              paddingHorizontal: 10,
              backgroundColor: '#ffffff99',
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
                        this.state.currentPosition === index
                          ? colors.appPurple
                          : '#55555555',
                    }}></View>
                  {/* <Text style={position === index && {}}>
          {index + 1}
        </Text> */}
                </TouchableHighlight>
              );
            })}
          </View>
          <Button
            light
            onPress={() => {
              if (
                this.state.currentPosition <
                this.state.imagesArray.length - 1
              ) {
                this.goToNextSlide();
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
              // height: h(6.5),
              width: '25%',
              alignSelf: 'center',
            }}>
            <Text
              style={{
                width: '100%',
                textAlign: 'center',
                fontSize: RFValue(12),
                color: 'black',
                fontWeight: 'bold',
              }}>
              {this.state.currentPosition < this.state.imagesArray.length - 1
                ? 'Next'
                : 'Done'}
            </Text>
          </Button>
        </View>
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
