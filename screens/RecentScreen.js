import React from 'react';
import {
    View,
    FlatList,
    Text,
    Image,
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import Moment from 'moment';
import { connect } from 'react-redux';
import HTML from 'react-native-render-html';
import { Haptic, DangerZone } from 'expo';
const { Lottie } = DangerZone;

import Colors from '../constants/Colors'
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { Snackbar, Badge } from 'react-native-paper';

import {
    saveArticle,
    removeSavedArticle,
    fetchRecentArticlesIfNeeded,
    fetchMoreRecentArticlesIfNeeded,
    invalidateRecentArticles
} from '../redux/actions/actions';

class RecentScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const logo = navigation.getParam('headerLogo', null)
        return {
            title: 'Recent Articles',
            headerLeft: (
                logo &&
                <Image
                    source={{ uri: logo }}
                    style={{ width: 60, height: 30, borderRadius: 7, marginLeft: 10 }}
                    resizeMode='cover'
                />
            ),
            headerBackTitle: null
        };
    };

    state = {
        snackbarSavedVisible: false,
        snackbarRemovedVisible: false
    }

    componentDidMount() {
        const { dispatch, activeDomain, navigation, menus } = this.props;
        if (this.animation) {
            this._playAnimation();
        }
        this.willFocusSubscription = navigation.addListener(
            'willFocus',
            () => {
                dispatch(fetchRecentArticlesIfNeeded(activeDomain.url))
            }
        );
        navigation.setParams({
            headerLogo: menus.headerSmall
        })
    }

    componentDidUpdate() {
        console.log('in component did update recent')
        if (this.animation) {
            this._playAnimation();
        }
        const { navigation } = this.props;
        if (navigation.state.params && navigation.state.params.scrollToTop) {
            if (this.flatListRef) {
                // scroll list to top
                this._scrollToTop();
            }
            navigation.setParams({ scrollToTop: false })
        }
    }

    componentWillUnmount() {
        this.willFocusSubscription.remove();
    }

    render() {
        const { navigation, recentArticles, recent, theme } = this.props;
        const { snackbarSavedVisible, snackbarRemovedVisible } = this.state;
        if (recent.items.length === 0 && recent.isFetching) {
            return (
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <View style={styles.animationContainer}>
                        <Lottie
                            ref={animation => {
                                this.animation = animation;
                            }}
                            style={{
                                width: 400,
                                height: 400,
                            }}
                            loop={true}
                            speed={1}
                            autoPlay={true}
                            source={require('../assets/lottiefiles/article-loading-animation')}
                        />
                    </View>
                </View>
            )
        }
        if (recent.error) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={styles.animationContainerError}>
                        <Lottie
                            ref={animation => {
                                this.animation = animation;
                            }}
                            style={{
                                width: 200,
                                height: 200,
                            }}
                            loop={false}
                            speed={1}
                            autoPlay={true}
                            source={require('../assets/lottiefiles/broken-stick-error')}
                        />
                    </View>
                    <Text style={{ textAlign: 'center', fontSize: 17, padding: 30 }}>
                        Sorry, something went wrong.
                    </Text>
                </View>
            )
        }

        return (
            <View style={{ flex: 1 }}>
                <FlatList
                    Style={{ flex: 1, marginVertical: 5 }}
                    data={recentArticles}
                    keyExtractor={item => item.id.toString()}
                    ref={(ref) => { this.flatListRef = ref; }}
                    onEndReachedThreshold={0.25}
                    onEndReached={this._loadMore}
                    onRefresh={this._handleRefresh}
                    refreshing={recent.didInvalidate}
                    onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
                    ListFooterComponent={() => {
                        if (!recent.isFetching) {
                            return null
                        }
                        return (
                            <View style={styles.loadingMore}>
                                <ActivityIndicator />
                            </View>
                        )
                    }}
                    renderItem={(props) => {
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
                                        <Text ellipsizeMode='tail' numberOfLines={1} style={[styles.author, { color: theme.colors.accent }]}>{story.custom_fields.writer ? story.custom_fields.writer : ''}</Text>
                                        <View style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between'
                                        }}
                                        >
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={styles.date}>
                                                    {Moment(story.date).format('D MMM YYYY')}
                                                </Text>
                                                <Text style={[{ paddingHorizontal: 5 }, styles.date]}>•</Text>
                                                <Text style={styles.date}>{String(Moment(story.date).fromNow())}</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={{ justifySelf: 'end', justifyContent: 'space-between' }}>
                                        <View>
                                            <FontAwesome name="comment"
                                                size={21} color='#e0e0e0'
                                            />
                                            <Badge
                                                size={16}
                                                style={{
                                                    position: 'absolute',
                                                    bottom: 2,
                                                    right: 4,
                                                    backgroundColor: theme.colors.accent,
                                                    borderWidth: 1,
                                                    borderColor: 'white'
                                                }}
                                            >
                                                {story.comments.length}
                                            </Badge>
                                        </View>
                                        <MaterialIcons
                                            name={
                                                story.saved ? 'bookmark'
                                                    :
                                                    'bookmark-border'
                                            }
                                            color={theme.colors.accent}
                                            style={styles.socialIcon}
                                            size={24}
                                            onPress={() => {
                                                this._saveRemoveToggle(story)
                                            }}
                                        />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )
                    }}
                />
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
                <Snackbar
                    visible={snackbarRemovedVisible}
                    style={styles.snackbar}
                    duration={3000}
                    onDismiss={() => this.setState({ snackbarRemovedVisible: false })}
                    action={{
                        label: 'Dismiss',
                        onPress: () => {
                            this.setState({ snackbarRemovedVisible: false })
                        }
                    }}
                >
                    Article Removed From Saved List
                </Snackbar>
            </View>

        );
    }

    _getAttachmentsAync = async (article) => {
        console.log('article', article)
        const response = await fetch(article._links['wp:attachment'][0].href);
        const imageAttachments = await response.json();
        return imageAttachments;
    }

    _handleArticlePress = article => () => {
        Haptic.selection();
        console.log('article', article)
        if(article.custom_fields.sno_format && article.custom_fields.sno_format == 'Classic') {
            this._handleRegularArticle(article)
        } else {
            this._handleLongFormArticle(article);
        }
    }

    _handleRegularArticle = async (article) => {
        console.log('in article press')
        const { navigation } = this.props;
        Haptic.selection();
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

    _scrollToTop = () => {
        this.flatListRef.scrollToOffset({ animated: true, offset: 0 });
    }

    _saveRemoveToggle = article => {
        if (article.saved) {
            this._handleArticleRemove(article.id);
        } else {
            this._handleArticleSave(article);
        }
    }

    _handleArticleSave = article => {
        console.log('in article save')
        const { activeDomain } = this.props;
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

    _loadMore = () => {
        if (!this.onEndReachedCalledDuringMomentum) {
            const { activeDomain } = this.props;
            this.props.dispatch(fetchMoreRecentArticlesIfNeeded(activeDomain.url))
            this.onEndReachedCalledDuringMomentum = true;
        }
    }

    _handleRefresh = () => {
        const { dispatch, activeDomain } = this.props;
        dispatch(invalidateRecentArticles());
        dispatch(fetchRecentArticlesIfNeeded({
            domain: activeDomain.url,
        }))
    }

    _playAnimation = () => {
        this.animation.reset();
        this.animation.play();
    };
}

const styles = StyleSheet.create({
    storyContainer: {
        flexDirection: 'row',
        flex: 1,
        marginHorizontal: 10,
        marginVertical: 10,
    },
    animationContainer: {
        width: 400,
        height: 400,
    },
    animationContainerError: {
        width: 200,
        height: 200,
    },
    featuredImage: {
        width: 125,
        height: 80,
        borderRadius: 8
    },
    imagePlaceholder: {
        backgroundColor: 'grey'
    },
    storyInfo: {
        flex: 1,
        marginLeft: 10,
        justifyContent: 'space-between'
    },
    date: {
        fontSize: 14,
        color: 'grey'
    },
    author: {
        fontSize: 15,
    },
    socialIcon: {
        paddingHorizontal: 5
    },
    snackbar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0
    },
    loadingMore: {
        flex: 1,
        paddingTop: 20,
        paddingBottom: 30,
        alignItems: 'center'
    }
});

const mapStateToProps = (state) => {
    return {
        theme: state.theme,
        activeDomain: state.activeDomain,
        menus: state.menus,
        recent: state.recentArticles,
        recentArticles: state.recentArticles.items.map(articleId => {
            const found = state.savedArticlesBySchool[state.activeDomain.id].find(savedArticle => {
                return savedArticle.id === articleId;
            })
            if (found) {
                state.entities.articles[articleId].saved = true;
            } else {
                state.entities.articles[articleId].saved = false;
            }
            return state.entities.articles[articleId]
        })
    }
}

export default connect(mapStateToProps)(RecentScreen);