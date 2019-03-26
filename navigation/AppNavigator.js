import React from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet,
    View,
} from 'react-native';
import { createAppContainer, createStackNavigator, createSwitchNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';

import InitScreen from '../screens/InitScreen';
import selectScreen from '../screens/SelectScreen';

class AuthLoadingScreen extends React.Component {
    constructor(props) {
        super(props);
        this._bootstrapAsync();
    }

    _bootstrapAsync = async () => {
        const userOrg = await AsyncStorage.getItem('userOrg');
        this.props.navigation.navigate(userOrg ? 'Main' : 'Auth')
    };

    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'black' }}>
                <StatusBar barStyle="light-content" />
                <ActivityIndicator size="large" />
            </View>
        );
    }
}

const AuthStack = createStackNavigator({
    Init: InitScreen,
    Select: selectScreen
});

export default createAppContainer(createSwitchNavigator(
    {
        AuthLoading: AuthLoadingScreen,
        Main: MainTabNavigator,
        Auth: AuthStack,
    },
    {
        initialRouteName: 'AuthLoading',
    }
));