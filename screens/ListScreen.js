import React, { useEffect, useState, useRef } from 'react'
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native'

import { useIsTablet } from '../utils/helpers'
import LottieView from 'lottie-react-native'

import ErrorView from '../components/ErrorView'
import ListItemRenderer from '../components/listItems/ListItemRenderer'

import { handleArticlePress } from '../utils/articlePress'

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
    } = props

    const { storyListStyle } = global

    const isTablet = useIsTablet()
    const [ad, setAd] = useState(null)

    const animationRef = useRef(null)
    const flatListRef = useRef(null)
    const momentumScrolling = useRef(false)

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

    // useEffect(() => {
    //     const unsubscribe = navigation.addListener('focus', () => {
    //         if (ad && ad.id) {
    //             console.log('sending ad analytic')
    //             sendAdAnalytic(activeDomain.url, ad.id, 'ad_views')
    //         }
    //     })

    //     return unsubscribe
    // }, [navigation])

    const _playAnimation = () => {
        if (animationRef && animationRef.current) {
            animationRef.current.reset()
            animationRef.current.play()
        }
    }

    const _handleRefresh = () => {
        invalidateArticles(category.categoryId)
        fetchArticlesIfNeeded({
            domain: activeDomain.url,
            category: category.categoryId,
        })
    }

    const _loadMore = () => {
        fetchMoreArticlesIfNeeded({
            domain: activeDomain.url,
            category: category.categoryId,
        })
    }

    const _scrollToTop = () => {
        flatListRef.current?.scrollToOffset({ animated: true, offset: 0 })
    }

    if (!categoryId || (!articlesByCategory.length && category.isFetching)) {
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
        return <ErrorView theme={theme} onRefresh={_handleRefresh} />
    }

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.surface }}>
            <FlatList
                Style={{ flex: 1 }}
                contentContainerStyle={{ padding: 10 }}
                data={articlesByCategory}
                keyExtractor={(item) => item.id.toString()}
                ref={flatListRef}
                onEndReachedThreshold={0.2}
                onEndReached={_loadMore}
                onRefresh={_handleRefresh}
                refreshing={category.didInvalidate && category.isFetching}
                ListFooterComponent={() => {
                    if (!category.isFetching) {
                        return null
                    }
                    return (
                        <View
                            style={{
                                flex: 1,
                                padding: 10,
                                alignItems: 'center',
                            }}
                        >
                            <ActivityIndicator />
                        </View>
                    )
                }}
                renderItem={({ item, index, separators }) => (
                    <ListItemRenderer
                        theme={theme}
                        item={item}
                        index={index}
                        separators={separators}
                        onPress={() => handleArticlePress(item, activeDomain)}
                        listStyle={storyListStyle}
                    />
                )}
                ItemSeparatorComponent={() => (
                    <View style={{ height: 10, backgroundColor: theme.colors.surface }} />
                )}
                ListEmptyComponent={() => (
                    <View>
                        <Text
                            style={{
                                fontFamily: 'ralewayBold',
                                fontSize: 18,
                                textAlign: 'center',
                                padding: 20,
                            }}
                        >
                            There are no items to display in this category
                        </Text>
                    </View>
                )}
            />
        </View>
    )
}

export default ListScreen
