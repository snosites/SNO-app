import React, { useState } from 'react'
import { StyleSheet, Text, View, ImageBackground, useWindowDimensions } from 'react-native'

import HTML from 'react-native-render-html'
import * as Haptics from 'expo-haptics'
import { WebView } from 'react-native-webview'

import TouchableItem from '../../constants/TouchableItem'
import Slideshow from '../../views/Slideshow'

const FeaturedMedia = ({ navigation, article, theme }) => {
    const [expandCaption, setExpandCaption] = useState(false)

    const MAX_MEDIA_HEIGHT = useWindowDimensions().height * 0.35
    const MEDIA_WIDTH = useWindowDimensions().width

    const _handleProfilePress = (writerId) => {
        Haptics.selectionAsync()
        navigation.navigate('ProfileModal', {
            profileId: writerId,
        })
    }

    if (article.slideshow && article.slideshow.length) {
        return <Slideshow accentColor={theme.colors.accent} images={article.slideshow} />
    }

    if (article.custom_fields.video && article.custom_fields.video[0]) {
        const source = article.custom_fields.video[0]

        if (source.includes('iframe')) {
            let regex = /<iframe.*?src=["'](.*?)["']/
            let src = regex.exec(source)[1]
            console.log('src', src)

            return (
                <WebView
                    style={{ width: MEDIA_WIDTH, height: MAX_MEDIA_HEIGHT }}
                    scrollEnabled={false}
                    bounces={false}
                    originWhitelist={['https://*', 'http://*']}
                    allowsInlineMediaPlayback={true}
                    startInLoadingState={true}
                    renderError={() => (
                        <View
                            style={{
                                position: 'absolute',
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '100%',
                                width: '100%',
                                backgroundColor: 'white',
                            }}
                        >
                            <Text style={{ textAlign: 'center' }}>
                                Sorry, the video failed to load
                            </Text>
                        </View>
                    )}
                    onLoad={(syntheticEvent) => {
                        // update component to be aware of loading status
                        const { nativeEvent } = syntheticEvent
                        console.log('onLoad: ', nativeEvent)
                    }}
                    onLoadStart={(syntheticEvent) => {
                        // update component to be aware of loading status
                        const { nativeEvent } = syntheticEvent
                        console.log('onLoadStart: ', nativeEvent)
                    }}
                    onLoadEnd={(syntheticEvent) => {
                        // update component to be aware of loading status
                        const { nativeEvent } = syntheticEvent
                        console.log('onLoadEnd: ', nativeEvent)
                    }}
                    onError={(syntheticEvent) => {
                        const { nativeEvent } = syntheticEvent
                        console.log('onError: ', nativeEvent)
                    }}
                    renderError={(errorName) => {
                        console.log('renderError: ', errorName)
                    }}
                    source={{ uri: src }}
                />
            )
        }

        let embedString = source.replace('watch?v=', 'embed/')

        return (
            <WebView
                scrollEnabled={false}
                bounces={false}
                originWhitelist={['*']}
                allowsInlineMediaPlayback={true}
                startInLoadingState={true}
                renderError={() => (
                    <View
                        style={{
                            position: 'absolute',
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%',
                            width: '100%',
                            backgroundColor: 'white',
                        }}
                    >
                        <Text style={{ textAlign: 'center' }}>Sorry, the video failed to load</Text>
                    </View>
                )}
                onError={(syntheticEvent) => {
                    const { nativeEvent } = syntheticEvent
                    console.warn('WebView error: ', nativeEvent)
                }}
                source={{ uri: embedString }}
            />
        )
    }
    if (article.featuredImage) {
        const imageAspectRatio = article.featuredImage.height / article.featuredImage.width
        const maxImageAspectRatio = MAX_MEDIA_HEIGHT / MEDIA_WIDTH
        const MEDIA_HEIGHT = MEDIA_WIDTH * imageAspectRatio

        console.log('aspect rtatios', imageAspectRatio, maxImageAspectRatio)
        return (
            <ImageBackground
                source={{ uri: article.featuredImage.uri }}
                style={{
                    width: MEDIA_WIDTH,
                    height:
                        imageAspectRatio < maxImageAspectRatio ? MEDIA_HEIGHT : MAX_MEDIA_HEIGHT,
                    resizeMode: 'contain',
                }}
                resizeMode='contain'
            >
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'flex-end',
                    }}
                >
                    <View
                        style={{
                            backgroundColor: theme.colors.background,
                            padding: 10,
                            borderTopLeftRadius: 10,
                            borderTopRightRadius: 10,
                        }}
                    >
                        {article.featuredImage.caption ? (
                            <HTML
                                html={article.featuredImage.caption}
                                baseFontStyle={{ fontSize: 14, color: theme.colors.text }}
                                allowedStyles={[]}
                                customWrapper={(text) => {
                                    return (
                                        <Text
                                            ellipsizeMode='tail'
                                            numberOfLines={expandCaption ? 15 : 2}
                                            onPress={() => setExpandCaption(!expandCaption)}
                                        >
                                            {text}
                                        </Text>
                                    )
                                }}
                                tagsStyles={{
                                    rawtext: {
                                        fontSize: 14,
                                        color: theme.colors.text,
                                    },
                                }}
                            />
                        ) : null}
                        {article.featuredImage.photographer ? (
                            <TouchableItem
                                onPress={() => {
                                    _handleProfilePress(article.featuredImage.photographerTermId)
                                }}
                            >
                                <Text style={{ color: theme.colors.accent }}>
                                    {article.featuredImage.photographer[0]}
                                </Text>
                            </TouchableItem>
                        ) : null}
                    </View>
                </View>
            </ImageBackground>
        )
    } else {
        return null
    }
}

const styles = StyleSheet.create({
    imageInfo: {
        backgroundColor: 'rgba(0,0,0,0.55)',
        padding: 10,
    },
})

export default FeaturedMedia
