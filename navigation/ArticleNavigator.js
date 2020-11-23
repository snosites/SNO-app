import React, { createContext, useEffect, useState } from 'react'
import { Animated, View, TouchableOpacity } from 'react-native'
import {
    createStackNavigator,
    CardStyleInterpolators,
    TransitionSpecs,
    TransitionPresets,
} from '@react-navigation/stack'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'

import { StatusBar } from 'expo-status-bar'

import { connect } from 'react-redux'
import { actions as articleActions } from '../redux/articles'

import ArticleScreenContainer from '../containers/screens/ArticleScreenContainer'
import CommentsScreenContainer from '../containers/screens/CommentsScreenContainer'
import ArticleActionsContainer from '../containers/screens/ArticleActionsScreenContainer'
import ProfileModalContainer from '../containers/screens/ProfileModalScreenContainer'

import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons'

import { asyncFetchArticle } from '../utils/sagaHelpers'
import { getActiveDomain } from '../redux/domains'

const { add, multiply } = Animated

const Tab = createMaterialTopTabNavigator()
const Stack = createStackNavigator()

export const ArticleContext = createContext(null)
export const ArticleHeaderContext = createContext(() => {})

const ArticleTabs = ({ route, navigation, enableComments, theme }) => {
    if (enableComments) {
        return (
            <Tab.Navigator
                initialRouteName='Article'
                backBehavior='order'
                style={
                    {
                        // backgroundColor: theme.colors.surface,
                    }
                }
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
    theme,
    activeDomain,
    asyncFetchArticleError,
    cachedArticle,
    articleSaved,
}) => {
    const articleId = route.params?.articleId

    const [article, setArticle] = useState({})

    useEffect(() => {
        if (articleId) {
            if (cachedArticle) setArticle(cachedArticle)
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
            <StatusBar style={theme.dark ? 'light' : 'dark'} />
            <Stack.Navigator
                mode={'modal'}
                screenOptions={{
                    headerShown: false,
                    headerBackTitleVisible: false,
                    cardStyle: { backgroundColor: 'transparent' },
                    cardOverlayEnabled: true,
                    headerTitleAlign: true,
                    // cardStyleInterpolator: ({ current: { progress } }) => ({
                    //     cardStyle: {
                    //         opacity: progress.interpolate({
                    //             inputRange: [0, 0.5, 0.9, 1],
                    //             outputRange: [0, 0.25, 0.7, 1],
                    //         }),
                    //     },
                    //     overlayStyle: {
                    //         opacity: progress.interpolate({
                    //             inputRange: [0, 1],
                    //             outputRange: [0, 0.5],
                    //             extrapolate: 'clamp',
                    //         }),
                    //     },
                    // }),
                }}
                initialRouteName='ArticleTabs'
            >
                <Stack.Screen
                    name='ArticleTabs'
                    component={ConnectedArticleTabs}
                    options={({ route, navigation }) => ({
                        headerShown: true,
                        title: null,
                        headerRight: () => {
                            return (
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <TouchableOpacity
                                        onPress={() => {}}
                                        style={{
                                            justifyContent: 'center',
                                            alignItems: 'stretch',
                                            padding: 10,
                                        }}
                                    >
                                        <AntDesign
                                            name={'like2'}
                                            size={25}
                                            style={{ marginBottom: -3 }}
                                            color={theme.colors.accent}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => {
                                            navigation.push('ArticleActions')
                                        }}
                                        style={{
                                            justifyContent: 'center',
                                            alignItems: 'stretch',
                                            padding: 10,
                                        }}
                                    >
                                        <MaterialCommunityIcons
                                            name={'dots-horizontal'}
                                            backgroundColor={'transparant'}
                                            size={25}
                                            style={{ marginBottom: -3 }}
                                            color={theme.colors.accent}
                                        />
                                    </TouchableOpacity>
                                </View>
                            )
                        },
                        headerBackTitleVisible: false,
                    })}
                />
                <Stack.Screen
                    name='ArticleActions'
                    component={ArticleActionsContainer}
                    options={{
                        cardOverlayEnabled: true,
                        cardStyleInterpolator: ({
                            current: { progress },
                            inverted,
                            layouts: { screen },
                        }) => {
                            const translateY = multiply(
                                progress.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [screen.height, 0],
                                    extrapolate: 'clamp',
                                }),
                                inverted
                            )
                            return {
                                cardStyle: {
                                    transform: [
                                        // Translation for the animation of the current card
                                        { translateY },
                                    ],
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
                            }
                        },
                    }}
                />
            </Stack.Navigator>
        </ArticleContext.Provider>
    )
}

const mapStateToNavProps = (state, ownProps) => {
    const articleId = ownProps.route?.params?.articleId
    const activeDomain = getActiveDomain(state)

    const savedArticlesForSchool = state.savedArticlesBySchool[activeDomain.id]
    let savedArticle = false

    let article = {}
    if (articleId) {
        article = state.entities.articles[articleId]
    }
    if (article && article.id && savedArticlesForSchool) {
        const saved = savedArticlesForSchool.find((savedArticle) => savedArticle.id == article.id)
        if (saved) {
            article.saved = true
            savedArticle = true
        }
    }
    return {
        activeDomain,
        theme: state.theme,
        cachedArticle: article,
        articleSaved: savedArticle,
    }
}

const mapDispatchToProps = (dispatch) => ({
    asyncFetchArticleError: () => dispatch(articleActions.asyncFetchArticleError()),
})

export default connect(mapStateToNavProps, mapDispatchToProps)(ArticleNavigator)
