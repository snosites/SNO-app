import React, { useEffect, useState, useRef } from 'react'
import { View, Text, StyleSheet, Platform } from 'react-native'

import { useIsTablet } from '../utils/helpers'
import LottieView from 'lottie-react-native'

import { Snackbar, Button } from 'react-native-paper'

import ArticleListContent from '../views/ArticleListContent'
import TabletArticleListContent from '../views/TabletArticleListContent'
import ErrorView from '../components/ErrorView'

const ListScreen = (props) => {
    const {
        route,
        navigation,
        theme,
        global,
        listAds,
        activeDomain,
        sendAdAnalytic,
        categoryId,
        category,
        articlesByCategory,
        invalidateArticles,
        fetchArticlesIfNeeded,
        fetchMoreArticlesIfNeeded,
        saveArticle,
        removeSavedArticle,
    } = props

    const isTablet = useIsTablet()
    const [ad, setAd] = useState(null)

    const animationRef = useRef(null)
    const flatListRef = useRef(null)

    useEffect(() => {
        _playAnimation()

        if (listAds && listAds.images && listAds.images.length) {
            const activeAdImage = listAds.images[Math.floor(Math.random() * listAds.images.length)]
            if (activeAdImage.id) {
                setAd(activeAdImage)
                sendAdAnalytic(activeDomain.url, activeAdImage.id, 'ad_views')
            }
        }
    }, [listAds])

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            if (ad && ad.id) {
                console.log('sending ad analytic')
                sendAdAnalytic(activeDomain.url, ad.id, 'ad_views')
            }
        })

        return unsubscribe
    }, [navigation])

    _playAnimation = () => {
        if (animationRef && animationRef.current) {
            animationRef.current.reset()
            animationRef.current.play()
        }
    }

    _handleRefresh = () => {
        invalidateArticles(category.categoryId)
        fetchArticlesIfNeeded({
            domain: activeDomain.url,
            category: category.categoryId,
        })
    }

    _loadMore = () => {
        fetchMoreArticlesIfNeeded({
            domain: activeDomain.url,
            category: category.categoryId,
        })
    }

    _scrollToTop = () => {
        flatListRef.scrollToOffset({ animated: true, offset: 0 })
    }

    _saveRef = (ref) => {
        flatListRef = ref
    }

    const _saveRemoveToggle = (article) => {
        if (article.saved) {
            removeSavedArticle(article.id, activeDomain.id)
        } else {
            saveArticle(article, activeDomain.id)
        }
    }

    if (!categoryId) {
        return (
            <View
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
            </View>
        )
    }
    if (articlesByCategory.length === 0 && category.isFetching) {
        return (
            <View
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
            </View>
        )
    }
    if (category.error) {
        return <ErrorView onRefresh={_handleRefresh} />
    }

    return (
        <View style={{ flex: 1 }}>
            {isTablet ? (
                <TabletArticleListContent
                    articleList={articlesByCategory}
                    isFetching={category.isFetching}
                    isRefreshing={category.didInvalidate || false}
                    loadMore={_loadMore}
                    handleRefresh={_handleRefresh}
                    saveRef={_saveRef}
                    activeDomain={activeDomain}
                    theme={theme}
                    enableComments={global.enableComments}
                    navigation={navigation}
                    onIconPress={_saveRemoveToggle}
                    listAds={listAds}
                    ad={ad}
                />
            ) : (
                <ArticleListContent
                    articleList={articlesByCategory}
                    isFetching={category.isFetching}
                    isRefreshing={category.didInvalidate || false}
                    loadMore={_loadMore}
                    handleRefresh={_handleRefresh}
                    saveRef={_saveRef}
                    activeDomain={activeDomain}
                    theme={theme}
                    enableComments={global.enableComments}
                    navigation={navigation}
                    onIconPress={_saveRemoveToggle}
                    storyListStyle={global.storyListStyle}
                    listAds={listAds}
                    ad={ad}
                />
            )}
        </View>
    )
}

export default ListScreen
