import React, { createContext, useEffect, useState } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'

import { connect } from 'react-redux'
import { actions as articleActions } from '../redux/articles'

import ArticleScreenContainer from '../containers/screens/ArticleScreenContainer'
import CommentsScreenContainer from '../containers/screens/CommentsScreenContainer'
import ArticleActionsContainer from '../containers/screens/ArticleActionsScreenContainer'
import ProfileModalContainer from '../containers/screens/ProfileModalScreenContainer'

import { asyncFetchArticle } from '../utils/sagaHelpers'
import { getActiveDomain } from '../redux/domains'

const Tab = createMaterialTopTabNavigator()
const Stack = createStackNavigator()

export const ArticleContext = createContext(null)

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

const ArticleNavigator = ({
    navigation,
    route,
    activeDomain,
    articles,
    asyncFetchArticleError,
}) => {
    const articleId = route.params?.articleId

    const [article, setArticle] = useState({})

    useEffect(() => {
        if (articleId) {
            if (articles && articles[articleId]) setArticle(articles[articleId])
            else _asyncFetchArticle(articleId)
        }
    }, [articleId])

    const _asyncFetchArticle = async (articleId) => {
        setArticle({})
        try {
            const article = await asyncFetchArticle(activeDomain.url, articleId)
            setArticle(article)
        } catch (e) {
            asyncFetchArticleError()
            navigation.pop()
        }
    }

    return (
        <ArticleContext.Provider value={article}>
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
        </ArticleContext.Provider>
    )
}

const mapStateToNavProps = (state) => ({
    articles: state.entities.articles,
    activeDomain: getActiveDomain(state),
})

const mapDispatchToProps = (dispatch) => ({
    asyncFetchArticleError: () => dispatch(articleActions.asyncFetchArticleError()),
})

export default connect(mapStateToNavProps, mapDispatchToProps)(ArticleNavigator)
