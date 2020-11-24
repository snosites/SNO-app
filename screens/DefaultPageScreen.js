import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ScrollView, StyleSheet, Text, View, Image, Platform } from 'react-native'
import Color from 'color'
import HTML from 'react-native-render-html'
import * as WebBrowser from 'expo-web-browser'

import { NavigationEvents } from 'react-navigation'

import LottieView from 'lottie-react-native'

import ErrorView from '../components/ErrorView'

import { asyncFetchArticle } from '../utils/sagaHelpers'
import { handleArticlePress } from '../utils/articlePress'

import { Html5Entities } from 'html-entities'

const entities = new Html5Entities()

// entities.decode(activeCategoryTitle)

const DefaultPageScreen = (props) => {
    const { navigation, route, theme, activeDomain, isLoading, error, page = {}, fetchPage } = props

    const [loadingLink, setLoadingLink] = useState(false)
    const animationRef = useRef(null)

    useEffect(() => {
        if (route.params?.pageId) {
            if (route.params.pageId !== page.id) {
                fetchPage(route.params.pageId)
            }
        }
    }, [route.params?.pageId])

    useLayoutEffect(() => {
        if (page.title?.rendered) {
            navigation.setOptions({
                title: entities.decode(page.title.rendered),
            })
        }
    }, [navigation, page.title?.rendered])

    const _viewLink = async (href) => {
        setLoadingLink(true)

        if (href.includes(activeDomain.url)) {
            const matchPattern = `${activeDomain.url}\/([0-9]+)`

            const matches = new RegExp(matchPattern).exec(href)

            if (matches && matches[1]) {
                const article = await asyncFetchArticle(activeDomain.url, Number(matches[1]))

                handleArticlePress(article, activeDomain)
            } else {
                await WebBrowser.openBrowserAsync(href)
            }
        } else {
            await WebBrowser.openBrowserAsync(href)
        }

        setLoadingLink(false)
    }

    console.log('page screen', route, page)

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <LottieView
                    ref={animationRef}
                    style={StyleSheet.absoluteFill}
                    speed={0.8}
                    loop={true}
                    autoPlay={true}
                    source={require('../assets/lottiefiles/wavy')}
                />
            </View>
        )
    }
    if (error) {
        return <ErrorView theme={theme} onRefresh={() => navigation.goBack()} />
    }

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.surface }}>
            <ScrollView style={{ flex: 1 }}>
                <Text
                    style={{
                        fontSize: 30,
                        fontFamily: 'ralewayBold',
                        textAlign: 'center',
                        padding: 10,
                        color: theme.colors.primary,
                    }}
                >
                    {entities.decode(page.title?.rendered)}
                </Text>
                <View style={{ padding: 20 }}>
                    {page.content?.rendered ? (
                        <HTML
                            html={page.content.rendered}
                            baseFontStyle={{ fontSize: 18 }}
                            allowedStyles={['color']}
                            onLinkPress={(e, href) => _viewLink(href)}
                            tagsStyles={{
                                rawtext: {
                                    fontSize: 19,
                                    color: theme.colors.text,
                                },
                            }}
                        />
                    ) : null}
                </View>
            </ScrollView>
        </View>
    )
}

export default DefaultPageScreen
