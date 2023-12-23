import React from 'react';
import colors from './src/styles/colors';
import Home from './src/scenes/home';
import Login from './src/scenes/admin/login';
import Viewer_Home from './src/scenes/home/viewer';
import Admin_Home from './src/scenes/admin/admin-home';
import Product from './src/scenes/admin/products';
import Speaker_Home from './src/scenes/home/speaker';
import Meeting from './src/scenes/ILS';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {SCREEN_NAMES} from './src/navigators/screenNames';

const RootStack = createStackNavigator();

export default function App({}) {
  return (
    <NavigationContainer>
      <RootStack.Navigator
        screenOptions={{
          animationEnabled: false,
          presentation: 'modal',
        }}
        initialRouteName={SCREEN_NAMES.Login}>
          <RootStack.Screen
          name={SCREEN_NAMES.Login}
          component={Login}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name={SCREEN_NAMES.Home}
          component={Home}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name={SCREEN_NAMES.Admin_Home}
          component={Admin_Home}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name={SCREEN_NAMES.Product}
          component={Product}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name={SCREEN_NAMES.Viewer_Home}
          component={Viewer_Home}
          options={{
            headerStyle: {
              backgroundColor: colors.primary['900'],
            },
            headerBackTitle: 'Home',
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <RootStack.Screen
          name={SCREEN_NAMES.Speaker_Home}
          component={Speaker_Home}
          options={{
            headerStyle: {
              backgroundColor: colors.primary['900'],
            },
            headerBackTitle: 'Home',
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <RootStack.Screen
          name={SCREEN_NAMES.Meeting}
          component={Meeting}
          options={{headerShown: false}}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
