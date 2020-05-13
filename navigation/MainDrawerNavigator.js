import React from 'react'
import { Platform } from 'react-native'
import { createDrawerNavigator, createStackNavigator } from 'react-navigation'
import Color from 'color'

import TabBarIcon from '../components/TabBarIcon'
import CustomDrawer from './CustomDrawer'

import ListScreen from '../screens/ListScreen'
import FullArticleScreen from '../screens/FullArticleScreen'
import SearchScreen from '../screens/SearchScreen'
import ProfileScreen from '../screens/ProfileScreen'
import CommentsScreen from '../screens/CommentsScreen'
import StaffScreen from '../screens/StaffScreen'
import DefaultPageScreen from '../screens/DefaultPageScreen'

import HomeScreen from '../screens/HomeScreen'

// add custom home screen

//TODO and deep link args

const ArticleStack = createStackNavigator(
    {
        HomeScreen: HomeScreen,
        List: { screen: ListScreen, params: { categoryId: null } },
        FullArticle: {
            screen: FullArticleScreen,
            path: 'article/:articleId',
        },
        Search: SearchScreen,
        Profile: ProfileScreen,
        Comments: CommentsScreen,
        Staff: StaffScreen,
        DefaultPage: DefaultPageScreen,
    },
    {
        defaultNavigationOptions: ({ screenProps }) => {
            let primaryColor = Color(screenProps.theme.colors.primary)
            let isDark = primaryColor.isDark()
            return {
                headerStyle: {
                    backgroundColor: screenProps.theme.colors.primary,
                },
                headerTintColor: isDark ? '#fff' : '#000',
            }
        },
    }
)

const MyDrawerNavigator = createDrawerNavigator(
    {
        Home: {
            screen: ArticleStack,
            path: 'home',
        },
    },
    {
        contentComponent: CustomDrawer,
    }
)

MyDrawerNavigator.navigationOptions = ({ screenProps }) => {
    const { theme, homeScreenMode } = screenProps
    return {
        tabBarLabel: 'Home',
        tabBarIcon: ({ focused }) => (
            <TabBarIcon
                focused={focused}
                color={theme.colors.primary}
                name={Platform.OS === 'ios' ? `ios-home` : 'md-home'}
            />
        ),
        tabBarOnPress: ({ navigation }) => {
            if (homeScreenMode === 'legacy') {
                navigation.navigate('List', { scrollToTop: true })
                return
            }
            navigation.navigate('HomeScreen', {
                scrollToTop: true,
            })
        },
    }
}

export default MyDrawerNavigator
