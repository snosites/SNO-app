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

import ErrorView from '../components/ErrorView'
import ListItemRenderer from '../components/listItems/ListItemRenderer'
import AdBlock from '../components/AdBlock'

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
        fetchHomeScreenArticles,
    } = props

    const { homeScreenListStyle } = global

    const [ad, setAd] = useState(null)
    const isTablet = useIsTablet()

    const animationRef = useRef(null)
    const flatListRef = useRef(null)

    useEffect(() => {
        _playAnimation()

        if (homeAds.images?.length) {
            const randomAdImage = homeAds.images[Math.floor(Math.random() * homeAds.images.length)]

            if (randomAdImage.id) {
                setAd(randomAdImage)
                sendAdAnalytic(activeDomain.url, randomAdImage.id, 'ad_views')
            }
        } else {
            setAd(null)
        }
    }, [homeAds])

    useEffect(() => {
        fetchHomeScreenArticles()
    }, [])

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            if (ad && ad.id && homeScreenData?.length) {
                sendAdAnalytic(activeDomain.url, ad.id, 'ad_views')
            }
        })
        return unsubscribe
    }, [navigation])

    useEffect(() => {
        if (navigation.dangerouslyGetParent()?.dangerouslyGetParent()) {
            const unsubscribe = navigation
                .dangerouslyGetParent()
                .dangerouslyGetParent()
                .addListener('tabPress', () => {
                    const isFocused = navigation.dangerouslyGetParent().isFocused()
                    if (isFocused) _scrollToTop()
                })
            return unsubscribe
        }
    }, [navigation])

    const shouldShowAdImage = (sectionIndex) =>
        homeAds.displayLocation?.includes(sectionIndex) && ad

    const _playAnimation = () => {
        if (animationRef && animationRef.current) {
            animationRef.current.reset()
            animationRef.current.play()
        }
    }

    const _scrollToTop = () => {
        flatListRef.current?.scrollToLocation({
            sectionIndex: 0,
            itemIndex: 0,
        })
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
        return <ErrorView theme={theme} onRefresh={fetchHomeScreenArticles} />
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
                        color: theme.colors.homeScreenCategoryTitle,
                        paddingVertical: 20,
                    }}
                >
                    {entities.decode(title)}
                </Text>
            )}
            renderSectionFooter={({ section: { title, id, sectionIndex } }) => {
                return (
                    <View>
                        <View
                            style={{
                                marginTop: 20,
                                flexDirection: 'row',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                            }}
<<<<<<< HEAD
                            loop={true}
                            autoPlay={true}
                            source={require('../assets/lottiefiles/broken-stick-error')}
                        />
                    </View>
                    <Text style={{ textAlign: 'center', fontSize: 17, padding: 30 }}>
                        Sorry, something went wrong. If you are the site owner, please submit a
                        support request.
                    </Text>
                    <Button
                        mode='contained'
                        theme={{
                            roundness: 7,
                            colors: {
                                primary: theme ? theme.colors.primary : '#2099CE',
                            },
                        }}
                        style={{ padding: 5 }}
                        onPress={this._handleRefresh}
                    >
                        Reload
                    </Button>
                </View>
            )
        }

        const categoryBackgroundColor = homeScreenCategoryColor
            ? homeScreenCategoryColor
            : theme.colors.primary

        let primaryCategoryBackgroundColor = Color(categoryBackgroundColor)
        let isCategoryColorDark = primaryCategoryBackgroundColor.isDark()

        return (
            <ScrollView style={{ flex: 1 }}>
                <NavigationEvents
                    onDidFocus={() => {
                        if (ad && ad.id) {
                            sendAdAnalytic(activeDomain.url, ad.id, 'ad_views')
                        }
                    }}
                />
                {categoryTitles.map((title, i) => {
                    // const margin = i ? 40 : 0
                    const listLength = homeScreenCategoryAmounts[i] || 5
                    const shouldShowAd =
                        homeAds.displayLocation && homeAds.displayLocation.includes(i + 1) && ad

                    console.log('should show ad', shouldShowAd, homeAds.displayLocation, ad)
                    return (
                        <View style={{ flex: 1 }} key={i}>
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.navigate('List', {
                                        menuTitle: title,
                                        categoryId: homeScreenCategories[i],
                                    })
                                    setActiveCategory(homeScreenCategories[i])
                                }}
                                style={{
                                    backgroundColor: categoryBackgroundColor,
                                    justifyContent: 'center',
                                    paddingVertical: 10,
                                    // marginTop: margin,
                                    shadowColor: '#000',
                                    shadowOffset: {
                                        width: 0,
                                        height: 2,
                                    },
                                    shadowOpacity: 0.23,
                                    shadowRadius: 2.62,

                                    elevation: 4,
=======
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
>>>>>>> navigation-v5
                                }}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text
                                        style={{
                                            fontFamily: 'ralewayBold',
                                            fontSize: 15,
                                            color: theme.colors.homeScreenCategoryTitle,
                                        }}
                                    >
                                        {entities.decode(title)}
                                    </Text>
                                    <AntDesign
                                        name={'caretright'}
                                        size={12}
                                        style={{ marginBottom: -3, marginLeft: -2 }}
                                        color={theme.colors.homeScreenCategoryTitle}
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View
                            style={{
                                marginTop: 20,
                                height: 1,
                                backgroundColor: theme.colors.homeScreenCategoryTitle,
                                marginHorizontal: 30,
                            }}
                        />
                        {shouldShowAdImage(sectionIndex) && (
                            <AdBlock image={ad} themeIsDark={theme.dark} />
                        )}
                    </View>
                )
            }}
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
