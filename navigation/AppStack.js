import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createSwitchNavigator } from 'react-navigation';
import ConnectedBottomTabBar from '../components/ConnectedBottomTabBar';

import Color from 'color';

import TabBarIcon from '../components/TabBarIcon';
import TabBarLabel from '../components/TabBarLabel';

import AppSetupScreen from '../screens/AppSetupScreen';
import MainDrawerNavigator from './MainDrawerNavigator';
import SettingsScreen from '../screens/SettingsScreen';
import SavedScreen from '../screens/SavedScreen';
import RecentScreen from '../screens/RecentScreen';

import FullArticleScreen from '../screens/FullArticleScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CommentsScreen from '../screens/CommentsScreen';
import StaffScreen from '../screens/StaffScreen';
import ErrorScreen from '../screens/ErrorScreen';


const RecentStack = createStackNavigator({
    Recent: RecentScreen,
    FullArticle: FullArticleScreen,
    Profile: ProfileScreen,
    Comments: CommentsScreen,
    Staff: StaffScreen
},
{
    defaultNavigationOptions: ({ screenProps }) => {
        let primaryColor = Color(screenProps.theme.colors.primary);
        let isDark = primaryColor.isDark();
        return {
            headerStyle: {
                backgroundColor: screenProps.theme.colors.primary,
            },
            headerTintColor: isDark ? '#fff' : '#000',
        }
    }
});

RecentStack.navigationOptions = ({ screenProps }) => {
    const { theme } = screenProps;
    return ({
        tabBarLabel: 'Recent',
        tabBarIcon: ({ focused }) => (
            <TabBarIcon
                focused={focused}
                color={theme.colors.primary}
                name={'md-funnel'}
            />
        ),
        tabBarOnPress: ({ navigation }) => {
            console.log('pressed tab button home')
            navigation.navigate('Recent', {
                scrollToTop: true
            })
        }
    })
};

const BookmarkStack = createStackNavigator({
    Saved: SavedScreen,
    FullArticle: FullArticleScreen,
    Profile: ProfileScreen,
    Comments: CommentsScreen,
    Staff: StaffScreen
},
{
    defaultNavigationOptions: ({ screenProps }) => {
        let primaryColor = Color(screenProps.theme.colors.primary);
        let isDark = primaryColor.isDark();
        return {
            headerStyle: {
                backgroundColor: screenProps.theme.colors.primary,
            },
            headerTintColor: isDark ? '#fff' : '#000',
        }
    }
});

BookmarkStack.navigationOptions = ({ screenProps }) => {
    const { theme } = screenProps;
    return ({
        tabBarLabel: 'Saved',
        tabBarIcon: ({ focused }) => (
            <TabBarIcon
                focused={focused}
                color={theme.colors.primary}
                name={Platform.OS === 'ios' ? 'ios-bookmark' : 'md-bookmark'}
            />
        ),
        tabBarOnPress: ({ navigation }) => {
            navigation.navigate('Saved', {
                scrollToTop: true
            })
        }
    })
};

const SettingsStack = createStackNavigator({
    Settings: SettingsScreen,
},
{
    defaultNavigationOptions: ({ screenProps }) => {
        let primaryColor = Color(screenProps.theme.colors.primary);
        let isDark = primaryColor.isDark();
        return {
            headerStyle: {
                backgroundColor: screenProps.theme.colors.primary,
            },
            headerTintColor: isDark ? '#fff' : '#000',
        }
    }
});

SettingsStack.navigationOptions = ({ screenProps }) => {
    const { theme } = screenProps;
    return ({
        tabBarLabel: 'Settings',
        tabBarIcon: ({ focused, horizontal }) => (
            <TabBarIcon
                focused={focused}
                horizontal={horizontal}
                color={theme.colors.primary}
                name={Platform.OS === 'ios' ? 'ios-settings' : 'md-settings'}
            />
        ),
    })
};



const AppNav = createBottomTabNavigator({
    HomeStack: MainDrawerNavigator,
    RecentStack,
    BookmarkStack,
    SettingsStack,
},
{
    tabBarComponent: props => <ConnectedBottomTabBar {...props} />,
} 
);

export default createSwitchNavigator(
    {
        AppSetup: AppSetupScreen,
        MainApp: AppNav,
        Error: ErrorScreen
    },
    {
        initialRouteName: 'AppSetup',
    }
)
