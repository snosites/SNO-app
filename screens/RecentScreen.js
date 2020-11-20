import React, { useEffect, useRef } from 'react'
import { View, Text, StyleSheet, FlatList } from 'react-native'
import LottieView from 'lottie-react-native'

import { useIsTablet } from '../utils/helpers'

import ListItemRenderer from '../components/listItems/ListItemRenderer'

import { handleArticlePress } from '../utils/articlePress'

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
    } = props
    const isTablet = useIsTablet()

    const animationRef = useRef(null)
    const flatListRef = useRef(null)

    useEffect(() => {
        _playAnimation()
        fetchRecentArticlesIfNeeded(activeDomain.url)
    }, [])

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

    if (!recent.items.length && recent.isFetching) {
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
        <View style={{ flex: 1, backgroundColor: theme.colors.surface }}>
            <FlatList
                Style={{ flex: 1 }}
                contentContainerStyle={{ padding: 10 }}
                data={recentArticles}
                keyExtractor={(item) => item.id.toString()}
                ref={flatListRef}
                onEndReachedThreshold={0.2}
                onEndReached={() => fetchMoreRecentArticlesIfNeeded(activeDomain.url)}
                onRefresh={_handleRefresh}
                refreshing={(recentArticles.didInvalidate && recentArticles.isFetching) || false}
                ListFooterComponent={() => {
                    if (!recentArticles.isFetching) {
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
                        listStyle={'mix'}
                    />
                )}
                ItemSeparatorComponent={() => (
                    <View style={{ height: 10, backgroundColor: theme.colors.surface }} />
                )}
                ListEmptyComponent={() => (
                    <View style={{ flex: 1 }}>
                        <Text
                            style={{
                                textAlign: 'center',
                                fontSize: 19,
                                padding: 20,
                                fontFamily: 'openSansBold',
                            }}
                        >
                            No recent articles
                        </Text>
                    </View>
                )}
            />
        </View>
    )
}

export default RecentScreen
