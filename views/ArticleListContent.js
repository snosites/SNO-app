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
import { connect } from 'react-redux';
import HTML from 'react-native-render-html';
import { Haptic, DangerZone } from 'expo';

const { Lottie } = DangerZone;

import Colors from '../constants/Colors'
import { Ionicons, Feather, FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Snackbar, Badge, IconButton } from 'react-native-paper';

import {
    saveArticle,
    fetchArticlesIfNeeded,
    fetchMoreArticlesIfNeeded,
    invalidateArticles,
    removeSavedArticle
} from '../redux/actions/actions';


export default class ArticleListContent extends React.Component {

    render() {
        const { articleList, refreshing, isFetching, navigation } = this.props;
        return (
            <View style={{ flex: 1 }}>
                <FlatList
                    Style={{ flex: 1, marginVertical: 5 }}
                    data={articleList}
                    keyExtractor={item => item.id.toString()}
                    ref={(ref) => { this.flatListRef = ref; }}
                    onEndReachedThreshold={0.25}
                    onEndReached={this._loadMore}
                    onRefresh={this._handleRefresh}
                    refreshing={refreshing}
                    onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
                    ListFooterComponent={() => {
                        if (!isFetching) {
                            return null
                        }
                        return (
                            <View style={styles.loadingMore}>
                                <ActivityIndicator />
                            </View>
                        )
                    }}
                    renderItem={this._renderItem}
                />
            </View>
        )
    }

    _renderItem = props => {
        const story = props.item;
        return (
            <TouchableOpacity
                style={{ flex: 1 }}
                onPress={this._handleArticlePress(story)}
            >
                <View style={styles.storyContainer}>
                    {story.featuredImage ?
                        <Image
                            source={{ uri: story.featuredImage.uri }}
                            style={styles.featuredImage}
                        />
                        :
                        null
                    }
                    <View style={styles.storyInfo}>
                        <HTML
                            html={story.title.rendered}
                            baseFontStyle={{ fontSize: 17 }}
                            customWrapper={(text) => {
                                return (
                                    <Text ellipsizeMode='tail' numberOfLines={2}>{text}</Text>
                                )
                            }}
                            tagsStyles={{
                                rawtext: {
                                    fontSize: 17,
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
                                fontSize: 15
                            }}
                        >
                            {story.custom_fields.writer ? story.custom_fields.writer : ''}
                        </Text>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}
                        >
                            <View style={{ flexDirection: 'row' }}>
                                {this._renderDate(story.date)}
                            </View>
                        </View>
                    </View>
                    <View
                        style={{
                            justifySelf: 'end',
                            justifyContent: 'space-between'
                        }}
                    >
                        <View>
                            <FontAwesome
                                name="comment"
                                size={21}
                                color='#e0e0e0'
                            />
                            <Badge
                                size={16}
                                style={{
                                    position: 'absolute',
                                    bottom: 2,
                                    right: 4,
                                    backgroundColor: theme.colors.accent,
                                }}
                            >
                                {story.comments.length > 99 ? '99' : story.comments.length}
                            </Badge>
                        </View>
                        <MaterialIcons
                            name={
                                story.saved ? 'bookmark'
                                    :
                                    'bookmark-border'
                            }
                            color={theme.colors.accent}
                            style={{ paddingHorizontal: 5 }}
                            size={24}
                            onPress={() => {
                                this._saveRemoveToggle(story)
                            }}
                        />
                    </View>
                </View>
            </TouchableOpacity>

        )
    }

    _loadMore = () => {
        if (!this.onEndReachedCalledDuringMomentum) {
            const { activeDomain, category } = this.props;
            this.props.dispatch(fetchMoreArticlesIfNeeded({
                domain: activeDomain.url,
                category: category.categoryId,
            }))
            this.onEndReachedCalledDuringMomentum = true;
        }

    }

    _handleRefresh = () => {
        const { dispatch, activeDomain, category } = this.props;
        dispatch(invalidateArticles(category.categoryId));
        dispatch(fetchArticlesIfNeeded({
            domain: activeDomain.url,
            category: category.categoryId,
        }))
    }

    _handleArticlePress = article => () => {
        if (Platform.OS === 'ios') {
            Haptic.selection();
        }
        console.log('article', article)
        if (article.custom_fields.sno_format && article.custom_fields.sno_format == 'Classic') {
            this._handleRegularArticle(article)
        } else {
            this._handleLongFormArticle(article);
        }
    }

    _handleRegularArticle = async (article) => {
        console.log('in article press')
        const { navigation } = this.props;
        if (Platform.OS === 'ios') {
            Haptic.selection();
        }
        // check if there is a slidehsow
        if (article.custom_fields.featureimage && article.custom_fields.featureimage[0] == 'Slideshow of All Attached Images') {
            article.slideshow = await this._getAttachmentsAync(article);
        }
        navigation.navigate('FullArticle', {
            articleId: article.id,
            article,
            commentNumber: article.comments.length,
            comments: article.comments
        })
    }

    _handleLongFormArticle = async article => {
        console.log('in article press long form')
        const { navigation, activeDomain } = this.props;
        let storyChapters = [];
        if (article.custom_fields.sno_format == "Long-Form") {
            let results = await fetch(`https://${activeDomain.url}/wp-json/custom_meta/my_meta_query?meta_query[0][key]=sno_longform_list&meta_query[0][value]=${article.id}`)
            storyChapters = await results.json();
        }
        else if (article.custom_fields.sno_format == "Grid") {
            let results = await fetch(`https://${activeDomain.url}/wp-json/custom_meta/my_meta_query?meta_query[0][key]=sno_grid_list&meta_query[0][value]=${article.id}`)
            storyChapters = await results.json();
        }
        else if (article.custom_fields.sno_format == "Side by Side") {
            let results = await fetch(`https://${activeDomain.url}/wp-json/custom_meta/my_meta_query?meta_query[0][key]=sno_sidebyside_list&meta_query[0][value]=${article.id}`)
            storyChapters = await results.json();
        }
        let updatedStoryChapters = await Promise.all(storyChapters.map(async article => {
            const response = await fetch(`https://${activeDomain.url}/wp-json/wp/v2/posts/${article.ID}`)
            return await response.json();
        }))
        updatedStoryChapters = await Promise.all(updatedStoryChapters.map(async article => {
            if (article.custom_fields.featureimage && article.custom_fields.featureimage[0] == 'Slideshow of All Attached Images') {
                article.slideshow = await this._getAttachmentsAync(article);
            }
            if (article._links['wp:featuredmedia']) {
                const imgResponse = await fetch(article._links['wp:featuredmedia'][0].href);
                const featuredImage = await imgResponse.json();
                if (!featuredImage.meta_fields) {
                    article.featuredImage = {
                        uri: featuredImage.source_url,
                        photographer: 'Unknown',
                        caption: featuredImage.caption && featuredImage.caption.rendered ? featuredImage.caption.rendered : 'Unknown'
                    }
                    return article
                }
                article.featuredImage = {
                    uri: featuredImage.source_url,
                    photographer: featuredImage.meta_fields.photographer ? featuredImage.meta_fields.photographer : '',
                    caption: featuredImage.caption && featuredImage.caption.rendered ? featuredImage.caption.rendered : ''
                }
            }
            return article
        }))
        if (article.custom_fields.sno_format == "Long-Form") {
            console.log('updated chapters', updatedStoryChapters)
            updatedStoryChapters.sort(function (a, b) {
                if (a.custom_fields.sno_longform_order && a.custom_fields.sno_longform_order[0] < b.custom_fields.sno_longform_order && b.custom_fields.sno_longform_order[0])
                    return -1;
                if (a.custom_fields.sno_longform_order && a.custom_fields.sno_longform_order[0] > b.custom_fields.sno_longform_order && b.custom_fields.sno_longform_order[0])
                    return 1;
                return 0;
            })
        }
        navigation.navigate('FullArticle', {
            articleId: article.id,
            article,
            articleChapters: updatedStoryChapters,
            commentNumber: article.comments.length,
            comments: article.comments
        })
    }

    _renderDate = date => {
        let dateNow = Moment();
        let subDate = Moment(date).subtract(7, 'days');
        console.log('moment date', subDate, dateNow)
        if (Moment().isAfter(Moment(date).add(7, 'days'))) {
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

    _saveRemoveToggle = article => {
        if (article.saved) {
            this._handleArticleRemove(article.id);
        } else {
            this._handleArticleSave(article);
        }
    }

    _handleArticleSave = article => {

        const { activeDomain } = this.props;
        console.log('in article save', activeDomain)
        this.props.dispatch(saveArticle(article, activeDomain.id))
        this.setState({
            snackbarSavedVisible: true
        })
    }

    _handleArticleRemove = articleId => {
        console.log('in article remove')
        const { activeDomain } = this.props;
        this.props.dispatch(removeSavedArticle(articleId, activeDomain.id))
        this.setState({
            snackbarRemovedVisible: true
        })
    }

}

const styles = StyleSheet.create({
    loadingMore: {
        flex: 1,
        paddingTop: 20,
        paddingBottom: 30,
        alignItems: 'center'
    },
    storyContainer: {
        flexDirection: 'row',
        flex: 1,
        marginHorizontal: 10,
        marginVertical: 10,
    },
    featuredImage: {
        width: 125,
        height: 80,
        borderRadius: 8
    },
    storyInfo: {
        flex: 1,
        marginLeft: 10,
        justifyContent: 'space-between'
    },

})