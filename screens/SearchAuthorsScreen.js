import React, { useEffect, useState, useRef } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native'

import { List } from 'react-native-paper'

import LottieView from 'lottie-react-native'

import ListItemRenderer from '../components/listItems/ListItemRenderer'

import { handleArticlePress } from '../utils/articlePress'

import { useIsTablet } from '../utils/helpers'

import ErrorView from '../components/ErrorView'

import { Html5Entities } from 'html-entities'

const entities = new Html5Entities()

const SearchAuthorsScreen = (props) => {
    const {
        navigation,
        route,
        searchAuthors,
        search,
        theme,
        activeDomain,
        fetchSearchAuthorsIfNeeded,
        fetchMoreSearchAuthorsIfNeeded,
        invalidateSearchAuthors,
    } = props

    const isTablet = useIsTablet()

    const animationRef = useRef(null)
    const flatListRef = useRef(null)

    console.log('searchAuthors', searchAuthors)

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
            invalidateSearchAuthors()
            fetchSearchAuthorsIfNeeded(activeDomain.url, route.params.searchTerm)
        }
    }

    const _loadMore = () => {
        if (route.params?.searchTerm) {
            fetchMoreSearchAuthorsIfNeeded(activeDomain.url, route.params.searchTerm)
        }
    }

    const handleProfilePress = (profile) => {
        navigation.navigate('ProfileModal', {
            profileId: writerId,
            profileName: writerName,
        })
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
                data={searchAuthors}
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
                    <List.Item
                        onPress={() => {
                            if (item.custom_fields?.terms) {
                                // navigation.navigate('ProfileModal', {
                                //     profileId: item.custom_fields.terms[0].term_id,
                                //     profileName: item.custom_fields.terms[0].name,
                                // })
                            }
                        }}
                        title={entities.decode(item.title?.rendered)}
                        titleStyle={{
                            color: theme.colors.accent,
                        }}
                        description={entities.decode(item.excerpt)}
                        descriptionNumberOfLines={1}
                        left={(props) =>
                            item.profileImageUrl ? (
                                <Image
                                    source={{ uri: item.profileImageUrl }}
                                    style={{
                                        ...props.style,
                                        width: 50,
                                        height: 50,
                                        borderRadius: 25,
                                    }}
                                    resizeMode='cover'
                                />
                            ) : (
                                <List.Icon {...props} icon='account' />
                            )
                        }
                        right={(props) => (
                            <List.Icon
                                {...props}
                                color={theme.colors.accent}
                                icon='chevron-right'
                            />
                        )}
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
                                fontFamily: 'ralewayBold',
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

export default SearchAuthorsScreen
