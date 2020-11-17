import React, { useEffect } from 'react'
import { TouchableOpacity, Image, Text } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { HeaderBackButton } from '@react-navigation/stack'
import * as Icon from '@expo/vector-icons'

import HomeScreenContainer from '../containers/HomeScreenContainer'
import ListScreenContainer from '../containers/ListScreenContainer'
import ArticleNavigator from './ArticleNavigator'
import StaffScreenContainer from '../containers/StaffScreenContainer'
import ProfileScreenContainer from '../containers/ProfileScreenContainer'

import SearchScreen from '../screens/SearchScreen'

import DefaultPageScreen from '../screens/DefaultPageScreen'

import HTML from 'react-native-render-html'

const Stack = createStackNavigator()

const ArticleStack = (props) => {
    const { homeScreenMode, theme, activeCategory, headerLogo, navigation, route } = props

    useEffect(() => {
        const unsubscribe = navigation.dangerouslyGetParent().addListener('tabPress', (e) => {
            if (navigation.dangerouslyGetParent().isFocused()) {
                navigation.popToTop()
            }
        })

        return unsubscribe
    }, [navigation])

    const CustomHeaderTitle = ({ children }) => {
        return (
            <HTML
                html={children}
                customWrapper={(text) => {
                    return (
                        <Text
                            ellipsizeMode='tail'
                            numberOfLines={1}
                            style={{ fontSize: 20, color: theme.primaryIsDark ? '#fff' : '#000' }}
                        >
                            {text}
                        </Text>
                    )
                }}
                baseFontStyle={{ fontSize: 20 }}
            />
        )
    }
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: theme.colors.primary,
                },
                headerTintColor: theme.primaryIsDark ? '#fff' : '#000',
                headerRight: (props) => {
                    return (
                        <TouchableOpacity
                            onPress={() => navigation.openDrawer()}
                            style={{ flex: 1, paddingHorizontal: 15 }}
                        >
                            <Icon.Ionicons
                                style={{
                                    justifyContent: 'center',
                                    alignItems: 'stretch',
                                }}
                                name={'ios-menu'}
                                size={35}
                                // style={{ marginBottom: -3 }}
                                color={theme.primaryIsDark ? '#fff' : '#000'}
                            />
                        </TouchableOpacity>
                    )
                },
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
                headerBackTitleVisible: false,
                headerTitleAlign: 'center',
            }}
        >
            {homeScreenMode === 'categories' ? (
                <Stack.Screen
                    name='Home'
                    component={HomeScreenContainer}
                    options={{ title: 'Home', headerTitle: CustomHeaderTitle }}
                />
            ) : null}
            <Stack.Screen
                name='List'
                component={ListScreenContainer}
                options={{ title: activeCategory, headerTitle: CustomHeaderTitle }}
            />
            <Stack.Screen
                name='ArticleNavigator'
                component={ArticleNavigator}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen name='Staff' component={StaffScreenContainer} />
            <Stack.Screen
                name='Profile'
                component={ProfileScreenContainer}
                options={{
                    headerLeft: (props) => <HeaderBackButton {...props} />,
                }}
            />
        </Stack.Navigator>
    )
}

export default ArticleStack
