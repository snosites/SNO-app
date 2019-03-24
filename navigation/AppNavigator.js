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
import selectScreen from '../screens/selectScreen';

class AuthLoadingScreen extends React.Component {
    constructor(props) {
        super(props);
        this._bootstrapAsync();
    }

    // Fetch the token from storage then navigate to our appropriate place
    _bootstrapAsync = async () => {
        const userOrg = await AsyncStorage.getItem('userOrg');

        this.props.navigation.navigate(userOrg ? 'Main' : 'Auth');
    };

    // Render any loading content that you like here
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