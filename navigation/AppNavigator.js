import React from 'react';
import { createAppContainer, createStackNavigator, createSwitchNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';

import InitScreen from '../screens/InitScreen';
import selectScreen from '../screens/selectScreen';

const AuthStack = createStackNavigator({
    Init: InitScreen,
    Select: selectScreen
});

export default createAppContainer(createSwitchNavigator(
    {
        // You could add another route here for authentication.
        // Read more at https://reactnavigation.org/docs/en/auth-flow.html
        Main: MainTabNavigator,
        Auth: AuthStack,
    },
    {
        initialRouteName: 'Auth',
    }
));