import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { ScreenNames } from '../constants/ScreenNames';
import { Screens } from './Screens';

const Stack = createStackNavigator();

export default function CategoriesDealsNavigator({ navigation, route }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={ScreenNames.CategoriesDealsScreen}
        component={Screens.CategoriesDealsScreen}
        options={{ headerShown: false }}
        initialParams={route.params}
      />
      <Stack.Screen
        name={ScreenNames.ProductDetailScreen}
        component={Screens.ProductDetailScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={ScreenNames.ProductAboutScreen}
        component={Screens.ProductAboutScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={ScreenNames.ProductLocationScreen}
        component={Screens.ProductLocationScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={ScreenNames.WebSiteScreen}
        component={Screens.WebSiteScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={ScreenNames.CartScreen}
        component={Screens.CartScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={ScreenNames.PaymentScreen}
        component={Screens.PaymentScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={ScreenNames.CardPaymentScreen}
        component={Screens.CardPaymentScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
