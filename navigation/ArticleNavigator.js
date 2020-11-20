import React, { createContext, useEffect, useState } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { connect } from 'react-redux'

import ArticleScreenContainer from '../containers/screens/ArticleScreenContainer'
import CommentsScreenContainer from '../containers/screens/CommentsScreenContainer'
import ArticleActionsContainer from '../containers/screens/ArticleActionsScreenContainer'
import ProfileModalContainer from '../containers/screens/ProfileModalScreenContainer'

const Tab = createMaterialTopTabNavigator()
const Stack = createStackNavigator()

export const ArticleIdContext = createContext(null)

const ArticleTabs = ({ route, navigation, enableComments, theme }) => {
    if (enableComments) {
        return (
            <Tab.Navigator
                initialRouteName='Article'
                backBehavior='order'
                style={{
                    backgroundColor: theme.navigationTheme.colors.background,
                }}
                tabBarOptions={{
                    indicatorStyle: { backgroundColor: theme.colors.accent, height: 3 },
                }}
            >
                <Tab.Screen name='Article' component={ArticleScreenContainer} />
                <Tab.Screen name='Comments' component={CommentsScreenContainer} />
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

const ArticleNavigator = ({ articles, route }) => {
    const articleId = route.params?.articleId

    const [article, setArticle] = useState({})

    useEffect(() => {
        if (articleId) {
            if (articles && articles[articleId]) setArticle(articles[articleId])
        }
    }, [articleId])

    return (
        <ArticleIdContext.Provider value={article}>
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
                <Stack.Screen
                    name='ProfileModal'
                    component={ProfileModalContainer}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </ArticleIdContext.Provider>
    )
}

const mapStateToNavProps = (state) => ({
    articles: state.entities.articles,
})

export default connect(mapStateToNavProps)(ArticleNavigator)
