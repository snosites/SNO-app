import React from 'react';
import {
    Platform,
} from 'react-native';
import { createDrawerNavigator, createStackNavigator } from 'react-navigation';
import Color from 'color';

import TabBarIcon from '../components/TabBarIcon';
import TabBarLabel from '../components/TabBarLabel';
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
    }
);

const MyDrawerNavigator = createDrawerNavigator(
    {
        Home: ArticleStack,
    },
    {
        contentComponent: CustomDrawer
    }
);

MyDrawerNavigator.navigationOptions = ({ screenProps }) => {
    const { theme } = screenProps;
    return ({
        tabBarLabel: ({ focused }) => (
            <TabBarLabel
                focused={focused}
                label='Home'
                color={theme.colors.primary}
            />
        ),
        tabBarIcon: ({ focused }) => (
            <TabBarIcon
                focused={focused}
                color={theme.colors.primary}
                name={
                    Platform.OS === 'ios'
                        ? `ios-home`
                        : 'md-home'
                }
            />
        ),
        tabBarOnPress: ({ navigation }) => {
            navigation.navigate('List', {
                scrollToTop: true
            })
        }
    })
};

export default MyDrawerNavigator;