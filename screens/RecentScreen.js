import React from 'react'
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native'
import { connect } from 'react-redux'
import LottieView from 'lottie-react-native'
import * as Device from 'expo-device'

import { Snackbar } from 'react-native-paper'

import { getActiveDomain } from '../redux/domains'
import { actions as recentActions } from '../redux/recent'
import { actions as savedArticleActions } from '../redux/savedArticles'

import { SafeAreaView } from 'react-navigation'
import ArticleListContent from '../views/ArticleListContent'
import TabletArticleListContent from '../views/TabletArticleListContent'

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window')

class RecentScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const logo = navigation.getParam('headerLogo', null)
        return {
            title: 'Recent Articles',
            headerLeft: logo && (
                <Image
                    source={{ uri: logo }}
                    style={{ width: 60, height: 35, borderRadius: 7, marginLeft: 10 }}
                    resizeMode='contain'
                />
            ),
            headerBackTitle: null
        }
    }

    state = {
        snackbarSavedVisible: false,
        snackbarRemovedVisible: false,
        offset: 0,
        isTablet: false
    }

    async getDeviceTypeComponent() {
        const deviceType = await Device.getDeviceTypeAsync()

        if (Device.DeviceType[deviceType] === 'TABLET') {
            this.setState({ isTablet: true })
        } else {
            this.setState({ isTablet: false })
        }
    }

    componentDidMount() {
        const { activeDomain, navigation, global, fetchRecentArticlesIfNeeded } = this.props
        if (this.animation) {
            this._playAnimation()
        }
        this.willFocusSubscription = navigation.addListener('willFocus', () => {
            fetchRecentArticlesIfNeeded(activeDomain.url)
        })
        navigation.setParams({
            headerLogo: global.headerSmall
        })
        this.getDeviceTypeComponent()
    }

    componentDidUpdate() {
        if (this.animation) {
            this._playAnimation()
        }
        const { navigation } = this.props
        if (navigation.state.params && navigation.state.params.scrollToTop) {
            if (this.flatListRef) {
                // scroll list to top
                this._scrollToTop()
            }
            navigation.setParams({ scrollToTop: false })
        }
    }

    componentWillUnmount() {
        this.willFocusSubscription.remove()
    }

    render() {
        const { navigation, recentArticles, recent, theme, activeDomain } = this.props
        const { snackbarSavedVisible, snackbarRemovedVisible, isTablet } = this.state
        if (recent.items.length === 0 && recent.isFetching) {
            return (
                <SafeAreaView
                    style={{
                        flex: 1,
                        marginTop: 20
                    }}
                >
                    <LottieView
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
                        <LottieView
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
                {isTablet ? (
                    <TabletArticleListContent
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
                ) : (
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
                )}
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
        )
    }

    _saveRef = ref => {
        this.flatListRef = ref
    }

    _saveAnimationRef = ref => {
        this.animation = ref
    }

    _scrollToTop = () => {
        this.flatListRef.scrollToOffset({ animated: true, offset: 0 })
    }

    _saveRemoveToggle = article => {
        if (article.saved) {
            this._handleArticleRemove(article.id)
        } else {
            this._handleArticleSave(article)
        }
    }

    _handleArticleSave = article => {
        const { activeDomain, saveArticle } = this.props
        saveArticle(article, activeDomain.id)
        this.setState({
            snackbarSavedVisible: true
        })
    }

    _handleArticleRemove = articleId => {
        const { activeDomain, removeSavedArticle } = this.props
        removeSavedArticle(articleId, activeDomain.id)
        this.setState({
            snackbarRemovedVisible: true
        })
    }

    _loadMore = () => {
        const { activeDomain, fetchMoreRecentArticlesIfNeeded } = this.props
        fetchMoreRecentArticlesIfNeeded(activeDomain.url)
    }

    _handleRefresh = () => {
        const { activeDomain, fetchRecentArticlesIfNeeded, invalidateRecentArticles } = this.props
        invalidateRecentArticles()
        fetchRecentArticlesIfNeeded(activeDomain.url)
    }

    _playAnimation = () => {
        this.animation.reset()
        this.animation.play()
    }
}

const styles = StyleSheet.create({
    animationContainer: {
        width: 400,
        height: 400
    },
    animationContainerError: {
        width: 200,
        height: 200
    },
    snackbar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0
    }
})

const mapStateToProps = state => {
    const activeDomain = getActiveDomain(state)
    return {
        theme: state.theme,
        activeDomain,
        global: state.global,
        recent: state.recentArticles,
        recentArticles: state.recentArticles.items.map(articleId => {
            const found = state.savedArticlesBySchool[activeDomain.id].find(savedArticle => {
                return savedArticle.id === articleId
            })
            if (found) {
                state.entities.articles[articleId].saved = true
            } else {
                state.entities.articles[articleId].saved = false
            }
            return state.entities.articles[articleId]
        })
    }
}

const mapdispatchToProps = dispatch => ({
    saveArticle: (article, domainId) =>
        dispatch(savedArticleActions.saveArticle(article, domainId)),
    removeSavedArticle: (articleId, domainId) =>
        dispatch(savedArticleActions.removeSavedArticle(articleId, domainId)),
    invalidateRecentArticles: categoryId =>
        dispatch(recentActions.invalidateRecentArticles(categoryId)),
    fetchRecentArticlesIfNeeded: domainUrl =>
        dispatch(recentActions.fetchRecentArticlesIfNeeded(domainUrl)),
    fetchMoreRecentArticlesIfNeeded: payload =>
        dispatch(recentActions.fetchMoreRecentArticlesIfNeeded(payload))
})

export default connect(mapStateToProps, mapdispatchToProps)(RecentScreen)
