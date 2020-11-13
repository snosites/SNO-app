import React from 'react'
import { Platform } from 'react-native'
// import { createBottomTabNavigator, createSwitchNavigator } from 'react-navigation'
// import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

// import Color from 'color'

// import ConnectedBottomTabBar from '../components/ConnectedBottomTabBar'
import TabBarIcon from '../components/TabBarIcon'

// import AppSetupScreen from '../screens/AppSetupScreen'
import DrawerNavigatorContainer from '../containers/DrawerNavigatorContainer'
import SavedStack from '../navigation/SavedStack'
import RecentStack from '../navigation/RecentStack'
import SettingsStackContainer from '../containers/SettingsStackContainer'
// import SettingsScreen from '../screens/SettingsScreen'
// import SavedScreen from '../screens/SavedScreen'
// import RecentScreen from '../screens/RecentScreen'
// import SportcenterScreen from '../screens/SportcenterScreen'

// import FullArticleScreen from '../screens/FullArticleScreen'
// import ProfileScreen from '../screens/ProfileScreen'
// import CommentsScreen from '../screens/CommentsScreen'
// import StaffScreen from '../screens/StaffScreen'
// import ErrorScreen from '../screens/ErrorScreen'

import TestScreen from '../screens/TestScreen'

// const RecentStack = createStackNavigator(
//     {
//         Recent: RecentScreen,
//         FullArticle: FullArticleScreen,
//         Profile: ProfileScreen,
//         Comments: CommentsScreen,
//         Staff: StaffScreen,
//     },
//     {
//         defaultNavigationOptions: ({ screenProps }) => {
//             let primaryColor = Color(screenProps.theme.colors.primary)
//             let isDark = primaryColor.isDark()
//             return {
//                 headerStyle: {
//                     backgroundColor: screenProps.theme.colors.primary,
//                 },
//                 headerTintColor: isDark ? '#fff' : '#000',
//             }
//         },
//     }
// )

// RecentStack.navigationOptions = ({ screenProps }) => {
//     const { theme } = screenProps
//     return {
//         tabBarLabel: 'Recent',
//         tabBarIcon: ({ focused }) => (
//             <TabBarIcon focused={focused} color={theme.colors.primary} name={'md-funnel'} />
//         ),
//         tabBarOnPress: ({ navigation }) => {
//             navigation.navigate('Recent', {
//                 scrollToTop: true,
//             })
//         },
//     }
// }

// const BookmarkStack = createStackNavigator(
//     {
//         Saved: SavedScreen,
//         FullArticle: FullArticleScreen,
//         Profile: ProfileScreen,
//         Comments: CommentsScreen,
//         Staff: StaffScreen,
//     },
//     {
//         defaultNavigationOptions: ({ screenProps }) => {
//             let primaryColor = Color(screenProps.theme.colors.primary)
//             let isDark = primaryColor.isDark()
//             return {
//                 headerStyle: {
//                     backgroundColor: screenProps.theme.colors.primary,
//                 },
//                 headerTintColor: isDark ? '#fff' : '#000',
//             }
//         },
//     }
// )

// BookmarkStack.navigationOptions = ({ screenProps }) => {
//     const { theme } = screenProps
//     return {
//         tabBarLabel: 'Saved',
//         tabBarIcon: ({ focused }) => (
//             <TabBarIcon
//                 focused={focused}
//                 color={theme.colors.primary}
//                 name={Platform.OS === 'ios' ? 'ios-bookmark' : 'md-bookmark'}
//             />
//         ),
//         tabBarOnPress: ({ navigation }) => {
//             navigation.navigate('Saved', {
//                 scrollToTop: true,
//             })
//         },
//     }
// }

// const SportcenterStack = createStackNavigator(
//     {
//         Sportcenter: SportcenterScreen,
//     },
//     {
//         defaultNavigationOptions: ({ screenProps }) => {
//             let primaryColor = Color(screenProps.theme.colors.primary)
//             let isDark = primaryColor.isDark()
//             return {
//                 headerStyle: {
//                     backgroundColor: screenProps.theme.colors.primary,
//                 },
//                 headerTintColor: isDark ? '#fff' : '#000',
//             }
//         },
//     }
// )

// SportcenterStack.navigationOptions = ({ screenProps }) => {
//     const { theme } = screenProps
//     return {
//         tabBarLabel: 'Sports Center',
//         tabBarIcon: ({ focused }) => (
//             <TabBarIcon
//                 focused={focused}
//                 color={theme.colors.primary}
//                 name={Platform.OS === 'ios' ? 'ios-basketball' : 'md-basketball'}
//             />
//         ),
//         tabBarOnPress: ({ navigation }) => {
//             navigation.navigate('SportcenterStack', {
//                 scrollToTop: true,
//             })
//         },
//     }
// }

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
            <Tab.Screen name='Home' component={DrawerNavigatorContainer} />
            <Tab.Screen name='Recent' component={RecentStack} />
            <Tab.Screen name='Saved' component={SavedStack} />
            {sportCenterEnabled && <Tab.Screen name='SportsCenter' component={TestScreen} />}
            <Tab.Screen name='Settings' component={SettingsStackContainer} />
        </Tab.Navigator>
    )
}
