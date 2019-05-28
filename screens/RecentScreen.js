import React from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions
} from 'react-native';
import { connect } from 'react-redux';
import { DangerZone } from 'expo';
const { Lottie } = DangerZone;

import { Snackbar } from 'react-native-paper';

import {
    saveArticle,
    removeSavedArticle,
    fetchRecentArticlesIfNeeded,
    fetchMoreRecentArticlesIfNeeded,
    invalidateRecentArticles
} from '../redux/actionCreators';
import { SafeAreaView } from 'react-navigation';
import ArticleListContent from '../views/ArticleListContent';
import Animation from '../views/Animation';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

class RecentScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const logo = navigation.getParam('headerLogo', null)
        return {
            title: 'Recent Articles',
            headerLeft: (
                logo &&
                <Image
                    source={{ uri: logo }}
                    style={{ width: 60, height: 35, borderRadius: 7, marginLeft: 10 }}
                    resizeMode='contain'
                />
            ),
            headerBackTitle: null
        };
    };

    state = {
        snackbarSavedVisible: false,
        snackbarRemovedVisible: false,
        offset: 0
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
        const {
            navigation,
            recentArticles,
            recent,
            theme,
            activeDomain
        } = this.props;
        const { snackbarSavedVisible, snackbarRemovedVisible } = this.state;
        if (recent.items.length === 0 && recent.isFetching) {
            return (
                <SafeAreaView
                    style={{
                        flex: 1,
                        marginTop: 20,
                    }}
                >
                    <Lottie
                        ref={animation => this._saveAnimationRef(animation)}
                        style={StyleSheet.absoluteFill}
                        speed={0.8}
                        loop={true}
                        autoPlay={true}
                        source={require('../assets/lottiefiles/multi-article-loading')}
                    />
                </SafeAreaView>
            )
        }
        if (recent.error) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View
                        style={{
                            width: 200,
                            height: 200
                        }}
                    >
                        <Lottie
                            ref={animation => this._saveAnimationRef(animation)}
                            style={{
                                width: 200,
                                height: 200
                            }}
                            loop={true}
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
                <ArticleListContent
                    articleList={recentArticles}
                    isFetching={recent.isFetching}
                    isRefreshing={recent.didInvalidate}
                    loadMore={this._loadMore}
                    handleRefresh={this._handleRefresh}
                    saveRef={this._saveRef}
                    activeDomain={activeDomain}
                    theme={theme}
                    navigation={navigation}
                    onIconPress={this._saveRemoveToggle}
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

    _saveRef = (ref) => {
        this.flatListRef = ref;
    }

    _saveAnimationRef = (ref) => {
        this.animation = ref;
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
        const { activeDomain } = this.props;
        this.props.dispatch(saveArticle(article, activeDomain.id))
        this.setState({
            snackbarSavedVisible: true
        })
    }

    _handleArticleRemove = articleId => {
        const { activeDomain } = this.props;
        this.props.dispatch(removeSavedArticle(articleId, activeDomain.id))
        this.setState({
            snackbarRemovedVisible: true
        })
    }

    _loadMore = () => {
        const { activeDomain } = this.props;
        this.props.dispatch(fetchMoreRecentArticlesIfNeeded(activeDomain.url))
    }

    _handleRefresh = () => {
        const { dispatch, activeDomain } = this.props;
        dispatch(invalidateRecentArticles());
        dispatch(fetchRecentArticlesIfNeeded(activeDomain.url))
    }

    _playAnimation = () => {
        this.animation.reset();
        this.animation.play();
    };

}

const styles = StyleSheet.create({
    animationContainer: {
        width: 400,
        height: 400,
    },
    animationContainerError: {
        width: 200,
        height: 200,
    },
    snackbar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0
    },
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