import React from 'react'
import { Platform } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import TabBarIcon from '../components/TabBarIcon'

import DrawerNavigatorContainer from '../containers/DrawerNavigatorContainer'
import HomeStack from './HomeNavigator'
import SavedStack from '../navigation/SavedStack'
import RecentStack from '../navigation/RecentStack'
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

                    if (route.name === 'Home') {
                        iconName = Platform.OS === 'ios' ? `ios-home` : 'md-home'
                    } else if (route.name === 'Recent') {
                        iconName = 'md-funnel'
                    } else if (route.name === 'Saved') {
                        iconName = Platform.OS === 'ios' ? 'ios-bookmark' : 'md-bookmark'
                    } else if (route.name === 'SportsCenter') {
                        iconName = Platform.OS === 'ios' ? 'ios-basketball' : 'md-basketball'
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
            <Tab.Screen name='Home' component={HomeStack} />
            <Tab.Screen name='Recent' component={RecentStack} />
            <Tab.Screen name='Saved' component={SavedStack} />
            {sportCenterEnabled && <Tab.Screen name='SportsCenter' component={SportcenterStack} />}
            <Tab.Screen name='Settings' component={SettingsStackContainer} />
        </Tab.Navigator>
    )
}
