import React from 'react'
import { Text, View, ScrollView, useWindowDimensions } from 'react-native'

import Moment from 'moment'
import HTML from 'react-native-render-html'

import { slideshowRenderer, relatedRenderer, adBlockRenderer } from '../../utils/Renderers'

import AdBlock from '../../components/AdBlock'

import FeaturedMedia from './FeaturedMedia'
import ArticleAuthors from './ArticleAuthors'

import { Html5Entities } from 'html-entities'

const entities = new Html5Entities()

Moment.updateLocale('en', {
    relativeTime: {
        d: '1 day',
    },
})

const ArticleContent = (props) => {
    const {
        navigation,
        theme,
        article,
        onLayout = () => {},
        onLinkPress = (href) => {},
        ad,
        snoAd,
        adPosition,
    } = props

    const viewportWidth = useWindowDimensions().width

    const MEDIAWIDTH = viewportWidth * 0.9
    const MEDIA_HEIGHT = useWindowDimensions().height * 0.35

    const _renderDate = (date) => {
        if (Moment().isAfter(Moment(date).add(7, 'days'))) return Moment(date).format('MMM D, YYYY')
        return String(Moment(date).fromNow())
    }

    return (
        <View>
            <View
                style={{ flex: 0, height: MEDIA_HEIGHT, backgroundColor: theme.colors.background }}
            >
                <FeaturedMedia navigation={navigation} article={article} theme={theme} />
            </View>
            <View
                style={{
                    paddingHorizontal: 20,
                    paddingTop: 10,
                    alignItems: 'center',
                }}
                onLayout={(e) => onLayout(e)}
            >
                <Text
                    style={{
                        fontSize: 30,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        paddingTop: 10,
                        color: theme.colors.text,
                    }}
                >
                    {entities.decode(article.title?.rendered)}
                </Text>
                {article.custom_fields.sno_deck && article.custom_fields.sno_deck[0] ? (
                    <Text
                        style={{
                            fontSize: 22,
                            textAlign: 'center',
                            paddingVertical: 10,
                            color: theme.colors.text,
                        }}
                    >
                        {entities.decode(article.custom_fields.sno_deck[0])}
                    </Text>
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
                <ArticleAuthors navigation={navigation} article={article} theme={theme} />
            </View>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    paddingTop: 10,
                }}
            >
                <Text
                    style={{
                        fontSize: 15,
                        color: '#9e9e9e',
                    }}
                >
                    {_renderDate(article.date)}
                </Text>
            </View>
            {ad && adPosition === 'beginning' ? (
                <AdBlock image={ad} themeIsDark={theme.dark} />
            ) : null}
            {article.content.rendered ? (
                <View style={{ padding: 20 }}>
                    <HTML
                        html={article.content.rendered}
                        imagesMaxWidth={MEDIAWIDTH}
                        ignoredStyles={['height', 'width', 'display', 'font-family']}
                        allowedStyles={[]}
                        imagesInitialDimensions={{
                            width: MEDIAWIDTH,
                        }}
                        textSelectable={true}
                        onLinkPress={(e, href) => {
                            onLinkPress(href)
                        }}
                        alterChildren={(node) => {
                            if (node.name === 'iframe') {
                                delete node.attribs.width
                                delete node.attribs.height
                            }
                            return node.children
                        }}
                        tagsStyles={{
                            p: {
                                fontSize: 18,
                                marginBottom: 15,
                                color: theme.colors.text,
                            },
                            img: {
                                marginLeft: -20,
                                width: MEDIAWIDTH,
                                resizeMode: 'cover',
                            },
                            iframe: {
                                marginLeft: -20,
                                height: MEDIA_HEIGHT,
                                width: MEDIAWIDTH,
                            },
                            a: {
                                fontSize: 18,
                                color: theme.colors.accent,
                            },
                        }}
                        classesStyles={{
                            pullquote: {
                                backgroundColor: '#eeeeee',
                                borderRadius: 8,
                                padding: 10,
                                marginBottom: 15,
                            },
                            largequote: { fontSize: 21, color: theme.colors.text },
                            pullquotetext: {
                                textAlign: 'left',
                                fontSize: 21,
                                color: theme.colors.text,
                            },
                            quotespeaker: {
                                textAlign: 'left',
                                fontSize: 14,
                                color: theme.colors.text,
                            },
                            photowrap: {
                                display: 'none',
                            },
                            'wp-caption-text': {
                                fontSize: 14,
                                color: '#757575',
                            },
                        }}
                        onParsed={(dom, RNElements) => {
                            // snoAd is always in the middle
                            if (snoAd) {
                                console.log('rendering ad block for sno ad')
                                const ad = {
                                    wrapper: null,
                                    tagName: 'adBlock',
                                    attribs: {},
                                    parent: false,
                                    parentTag: false,
                                    nodeIndex: Math.floor(RNElements.length / 2),
                                }
                                // // Insert the component
                                RNElements.splice(Math.floor(RNElements.length / 2), 0, ad)

                                return RNElements
                            }
                            if (!ad || !adPosition || adPosition !== 'middle') return RNElements

                            // Find the index of the first paragraph
                            const ad = {
                                wrapper: null,
                                tagName: 'adBlock',
                                attribs: {},
                                parent: false,
                                parentTag: false,
                                nodeIndex: Math.floor(RNElements.length / 2),
                            }
                            // // Insert the component
                            RNElements.splice(Math.floor(RNElements.length / 2), 0, ad)

                            return RNElements
                        }}
                        renderers={{
                            snsgallery: slideshowRenderer,
                            snsrelated: relatedRenderer,
                            adBlock: adBlockRenderer,
                        }}
                        renderersProps={{
                            adImage: ad,
                            snoAdImage: snoAd,
                            backgroundColor: theme.colors.background,
                            themeIsDark: theme.dark,
                        }}
                    />
                </View>
            ) : null}
            {ad && adPosition === 'end' ? <AdBlock image={ad} themeIsDark={theme.dark} /> : null}
        </View>
    )
}

export default ArticleContent
