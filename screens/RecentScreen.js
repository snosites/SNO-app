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
        if (this.animation) {
            this._playAnimation();
        }
    }

    componentWillUnmount() {
        this.willFocusSubscription.remove();
    }

    render() {
        const { navigation, recentArticles, recent } = this.props;
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

        return (
            <View style={{ flex: 1 }}>
                <FlatList
                    Style={{ flex: 1, marginVertical: 5 }}
                    data={recentArticles}
                    keyExtractor={item => item.id.toString()}
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
                                            baseFontStyle={{ fontSize: 19 }}
                                            customWrapper={(text) => {
                                                return (
                                                    <Text ellipsizeMode='tail' numberOfLines={2}>{text}</Text>
                                                )
                                            }}
                                            tagsStyles={{
                                                rawtext: {
                                                    fontSize: 20,
                                                    fontWeight: 'bold'
                                                }
                                            }}
                                        />
                                        <Text ellipsizeMode='tail' numberOfLines={1} style={styles.author}>{story.custom_fields.writer ? story.custom_fields.writer : 'Unknown'}</Text>
                                        <View style={{
                                            flexDirection: 'row',
                                            paddingTop: 5,
                                            alignItems: 'center',
                                            justifyContent: 'space-between'
                                        }}
                                        >
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={styles.date}>
                                                    {Moment(story.date).format('D MMM YYYY')}
                                                </Text>
                                                <Text style={[{ paddingHorizontal: 10 }, styles.date]}>•</Text>
                                                <Text style={styles.date}>{String(Moment(story.date).fromNow())}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row' }}>
                                                <View style={{
                                                    marginRight: 40,
                                                }}>
                                                    <FontAwesome name="comment"
                                                        size={21} color='grey'
                                                    />
                                                    <Badge
                                                        size={16}
                                                        style={{
                                                            position: 'absolute',
                                                            bottom: 5,
                                                            right: -11,
                                                            backgroundColor: '#4fc3f7',
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
                                                    color={Colors.tintColor}
                                                    style={styles.socialIcon}
                                                    size={24}
                                                    onPress={() => {
                                                        this._saveRemoveToggle(story)
                                                    }}
                                                />
                                            </View>
                                        </View>
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

    _handleArticlePress = article => async () => {
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

    _saveRemoveToggle = article => {
        if (article.saved) {
            this._handleArticleRemove(article.id);
        } else {
            this._handleArticleSave(article);
        }
    }

    _handleArticleSave = article => {
        console.log('in article save')
        this.props.dispatch(saveArticle(article))
        this.setState({
            snackbarSavedVisible: true
        })
    }

    _handleArticleRemove = articleId => {
        console.log('in article remove')
        this.props.dispatch(removeSavedArticle(articleId))
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
        marginHorizontal: 20,
        marginVertical: 10,
    },
    animationContainer: {
        width: 400,
        height: 400,
    },
    featuredImage: {
        width: 125,
        height: 90,
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
        color: '#90caf9'
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
        activeDomain: state.activeDomain,
        menus: state.menus,
        recent: state.recentArticles,
        recentArticles: state.recentArticles.items.map(articleId => {
            return state.entities.articles[articleId]
        })
    }
}

export default connect(mapStateToProps)(RecentScreen);