import React from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet,
    View,
} from 'react-native';
import { createAppContainer, createStackNavigator, createSwitchNavigator, NavigationActions } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';

import InitScreen from '../screens/InitScreen';
import selectScreen from '../screens/SelectScreen';

class AuthLoadingScreen extends React.Component {
    constructor(props) {
        super(props);
        this._getDomainAsync();
    }

    _getDomainAsync = async () => {
        const userDomain = await AsyncStorage.getItem('userDomain');
        this.props.navigation.navigate(userDomain ? 'Main' : 'Auth')
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