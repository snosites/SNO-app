import React, { createContext } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { connect } from 'react-redux'

import ArticleScreenContainer from '../containers/ArticleScreenContainer'
import ArticleActionsContainer from '../containers/ArticleActionsScreenContainer'
import TestScreen from '../screens/TestScreen'

import ArticleActionsScreen from '../screens/ArticleActionsScreen'

const Tab = createMaterialTopTabNavigator()
const Stack = createStackNavigator()

export const ArticleIdContext = createContext(null)

const ArticleTabs = ({ route, navigation, enableComments }) => {
    if (enableComments) {
        return (
            <Tab.Navigator
                initialRouteName='Article'
                backBehavior='order'
                tabBarOptions={{ indicatorStyle: { backgroundColor: theme.colors.primary } }}
            >
                <Tab.Screen name='Article' component={ArticleScreenContainer} />
                <Tab.Screen name='Comments' component={TestScreen} />
            </Tab.Navigator>
        )
    }
    return <ArticleScreenContainer route={route} navigation={navigation} />
}

const mapStateToProps = (state) => ({
    theme: state.theme,
    enableComments: state.global.enableComments,
})

const ConnectedArticleTabs = connect(mapStateToProps)(ArticleTabs)

const ArticleNavigator = ({ route }) => {
    // const comments = route && route.params && route.params.comments ? route.params.comments : []
    const articleId = route.params && route.params.articleId ? route.params.articleId : null

    return (
        <ArticleIdContext.Provider value={articleId}>
            <Stack.Navigator
                mode={'modal'}
                screenOptions={{
                    headerShown: false,
                    cardStyle: { backgroundColor: 'transparent' },
                    cardOverlayEnabled: true,
                    cardStyleInterpolator: ({ current: { progress } }) => ({
                        cardStyle: {
                            opacity: progress.interpolate({
                                inputRange: [0, 0.5, 0.9, 1],
                                outputRange: [0, 0.25, 0.7, 1],
                            }),
                        },
                        overlayStyle: {
                            opacity: progress.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, 0.5],
                                extrapolate: 'clamp',
                            }),
                        },
                    }),
                }}
                initialRouteName='ArticleTabs'
            >
                <Stack.Screen
                    name='ArticleTabs'
                    component={ConnectedArticleTabs}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name='ArticleActions'
                    component={ArticleActionsContainer}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </ArticleIdContext.Provider>
    )
}

export default connect(mapStateToProps)(ArticleNavigator)
