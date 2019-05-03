import React from 'react';
import {
    Platform,
    Button,
    ScrollView,
    StyleSheet,
    Text,
    View,
    AsyncStorage,
    StatusBar,
    ActivityIndicator
} from 'react-native';
import { createDrawerNavigator, createStackNavigator, DrawerItems, SafeAreaView, createSwitchNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import CustomDrawer from './CustomDrawer';

import ListScreen from '../screens/ListScreen';
import FullArticleScreen from '../screens/FullArticleScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CommentsScreen from '../screens/CommentsScreen';
import StaffScreen from '../screens/StaffScreen';

const ArticleStack = createStackNavigator({
    List: ListScreen,
    FullArticle: FullArticleScreen,
    Profile: ProfileScreen,
    Comments: CommentsScreen,
    Staff: StaffScreen
},);

const MyDrawerNavigator = createDrawerNavigator(
    {
        Home: ArticleStack,
    },
    {
        contentComponent: CustomDrawer
    }
);

MyDrawerNavigator.navigationOptions = {
    tabBarLabel: 'Home',
    tabBarIcon: ({ focused }) => (
        <TabBarIcon
            focused={focused}
            name={
                Platform.OS === 'ios'
                    ? `ios-home`
                    : 'md-home'
            }
        />
    ),
};

export default MyDrawerNavigator;