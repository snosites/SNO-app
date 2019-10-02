import React from 'react';
import {
    View,
    FlatList,
    Text,
    Image,
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity,
    Platform
} from 'react-native';
import Moment from 'moment';
import Color from 'color';
import HTML from 'react-native-render-html';
import * as Haptic from 'expo-haptics';

import { handleArticlePress } from '../utils/articlePress';

import { connect } from 'react-redux';

Moment.updateLocale('en', {
    relativeTime: {
        d: "1 day",
    }
});


class RelatedStoriesList extends React.Component {

    state = {
        stories: [],
        error: ''
    }

    componentDidMount() {
        if (this.props.relatedStoryIds) {
            this._fetchRelatedStories(this.props.relatedStoryIds)
        }
    }


    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', paddingVertical: 10 }}>
                <Text
                    style={{
                        textAlign: 'center',
                        color: '#757575',
                        fontSize: 19,
                        fontWeight: 'bold',
                        paddingVertical: 10
                    }}
                >
                    Related Stories
                </Text>
                {this._renderRelatedStories()}
            </View>
        )
    }

    _renderRelatedStories = () => {
        const { relatedStoryIds } = this.props;
        const { stories, error } = this.state;
        if (error) {
            return (
                <Text style={{ textAlign: 'center' }}>Error loading related stories</Text>
            )
        }
        else if (relatedStoryIds && stories.length == 0) {
            return (
                <ActivityIndicator />
            )
        }
        else {
            return (
                <View style={{flex: 1}}>
                    <FlatList
                        // style={{ flex: 1, marginVertical: 5 }}
                        data={stories}
                        keyExtractor={item => item.id.toString()}
                        renderItem={this._renderItem}
                    />
                </View>
            )
        }
    }

    _renderItem = ({ item }) => {
        const { theme, activeDomain } = this.props;
        const article = item;
        return (
            <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => handleArticlePress(article, activeDomain)}
            >
                <View style={styles.storyContainer}>
                    {article.featuredImage ?
                        <Image
                            source={{ uri: article.featuredImage.uri }}
                            style={styles.featuredImage}
                        />
                        :
                        null
                    }
                    <View style={styles.storyInfo}>
                        <HTML
                            html={article.title.rendered}
                            baseFontStyle={{ fontSize: 16 }}
                            customWrapper={(text) => {
                                return (
                                    <Text
                                        ellipsizeMode='tail'
                                        numberOfLines={2}
                                    >
                                        {text}
                                    </Text>
                                )
                            }}
                            tagsStyles={{
                                rawtext: {
                                    fontSize: 16,
                                    fontWeight: 'bold',
                                    color: theme.dark ? 'white' : 'black'
                                }
                            }}
                        />
                        <Text
                            ellipsizeMode='tail'
                            numberOfLines={1}
                            style={{
                                color: theme.colors.accent,
                                fontSize: 14
                            }}
                        >
                            {article.custom_fields.writer ? this._renderWriters(article.custom_fields.writer) : ''}
                        </Text>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}
                        >
                            <View style={{ flexDirection: 'row' }}>
                                {this._renderDate(article.date)}
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>

        )
    }

    _renderDate = date => {
        return (
            <Text style={{
                fontSize: 14,
                color: '#9e9e9e'
            }}
            >
                {Moment().isAfter(Moment(date).add(7, 'days'))
                    ?
                    String(Moment(date).format('MMM D, YYYY'))
                    :
                    String(Moment(date).fromNow())
                }
            </Text>
        )
    }

    _renderWriters = writers => {
        let newArr = '';
        for (let i = 0; i < writers.length; i++) {
            if (i === writers.length - 2) {
                newArr += `${writers[i]} & `
            }
            else if (i === writers.length - 1) {
                newArr += `${writers[i]}`
            } else {
                newArr += `${writers[i]}, `
            }
        }
        return newArr;
    }

    _fetchFeaturedImage = async (url, story) => {
        const imgResponse = await fetch(url);
        const featuredImage = await imgResponse.json();
        if (!featuredImage.meta_fields) {
            story.featuredImage = {
                uri: featuredImage.source_url,
                photographer: '',
                caption: featuredImage.caption && featuredImage.caption.rendered ? featuredImage.caption.rendered : ''
            }
            return;
        }
        story.featuredImage = {
            uri: featuredImage.source_url,
            photographer: featuredImage.meta_fields.photographer ? featuredImage.meta_fields.photographer : '',
            caption: featuredImage.caption && featuredImage.caption.rendered ? featuredImage.caption.rendered : ''
        }
    }

    _fetchComments = async (url, story) => {
        const response = await fetch(`https://${url}/wp-json/wp/v2/comments?post=${story.id}`);
        const comments = await response.json();
        if (response.status == 200) {
            story.comments = comments
        } else {
            story.comments = []
        }
        return;
    }

    _getStory = async id => {
        const { activeDomain } = this.props;
        const result = await fetch(`http://${activeDomain.url}/wp-json/wp/v2/posts/${id}`)
        const post = await result.json();
        if (post._links['wp:featuredmedia']) {
            await this._fetchFeaturedImage(`${post._links['wp:featuredmedia'][0].href}`, post)
        }
        await this._fetchComments(activeDomain.url, post)
        return post;
    }

    _fetchRelatedStories = async storyIds => {

        try {
            const stories = await Promise.all(storyIds.map(async id => {
                return await this._getStory(id)
            }))
            this.setState({
                stories
            })
        }
        catch (err) {
            console.log('error fetching related stories', err)
            this.setState({
                error: true
            })
        }
    }

}

const styles = StyleSheet.create({
    storyContainer: {
        flexDirection: 'row',
        flex: 1,
        marginHorizontal: 10,
        marginVertical: 10,
    },
    featuredImage: {
        width: 95,
        height: 60,
        borderRadius: 8
    },
    storyInfo: {
        flex: 1,
        marginLeft: 10,
        justifyContent: 'space-between'
    },

})

const mapStateToProps = state => ({
    activeDomain: state.activeDomain,
    theme: state.theme
})

export default connect(mapStateToProps)(RelatedStoriesList);