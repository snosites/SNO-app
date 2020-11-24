import React, { useState, useEffect, useRef } from 'react'
import {
    ScrollView,
    StyleSheet,
    Share,
    View,
    TouchableOpacity,
    Text,
    ActivityIndicator,
} from 'react-native'
import { StatusBar } from 'expo-status-bar'
import * as Amplitude from 'expo-analytics-amplitude'
import LottieView from 'lottie-react-native'
import { NavigationEvents } from 'react-navigation'

import * as WebBrowser from 'expo-web-browser'
import { SafeAreaView } from 'react-native-safe-area-context'

import ArticleContent from '../components/Article/ArticleContent'

import { asyncFetchArticle } from '../utils/sagaHelpers'
import { handleArticlePress } from '../utils/articlePress'

import { Html5Entities } from 'html-entities'

const entities = new Html5Entities()

const ArticleScreen = (props) => {
    const { navigation, article, theme, activeDomain, enableComments, storyAds } = props

    const [loadingLink, setLoadingLink] = useState(false)
    const [articleChapters, setArticleChapters] = useState([])
    const [titleYOffset, setTitleYOffset] = useState(null)

    const animationRef = useRef(null)
    const scrollViewRef = useRef(null)

    useEffect(() => {
        console.log('storyAds', storyAds)
    }, [storyAds])

    const _onLayout = (e) => {
        if (e.nativeEvent?.layout) {
            const { y, height } = e.nativeEvent.layout
            setTitleYOffset(y + height - 10)
        }
    }

    const _onScroll = ({ nativeEvent: { contentOffset } }) => {
        const articleTitle = entities.decode(article.title?.rendered)

        if (!articleTitle) return

        if (contentOffset.y > titleYOffset) {
            if (enableComments) {
                if (navigation.dangerouslyGetParent()) {
                    navigation.dangerouslyGetParent().setOptions({
                        headerTitle: ({ style }) => (
                            <Text
                                style={{
                                    ...style,
                                    marginHorizontal: 50,
                                    fontSize: 16,
                                    fontFamily: 'ralewayBold',
                                    color: theme.colors.text,
                                }}
                                ellipsizeMode={'middle'}
                                numberOfLines={1}
                            >
                                {articleTitle}
                            </Text>
                        ),
                    })
                }
            } else {
                navigation.setOptions({
                    headerTitle: ({ style }) => (
                        <Text
                            style={{
                                ...style,
                                marginHorizontal: 50,
                                fontSize: 16,
                                fontFamily: 'ralewayBold',
                                color: theme.colors.text,
                            }}
                            ellipsizeMode={'middle'}
                            numberOfLines={1}
                        >
                            {articleTitle}
                        </Text>
                    ),
                })
            }
        }
        if (contentOffset.y < titleYOffset) {
            if (enableComments) {
                if (navigation.dangerouslyGetParent()) {
                    navigation.dangerouslyGetParent().setOptions({
                        headerTitle: '',
                    })
                }
            } else {
                navigation.setOptions({
                    headerTitle: '',
                })
            }
        }
    }

    const _viewLink = async (href) => {
        setLoadingLink(true)

        if (href.includes(activeDomain.url)) {
            const matchPattern = `${activeDomain.url}\/([0-9]+)`

            const matches = new RegExp(matchPattern).exec(href)

            if (matches && matches[1]) {
                try {
                    const article = await asyncFetchArticle(activeDomain.url, Number(matches[1]))

                    handleArticlePress(article, activeDomain)
                } catch (err) {
                    setLoadingLink(false)
                    await WebBrowser.openBrowserAsync(href)
                }
            } else {
                await WebBrowser.openBrowserAsync(href)
            }
        } else {
            await WebBrowser.openBrowserAsync(href)
        }

        setLoadingLink(false)
    }

    if (!article.id) {
        return (
            <SafeAreaView
                style={{
                    flex: 1,
                    alignContent: 'center',
                    justifyContent: 'center',
                    backgroundColor: theme.colors.surface,
                }}
            >
                <LottieView
                    style={StyleSheet.absoluteFill}
                    ref={animationRef}
                    loop={true}
                    autoPlay={true}
                    source={require('../assets/lottiefiles/article-loading-animation')}
                />
            </SafeAreaView>
        )
    }

    return (
        <>
            <ScrollView
                style={{ flex: 1, backgroundColor: theme.colors.surface }}
                scrollEventThrottle={16}
                onScroll={(e) => _onScroll(e)}
            >
                <ArticleContent
                    navigation={navigation}
                    article={article}
                    theme={theme}
                    onLinkPress={(href) => _viewLink(href)}
                    onLayout={_onLayout}
                />
                {articleChapters.map((article) => (
                    <ArticleContent
                        key={article.id}
                        navigation={navigation}
                        article={article}
                        theme={theme}
                        onLinkPress={(href) => _viewLink(href)}
                    />
                ))}
            </ScrollView>
            {loadingLink && (
                <View
                    style={{
                        backgroundColor: '#c7c7c7',
                        opacity: 0.5,
                        ...StyleSheet.absoluteFill,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <ActivityIndicator size='large' color={theme.colors.primary} />
                </View>
            )}
        </>
    )
}

export default ArticleScreen
