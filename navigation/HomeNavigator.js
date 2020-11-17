import React, { useEffect } from 'react'
import { TouchableOpacity, Image, Text } from 'react-native'

import { connect } from 'react-redux'

import { createStackNavigator } from '@react-navigation/stack'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'

import Searchbar from '../components/SearchBar'
import { HeaderBackButton } from '@react-navigation/stack'
import * as Icon from '@expo/vector-icons'

import HomeScreenContainer from '../containers/HomeScreenContainer'
import RecentScreenContainer from '../containers/RecentScreenContainer'
import ListScreenContainer from '../containers/ListScreenContainer'
import ArticleNavigator from './ArticleNavigator'
import StaffScreenContainer from '../containers/StaffScreenContainer'
import ProfileScreenContainer from '../containers/ProfileScreenContainer'

import SearchScreen from '../screens/SearchScreen'

import DefaultPageScreen from '../screens/DefaultPageScreen'

import HTML from 'react-native-render-html'

const Tab = createMaterialTopTabNavigator()

const HomeNavigator = (props) => {
    const { theme, headerLogo } = props

    return (
        <Tab.Navigator
            initialRouteName='Home'
            backBehavior='order'
            tabBarOptions={{ indicatorStyle: { backgroundColor: theme.colors.primary } }}
        >
            <Tab.Screen name='Home' component={HomeScreenContainer} />
            <Tab.Screen name='Recent' component={RecentScreenContainer} />
        </Tab.Navigator>
    )
}

const mapStateToProps = (state) => ({
    theme: state.theme,
    headerLogo: state.global.headerSmall,
})

export default connect(mapStateToProps)(HomeNavigator)
