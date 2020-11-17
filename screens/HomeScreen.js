import React, { useEffect, useState, useRef } from 'react'
import {
    View,
    ScrollView,
    SafeAreaView,
    SectionList,
    Text,
    StyleSheet,
    Platform,
    TouchableOpacity,
} from 'react-native'

import HTML from 'react-native-render-html'
import LottieView from 'lottie-react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Snackbar } from 'react-native-paper'
import { AntDesign } from '@expo/vector-icons'

import AdBlock from '../components/AdBlock'
import ArticleListContent from '../views/ArticleListContent'
import TabletArticleListContent from '../views/TabletArticleListContent'
import ErrorView from '../components/ErrorView'

import { useIsTablet } from '../utils/helpers'

import ArticleListItem from '../views/ArticleListItem'

import { Html5Entities } from 'html-entities'

const entities = new Html5Entities()

const HomeScreen = (props) => {
    const {
        navigation,
        global,
        theme,
        homeAds,
        sendAdAnalytic,
        activeDomain,
        articlesLoading,
        setActiveCategory,
        saveArticle,
        removeSavedArticle,
        homeScreenData,
    } = props

    const { homeScreenListStyle, enableComments } = global

    const [ad, setAd] = useState(null)
    const isTablet = useIsTablet()
    const [index, setIndex] = useState(0)

    const animationRef = useRef(null)
    const flatListRef = useRef(null)

    useEffect(() => {
        _playAnimation()

        if (homeAds && homeAds.images && homeAds.images.length) {
            const activeAdImage = homeAds.images[Math.floor(Math.random() * homeAds.images.length)]
            setAd(activeAdImage)
            sendAdAnalytic(activeDomain.url, activeAdImage.id, 'ad_views')
        }
    }, [homeAds])

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

    if (articlesLoading) {
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
    if (!homeScreenData.length) {
        return <ErrorView onRefresh={_handleRefresh} />
    }

    console.log('home screen data', homeScreenData)

    return (
        <ScrollView style={{ flex: 1 }}>
            {homeScreenData.map((item, i) => {
                return (
                    <LinearGradient
                        key={i}
                        colors={[theme.colors.surface, theme.colors.background]}
                        style={{
                            paddingHorizontal: 10,
                            paddingVertical: 10,
                            borderRadius: 16,
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: 'openSansExtraBold',
                                fontSize: 32,
                                color: theme.colors.accent,
                            }}
                        >
                            {entities.decode(item.title)}
                        </Text>
                        <View style={{ marginLeft: -10 }}>
                            {item.data.map((story, i) => (
                                <ArticleListItem
                                    article={story}
                                    storyListStyle={homeScreenListStyle}
                                    index={i}
                                />
                            ))}
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: 'openSansBold',
                                    fontSize: 14,
                                    color: theme.extraColors.darkGray,
                                }}
                            >
                                More{' '}
                            </Text>
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.navigate('List', {
                                        categoryId: id,
                                    })
                                    setActiveCategory(id)
                                }}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text
                                        style={{
                                            fontFamily: 'openSansBold',
                                            fontSize: 14,
                                            color: theme.colors.accent,
                                        }}
                                    >
                                        {entities.decode(item.title)}
                                    </Text>
                                    <AntDesign
                                        name={'caretright'}
                                        size={12}
                                        style={{ marginBottom: -3, marginLeft: -2 }}
                                        color={theme.colors.accent}
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>
                )
            })}
        </ScrollView>
    )
}

export default HomeScreen
