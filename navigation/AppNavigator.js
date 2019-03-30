import React from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet,
    View,
} from 'react-native';
import { createAppContainer, createStackNavigator, createSwitchNavigator, NavigationActions } from 'react-navigation';

import AppStack from './AppStack';

import InitScreen from '../screens/InitScreen';
import selectScreen from '../screens/SelectScreen';

class AuthLoadingScreen extends React.Component {
    constructor(props) {
        super(props);
        this._getDomainAsync();
    }

    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'black' }}>
                <StatusBar barStyle="light-content" />
                <ActivityIndicator size="large" />
            </View>
        );
    }

    _getDomainAsync = async () => {
        const userDomain = await AsyncStorage.getItem('userDomain');
        this.props.navigation.navigate(userDomain ? 'App' : 'Auth')
    };
}

const AuthStack = createStackNavigator({
    Init: InitScreen,
    Select: selectScreen
});

export default createAppContainer(createSwitchNavigator(
    {
        AuthLoading: AuthLoadingScreen,
        App: AppStack,
        Auth: AuthStack,
    },
    {
        initialRouteName: 'AuthLoading',
    }
));