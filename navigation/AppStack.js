import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createSwitchNavigator } from 'react-navigation';
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



const RecentStack = createStackNavigator({
    Recent: RecentScreen,
    FullArticle: FullArticleScreen,
    Profile: ProfileScreen,
    Comments: CommentsScreen,
    Staff: StaffScreen
});

RecentStack.navigationOptions = ({ screenProps }) => {
    const { theme } = screenProps;
    return ({
        tabBarLabel: ({ focused }) => (
            <TabBarLabel
                focused={focused}
                label='Recent'
                color={theme.colors.primary}
            />
        ),
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
});

BookmarkStack.navigationOptions = ({ screenProps }) => {
    const { theme } = screenProps;
    return ({
        tabBarLabel: ({ focused }) => (
            <TabBarLabel
                focused={focused}
                label='Saved'
                color={theme.colors.primary}
            />
        ),
        tabBarIcon: ({ focused }) => (
            <TabBarIcon
                focused={focused}
                color={theme.colors.primary}
                name={Platform.OS === 'ios' ? 'ios-bookmark' : 'md-bookmark'}
            />
        ),
        tabBarOnPress: ({ navigation }) => {
            console.log('pressed tab button home')
            navigation.navigate('Saved', {
                scrollToTop: true
            })
        }
    })
};

const SettingsStack = createStackNavigator({
    Settings: SettingsScreen,
});

SettingsStack.navigationOptions = ({ screenProps }) => {
    const { theme } = screenProps;
    return ({
        tabBarLabel: ({ focused }) => (
            <TabBarLabel
                focused={focused}
                label='Settings'
                color={theme.colors.primary}
            />
        ),
        tabBarIcon: ({ focused }) => (
            <TabBarIcon
                focused={focused}
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
);

export default createSwitchNavigator(
    {
        AppSetup: AppSetupScreen,
        MainApp: AppNav
    },
    {
        initialRouteName: 'AppSetup',
    }
)
