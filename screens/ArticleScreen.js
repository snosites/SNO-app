import React, { useState, useEffect, useRef } from 'react'
import { ScrollView, StyleSheet, Share, View, TouchableOpacity, Text } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import * as Amplitude from 'expo-analytics-amplitude'
import LottieView from 'lottie-react-native'
import { NavigationEvents } from 'react-navigation'

import * as WebBrowser from 'expo-web-browser'
import { SafeAreaView } from 'react-native-safe-area-context'

import ArticleContent from '../components/Article/ArticleContent'

import { asyncFetchArticle } from '../utils/sagaHelpers'
import { handleArticlePress } from '../utils/articlePress'

const ArticleScreen = (props) => {
    const { route, navigation, theme, activeDomain, article } = props

    const [loadingLink, setLoadingLink] = useState(false)
    const [articleChapters, setArticleChapters] = useState([])

    const animationRef = useRef(null)
    const scrollViewRef = useRef(null)

    const _viewLink = async (href, article) => {
        setLoadingLink(true)

        if (href.includes(activeDomain.url)) {
            const matchPattern = `${activeDomain.url}\/([0-9]+)`

            const matches = new RegExp(matchPattern).exec(href)

            if (matches && matches[1]) {
                const article = await asyncFetchArticle(activeDomain.url, Number(matches[1]))

                handleArticlePress(article, activeDomain)
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
        <ScrollView style={{ flex: 1, backgroundColor: theme.colors.surface }}>
            <ArticleContent
                navigation={navigation}
                article={article}
                theme={theme}
                onLinkPress={() => _viewLink()}
            />
            {articleChapters.map((article) => (
                <ArticleContent
                    key={article.id}
                    navigation={navigation}
                    article={article}
                    theme={theme}
                />
            ))}
        </ScrollView>
    )
}

export default ArticleScreen
