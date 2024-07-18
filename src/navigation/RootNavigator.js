import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {ScreenNames} from '../constants/ScreenNames';
import {Screens} from './Screens';

const Stack = createStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={ScreenNames.SplashScreen}
        component={Screens.SplashScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={ScreenNames.HomeScreen}
        component={Screens.HomeScreen}
      />
      <Stack.Screen
        name={ScreenNames.BottomNavigator}
        component={Screens.BottomNavigator}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={ScreenNames.CategoriesDealsNavigator}
        component={Screens.CategoriesDealsNavigator}
        options={{headerShown: false}}
      />

      {/* <Stack.Screen name={ScreenNames.ProductDetailScreen} component={Screens.ProductDetailScreen} options={{ headerShown: false }}/>
      <Stack.Screen name={ScreenNames.ProductAboutScreen} component={Screens.ProductAboutScreen} options={{ headerShown: false }}/>
      <Stack.Screen name={ScreenNames.ProductLocationScreen} component={Screens.ProductLocationScreen} options={{ headerShown: false }}/> */}

      {/* <Stack.Screen name={ScreenNames.CartScreen} component={Screens.CartScreen} options={{ headerShown: false }}/> */}

      {/* <Stack.Screen name={ScreenNames.MyDibbsScreen} component={Screens.MyDibbsScreen} options={{ headerShown: false }}/> */}

      <Stack.Screen
        name={ScreenNames.LoginScreen}
        component={Screens.LoginScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={ScreenNames.SignUpScreen}
        component={Screens.SignUpScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={ScreenNames.RefferalScreen}
        component={Screens.RefferalScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={ScreenNames.ForgotPasswordScreen}
        component={Screens.ForgotPasswordScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={ScreenNames.NotificationSettingsScreen}
        component={Screens.NotificationSettingsScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={ScreenNames.IntroScreen}
        component={Screens.IntroScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={ScreenNames.CustomerSupportScreen}
        component={Screens.CustomerSupportScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={ScreenNames.FeaturesScreen}
        component={Screens.FeaturesScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={ScreenNames.AboutScreen}
        component={Screens.AboutScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={ScreenNames.ShareAppScreen}
        component={Screens.ShareAppScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={ScreenNames.FAQsScreen}
        component={Screens.FAQsScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={ScreenNames.PrivacyPolicyScreen}
        component={Screens.PrivacyPolicyScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={ScreenNames.TermsAndConditionsScreen}
        component={Screens.TermsAndConditionsScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={ScreenNames.MyOrdersScreen}
        component={Screens.MyOrdersScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={ScreenNames.DealDetailScreen}
        component={Screens.DealDetailScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
