import React from 'react';
import {
    Platform,
    AsyncStorage,
    View,
    ScrollView,
    FlatList,
    Text,
    Image,
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import Moment from 'moment';
import { connect } from 'react-redux';
import { Haptic, DangerZone } from 'expo';
const { Lottie } = DangerZone;

import TabBarIcon from '../components/TabBarIcon';

import Colors from '../constants/Colors'
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Snackbar } from 'react-native-paper';

import {
    saveArticle,
    fetchRecentArticlesIfNeeded,
    fetchMoreRecentArticlesIfNeeded,
    invalidateRecentArticles
} from '../redux/actions/actions';

class RecentScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Recent Articles',
            
        };
    };

    state = {
        snackbarVisible: false
    }

    componentDidMount() {
        const { dispatch, activeDomain } = this.props;
        if (this.animation) {
            this._playAnimation();
        }
        const willFocusSubscription = this.props.navigation.addListener(
            'willFocus',
            () => {
                dispatch(fetchRecentArticlesIfNeeded(activeDomain.url))
            }
          );
    }

    componentDidUpdate() {
        if (this.animation) {
            this._playAnimation();
        }
    }

    componentWillUnmount() {
        willFocusSubscription.remove();
    }

    render() {
        const { navigation, recentArticles, recent } = this.props;
        const { snackbarVisible } = this.state;
        if (recentArticles.length === 0) {
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
                    refreshing={recent.isFetching}
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
                                        <Text ellipsizeMode='tail' numberOfLines={2} style={styles.title}>{story.title.rendered}</Text>
                                        <View style={styles.extraInfo}>
                                            <View style={{ flex: 1 }}>
                                                <Text ellipsizeMode='tail' numberOfLines={1} style={styles.author}>{story.custom_fields.writer ? story.custom_fields.writer : 'Unknown'}</Text>
                                                <Text style={styles.date}>{String(Moment(story.date).fromNow())}</Text>
                                            </View>

                                            <View style={styles.socialIconsContainer}>

                                                <MaterialIcons
                                                    onPress={() => {
                                                        alert('share')
                                                    }}
                                                    style={styles.socialIcon} name='share' size={28}
                                                    color={Colors.tintColor} />
                                                <MaterialIcons
                                                    onPress={() => {
                                                        this._handleArticleSave(story)
                                                    }}
                                                    style={styles.socialIcon} name='bookmark-border' size={28}
                                                    color={Colors.tintColor} />
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )
                    }}
                />
                <Snackbar
                    visible={snackbarVisible}
                    style={styles.snackbar}
                    duration={3000}
                    onDismiss={() => this.setState({ snackbarVisible: false })}
                    action={{
                        label: 'Dismiss',
                        onPress: () => {
                            this.setState({ snackbarVisible: false })
                        }
                    }}
                >
                    Article Saved
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
        })
    }

    _handleArticleSave = article => {
        console.log('in article save')
        this.props.dispatch(saveArticle(article))
        this.setState({
            snackbarVisible: true
        })
    }

    // _getAttachmentsAync = async (article) => {
    //     const response = await fetch(article._links['wp:attachment'][0].href);
    //     const imageAttachments = await response.json();
    //     return imageAttachments;
    // }

    _loadMore = () => {
        const { activeDomain } = this.props;
        this.props.dispatch(fetchMoreRecentArticlesIfNeeded(activeDomain.url))
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
        marginVertical: 15,
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
    extraInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        flex: 1,
    },
    socialIconsContainer: {
        flexDirection: 'row',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    date: {
        fontSize: 15,
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
        recent: state.recentArticles,
        recentArticles: state.recentArticles.items.map(articleId => {
            return state.entities.articles[articleId]
        })
    }
}

export default connect(mapStateToProps)(RecentScreen);