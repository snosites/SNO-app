import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import ListScreen from '../screens/ListScreen'
import FullArticleScreen from '../screens/FullArticleScreen'
import SearchScreen from '../screens/SearchScreen'
import ProfileScreen from '../screens/ProfileScreen'
import CommentsScreen from '../screens/CommentsScreen'
import StaffScreen from '../screens/StaffScreen'
import DefaultPageScreen from '../screens/DefaultPageScreen'

import HomeScreen from '../screens/HomeScreen'
import TestScreen from '../screens/TestScreen'

const Stack = createStackNavigator()

const ArticleStack = (props) => {
    const { homeScreenMode, theme } = props
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: theme.colors.primary,
                },
                headerTintColor: theme.primaryIsDark ? '#fff' : '#000',
            }}
        >
            {homeScreenMode === 'categories' ? (
                <Stack.Screen name='HomeScreen' component={TestScreen} />
            ) : null}
            <Stack.Screen name='List' component={TestScreen} />
        </Stack.Navigator>
    )
}

export default ArticleStack
