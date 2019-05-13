import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    WebView,
    ImageBackground,
    Dimensions,
    Share,
    Platform,
} from 'react-native';
import Moment from 'moment';
import { connect } from 'react-redux';
import { NavigationEvents, SafeAreaView } from 'react-navigation';
import HTML from 'react-native-render-html';
import Slideshow from '../constants/Slideshow';
import { withTheme } from 'react-native-paper';
import { Permissions, MediaLibrary, WebBrowser, Haptic } from 'expo';
import { saveArticle } from '../redux/actions/actions';

import { FAB, Portal, Snackbar } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import TouchableItem from '../constants/TouchableItem';
import { CustomArticleHeader } from '../components/ArticleHeader';
import { theme } from '../redux/reducers/reducers';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

const MEDIASIZE = viewportHeight * 0.32;
const MEDIAWIDTH = viewportWidth * 0.90;

class FullArticleScreen extends React.Component {
    static navigationOptions = ({ navigation, navigation: { state } }) => {
        return {
            headerTitle: <CustomArticleHeader state={state} navigation={navigation} />
        };
    };

    state = {
        fabOpen: false,
        showPortal: true,
        snackbarSavedVisible: false,
        expandCaption: false
    };

    //     "<p>long form 1 chapter 2 text</p>
    // <p><img src="http://travislang.snodemo.com/wp-content/uploads/2019/04/1077120e27b3ef20b48e4a693acdc081.jpg" alt="" width="844" height="1501" class="alignnone size-full wp-image-602" srcset="https://travislang.snodemo.com/wp-content/uploads/2019/04/1077120e27b3ef20b48e4a693acdc081.jpg 844w, https://travislang.snodemo.com/wp-content/uploads/2019/04/1077120e27b3ef20b48e4a693acdc081-267x475.jpg 267w, https://travislang.snodemo.com/wp-content/uploads/2019/04/1077120e27b3ef20b48e4a693acdc081-768x1366.jpg 768w, https://travislang.snodemo.com/wp-content/uploads/2019/04/1077120e27b3ef20b48e4a693acdc081-506x900.jpg 506w, https://travislang.snodemo.com/wp-content/uploads/2019/04/1077120e27b3ef20b48e4a693acdc081-300x534.jpg 300w" sizes="(max-width: 844px) 100vw, 844px" /></p>
    // <div class='pullquote left  background-gray shadow borderall sno-animate' style='border-color: #888888;'><div class='largequote' style='color: #888888;'>&ldquo;</div><p class='pullquotetext'>this is a pull quote&rdquo;</p><p class='quotespeaker'>&mdash; Travis L</p></div>
    // "

    render() {
        const { navigation, theme } = this.props;
        const { snackbarSavedVisible } = this.state;
        let article = navigation.getParam('article', 'loading')
        console.log('article', article)
        return (
            <ScrollView style={styles.storyContainer}>
                <NavigationEvents
                    onDidFocus={() => this.setState({
                        showPortal: true
                    })}
                    onWillBlur={() => this.setState({
                        showPortal: false,
                        expandCaption: false
                    })}
                />
                {article !== 'loading' &&
                    <View style={styles.featuredMediaContainer}>
                        {this._renderFeaturedMedia(article)}
                    </View>
                }
                <HTML
                    html={article.title.rendered}
                    baseFontStyle={{ fontSize: 30 }}
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
                            paddingHorizontal: 10,
                            color: theme.dark ? 'white' : 'black'
                        }
                    }}
                />
                {article.custom_fields.sno_deck &&
                    <HTML
                        html={article.custom_fields.sno_deck[0]}
                        baseFontStyle={{ fontSize: 22 }}
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
                                paddingHorizontal: 10,
                                color: theme.dark ? 'white' : 'black'
                            }
                        }}
                    />
                }
                <TouchableItem onPress={() => this._handleProfilePress(article)}>
                    <Text style={{
                        fontSize: 17,
                        textAlign: 'center',
                        paddingTop: 20,
                        color: theme.colors.accent
                    }}>
                        {this._getArticleAuthor()}
                    </Text>
                </TouchableItem>
                <View style={{ flexDirection: 'row', justifyContent: 'center', paddingTop: 10 }}>
                    {this._renderDate(article.date)}
                </View>
                <View style={styles.articleContents}>
                    <HTML
                        html={article.content.rendered}
                        imagesMaxWidth={Dimensions.get('window').width}
                        ignoredStyles={['height', 'width', 'display']}
                        textSelectable={true}
                        onLinkPress={(e, href) => this._viewLink(href)}
                        tagsStyles={{
                            p: {
                                fontSize: 18,
                                marginBottom: 15
                            },
                            img: {
                                height: MEDIASIZE,
                                width: MEDIAWIDTH,
                                borderRadius: 8
                            }
                        }}
                        classesStyles={{
                            'pullquote': { backgroundColor: '#eeeeee', borderRadius: 8, padding: 10, marginBottom: 15 },
                            'largequote': { fontSize: 21 },
                            'pullquotetext': { textAlign: 'left', fontSize: 21 },
                            'quotespeaker': { textAlign: 'left', fontSize: 14 },
                            'photowrap': {
                                display: 'none'
                            }
                        }}
                    />
                </View>
                {this._renderChapters(article)}

                {this.state.showPortal && <Portal>
                    <SafeAreaView style={{ flex: 1 }}>
                        <Snackbar
                            visible={snackbarSavedVisible}
                            style={styles.snackbar}
                            duration={3000}
                            onDismiss={() => this.setState({ snackbarSavedVisible: false })}
                            action={{
                                label: 'Dismiss',
                                onPress: () => {
                                    this.setState({ snackbarSavedVisible: false })
                                }
                            }}
                        >
                            Article Added To Saved List
                        </Snackbar>
                        <FAB.Group
                            style={{ marginBottom: snackbarSavedVisible ? 100 : 50 }}
                            open={this.state.fabOpen}
                            icon={this.state.fabOpen ? 'clear' : 'add'}
                            actions={[
                                {
                                    icon: 'comment', label: 'Comment', onPress: () => navigation.navigate('Comments', {
                                        comments: article.comments
                                    })
                                },
                                {
                                    icon: 'send', label: 'Share', onPress: () => {
                                        this._shareArticle(article)
                                    }
                                },
                                { icon: 'bookmark', label: 'Save', onPress: () => this._handleArticleSave(article) },
                            ]}
                            onStateChange={({ open }) => this.setState({
                                fabOpen: open
                            })}
                            onPress={() => {
                                if (this.state.open) {
                                    // do something if the speed dial is open
                                }
                            }}
                        />
                    </SafeAreaView>
                </Portal>}

            </ScrollView>
        );
    }

    _renderDate = date => {
        if (Moment(date).subtract(7, 'days') < Moment()) {
            return (
                <Text style={{
                    fontSize: 15,
                    color: '#9e9e9e'
                }}
                >
                    {Moment(date).format('MMM D YYYY')}
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

    _shareArticle = article => {
        Share.share({
            title: article.title.rendered,
            message: article.title.rendered,
            url: article.link
        })
    }

    _handleArticleSave = article => {
        const { activeDomain } = this.props;
        this.props.dispatch(saveArticle(article, activeDomain.id))
        this.setState({
            snackbarSavedVisible: true
        })
    }

    _renderFeaturedMedia = (article) => {
        const { theme } = this.props;
        if (article.slideshow) {
            return (
                <Slideshow accentColor={theme.colors.accent} images={article.slideshow} />
            )
        }
        else if (article.custom_fields.video) {
            return <WebView
                style={{ flex: 1, height: MEDIASIZE }}
                source={{ uri: article.custom_fields.video[0] }}
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
                            {/* <HTML
                                html={article.featuredImage.caption.toUpperCase()}
                                textSelectable={true}
                                tagsStyles={{
                                    p: {
                                        fontSize: 12,
                                        color: 'white'
                                    }
                                }}
                            /> */}
                            {article.featuredImage.caption ?
                                <HTML
                                    html={article.featuredImage.caption}
                                    baseFontStyle={{ fontSize: 12 }}
                                    customWrapper={(text) => {
                                        return (
                                            <Text ellipsizeMode='tail' numberOfLines={this.state.expandCaption ? null : 2} onPress={() => {
                                                this.setState({
                                                    expandCaption: !this.state.expandCaption
                                                })
                                            }}>{text}</Text>
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

    _getArticleAuthor = () => {
        const { navigation } = this.props;
        let article = navigation.getParam('article', 'loading')
        if (article.custom_fields.writer) {
            if (article.custom_fields.jobtitle) {
                return `${article.custom_fields.writer} | ${article.custom_fields.jobtitle}`
            }
            else {
                return article.custom_fields.writer
            }
        }
        else {
            return ''
        }
    }

    _viewLink = async (href) => {
        let result = await WebBrowser.openBrowserAsync(href);
    }

    _handleProfilePress = async (article) => {
        const { navigation } = this.props;
        if(Platform.OS === 'ios') {
            Haptic.selection();
        }
        const writerName = article.custom_fields.writer && article.custom_fields.writer[0];
        navigation.navigate('Profile', {
            writerName
        })
    }


    _renderChapters = (article) => {
        const { navigation, theme } = this.props;
        let articleChapters = navigation.getParam('articleChapters', [])
        console.log('article chapters', articleChapters)
        //sort long form stories

        return (
            articleChapters.map(article => {
                return (
                    <View key={article.id}>
                        <View style={styles.featuredMediaContainer}>
                            {this._renderFeaturedMedia(article)}
                        </View>
                        <HTML
                            html={article.title.rendered}
                            baseFontStyle={{ fontSize: 30 }}
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
                                    paddingHorizontal: 10,
                                    color: theme.dark ? 'white' : 'black'
                                }
                            }}
                        />
                        {article.custom_fields.sno_deck &&
                            <HTML
                                html={article.custom_fields.sno_deck[0]}
                                baseFontStyle={{ fontSize: 22 }}
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
                                        paddingHorizontal: 10,
                                        color: theme.dark ? 'white' : 'black'
                                    }
                                }}
                            />
                        }
                        <TouchableItem onPress={() => this._handleProfilePress(article)}>
                            <Text style={{
                                fontSize: 17,
                                textAlign: 'center',
                                paddingTop: 20,
                                color: theme.colors.accent
                            }}>
                                {this._getArticleAuthor()}
                            </Text>
                        </TouchableItem>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', paddingTop: 10 }}>
                            {this._renderDate(article.date)}
                        </View>
                        <View style={styles.articleContents}>
                            <HTML
                                html={article.content.rendered}
                                imagesMaxWidth={Dimensions.get('window').width}
                                ignoredStyles={['height', 'width', 'display']}
                                textSelectable={true}
                                onLinkPress={(e, href) => this._viewLink(href)}
                                tagsStyles={{
                                    p: {
                                        fontSize: 18,
                                        marginBottom: 15
                                    },
                                    img: {
                                        height: MEDIASIZE,
                                        width: MEDIAWIDTH,
                                        borderRadius: 8
                                    }
                                }}
                                classesStyles={{
                                    'pullquote': { backgroundColor: '#eeeeee', borderRadius: 8, padding: 10, marginBottom: 15 },
                                    'largequote': { fontSize: 21 },
                                    'pullquotetext': { textAlign: 'left', fontSize: 21 },
                                    'quotespeaker': { textAlign: 'left', fontSize: 14 },
                                    'photowrap': {
                                        display: 'none'
                                    }
                                }}
                            />
                        </View>
                    </View>
                )
            })
        )
    }
}

const styles = StyleSheet.create({
    storyContainer: {
        flex: 1,
    },
    animationContainer: {
        width: 400,
        height: 400,
    },
    featuredMediaContainer: {
        flex: 1,
        // height: MEDIASIZE
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
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingVertical: 5,
        paddingHorizontal: 10

    },
    date: {
        fontSize: 15,
        color: '#9e9e9e',
    },
    articleContents: {
        padding: 20,
    },
    snackbar: {
        position: 'absolute',
        bottom: 50,
        left: 0,
        right: 0
    },
})

const mapStateToProps = state => ({
    theme: state.theme,
    activeDomain: state.activeDomain
})

export default connect(mapStateToProps)(FullArticleScreen);