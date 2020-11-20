import React, { useEffect, useState, useRef } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native'

import LottieView from 'lottie-react-native'

import ListItemRenderer from '../components/listItems/ListItemRenderer'

import { handleArticlePress } from '../utils/articlePress'

import { useIsTablet } from '../utils/helpers'

import ErrorView from '../components/ErrorView'

const SearchScreen = (props) => {
    const {
        navigation,
        route,
        searchArticles,
        search,
        theme,
        activeDomain,
        fetchSearchArticlesIfNeeded,
        fetchMoreSearchArticlesIfNeeded,
        invalidateSearchArticles,
    } = props

    const isTablet = useIsTablet()

    const animationRef = useRef(null)
    const flatListRef = useRef(null)

    useEffect(() => {
        _playAnimation()
    }, [])

    const _playAnimation = () => {
        if (animationRef && animationRef.current) {
            animationRef.current.reset()
            animationRef.current.play()
        }
    }

    _scrollToTop = () => {
        flatListRef.current?.scrollToOffset({ animated: true, offset: 0 })
    }

    const _handleRefresh = () => {
        if (route.params?.searchTerm) {
            invalidateSearchArticles()
            fetchSearchArticlesIfNeeded(activeDomain.url, route.params.searchTerm)
        }
    }

    const _loadMore = () => {
        if (route.params?.searchTerm) {
            fetchMoreSearchArticlesIfNeeded(activeDomain.url, route.params.searchTerm)
        }
    }

    if (search.didInvalidate && search.isFetching) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <LottieView
                    ref={animationRef}
                    style={StyleSheet.absoluteFill}
                    speed={0.8}
                    loop={true}
                    autoPlay={true}
                    source={require('../assets/lottiefiles/search-processing')}
                />
            </View>
        )
    }
    if (search.error) {
        return <ErrorView theme={theme} onRefresh={_handleRefresh} />
    }

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.surface }}>
            <FlatList
                Style={{ flex: 1 }}
                contentContainerStyle={{ padding: 10 }}
                data={searchArticles}
                keyExtractor={(item) => item.id.toString()}
                ref={flatListRef}
                onEndReachedThreshold={0.2}
                onEndReached={_loadMore}
                onRefresh={_handleRefresh}
                refreshing={search.didInvalidate && search.isFetching}
                ListFooterComponent={() => {
                    if (!search.isFetching) {
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
                        listStyle={'alternating'}
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
                            No search results for that term.
                        </Text>
                    </View>
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    animationContainer: {
        width: 400,
        height: 400,
    },
    animationContainerError: {
        width: 200,
        height: 200,
    },
    snackbar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
})

export default SearchScreen
