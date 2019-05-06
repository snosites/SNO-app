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
import { createDrawerNavigator, createStackNavigator, DrawerItems, SafeAreaView, createSwitchNavigator, NavigationActions } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import CustomDrawer from './CustomDrawer';

import ListScreen from '../screens/ListScreen';
import FullArticleScreen from '../screens/FullArticleScreen';
import SearchScreen from '../screens/SearchScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CommentsScreen from '../screens/CommentsScreen';
import StaffScreen from '../screens/StaffScreen';

const ArticleStack = createStackNavigator({
    List: ListScreen,
    FullArticle: FullArticleScreen,
    Search: SearchScreen,
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
    tabBarOnPress: ({navigation}) => {
        console.log('pressed tab button home')
        navigation.navigate('List', {
            scrollToTop: true
        })
    }
};

export default MyDrawerNavigator;