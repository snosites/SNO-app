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
    TouchableOpacity
} from 'react-native';
import Moment from 'moment';
import { NavigationEvents } from 'react-navigation';
import HTML from 'react-native-render-html';
import Slideshow from '../constants/Slideshow';
import { withTheme } from 'react-native-paper';
import { Permissions, MediaLibrary, WebBrowser, Haptic } from 'expo';

import { FAB, Portal } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import TouchableItem from '../constants/TouchableItem';
import { CustomArticleHeader } from '../components/ArticleHeader';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

const MEDIASIZE = viewportHeight * 0.32;


export default class FullArticleScreen extends React.Component {
    static navigationOptions = ({ navigation, navigation: { state } }) => {
        return {
            headerTitle: <CustomArticleHeader state={state} navigation={navigation} />
        };
    };

    state = {
        fabOpen: false,
        showPortal: true
    };

    render() {
        const { navigation } = this.props;
        let article = navigation.getParam('article', 'loading')
        return (
            <ScrollView style={styles.storyContainer}>
                <NavigationEvents
                    onDidFocus={() => this.setState({
                        showPortal: true
                    })}
                    onWillBlur={() => this.setState({
                        showPortal: false
                    })}
                />
                {article !== 'loading' &&
                    <View style={styles.featuredMediaContainer}>
                        {this._renderFeaturedMedia(article)}
                    </View>
                }
                <Text style={styles.title}>{article.title.rendered}</Text>
                <TouchableItem onPress={() => this._handleProfilePress(article)}>
                    <Text style={styles.byLine}>
                        {this._getArticleAuthor()}
                    </Text>
                </TouchableItem>
                <View style={{flexDirection: 'row', justifyContent: 'center', paddingTop: 10}}>
                    <Text style={styles.date}>
                        {Moment(article.date).format('D MMM YYYY')}
                    </Text>
                    <Text style={[{ paddingHorizontal: 10 }, styles.date]}>•</Text>
                    <Text style={styles.date}>{String(Moment(article.date).fromNow())}</Text>
                </View>
                <View style={styles.articleContents}>
                    <HTML
                        html={article.content.rendered}
                        textSelectable={true}
                        onLinkPress={(e, href) => this._viewLink(href)}
                        tagsStyles={{
                            p: {
                                fontSize: 18,
                                marginBottom: 15
                            }
                        }}
                    />
                </View>
                {this.state.showPortal && <Portal>
                    <FAB.Group
                        style={{ marginBottom: 50 }}
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
                            { icon: 'bookmark', label: 'Save', onPress: () => console.log('Pressed email') },
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
                </Portal>}
            </ScrollView>
        );
    }

    _shareArticle = article => {
        console.log('sharing', article)
        Share.share({
            title: article.title.rendered,
            message: article.title.rendered,
            url: article.link
        })
    }

    _renderFeaturedMedia = (article) => {
        if (article.slideshow) {
            return (
                <Slideshow images={article.slideshow} />
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
                            <HTML
                                html={article.featuredImage.caption.toUpperCase()}
                                textSelectable={true}
                                tagsStyles={{
                                    p: {
                                        fontSize: 12,
                                        color: 'white'
                                    }
                                }}
                            />
                            <TouchableOpacity onPress={this._handleProfilePress}>
                                <Text style={{ color: '#bdbdbd' }}>{article.featuredImage.photographer[0]}</Text>
                            </TouchableOpacity>

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
            return 'Unknown'
        }
    }

    _viewLink = async (href) => {
        let result = await WebBrowser.openBrowserAsync(href);
    }

    _handleProfilePress = async (article) => {
        const { navigation } = this.props;
        Haptic.selection();
        const writerName = article.custom_fields.writer && article.custom_fields.writer[0];
        navigation.navigate('Profile', {
            writerName
        })
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
    byLine: {
        fontSize: 17,
        color: '#9e9e9e',
        textAlign: 'center'
    },
    date: {
        fontSize: 15,
        color: '#9e9e9e',
    },
    articleContents: {
        padding: 20,
    },
})