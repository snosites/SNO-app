import React from 'react'
import { Platform } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import TabBarIcon from '../components/TabBarIcon'

import HomeNavigator from './HomeNavigator'
import ListNavigator from './ListNavigator'
import FollowingStack from './FollowingStack'
import SettingsStackContainer from '../containers/navigators/SettingsStackContainer'

import SportcenterStack from '../navigation/SportcenterStack'

const Tab = createBottomTabNavigator()

export default (props) => {
    const { theme, sportCenterEnabled } = props
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName

                    if (route.name === 'ListDrawer') {
                        iconName = 'md-list'
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
                    fontFamily: 'ralewayLight',
                },
            }}
        >
            <Tab.Screen
                name='HomeTab'
                component={HomeNavigator}
                options={{
                    title: 'Home',
                    tabBarIcon: ({ focused, color, size }) => {
                        return (
                            <TabBarIcon
                                focused={focused}
                                color={color}
                                name={Platform.OS === 'ios' ? `ios-home` : 'md-home'}
                                size={size}
                                // badge={'dot'}
                                tabColor={theme.navigationTheme.colors.background}
                            />
                        )
                    },
                }}
            />
            <Tab.Screen name='ListDrawer' component={ListNavigator} options={{ title: 'Topics' }} />
            {sportCenterEnabled && <Tab.Screen name='SportsCenter' component={SportcenterStack} />}
            <Tab.Screen
                name='Following'
                component={FollowingStack}
                options={{
                    tabBarIcon: ({ focused, color, size }) => {
                        return (
                            <TabBarIcon
                                focused={focused}
                                color={color}
                                name='ios-apps'
                                size={size}
                                // badge='dot'
                                tabColor={theme.navigationTheme.colors.background}
                            />
                        )
                    },
                }}
            />
            <Tab.Screen name='Settings' component={SettingsStackContainer} />
        </Tab.Navigator>
    )
}
