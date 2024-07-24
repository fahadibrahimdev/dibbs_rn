import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React, {Component, Fragment} from 'react';
import {Text} from 'react-native';
import {height as h, width as w} from 'react-native-dimension';
import {RFValue} from 'react-native-responsive-fontsize';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';
import {TabScreenNames} from '../constants/ScreenNames';
import colors from '../helpers/colors';
import {getMySavedProducts} from '../redux/actions/productActions';
import {Screens} from './Screens';

const Tab = createBottomTabNavigator();

class BottomNavigator extends Component {
  render() {
    return (
      <Fragment>
        <SafeAreaView
          style={{flex: 1, backgroundColor: colors.commonBackground}}>
          <Tab.Navigator
            screenOptions={({route}) => ({
              headerShown: false,
              tabBarVisible: true,

              tabBarStyle: {
                height: h(8),
                paddingBottom: w(1),
                backgroundColor: colors.commonBackground,
              },
              tabBarLabelStyle: {
                fontSize: RFValue(11),
                margin: 0,
                padding: 0,
                fontFamily: 'SFProText-Medium',
              },
              tabBarActiveTintColor: colors.appSelectedTextColor,
              tabBarInactiveTintColor: colors.appTextColor,
            })}>
            <Tab.Screen
              name={TabScreenNames.Deals}
              component={Screens.DealsNavigator}
              options={{
                tabBarLabel: TabScreenNames.Deals,
                tabBarIcon: ({focused, color, size}) => (
                  <Icon
                    name="handshake-o"
                    size={h(3)}
                    color={
                      focused
                        ? colors.appSelectedTextColor
                        : colors.appTextColor
                    }
                  />
                ),
              }}
            />
            <Tab.Screen
              name={TabScreenNames.Search}
              component={Screens.SearchScreen}
              options={{
                tabBarLabel: TabScreenNames.Search,
                tabBarIcon: ({focused, color, size}) => (
                  <Ionicons
                    name={focused ? 'md-search' : 'md-search'}
                    size={h(3)}
                    color={
                      focused
                        ? colors.appSelectedTextColor
                        : colors.appTextColor
                    }
                  />
                ),
              }}
            />
            <Tab.Screen
              name={TabScreenNames.Categories}
              component={Screens.CategoriesScreen}
              options={{
                tabBarLabel: TabScreenNames.Categories,
                tabBarIcon: ({focused, color, size}) => (
                  <Ionicons
                    name={focused ? 'md-apps' : 'md-apps'}
                    size={h(3)}
                    color={
                      focused
                        ? colors.appSelectedTextColor
                        : colors.appTextColor
                    }
                  />
                ),
              }}
            />
            <Tab.Screen
              name={TabScreenNames.Saved}
              component={Screens.SavedScreen}
              options={{
                tabBarLabel: TabScreenNames.Saved,
                tabBarIcon: ({focused, color, size}) => (
                  <Ionicons
                    name={focused ? 'md-heart' : 'md-heart'}
                    size={h(3)}
                    color={
                      focused
                        ? colors.appSelectedTextColor
                        : colors.appTextColor
                    }
                  />
                ),
              }}
              listeners={{
                tabPress: e => {
                  // Prevent default action

                  this.props.getMySavedProducts();
                },
              }}
            />
            <Tab.Screen
              name={TabScreenNames.MyDibbs}
              component={Screens.MyDibbsScreen}
              options={{
                tabBarLabel: TabScreenNames.MyDibbs,
                tabBarIcon: ({focused, color, size}) => (
                  <Text
                    style={{
                      fontSize: RFValue(22),
                      fontWeight: '900',
                      color: focused
                        ? colors.appSelectedTextColor
                        : colors.appTextColor,
                    }}>
                    D
                  </Text>
                ),
              }}
            />
          </Tab.Navigator>
        </SafeAreaView>
      </Fragment>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {};
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    getMySavedProducts: () => dispatch(getMySavedProducts()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BottomNavigator);
