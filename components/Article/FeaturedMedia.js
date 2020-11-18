import React, { useState } from 'react'
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    Dimensions,
    ScrollView,
    Platform,
    ActivityIndicator,
    TouchableWithoutFeedback,
} from 'react-native'

import Moment from 'moment'
import HTML from 'react-native-render-html'
import * as Haptics from 'expo-haptics'
import * as WebBrowser from 'expo-web-browser'
import { WebView } from 'react-native-webview'

import TouchableItem from '../../constants/TouchableItem'
import Slideshow from '../../views/Slideshow'

import { Html5Entities } from 'html-entities'
import theme from '../../redux/theme'

const entities = new Html5Entities()

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window')

const MEDIASIZE = viewportHeight * 0.35
const MEDIAWIDTH = viewportWidth * 0.9

const FeaturedMedia = ({ navigation, article, theme }) => {
    const [expandCaption, setExpandCaption] = useState(false)

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
            var src = regex.exec(source)[1]

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
                            <Text style={{ textAlign: 'center' }}>
                                Sorry, the video failed to load
                            </Text>
                        </View>
                    )}
                    onError={(syntheticEvent) => {
                        const { nativeEvent } = syntheticEvent
                        console.warn('WebView error: ', nativeEvent)
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
        return (
            <ImageBackground
                source={{ uri: article.featuredImage.uri }}
                style={styles.featuredImage}
                resizeMode='contain'
            >
                <View style={styles.imageInfoContainer}>
                    <View style={styles.imageInfo}>
                        {article.featuredImage.caption ? (
                            <HTML
                                html={article.featuredImage.caption}
                                baseFontStyle={{ fontSize: 14 }}
                                allowedStyles={[]}
                                customWrapper={(text) => {
                                    return (
                                        <Text
                                            ellipsizeMode='tail'
                                            numberOfLines={expandCaption ? null : 2}
                                            onPress={() => setExpandCaption(!expandCaption)}
                                        >
                                            {text}
                                        </Text>
                                    )
                                }}
                                tagsStyles={{
                                    rawtext: {
                                        fontSize: 14,
                                        color: 'white',
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
    featuredMediaContainer: {
        // flex: 0,
        height: MEDIASIZE,
        backgroundColor: 'black',
    },
    featuredImage: {
        width: viewportWidth,
        height: MEDIASIZE,
        resizeMode: 'contain',
    },
    imageInfoContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    imageInfo: {
        backgroundColor: 'rgba(0,0,0,0.55)',
        padding: 10,
    },
})

export default FeaturedMedia
