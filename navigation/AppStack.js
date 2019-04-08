import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createDrawerNavigator } from 'react-navigation';
import { connect } from 'react-redux';

import TabBarIcon from '../components/TabBarIcon';
import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SavedScreen from '../screens/SavedScreen';

import MainDrawerNavigator from './MainDrawerNavigator';

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

// give settings screen access to redux store
const mapStateToProps = store => ({
    domains: store.domains
})

const SettingsStack = createStackNavigator({
    Settings: connect(mapStateToProps)(SettingsScreen),
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

export default createBottomTabNavigator({
    HomeStack: MainDrawerNavigator,
    BookmarkStack,
    LinksStack,
    SettingsStack,
});
