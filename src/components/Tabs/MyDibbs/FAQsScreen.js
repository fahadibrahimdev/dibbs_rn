import { Button, Header, Icon, Input, Item } from 'native-base';
import React, { Component } from 'react';
import { FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { height as h, width as w } from 'react-native-dimension';
import { RFValue } from 'react-native-responsive-fontsize';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import HeaderCenter from '../../../CustomComponents/Header/HeaderCenter';
import AlertComponent from '../../../helpers/AlertComponent';
import colors from '../../../helpers/colors';
import { AlertTypesEnum } from '../../../helpers/enum';
import { backImage } from '../../../helpers/Images';
import { logout, searchFAQs } from '../../../redux/actions/authActions';

class FAQsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      //Alert State

      alertProps: {
        alertModalVisible: false,
        alertType: '',
        alertHeading: '',
        alertMsg: '',
        showLeftButton: false,
        leftBtnText: '',
        leftBtnDestructive: false,
        showRightButton: false,
        rightBtnText: '',
        rightBtnDestructive: false,
      },

      FAQsData: [
        {
          question: 'Question # 1',
          answerVisible: false,
          ansewr:
            'This is dummy text.This is dummy text.This is dummy text.This is dummy text.This is dummy text.This is dummy text.',
        },
        {
          question: 'Question # 2',
          answerVisible: false,
          ansewr:
            'This is dummy text.This is dummy text.This is dummy text.This is dummy text.This is dummy text.This is dummy text.',
        },
        {
          question: 'Question # 3',
          answerVisible: false,
          ansewr:
            'This is dummy text.This is dummy text.This is dummy text.This is dummy text.This is dummy text.This is dummy text.',
        },
        {
          question: 'Question # 4',
          answerVisible: false,
          ansewr:
            'This is dummy text.This is dummy text.This is dummy text.This is dummy text.This is dummy text.This is dummy text.',
        },
        {
          question: 'Question # 5',
          answerVisible: false,
          ansewr:
            'This is dummy text.This is dummy text.This is dummy text.This is dummy text.This is dummy text.This is dummy text.',
        },
      ],

      searchText: '',
      filteredData: [],
    };
  }

  componentDidMount() {
    this.props.searchFAQs('');
  }

  componentDidUpdate(prevProps) {
    if (this.props.searchedFAQs.length !== prevProps.searchedFAQs.length) {
      this.startSearch(this.state.searchText);
    }
  }

  // <Alert Functions>
  showAlertModal = (
    alertHeading,
    alertMsg,
    alertType = '',
    showLeftButton = false,
    leftBtnText = '',
    leftBtnDestructive = false,
    showRightButton = true,
    rightBtnText = 'OK',
    rightBtnDestructive = false,
  ) => {
    this.setState({
      alertProps: {
        alertModalVisible: true,
        alertHeading: alertHeading,
        alertMsg: alertMsg,
        alertType: alertType,
        showLeftButton: showLeftButton,
        leftBtnText: leftBtnText,
        leftBtnDestructive: leftBtnDestructive,
        showRightButton: showRightButton,
        rightBtnText: rightBtnText,
        rightBtnDestructive: rightBtnDestructive,
      },
    });
  };

  setAlertModalVisible = visible => {
    this.setState({
      alertProps: {
        alertModalVisible: visible,
      },
    });
  };
  // </Alert Functions>

  startSearch(searchText) {
    if (searchText === '') {
      this.setState({
        filteredData: this.props.searchedFAQs,
      });
    } else {
      const newFilteredData = this.props.searchedFAQs.filter(
        obj =>
          obj.question.toLowerCase().indexOf(searchText.toLowerCase()) >= 0 ||
          obj.answer.toLowerCase().indexOf(searchText.toLowerCase()) >= 0,
      );

      this.setState({filteredData: newFilteredData});
    }
  }

  onRefresh = () => {
    this.props.searchFAQs(this.state.searchText);
  };

  //REMARK: - Different Modes Interval Flat List
  renderIntervalModeFlatList() {
    return (
      <View
        style={{
          marginTop: h(1),
          height: '100%',
          backgroundColor: colors.intervalCellBackground,
        }}>
        <FlatList
          data={this.state.filteredData}
          horizontal={false}
          renderItem={({item, index}) =>
            this.renderCellIntervalModeItem(item, index)
          }
          keyExtractor={(item, index) => item}
          keyboardShouldPersistTaps="always"
          refreshControl={
            <RefreshControl
              tintColor={colors.appPurple}
              title={'Refreshing...'}
              titleColor={colors.appPurple}
              refreshing={this.props.isSearchingFAQs}
              onRefresh={this.onRefresh}
            />
          }
        />
      </View>
    );
  }
  renderCellIntervalModeItem = (item, index) => {
    return (
      <View
        style={{
          justifyContent: 'center',
          marginLeft: h(1),
          borderBottomWidth: 1,
          paddingBottom: h(1.5),
        }}>
        <TouchableOpacity
          onPress={() => {
            var oldStateObj = this.state.filteredData[index];
            oldStateObj.answerVisible = !oldStateObj.answerVisible;

            var newState = this.state.filteredData;
            newState[index] = oldStateObj;

            this.setState({
              filteredData: newState,
            });

            // this.setState
          }}>
          <View
            style={{
              marginTop: h(1),
              marginLeft: h(1),
              flexDirection: 'row',
              alignItems: 'center',
              width: '100%',
            }}>
            <View
              style={{
                flex: 0.8,
              }}>
              <Text
                style={[
                  {
                    textAlign: 'left',
                    fontSize: RFValue(18),
                    color: colors.appTextColor,
                    fontFamily: 'SFProText-Medium',
                  },
                ]}
                numberOfLines={0}>
                {item.question}
              </Text>
            </View>
            <View
              style={{
                flex: 0.2,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Ionicons
                name={
                  item.answerVisible
                    ? 'chevron-up-circle-outline'
                    : 'chevron-down-circle-outline'
                }
                size={h(3)}
                color={colors.black}
              />
            </View>
          </View>
        </TouchableOpacity>
        {item.answerVisible && (
          <View style={{marginLeft: h(1), marginTop: h(1)}}>
            <Text
              style={[
                {
                  textAlign: 'left',
                  fontSize: RFValue(13),
                  color: colors.appTextColor,
                },
              ]}>
              {item.answer}
            </Text>
          </View>
        )}
      </View>
    );
  };

  render() {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: colors.commonBackground,
        }}>
        <AlertComponent
          alertProps={this.state.alertProps}
          setModalVisible={this.setAlertModalVisible}
          onLeftBtnClick={() => {
            this.setAlertModalVisible(false);
          }}
          onRightBtnClick={() => {
            if (this.state.alertProps.alertType === AlertTypesEnum.Logout) {
              this.props.logout();
            }

            this.setAlertModalVisible(false);
          }}
          width={w(85)}
        />
        <HeaderCenter
          titleText={'FAQs'}
          cardStyle={true}
          leftImageSource={backImage}
          onPressLeftButton={() => {
            this.props.navigation.goBack(null);
          }}
          leftType="image"
        />

        <View>
          <Header
            searchBar
            rounded
            style={{height: h(6), backgroundColor: colors.white}}>
            <Item>
              <Icon name="ios-search" style={{fontSize: RFValue(15)}} />

              <Input
                style={{fontSize: RFValue(12)}}
                placeholder="Search"
                value={this.state.searchText}
                returnKeyType={'done'}
                onChangeText={searchText => this.setState({searchText})}
                onSubmitEditing={() => {
                  this.onRefresh();
                }}
              />
              <TouchableOpacity
                onPress={() => {
                  this.setState({searchText: ''});
                  this.props.searchFAQs('');
                }}>
                <Icon name="md-close-circle" style={{fontSize: RFValue(15)}} />
              </TouchableOpacity>
            </Item>
            <Button
              transparent
              onPress={() => {
                this.onRefresh();
              }}>
              <Text>Search</Text>
            </Button>
          </Header>
        </View>

        {!this.props.isSearchingFAQs && this.state.filteredData.length === 0 && (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: RFValue(22), fontWeight: 'bold'}}>
              No data to show
            </Text>
          </View>
        )}

        {(this.props.isSearchingFAQs || this.state.filteredData.length > 0) && (
          <View>
            <Text
              style={{
                textAlign: 'left',
                color: colors.appTextColor,
                fontSize: RFValue(20),
                marginLeft: h(2),
                marginTop: h(2),
                fontFamily: 'SFProText-Medium',
              }}>
              About DIBBS
            </Text>
            {this.renderIntervalModeFlatList()}
          </View>
        )}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const {
    appName,
    appState,
    isSearchingFAQs,
    allFAQsFetched,
    searchedFAQs,
    searchFAQsError,
  } = state.authReducer;

  return {
    appName,
    appState,
    isSearchingFAQs,
    allFAQsFetched,
    searchedFAQs,
    searchFAQsError,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    logout: () => dispatch(logout()),
    searchFAQs: keyword => dispatch(searchFAQs(keyword)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FAQsScreen);
