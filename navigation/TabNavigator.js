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
    const { theme, sportCenterEnabled, user } = props
    console.log('user', user)
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
                        <TabBarIcon
                            color={color}
                            name={iconName}
                            size={size}
                            tabColor={theme.navigationTheme.colors.background}
                        />
                    )
                },
            })}
            tabBarOptions={{
                activeTintColor: theme.colors.primary,
                inactiveTintColor: theme.colors.defaultTabIcon,
                labelStyle: {
                    fontFamily: 'raleway',
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
            <Tab.Screen
                name='ListDrawer'
                component={ListNavigator}
                options={{
                    title: 'Sections',
                    tabBarIcon: ({ focused, color, size }) => {
                        return (
                            <TabBarIcon
                                color={color}
                                name={Platform.OS === 'ios' ? `md-list` : 'md-list'}
                                size={size}
                                // badge={'dot'}
                                tabColor={theme.navigationTheme.colors.background}
                            />
                        )
                    },
                }}
            />
            {sportCenterEnabled && <Tab.Screen name='SportsCenter' component={SportcenterStack} />}
            <Tab.Screen
                name='Following'
                component={FollowingStack}
                options={{
                    tabBarIcon: ({ focused, color, size }) => {
                        return (
                            <TabBarIcon
                                color={color}
                                name='ios-apps'
                                size={size}
                                badge={user.unread_ids?.length ? 'dot' : null}
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
