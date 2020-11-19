import React from 'react'
import { Image, TouchableOpacity } from 'react-native'

import { connect } from 'react-redux'

import { createStackNavigator } from '@react-navigation/stack'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'

import Searchbar from '../components/SearchBar'

import HomeScreenContainer from '../containers/HomeScreenContainer'
import RecentScreenContainer from '../containers/RecentScreenContainer'
import SavedScreenContainer from '../containers/SavedScreenContainer'

const Tab = createMaterialTopTabNavigator()
const Stack = createStackNavigator()

const TabHomeNavigator = ({ theme }) => {
    return (
        <Tab.Navigator
            initialRouteName='Home'
            backBehavior='order'
            style={{ backgroundColor: theme.navigationTheme.colors.background }}
            tabBarOptions={{
                indicatorStyle: { backgroundColor: theme.colors.primary },
            }}
        >
            <Tab.Screen name='Home' component={HomeScreenContainer} />
            <Tab.Screen name='Recent' component={RecentScreenContainer} />
            <Tab.Screen name='Saved' component={SavedScreenContainer} />
        </Tab.Navigator>
    )
}

const mapStateToProps = (state) => ({
    theme: state.theme,
    headerLogo: state.global.headerSmall,
})

const ConnectedTabHomeNavigator = connect(mapStateToProps)(TabHomeNavigator)

const HomeStack = (props) => {
    const { theme, headerLogo } = props

    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: theme.colors.primary,
                },
                headerTintColor: theme.primaryIsDark ? '#fff' : '#000',
                headerLeft: () => {
                    if (headerLogo) {
                        return (
                            <Image
                                source={{ uri: headerLogo }}
                                style={{ width: 60, height: 35, borderRadius: 7, marginLeft: 10 }}
                                resizeMode='contain'
                            />
                        )
                    }
                    return null
                },
                headerTitle: () => <Searchbar placeholder='Search Stories' />,
                headerTitleAlign: 'center',
            }}
        >
            <Stack.Screen
                name='HomeTabs'
                component={ConnectedTabHomeNavigator}
                // options={{ title: 'Recent Stories' }}
            />
            {/* <Stack.Screen
                name='HomeTabs'
                component={ConnectedTabHomeNavigator}
                // options={{ title: 'Recent Stories' }}
            /> */}
        </Stack.Navigator>
    )
}

export default connect(mapStateToProps)(HomeStack)
