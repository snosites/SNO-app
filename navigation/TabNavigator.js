import React from 'react'
import { Platform } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import TabBarIcon from '../components/TabBarIcon'

import HomeNavigator from './HomeNavigator'
import ListNavigator from './ListNavigator'
import SavedStack from '../navigation/SavedStack'
import RecentStack from '../navigation/RecentStack'
import FollowingStack from './FollowingStack'
import SettingsStackContainer from '../containers/SettingsStackContainer'
import SportcenterStack from '../navigation/SportcenterStack'

const Tab = createBottomTabNavigator()

export default (props) => {
    const { theme, sportCenterEnabled } = props
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName

                    if (route.name === 'HomeTab') {
                        iconName = Platform.OS === 'ios' ? `ios-home` : 'md-home'
                    } else if (route.name === 'ListDrawer') {
                        iconName = 'md-list'
                    } else if (route.name === 'Saved') {
                        iconName = Platform.OS === 'ios' ? 'ios-bookmark' : 'md-bookmark'
                    } else if (route.name === 'SportsCenter') {
                        iconName = Platform.OS === 'ios' ? 'ios-basketball' : 'md-basketball'
                    } else if (route.name === 'Following') {
                        iconName = 'ios-apps'
                    } else if (route.name === 'Settings') {
                        iconName = Platform.OS === 'ios' ? 'ios-settings' : 'md-settings'
                    }
                    return (
                        <TabBarIcon focused={focused} color={color} name={iconName} size={size} />
                    )
                },
            })}
            tabBarOptions={{
                activeTintColor: theme.colors.primary,
                labelStyle: {
                    fontFamily: 'openSansLight',
                },
            }}
        >
            <Tab.Screen name='HomeTab' component={HomeNavigator} options={{ title: 'Home' }} />
            <Tab.Screen name='ListDrawer' component={ListNavigator} options={{ title: 'List' }} />
            {/* <Tab.Screen name='Saved' component={SavedStack} /> */}
            {sportCenterEnabled && <Tab.Screen name='SportsCenter' component={SportcenterStack} />}
            <Tab.Screen name='Following' component={FollowingStack} />
            <Tab.Screen name='Settings' component={SettingsStackContainer} />
        </Tab.Navigator>
    )
}
