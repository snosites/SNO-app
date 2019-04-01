import React from 'react';
import {
    Platform,
    Button,
    ScrollView,
    StyleSheet,
    Text,
    View,
    AsyncStorage,
    StatusBar,
    ActivityIndicator,
    Image
} from 'react-native';
import Moment from 'moment';
import HTML from 'react-native-render-html';

import { Feather } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

import TouchableItem from '../constants/TouchableItem';

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
        console.log('in full article', article)
        return (
            <ScrollView style={styles.storyContainer}>
                {article.featuredImage &&
                    <Image source={{ uri: article.featuredImage }} style={styles.featuredImage} />
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

    _renderContent = (article) => {
        const regEx = /<\/?[^>]+(>|$)/g;
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
    featuredImage: {
        height: 250,
        resizeMode: 'cover'
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingTop: 20,
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
    }
})