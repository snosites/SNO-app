import React from 'react';
import {
    Platform,
    Button,
    ScrollView,
    StyleSheet,
    Text,
    View,
    WebView,
    AsyncStorage,
    StatusBar,
    ActivityIndicator,
    Image,
    ImageBackground,
    Dimensions
} from 'react-native';
import Moment from 'moment';
import HTML from 'react-native-render-html';
import Slideshow from '../constants/Slideshow';

import { Permissions, MediaLibrary, WebBrowser } from 'expo';

import { Feather } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

import TouchableItem from '../constants/TouchableItem';


const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

const MEDIASIZE = viewportHeight * 0.39;

export default class FullArticleScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const story = navigation.getParam('article', 'Full Article')
        return {
            title: story.title.rendered,
        };
    };

    render() {
        const { navigation } = this.props;
        let article = navigation.getParam('article', 'loading')
        // console.log('in full article', article)
        return (
            <ScrollView style={styles.storyContainer}>
                {article !== 'loading' &&
                    <View style={styles.featuredMediaContainer}>
                        {this._renderFeaturedMedia(article)}
                    </View>
                }
                <Text style={styles.title}>{article.title.rendered}</Text>
                <Text style={styles.byLine}>{this._getArticleAuthor()}
                </Text>
                <View style={styles.socialContainer}>
                    <TouchableItem style={styles.socialButton}>
                        <View style={styles.socialButtonInner}>
                            <MaterialIcons style={styles.socialIcon} name='bookmark-border' size={28} color='white' />
                            <Text style={styles.socialButtonText}>Save</Text>
                        </View>
                    </TouchableItem>
                    <TouchableItem style={styles.socialButton}>
                        <View style={styles.socialButtonInner}>
                            <MaterialIcons style={styles.socialIcon} name='share' size={28} color='white' />
                            <Text style={styles.socialButtonText}>Share</Text>
                        </View>
                    </TouchableItem>
                </View>
                <Text style={styles.date}>Published: {Moment(article.modified).fromNow()}</Text>
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
            </ScrollView>
        );
    }

    

    _renderFeaturedMedia = (article) => {
        console.log('article', article)
        if (article.slideshow) {
            return (
                <Slideshow images={article.slideshow} />
            )
        }
        else if (article.custom_fields.video) {
            return <WebView
                style={{ flex: 1 }}
                source={{ uri: article.custom_fields.video[0] }}
            />
        }
        else {
            return (
                <ImageBackground
                    source={{ uri: article.featuredImage.uri }}
                    style={styles.featuredImage}
                >
                    <View style={styles.imageInfoContainer}>
                        <View style={styles.imageInfo}>
                            <Text style={{ color: 'white' }}>{article.featuredImage.caption.toUpperCase()}</Text>
                            <Text style={{ color: 'grey' }}>{article.featuredImage.photographer}</Text>
                        </View>
                    </View>
                </ImageBackground>
            )

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
        height: MEDIASIZE
    },
    featuredImage: {
        height: 250,
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
        paddingTop: 10,
        paddingBottom: 5

    },
    byLine: {
        fontSize: 17,
        color: '#9e9e9e',
        textAlign: 'center'
    },
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10
    },
    socialButton: {
        borderRadius: 10,
        margin: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#5c6bc0',
    },
    socialButtonInner: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    socialButtonText: {
        fontSize: 19,
        color: 'white',
        paddingLeft: 5
    },
    date: {
        fontSize: 17,
        color: '#9e9e9e',
        textAlign: 'center'
    },
    articleContents: {
        padding: 20,
        marginTop: 20
    },
})