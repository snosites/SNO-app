import React from 'react';
import {
    Platform,
    View,
    Text,
    AsyncStorage,
    StatusBar,
    ActivityIndicator
} from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createDrawerNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';


const LinksStack = createStackNavigator({
    Links: LinksScreen,
});

LinksStack.navigationOptions = {
    tabBarLabel: 'Links',
    tabBarIcon: ({ focused }) => (
        <TabBarIcon
            focused={focused}
            name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'}
        />
    ),
};


const SettingsStack = createStackNavigator({
    Settings: SettingsScreen,
});

const TestScreen = createStackNavigator({
    Settings: SettingsScreen,
});

SettingsStack.navigationOptions = {
    tabBarLabel: 'Settings',
    tabBarIcon: ({ focused }) => (
        <TabBarIcon
            focused={focused}
            name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'}
        />
    ),
};

export default class MainApp extends React.Component {
    constructor(props) {
        super(props);
        this._getDomainAsync();
    }

    _getDomainAsync = async () => {
        const userDomain = await AsyncStorage.getItem('userDomain');
        // this._getMenusAsync(testMenus);
        console.log('userDomain', userDomain);

        console.log('finished building menus', routeConfig);
    };

    _getMenusAsync = (categories) => {
        categories.map((category) => {
            routeConfig[category] = {
                screen: TestScreen,
                navigationOptions: (props) => {
                    props.navigation.setParams({ category });
                }
            }
        })
        DrawerNav = createDrawerNavigator(routeConfig, { /*options*/ });
        BottomTabs = createAppContainer(createBottomTabNavigator({
            HomeStack: DrawerNav,
            LinksStack,
            SettingsStack,
        }));
    }


    render() {
        const DrawerNav = createDrawerNavigator({Testhome: TestScreen});
        const BottomTabs = createAppContainer(createBottomTabNavigator({
            HomeStack: DrawerNav,
            LinksStack,
            SettingsStack,
        }));
        return (
            // <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'black' }}>
            //     <StatusBar barStyle="light-content" />
            //     <ActivityIndicator size="large" color="purple" />
            // </View>
            <BottomTabs />
        );
    }
}


