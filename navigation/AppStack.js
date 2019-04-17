import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createSwitchNavigator } from 'react-navigation';


import TabBarIcon from '../components/TabBarIcon';
import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SavedScreen from '../screens/SavedScreen';
import RecentScreen from '../screens/RecentScreen';

import AppSetupScreen from '../screens/AppSetupScreen';
import MainDrawerNavigator from './MainDrawerNavigator';

const SearchStack = createStackNavigator({
    Links: LinksScreen,
});

SearchStack.navigationOptions = {
    tabBarLabel: 'Search',
    tabBarIcon: ({ focused }) => (
        <TabBarIcon
            focused={focused}
            name={Platform.OS === 'ios' ? 'ios-search' : 'md-search'}
        />
    ),
};

const RecentStack = createStackNavigator({
    Recent: RecentScreen,
});

RecentStack.navigationOptions = {
    tabBarLabel: 'Recent',
            tabBarIcon: ({ focused }) => (
                <TabBarIcon
                    focused={focused}
                    // name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'}
                    name={'md-funnel'}
                />
            ),
};

const BookmarkStack = createStackNavigator({
    Saved: SavedScreen
});

BookmarkStack.navigationOptions = {
    tabBarLabel: 'Saved',
    tabBarIcon: ({ focused }) => (
        <TabBarIcon
            focused={focused}
            name={Platform.OS === 'ios' ? 'ios-bookmark' : 'md-bookmark'}
        />
    ),
};

const SettingsStack = createStackNavigator({
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

const AppNav = createBottomTabNavigator({
    HomeStack: MainDrawerNavigator,
    RecentStack,
    BookmarkStack,
    SearchStack,
    SettingsStack,
});

export default createSwitchNavigator(
    {
        AppSetup: AppSetupScreen,
        MainApp: AppNav
    },
    {
        initialRouteName: 'AppSetup',
    }
)
