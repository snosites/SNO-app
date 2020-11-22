import React, { useEffect, useState, useRef } from 'react'
import {
    View,
    ScrollView,
    SafeAreaView,
    SectionList,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
} from 'react-native'

import LottieView from 'lottie-react-native'
import { AntDesign } from '@expo/vector-icons'

import AdBlock from '../components/AdBlock'
import ErrorView from '../components/ErrorView'
import ListItemRenderer from '../components/listItems/ListItemRenderer'

import { useIsTablet } from '../utils/helpers'

import { handleArticlePress } from '../utils/articlePress'

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
        homeScreenData,
    } = props

    const { homeScreenListStyle, enableComments } = global

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
        if (animationRef && animationRef.current) {
            animationRef.current.reset()
            animationRef.current.play()
        }
    }

    // _handleRefresh = () => {
    //     invalidateArticles(category.categoryId)
    //     fetchArticlesIfNeeded({
    //         domain: activeDomain.url,
    //         category: category.categoryId,
    //     })
    // }

    // _loadMore = () => {
    //     fetchMoreArticlesIfNeeded({
    //         domain: activeDomain.url,
    //         category: category.categoryId,
    //     })
    // }

    _scrollToTop = () => {
        flatListRef.scrollToOffset({ animated: true, offset: 0 })
    }

    if (articlesLoading) {
        return (
            <SafeAreaView
                style={{
                    flex: 1,
                }}
            >
                <LottieView
                    ref={animationRef}
                    style={StyleSheet.absoluteFill}
                    speed={0.8}
                    loop={true}
                    autoPlay={true}
                    source={require('../assets/lottiefiles/wavy')}
                />
            </SafeAreaView>
        )
    }
    if (!homeScreenData.length) {
        return <ErrorView onRefresh={_handleRefresh} />
    }

    return (
        <SectionList
            Style={{ flex: 1 }}
            contentContainerStyle={{ padding: 10, backgroundColor: theme.colors.surface }}
            sections={homeScreenData}
            keyExtractor={(item) => item.id.toString()}
            ref={flatListRef}
            renderSectionHeader={({ section: { title } }) => (
                <Text
                    style={{
                        fontFamily: 'ralewayExtraBold',
                        fontSize: 34,
                        color: theme.colors.accent,
                        paddingVertical: 20,
                    }}
                >
                    {entities.decode(title)}
                </Text>
            )}
            renderSectionFooter={({ section: { title, id } }) => (
                <View>
                    <View
                        style={{
                            marginTop: 20,
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: 'ralewayBold',
                                fontSize: 15,
                                color: theme.colors.gray,
                            }}
                        >
                            More{' '}
                        </Text>
                        <TouchableOpacity
                            onPress={() => {
                                setActiveCategory(id)
                                navigation.navigate('ListDrawer')
                            }}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text
                                    style={{
                                        fontFamily: 'ralewayBold',
                                        fontSize: 15,
                                        color: theme.colors.accent,
                                    }}
                                >
                                    {entities.decode(title)}
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
                    <View
                        style={{
                            marginTop: 20,
                            height: 1,
                            backgroundColor: theme.colors.accent,
                            marginHorizontal: 30,
                        }}
                    />
                </View>
            )}
            stickySectionHeadersEnabled={false}
            renderItem={({ item, index, separators }) => (
                <ListItemRenderer
                    theme={theme}
                    item={item}
                    index={index}
                    separators={separators}
                    onPress={() => handleArticlePress(item, activeDomain)}
                    listStyle={homeScreenListStyle}
                />
            )}
            ItemSeparatorComponent={() => (
                <View
                    style={{
                        height: 10,
                        backgroundColor: 'transparent',
                    }}
                />
            )}
            ListEmptyComponent={() => (
                <View>
                    <Text>No items</Text>
                </View>
            )}
        />
    )
}

export default HomeScreen
