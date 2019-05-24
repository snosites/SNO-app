import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    WebView,
    ImageBackground,
    Dimensions,
    Platform,
    ActivityIndicator
} from 'react-native';

import Moment from 'moment';
import HTML from 'react-native-render-html';
import { WebBrowser, Haptic } from 'expo';

import TouchableItem from '../constants/TouchableItem';
import Slideshow from './Slideshow';
import { slideshowRenderer } from '../utils/slideshowRenderer';

Moment.updateLocale('en', {
    relativeTime: {
        d: "1 day",
    }
});

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

const MEDIASIZE = viewportHeight * 0.35;
const MEDIAWIDTH = viewportWidth * 0.90;


export default class ArticleBodyContent extends React.Component {

    render() {
        const { theme, article } = this.props;
        return (
            <View>
                <View style={styles.featuredMediaContainer}>
                    {this._renderFeaturedMedia(article)}
                </View>
                <View style={{ paddingHorizontal: 20, paddingTop: 10, alignItems: 'center' }}>
                    <HTML
                        html={article.title.rendered}
                        baseFontStyle={{ fontSize: 30 }}
                        allowedStyles={[]}
                        customWrapper={(text) => {
                            return (
                                <Text>{text}</Text>
                            )
                        }}
                        tagsStyles={{
                            rawtext: {
                                fontSize: 30,
                                fontWeight: 'bold',
                                textAlign: 'center',
                                paddingVertical: 10,
                                color: theme.dark ? 'white' : 'black'
                            }
                        }}
                    />
                    {article.custom_fields.sno_deck && article.custom_fields.sno_deck[0] ?
                        <HTML
                            html={article.custom_fields.sno_deck[0]}
                            baseFontStyle={{ fontSize: 22 }}
                            allowedStyles={[]}
                            customWrapper={(text) => {
                                return (
                                    <Text>{text}</Text>
                                )
                            }}
                            tagsStyles={{
                                rawtext: {
                                    fontSize: 22,
                                    textAlign: 'center',
                                    paddingVertical: 10,
                                    color: theme.dark ? 'white' : 'black'
                                }
                            }}
                        />
                        :
                        null
                    }
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center'
                    }}
                >
                    {this._renderArticleAuthor(article)}
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center', paddingTop: 10 }}>
                    {this._renderDate(article.date)}
                </View>
                {article.content.rendered ?
                    <View style={styles.articleContents}>
                        <HTML
                            html={article.content.rendered}
                            imagesMaxWidth={MEDIAWIDTH}
                            ignoredStyles={['height', 'width', 'display', 'font-family']}
                            allowedStyles={[]}
                            imagesInitialDimensions={{
                                width: MEDIAWIDTH
                            }}
                            textSelectable={true}
                            onLinkPress={(e, href) => this._viewLink(href)}
                            alterChildren={(node) => {
                                if (node.name === 'iframe') {
                                    delete node.attribs.width;
                                    delete node.attribs.height;

                                }
                                // if (node.attribs['data-photo-ids']){
                                //     console.log('node', node);
                                //     console.log('node attribs', node.attribs);
                                //     console.log('node children', node.children)

                                // }
                                return node.children;
                            }}
                            tagsStyles={{
                                p: {
                                    fontSize: 18,
                                    marginBottom: 15
                                },
                                img: {
                                    marginLeft: -20,
                                    height: MEDIASIZE,
                                    width: viewportWidth
                                },
                                iframe: {
                                    marginLeft: -20,
                                    height: MEDIASIZE,
                                    width: viewportWidth
                                }
                            }}
                            classesStyles={{
                                'pullquote': { backgroundColor: '#eeeeee', borderRadius: 8, padding: 10, marginBottom: 15 },
                                'largequote': { fontSize: 21 },
                                'pullquotetext': { textAlign: 'left', fontSize: 21 },
                                'quotespeaker': { textAlign: 'left', fontSize: 14 },
                                'photowrap': {
                                    display: 'none'
                                },
                                'wp-caption-text': {
                                    fontSize: 14, color: '#757575'
                                }
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
                            snsgallery: slideshowRenderer
                        }}
                        />
                    </View>
                    :
                    null
                }
            </View>
        )
    }

//     "<p>embed pull quote</p>
//         <p>& nbsp;</p >
//             <div class='pullquote left  background-gray shadow borderall sno-animate' style='border-color: #888888;'><div class='largequote' style='color: #888888;'>&ldquo;</div><p class='pullquotetext'>This is the pull quote that this person said This is the pull quote that this person said This is the pull quote that this person said&rdquo;</p><p class='quotespeaker'>&mdash; Travis</p></div>
//             <p>&nbsp;</p>
//             <p>embed related stories</p>
//             <div class='related relatedvert left  background-gray shadow borderall sno-animate' style='border-color: #888888;'><h5>Related Stories</h5><a href="https://travislang.snodemo.com/799/opinions/new-political-piece/" title="New political piece"><img src="https://travislang.snodemo.com/wp-content/uploads/2012/07/iStock_000017198608Small-240x150.jpg" style="width:100%" class="catboxphoto" alt="New political piece" /></a><h5 class="relatedtitle"><a href="https://travislang.snodemo.com/799/opinions/new-political-piece/">New political piece</a></h5><div class='relateddivider'></div><a href="https://travislang.snodemo.com/756/entertainment/new-entertainment-article/" title="New Entertainment Article"><img src="https://travislang.snodemo.com/wp-content/uploads/2019/04/paint-240x150.jpg" style="width:100%" class="catboxphoto" alt="New Entertainment Article" /></a><h5 class="relatedtitle"><a href="https://travislang.snodemo.com/756/entertainment/new-entertainment-article/">New Entertainment Article</a></h5><div class='relateddivider'></div><h5 class="relatedtitle"><a href="https://travislang.snodemo.com/791/showcase/new-showcase-article/">new showcase article</a></h5><div class="clear"></div></div>
//             <p>test embed video iframe</p>
//             <div id='video7658' style="opacity:.4" class='videowidget left  background-white' style='border-color: #888888;'><div class='embedcontainer'><iframe width="560" height="315" src="https://www.youtube.com/embed/4FpgcX7tqho" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>travis</div> <script type='text/javascript'>
//                 $(document).ready(function() {
//                     $(function () {
//                         $(window).scroll(function () {
//                             var scrollTop7658 = $(window).scrollTop(),
//                                 elementOffset7658 = $('#video7658').offset().top,
//                                 distance7658 = (elementOffset7658 - scrollTop7658);
//                             if ((distance7658 < 400) && (distance7658 > 80)) {
//                                 $('#video7658').stop().animate({ 'opacity': '1' }, 'slow');

//                             } else {
//                                 $('#video7658').stop().animate({ 'opacity': '.4' }, 'slow');
//                             }


//                         });
//                     })

//                 })
// </script>

//             <p>test video embed link</p>
//             <div id='video2587' style="opacity:.4" class='videowidget left  background-white' style='border-color: #888888;'><div class='embedcontainer'>https://www.youtube.com/watch?v=4FpgcX7tqho</div>trav</div> <script type='text/javascript'>
//                 $(document).ready(function() {
//                     $(function () {
//                         $(window).scroll(function () {
//                             var scrollTop2587 = $(window).scrollTop(),
//                                 elementOffset2587 = $('#video2587').offset().top,
//                                 distance2587 = (elementOffset2587 - scrollTop2587);
//                             if ((distance2587 < 400) && (distance2587 > 80)) {
//                                 $('#video2587').stop().animate({ 'opacity': '1' }, 'slow');

//                             } else {
//                                 $('#video2587').stop().animate({ 'opacity': '.4' }, 'slow');
//                             }


//                         });
//                     })

//                 })
// </script>

//             <p>embed image</p>
//             <div id="attachment_415" style="width: 1010px" class="wp-caption alignnone"><img aria-describedby="caption-attachment-415" class="size-full wp-image-415" src="http://travislang.snodemo.com/wp-content/uploads/2013/12/tX5skae4XTfZstVA7A68_qdLW7-41fO_mxVf_7-XKlM.jpg" alt="" width="1000" height="665" srcset="https://travislang.snodemo.com/wp-content/uploads/2013/12/tX5skae4XTfZstVA7A68_qdLW7-41fO_mxVf_7-XKlM.jpg 1000w, https://travislang.snodemo.com/wp-content/uploads/2013/12/tX5skae4XTfZstVA7A68_qdLW7-41fO_mxVf_7-XKlM-475x315.jpg 475w, https://travislang.snodemo.com/wp-content/uploads/2013/12/tX5skae4XTfZstVA7A68_qdLW7-41fO_mxVf_7-XKlM-950x631.jpg 950w, https://travislang.snodemo.com/wp-content/uploads/2013/12/tX5skae4XTfZstVA7A68_qdLW7-41fO_mxVf_7-XKlM-122x80.jpg 122w" sizes="(max-width: 1000px) 100vw, 1000px" /><p id="caption-attachment-415" class="wp-caption-text"><span class="photocreditinline">Photographer</span><br />Caption goes here.</p></div>
//             <p>&nbsp;</p>
//             <p>embed slideshow</p>
//             <snsgallery data-photo-ids="602,410,403,453,197"></snsgallery
// <p>&nbsp;</p>
//             <p>&nbsp;</p>
//             <p>&nbsp;</p>
// "

    _renderFeaturedMedia = article => {
        const { theme, handleCaptionClick } = this.props;
        if (article.slideshow) {
            return (
                <Slideshow accentColor={theme.colors.accent} images={article.slideshow} />
            )
        }

        else if (article.custom_fields.video && article.custom_fields.video[0]) {
            const source = article.custom_fields.video[0];
            if (source.includes('iframe')) {

                let regex = /<iframe.*?src="(.*?)"/;
                var src = regex.exec(source)[1];

                // console.log('reg ex', src)
                return (
                    <WebView
                        scalesPageToFit={true}
                        automaticallyAdjustContentInsets={false}
                        scrollEnabled={false}
                        bounces={false}
                        originWhitelist={["*"]}
                        allowsInlineMediaPlayback={true}
                        javaScriptEnabled
                        startInLoadingState={true}
                        renderLoading={() => (<View
                            style={{
                                flex: 1,
                                height: MEDIASIZE,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <ActivityIndicator />
                        </View>)}
                        renderError={() => (<View
                            style={{
                                flex: 1,
                                height: MEDIASIZE,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Text style={{ textAlign: 'center' }}>Sorry, the video failed to load</Text>
                        </View>)}
                        style={{ flex: 1, height: MEDIASIZE }}
                        source={{ uri: src }}
                    />
                )
            }
            let embedString = source.replace('watch?v=', 'embed/');

            return <WebView
                scalesPageToFit={true}
                automaticallyAdjustContentInsets={false}
                scrollEnabled={false}
                bounces={false}
                originWhitelist={["*"]}
                allowsInlineMediaPlayback={true}
                javaScriptEnabled
                startInLoadingState={true}
                renderLoading={() => (<View
                    style={{
                        flex: 1,
                        height: MEDIASIZE,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <ActivityIndicator />
                </View>)}
                renderError={() => (<View
                    style={{
                        flex: 1,
                        height: MEDIASIZE,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Text style={{ textAlign: 'center' }}>Sorry, the video failed to load</Text>
                </View>)}
                style={{ flex: 1, height: MEDIASIZE }}
                source={{ uri: embedString }}
            />
        }

        else if (article.featuredImage) {
            return (
                <ImageBackground
                    source={{ uri: article.featuredImage.uri }}
                    style={styles.featuredImage}
                >
                    <View style={styles.imageInfoContainer}>
                        <View style={styles.imageInfo}>
                            {article.featuredImage.caption ?
                                <HTML
                                    html={article.featuredImage.caption}
                                    baseFontStyle={{ fontSize: 12 }}
                                    allowedStyles={[]}
                                    customWrapper={(text) => {
                                        return (
                                            <Text ellipsizeMode='tail' numberOfLines={this.props.expandCaption ? null : 2} onPress={handleCaptionClick}>{text}</Text>
                                        )
                                    }}
                                    tagsStyles={{
                                        rawtext: {
                                            fontSize: 12,
                                            color: 'white'
                                        }
                                    }}
                                />
                                :
                                null
                            }
                            {article.featuredImage.photographer ?
                                <Text style={{ color: '#bdbdbd' }}>
                                    {article.featuredImage.photographer[0]}
                                </Text>
                                :
                                null
                            }
                        </View>
                    </View>
                </ImageBackground>
            )
        } else {
            return;
        }
    }

    _handleProfilePress = writerName => {
        const { navigation } = this.props;
        if (Platform.OS === 'ios') {
            Haptic.selection();
        }
        navigation.navigate('Profile', {
            writerName
        })
    }

    _renderArticleAuthor = article => {
        const { theme } = this.props;
        if (article.custom_fields.writer && article.custom_fields.writer[0]) {
            let writers = article.custom_fields.writer;
            //if arr of writers dont include job title
            if (writers.length > 1) {
                return writers.map((writer, i) => {
                    if (i === writers.length - 2) {
                        return (
                            <TouchableItem key={i} onPress={() => this._handleProfilePress(writer)}>
                                <Text style={{
                                    fontSize: 17,
                                    textAlign: 'center',
                                    paddingTop: 20,
                                    color: theme.colors.accent
                                }}>
                                    {`${writer} & `}
                                </Text>
                            </TouchableItem>
                        )
                    }
                    else if (i === writers.length - 1) {
                        return (
                            <TouchableItem key={i} onPress={() => this._handleProfilePress(writer)}>
                                <Text style={{
                                    fontSize: 17,
                                    textAlign: 'center',
                                    paddingTop: 20,
                                    color: theme.colors.accent
                                }}>
                                    {writer}
                                </Text>
                            </TouchableItem>
                        )
                    } else {
                        return (
                            <TouchableItem key={i} onPress={() => this._handleProfilePress(writer)}>
                                <Text style={{
                                    fontSize: 17,
                                    textAlign: 'center',
                                    paddingTop: 20,
                                    color: theme.colors.accent
                                }}>
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
                    <TouchableItem onPress={() => this._handleProfilePress(article.custom_fields.writer[0])}>
                        <Text style={{
                            fontSize: 17,
                            textAlign: 'center',
                            paddingTop: 20,
                            color: theme.colors.accent
                        }}>
                            {`${article.custom_fields.writer[0]} | ${article.custom_fields.jobtitle[0]}`}
                        </Text>
                    </TouchableItem>
                )
            }
            // otherwise just display writer
            else {
                return (
                    <TouchableItem onPress={() => this._handleProfilePress(article.custom_fields.writer[0])}>
                        <Text style={{
                            fontSize: 17,
                            textAlign: 'center',
                            paddingTop: 20,
                            color: theme.colors.accent
                        }}>
                            {`${article.custom_fields.writer[0]}`}
                        </Text>
                    </TouchableItem>
                )
            }
        }
        else {
            return null
        }
    }

    _renderDate = date => {
        if (Moment().isAfter(Moment(date).add(7, 'days'))) {
            return (
                <Text style={{
                    fontSize: 15,
                    color: '#9e9e9e'
                }}
                >
                    {Moment(date).format('MMM D, YYYY')}
                </Text>
            )
        } else {
            return (
                <Text style={{
                    fontSize: 15,
                    color: '#9e9e9e'
                }}
                >
                    {String(Moment(date).fromNow())}
                </Text>
            )
        }
    }

    _viewLink = async (href) => {
        let result = await WebBrowser.openBrowserAsync(href);
    }

}

const styles = StyleSheet.create({
    featuredMediaContainer: {
        flex: 1,
    },
    articleContents: {
        padding: 20,
    },
    featuredImage: {
        height: MEDIASIZE,
        resizeMode: 'cover'
    },
    imageInfoContainer: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    imageInfo: {
        backgroundColor: 'rgba(0,0,0,0.55)',
        padding: 10,
    },
})