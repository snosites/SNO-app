import React, { useEffect, useState, useRef } from 'react'
import {
    SafeAreaView,
    SectionList,
    Text,
    StyleSheet,
    Platform,
    TouchableOpacity,
} from 'react-native'

import HTML from 'react-native-render-html'
import LottieView from 'lottie-react-native'

import { Snackbar } from 'react-native-paper'

import AdBlock from '../components/AdBlock'
import ArticleListContent from '../views/ArticleListContent'
import TabletArticleListContent from '../views/TabletArticleListContent'
import ErrorView from '../components/ErrorView'

import { useIsTablet } from '../utils/helpers'

// import ArticleListItem from '../views/ArticleListItem'

const HomeScreen = (props) => {
    const {
        navigation,
        global,
        theme,
        homeAds,
        sendAdAnalytic,
        activeDomain,
        isLoading,
        articlesLoading,
        articlesByCategory,
        categoryTitles,
        setActiveCategory,
        saveArticle,
        removeSavedArticle,
        homeScreenData,
    } = props

    const { homeScreenListStyle, enableComments } = global

    console.log('home screen stuff', homeScreenData)

    const [ad, setAd] = useState(null)
    const isTablet = useIsTablet()

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
        animationRef.current.reset()
        animationRef.current.play()
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

    _saveRemoveToggle = (article) => {
        if (article.saved) {
            removeSavedArticle(article.id, activeDomain.id)
        } else {
            saveArticle(article, activeDomain.id)
        }
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

    return (
        <SectionList
            sections={homeScreenData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => <Text>{index}</Text>}
            renderSectionHeader={({ section: { title } }) => (
                <TouchableOpacity
                    onPress={() => {
                        // navigation.navigate('List', {
                        //     categoryId: homeScreenCategories[i],
                        // })
                        // setActiveCategory(homeScreenCategories[i])
                    }}
                    style={{
                        backgroundColor: theme.colors.homeScreenCategoryTitle,
                        justifyContent: 'center',
                        paddingVertical: 10,
                        shadowColor: '#000',
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.23,
                        shadowRadius: 2.62,

                        elevation: 4,
                    }}
                >
                    <HTML
                        html={title}
                        baseFontStyle={{ fontSize: 28 }}
                        tagsStyles={{
                            rawtext: {
                                fontSize: 28,
                                fontWeight: 'bold',
                                color: theme.homeScreenCategoryTitleIsDark ? 'white' : 'black',
                                textAlign: 'center',
                            },
                        }}
                    />
                </TouchableOpacity>
            )}
        />
    )
}

const styles = StyleSheet.create({
    snackbar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    title: {
        ...Platform.select({
            ios: {
                fontSize: 17,
                fontWeight: '600',
            },
            android: {
                fontSize: 20,
                fontWeight: '500',
            },
            default: {
                fontSize: 18,
                fontWeight: '400',
            },
        }),
    },
})

export default HomeScreen
