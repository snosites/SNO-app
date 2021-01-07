import React from 'react'
import { Image } from 'react-native'

import { connect } from 'react-redux'

import { createStackNavigator } from '@react-navigation/stack'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'

import Searchbar from '../components/SearchBar'

import HomeScreenContainer from '../containers/screens/HomeScreenContainer'
import RecentScreenContainer from '../containers/screens/RecentScreenContainer'
import SavedScreenContainer from '../containers/screens/SavedScreenContainer'

import SearchScreenContainer from '../containers/screens/SearchScreenContainer'

const Tab = createMaterialTopTabNavigator()
const Stack = createStackNavigator()

const TabHomeNavigator = ({ theme, homeScreenMode }) => {
    return (
        <Tab.Navigator
            initialRouteName={homeScreenMode === 'home' ? 'Home' : 'Recent'}
            backBehavior='order'
            style={{
                backgroundColor: theme.navigationTheme.colors.surface,
            }}
            tabBarOptions={{
                indicatorStyle: { backgroundColor: theme.colors.primary },
            }}
        >
            <Tab.Screen name='Saved' component={SavedScreenContainer} />
            <Tab.Screen name='Home' component={HomeScreenContainer} />
            <Tab.Screen name='Recent' component={RecentScreenContainer} />
        </Tab.Navigator>
    )
}

const mapStateToProps = (state) => ({
    theme: state.theme,
    homeScreenMode: state.global.homeScreenMode,
    headerLogo: state.global.headerSmall,
})

const ConnectedTabHomeNavigator = connect(mapStateToProps)(TabHomeNavigator)

const HomeStack = (props) => {
    const { theme, headerLogo } = props

    return (
        <Stack.Navigator
            screenOptions={({ navigation }) => ({
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
                headerTitle: () => (
                    <Searchbar navigation={navigation} placeholder='Search Stories' />
                ),
                headerTitleAlign: 'center',
            })}
        >
            <Stack.Screen
                name='HomeTabs'
                component={ConnectedTabHomeNavigator}
                // options={{ title: 'Recent Stories' }}
            />
            <Stack.Screen
                name='Search'
                component={SearchScreenContainer}
                // options={{ title: 'Recent Stories' }}
            />
        </Stack.Navigator>
    )
}

export default connect(mapStateToProps)(HomeStack)
