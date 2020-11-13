import React, { useEffect, useRef } from 'react'
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native'
import LottieView from 'lottie-react-native'
import * as Device from 'expo-device'

import { Snackbar } from 'react-native-paper'

import { SafeAreaView } from 'react-navigation'
import ArticleListContent from '../views/ArticleListContent'
import TabletArticleListContent from '../views/TabletArticleListContent'

// const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window')
import { useIsTablet } from '../utils/helpers'

const RecentScreen = (props) => {
    const {
        navigation,
        recentArticles,
        recent,
        theme,
        activeDomain,
        global,
        fetchRecentArticlesIfNeeded,
        invalidateRecentArticles,
        saveArticle,
        removeSavedArticle,
    } = props
    const isTablet = useIsTablet()

    const animationRef = useRef(null)
    const flatListRef = useRef(null)

    useEffect(() => {
        _playAnimation()
        fetchRecentArticlesIfNeeded(activeDomain.url)
    }, [])

    const _saveRef = (ref) => {
        flatListRef = ref
    }

    const _playAnimation = () => {
        if (animationRef && animationRef.current) {
            animationRef.current.reset()
            animationRef.current.play()
        }
    }

    const _handleRefresh = () => {
        invalidateRecentArticles()
        fetchRecentArticlesIfNeeded(activeDomain.url)
    }

    const _saveRemoveToggle = (article) => {
        if (article.saved) {
            removeSavedArticle(article.id, activeDomain.id)
        } else {
            saveArticle(article, activeDomain.id)
        }
    }

    if (!recent.items.length && recent.isFetching) {
        return (
            <SafeAreaView
                style={{
                    flex: 1,
                    marginTop: 20,
                }}
            >
                <LottieView
                    ref={animationRef}
                    style={StyleSheet.absoluteFill}
                    speed={0.8}
                    loop={true}
                    autoPlay={true}
                    source={require('../assets/lottiefiles/multi-article-loading')}
                />
            </SafeAreaView>
        )
    }
    if (recent.error) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <View
                    style={{
                        width: 200,
                        height: 200,
                    }}
                >
                    <LottieView
                        ref={animationRef}
                        style={{
                            width: 200,
                            height: 200,
                        }}
                        loop={true}
                        autoPlay={true}
                        source={require('../assets/lottiefiles/broken-stick-error')}
                    />
                </View>
                <Text style={{ textAlign: 'center', fontSize: 17, padding: 30 }}>
                    Sorry, something went wrong.
                </Text>
            </View>
        )
    }

    return (
        <View style={{ flex: 1 }}>
            {isTablet ? (
                <TabletArticleListContent
                    articleList={recentArticles}
                    isFetching={recent.isFetching}
                    isRefreshing={recent.didInvalidate}
                    loadMore={() => fetchMoreRecentArticlesIfNeeded(activeDomain.url)}
                    handleRefresh={_handleRefresh}
                    saveRef={_saveRef}
                    activeDomain={activeDomain}
                    enableComments={global.enableComments}
                    theme={theme}
                    navigation={navigation}
                    onIconPress={_saveRemoveToggle}
                />
            ) : (
                <ArticleListContent
                    articleList={recentArticles}
                    isFetching={recent.isFetching}
                    isRefreshing={recent.didInvalidate}
                    loadMore={() => fetchMoreRecentArticlesIfNeeded(activeDomain.url)}
                    handleRefresh={_handleRefresh}
                    enableComments={global.enableComments}
                    saveRef={_saveRef}
                    activeDomain={activeDomain}
                    theme={theme}
                    navigation={navigation}
                    onIconPress={_saveRemoveToggle}
                    storyListStyle={global.storyListStyle}
                />
            )}
        </View>
    )
}

export default RecentScreen
