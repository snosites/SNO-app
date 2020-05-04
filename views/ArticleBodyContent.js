import React from 'react'
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    Dimensions,
    ScrollView,
    Platform,
    ActivityIndicator,
} from 'react-native'

import Moment from 'moment'
import HTML from 'react-native-render-html'
import * as Haptics from 'expo-haptics'
import * as WebBrowser from 'expo-web-browser'
import { WebView } from 'react-native-webview'

import TouchableItem from '../constants/TouchableItem'
import Slideshow from './Slideshow'
import { slideshowRenderer, relatedRenderer } from '../utils/Renderers'

Moment.updateLocale('en', {
    relativeTime: {
        d: '1 day',
    },
})

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window')

const MEDIASIZE = viewportHeight * 0.35
const MEDIAWIDTH = viewportWidth * 0.9

export default class ArticleBodyContent extends React.Component {
    render() {
        const { theme, article } = this.props
        return (
            <View>
                <View style={styles.featuredMediaContainer}>
                    {this._renderFeaturedMedia(article)}
                </View>
                <View
                    style={{
                        paddingHorizontal: 20,
                        paddingTop: 10,
                        alignItems: 'center',
                    }}
                >
                    <HTML
                        html={article.title.rendered}
                        baseFontStyle={{ fontSize: 30 }}
                        allowedStyles={[]}
                        customWrapper={(text) => {
                            return <Text>{text}</Text>
                        }}
                        tagsStyles={{
                            rawtext: {
                                fontSize: 30,
                                fontWeight: 'bold',
                                textAlign: 'center',
                                paddingVertical: 10,
                                color: theme.dark ? 'white' : 'black',
                            },
                        }}
                    />
                    {article.custom_fields.sno_deck && article.custom_fields.sno_deck[0] ? (
                        <HTML
                            html={article.custom_fields.sno_deck[0]}
                            baseFontStyle={{ fontSize: 22 }}
                            allowedStyles={[]}
                            customWrapper={(text) => {
                                return <Text>{text}</Text>
                            }}
                            tagsStyles={{
                                rawtext: {
                                    fontSize: 22,
                                    textAlign: 'center',
                                    paddingVertical: 10,
                                    color: theme.dark ? 'white' : 'black',
                                },
                            }}
                        />
                    ) : null}
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        flexWrap: 'wrap',
                    }}
                >
                    {this._renderArticleAuthor(article)}
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        paddingTop: 10,
                    }}
                >
                    {this._renderDate(article.date)}
                </View>
                {article.content.rendered ? (
                    <View style={styles.articleContents}>
                        <ScrollView>
                            <HTML
                                html={article.content.rendered}
                                imagesMaxWidth={viewportWidth}
                                ignoredStyles={['height', 'width', 'display', 'font-family']}
                                allowedStyles={[]}
                                imagesInitialDimensions={{
                                    width: viewportWidth,
                                }}
                                textSelectable={true}
                                onLinkPress={(e, href) => this._viewLink(href)}
                                //TODO: keep stories links in app if in app menu
                                alterChildren={(node) => {
                                    if (node.name === 'iframe') {
                                        console.log('node', node)
                                        delete node.attribs.width
                                        delete node.attribs.height
                                    }
                                    return node.children
                                }}
                                tagsStyles={{
                                    p: {
                                        fontSize: 18,
                                        marginBottom: 15,
                                    },
                                    img: {
                                        marginLeft: -20,
                                        // height: MEDIASIZE,
                                        width: viewportWidth,
                                        resizeMode: 'cover',
                                    },
                                    iframe: {
                                        marginLeft: -20,
                                        height: MEDIASIZE,
                                        width: viewportWidth,
                                    },
                                }}
                                classesStyles={{
                                    pullquote: {
                                        backgroundColor: '#eeeeee',
                                        borderRadius: 8,
                                        padding: 10,
                                        marginBottom: 15,
                                    },
                                    largequote: { fontSize: 21 },
                                    pullquotetext: { textAlign: 'left', fontSize: 21 },
                                    quotespeaker: { textAlign: 'left', fontSize: 14 },
                                    photowrap: {
                                        display: 'none',
                                    },
                                    'wp-caption-text': {
                                        fontSize: 14,
                                        color: '#757575',
                                    },
                                }}
                                // alterNode={(node) => {
                                //     if (node.attribs && node.attribs['data-photo-ids']) {
                                //         return {
                                //             attribs: {
                                //                 class: "photowrap",
                                //                 ['data-photo-ids']: "602,410,403,453,197"
                                //             },
                                //             children: [],
                                //             name: "snsgallery",
                                //             next: {},
                                //             parent: null,
                                //             prev: {},
                                //             type: "tag"
                                //         }

                                //     }
                                //     return node
                                // }}
                                renderers={{
                                    snsgallery: slideshowRenderer,
                                    snsrelated: relatedRenderer,
                                }}
                            />
                        </ScrollView>
                    </View>
                ) : null}
            </View>
        )
    }

    _renderFeaturedMedia = (article) => {
        const { theme, handleCaptionClick } = this.props
        if (article.slideshow && article.slideshow.length) {
            return <Slideshow accentColor={theme.colors.accent} images={article.slideshow} />
        } else if (article.custom_fields.video && article.custom_fields.video[0]) {
            const source = article.custom_fields.video[0]
            if (source.includes('iframe')) {
                let regex = /<iframe.*?src="(.*?)"/
                var src = regex.exec(source)[1]

                // console.log('reg ex', src)
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
                            <Text style={{ textAlign: 'center' }}>
                                Sorry, the video failed to load
                            </Text>
                        </View>
                    )}
                    onError={(syntheticEvent) => {
                        const { nativeEvent } = syntheticEvent
                        console.warn('WebView error: ', nativeEvent)
                    }}
                    source={{ uri: embedString }}
                />
            )
        } else if (article.featuredImage) {
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
                                    baseFontStyle={{ fontSize: 12 }}
                                    allowedStyles={[]}
                                    customWrapper={(text) => {
                                        return (
                                            <Text
                                                ellipsizeMode='tail'
                                                numberOfLines={this.props.expandCaption ? null : 2}
                                                onPress={handleCaptionClick}
                                            >
                                                {text}
                                            </Text>
                                        )
                                    }}
                                    tagsStyles={{
                                        rawtext: {
                                            fontSize: 12,
                                            color: 'white',
                                        },
                                    }}
                                />
                            ) : null}
                            {article.featuredImage.photographer ? (
                                <TouchableItem
                                    onPress={() => {
                                        this._handleProfilePress(
                                            article.featuredImage.photographerTermId
                                        )
                                    }}
                                >
                                    <Text style={{ color: '#bdbdbd' }}>
                                        {article.featuredImage.photographer[0]}
                                    </Text>
                                </TouchableItem>
                            ) : null}
                        </View>
                    </View>
                </ImageBackground>
            )
        } else {
            return
        }
    }

    _handleProfilePress = (writerId) => {
        const { navigation } = this.props
        Haptics.selectionAsync()
        navigation.navigate('Profile', {
            writerTermId: writerId,
        })
    }

    _renderArticleAuthor = (article) => {
        const { theme } = this.props
        if (article.custom_fields.terms && article.custom_fields.terms[0]) {
            let writers = article.custom_fields.terms
            //if arr of writers dont include job title
            if (writers.length > 1) {
                return writers.map((writer, i) => {
                    if (i === writers.length - 2) {
                        return (
                            <TouchableItem
                                key={i}
                                onPress={() => this._handleProfilePress(writer.term_id)}
                            >
                                <Text
                                    style={{
                                        fontSize: 17,
                                        textAlign: 'center',
                                        paddingTop: 20,
                                        color: theme.colors.accent,
                                    }}
                                >
                                    {`${writer.name} & `}
                                </Text>
                            </TouchableItem>
                        )
                    } else if (i === writers.length - 1) {
                        return (
                            <TouchableItem
                                key={i}
                                onPress={() => this._handleProfilePress(writer.term_id)}
                            >
                                <Text
                                    style={{
                                        fontSize: 17,
                                        textAlign: 'center',
                                        paddingTop: 20,
                                        color: theme.colors.accent,
                                    }}
                                >
                                    {writer.name}
                                </Text>
                            </TouchableItem>
                        )
                    } else {
                        return (
                            <TouchableItem
                                key={i}
                                onPress={() => this._handleProfilePress(writer.term_id)}
                            >
                                <Text
                                    style={{
                                        fontSize: 17,
                                        textAlign: 'center',
                                        paddingTop: 20,
                                        color: theme.colors.accent,
                                    }}
                                >
                                    {`${writer.name}, `}
                                </Text>
                            </TouchableItem>
                        )
                    }
                })
            }
            // if writer has a jobtitle include it
            if (article.custom_fields.jobtitle) {
                return (
                    <TouchableItem
                        onPress={() =>
                            this._handleProfilePress(article.custom_fields.terms[0].term_id)
                        }
                    >
                        <Text
                            style={{
                                fontSize: 17,
                                textAlign: 'center',
                                paddingTop: 20,
                                color: theme.colors.accent,
                            }}
                        >
                            {`${article.custom_fields.terms[0].name} | ${article.custom_fields.jobtitle[0]}`}
                        </Text>
                    </TouchableItem>
                )
            }
            // otherwise just display writer
            else {
                return (
                    <TouchableItem
                        onPress={() =>
                            this._handleProfilePress(article.custom_fields.terms[0].term_id)
                        }
                    >
                        <Text
                            style={{
                                fontSize: 17,
                                textAlign: 'center',
                                paddingTop: 20,
                                color: theme.colors.accent,
                            }}
                        >
                            {`${article.custom_fields.terms[0].name}`}
                        </Text>
                    </TouchableItem>
                )
            }
        } else if (article.custom_fields.writer && article.custom_fields.writer[0]) {
            let writers = article.custom_fields.writer
            //if arr of writers dont include job title
            if (writers.length > 1) {
                return writers.map((writer, i) => {
                    if (i === writers.length - 2) {
                        return (
                            <TouchableItem key={i} onPress={() => this._handleProfilePress(null)}>
                                <Text
                                    style={{
                                        fontSize: 17,
                                        textAlign: 'center',
                                        paddingTop: 20,
                                        color: theme.colors.accent,
                                    }}
                                >
                                    {`${writer} & `}
                                </Text>
                            </TouchableItem>
                        )
                    } else if (i === writers.length - 1) {
                        return (
                            <TouchableItem key={i} onPress={() => this._handleProfilePress(null)}>
                                <Text
                                    style={{
                                        fontSize: 17,
                                        textAlign: 'center',
                                        paddingTop: 20,
                                        color: theme.colors.accent,
                                    }}
                                >
                                    {writer}
                                </Text>
                            </TouchableItem>
                        )
                    } else {
                        return (
                            <TouchableItem key={i} onPress={() => this._handleProfilePress(null)}>
                                <Text
                                    style={{
                                        fontSize: 17,
                                        textAlign: 'center',
                                        paddingTop: 20,
                                        color: theme.colors.accent,
                                    }}
                                >
                                    {`${writer}, `}
                                </Text>
                            </TouchableItem>
                        )
                    }
                })
            }
            // if writer has a jobtitle include it
            if (article.custom_fields.jobtitle) {
                return (
                    <TouchableItem onPress={() => this._handleProfilePress(null)}>
                        <Text
                            style={{
                                fontSize: 17,
                                textAlign: 'center',
                                paddingTop: 20,
                                color: theme.colors.accent,
                            }}
                        >
                            {`${article.custom_fields.writer[0]} | ${article.custom_fields.jobtitle[0]}`}
                        </Text>
                    </TouchableItem>
                )
            }
            // otherwise just display writer
            else {
                return (
                    <TouchableItem onPress={() => this._handleProfilePress()}>
                        <Text
                            style={{
                                fontSize: 17,
                                textAlign: 'center',
                                paddingTop: 20,
                                color: theme.colors.accent,
                            }}
                        >
                            {`${article.custom_fields.writer[0]}`}
                        </Text>
                    </TouchableItem>
                )
            }
        } else {
            return null
        }
    }

    _renderDate = (date) => {
        if (Moment().isAfter(Moment(date).add(7, 'days'))) {
            return (
                <Text
                    style={{
                        fontSize: 15,
                        color: '#9e9e9e',
                    }}
                >
                    {Moment(date).format('MMM D, YYYY')}
                </Text>
            )
        } else {
            return (
                <Text
                    style={{
                        fontSize: 15,
                        color: '#9e9e9e',
                    }}
                >
                    {String(Moment(date).fromNow())}
                </Text>
            )
        }
    }

    _viewLink = async (href) => {
        let result = await WebBrowser.openBrowserAsync(href)
    }
}

const styles = StyleSheet.create({
    featuredMediaContainer: {
        flex: 0,
        height: MEDIASIZE,
        backgroundColor: 'black',
    },
    articleContents: {
        padding: 20,
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
