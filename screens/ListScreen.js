import React, { useEffect, useState } from 'react'
import { View, Text, Image, StyleSheet, Platform } from 'react-native'
import { NavigationEvents, SafeAreaView } from 'react-navigation'

import * as Device from 'expo-device'

import HTML from 'react-native-render-html'
import LottieView from 'lottie-react-native'

import Colors from '../constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import { Snackbar, Button } from 'react-native-paper'

import ArticleListContent from '../views/ArticleListContent'
import TabletArticleListContent from '../views/TabletArticleListContent'

const ListScreen2 = (props) => {
    const {
        route,
        naviogation,
        global,
        listAds,
        activeDomain,
        sendAdAnalytic,
        category,
        invalidateArticles,
        fetchArticlesIfNeeded,
    } = props

    const [snackbarSavedVisible, setSnackbarSavedVisible] = useState(false)
    const [snackbarRemovedVisible, setSnackbarRemovedVisible] = useState(false)
    const [isTablet, setIsTablet] = useState(false)
    const [ad, setAd] = useState(null)

    const animationRef = useRef(null)

    const getDeviceType = async () => {
        const deviceType = await Device.getDeviceTypeAsync()

        if (Device.DeviceType[deviceType] === 'TABLET') {
            setIsTablet(true)
        } else {
            setIsTablet(false)
        }
    }

    _playAnimation = () => {
        animationRef.current.reset()
        animationRef.current.play()
    }

    _handleRefresh = () => {
        invalidateArticles(category.categoryId)
        fetchArticlesIfNeeded({
            domain: activeDomain.url,
            category: category.categoryId,
        })
    }

    useEffect(() => {
        getDeviceType()
    }, [])

    if (!categoryId) {
        return (
            <View
                style={{
                    flex: 1,
                    marginTop: 20,
                }}
            >
                <LottieView
                    ref={animationRef}
                    style={StyleSheet.absoluteFill}
                    speed={0.8}
                    loop={true}
                    autoPlay={true}
                    source={require('../assets/lottiefiles/multi-article-loading')}
                />
            </View>
        )
    }
    if (articlesByCategory.length === 0 && category.isFetching) {
        return (
            <View
                style={{
                    flex: 1,
                    marginTop: 20,
                }}
            >
                <LottieView
                    ref={animationRef}
                    style={StyleSheet.absoluteFill}
                    speed={0.8}
                    loop={true}
                    autoPlay={true}
                    source={require('../assets/lottiefiles/multi-article-loading')}
                />
            </View>
        )
    }
    if (category.error) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <View
                    style={{
                        width: 150,
                        height: 150,
                        alignItems: 'center',
                    }}
                >
                    <LottieView
                        ref={animationRef}
                        style={{
                            width: 150,
                            height: 150,
                        }}
                        loop={true}
                        autoPlay={true}
                        source={require('../assets/lottiefiles/broken-stick-error')}
                    />
                </View>
                <Text style={{ textAlign: 'center', fontSize: 17, padding: 30 }}>
                    Sorry, something went wrong. If you are the site owner, please submit a support
                    request.
                </Text>
                <Button
                    mode='contained'
                    theme={{
                        roundness: 7,
                        colors: {
                            primary: theme.colors.primary,
                        },
                    }}
                    style={{ padding: 5 }}
                    onPress={_handleRefresh}
                >
                    Reload
                </Button>
            </View>
        )
    }

    return (
        <View style={{ flex: 1 }}>
            <NavigationEvents
                onDidFocus={() => {
                    if (ad && ad.id) {
                        console.log('sending ad analytic')
                        sendAdAnalytic(activeDomain.url, ad.id, 'ad_views')
                    }
                }}
            />
            {isTablet ? (
                <TabletArticleListContent
                    articleList={articlesByCategory}
                    isFetching={category.isFetching}
                    isRefreshing={category.didInvalidate || false}
                    loadMore={this._loadMore}
                    handleRefresh={this._handleRefresh}
                    saveRef={this._saveRef}
                    activeDomain={activeDomain}
                    theme={theme}
                    enableComments={global.enableComments}
                    navigation={navigation}
                    onIconPress={this._saveRemoveToggle}
                    listAds={listAds}
                    ad={this.state.ad}
                />
            ) : (
                <ArticleListContent
                    articleList={articlesByCategory}
                    isFetching={category.isFetching}
                    isRefreshing={category.didInvalidate || false}
                    loadMore={this._loadMore}
                    handleRefresh={this._handleRefresh}
                    saveRef={this._saveRef}
                    activeDomain={activeDomain}
                    theme={theme}
                    enableComments={global.enableComments}
                    navigation={navigation}
                    onIconPress={this._saveRemoveToggle}
                    storyListStyle={global.storyListStyle}
                    listAds={listAds}
                    ad={this.state.ad}
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
                    },
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
                    },
                }}
            >
                Article Removed From Saved List
            </Snackbar>
        </View>
    )
}

class ListScreen extends React.Component {
    state = {
        snackbarSavedVisible: false,
        snackbarRemovedVisible: false,
        isTablet: false,
        ad: null,
    }

    componentDidMount() {
        const { navigation, global, listAds, activeDomain, sendAdAnalytic } = this.props
        if (this.animation) {
            this._playAnimation()
        }
        navigation.setParams({
            headerLogo: global.headerSmall,
        })
        this.getDeviceTypeComponent()

        if (listAds && listAds.images && listAds.images.length) {
            const activeAdImage = listAds.images[Math.floor(Math.random() * listAds.images.length)]
            this.setState({ ad: activeAdImage })
            sendAdAnalytic(activeDomain.url, activeAdImage.id, 'ad_views')
        }
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

    render() {
        const {
            navigation,
            articlesByCategory,
            category,
            theme,
            activeDomain,
            global,
            listAds,
            sendAdAnalytic,
        } = this.props
        const { snackbarSavedVisible, snackbarRemovedVisible, isTablet, ad } = this.state
        const categoryId = this.props.navigation.getParam('categoryId', null)

        if (!categoryId) {
            return (
                <SafeAreaView
                    style={{
                        flex: 1,
                        marginTop: 20,
                    }}
                >
                    <LottieView
                        ref={(animation) => this._saveAnimationRef(animation)}
                        style={StyleSheet.absoluteFill}
                        speed={0.8}
                        loop={true}
                        autoPlay={true}
                        source={require('../assets/lottiefiles/multi-article-loading')}
                    />
                </SafeAreaView>
            )
        }
        if (articlesByCategory.length === 0 && category.isFetching) {
            return (
                <SafeAreaView
                    style={{
                        flex: 1,
                        marginTop: 20,
                    }}
                >
                    <LottieView
                        ref={(animation) => this._saveAnimationRef(animation)}
                        style={StyleSheet.absoluteFill}
                        speed={0.8}
                        loop={true}
                        autoPlay={true}
                        source={require('../assets/lottiefiles/multi-article-loading')}
                    />
                </SafeAreaView>
            )
        }
        if (category.error) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View
                        style={{
                            width: 150,
                            height: 150,
                            alignItems: 'center',
                        }}
                    >
                        <LottieView
                            ref={(animation) => this._saveAnimationRef(animation)}
                            style={{
                                width: 150,
                                height: 150,
                            }}
                            loop={true}
                            autoPlay={true}
                            source={require('../assets/lottiefiles/broken-stick-error')}
                        />
                    </View>
                    <Text style={{ textAlign: 'center', fontSize: 17, padding: 30 }}>
                        Sorry, something went wrong. If you are the site owner, please submit a
                        support request.
                    </Text>
                    <Button
                        mode='contained'
                        theme={{
                            roundness: 7,
                            colors: {
                                primary: theme ? theme.colors.primary : '#2099CE',
                            },
                        }}
                        style={{ padding: 5 }}
                        onPress={this._handleRefresh}
                    >
                        Reload
                    </Button>
                </View>
            )
        }

        return (
            <View style={{ flex: 1 }}>
                <NavigationEvents
                    onDidFocus={() => {
                        if (ad && ad.id) {
                            console.log('sending ad analytic')
                            sendAdAnalytic(activeDomain.url, ad.id, 'ad_views')
                        }
                    }}
                />
                {isTablet ? (
                    <TabletArticleListContent
                        articleList={articlesByCategory}
                        isFetching={category.isFetching}
                        isRefreshing={category.didInvalidate || false}
                        loadMore={this._loadMore}
                        handleRefresh={this._handleRefresh}
                        saveRef={this._saveRef}
                        activeDomain={activeDomain}
                        theme={theme}
                        enableComments={global.enableComments}
                        navigation={navigation}
                        onIconPress={this._saveRemoveToggle}
                        listAds={listAds}
                        ad={this.state.ad}
                    />
                ) : (
                    <ArticleListContent
                        articleList={articlesByCategory}
                        isFetching={category.isFetching}
                        isRefreshing={category.didInvalidate || false}
                        loadMore={this._loadMore}
                        handleRefresh={this._handleRefresh}
                        saveRef={this._saveRef}
                        activeDomain={activeDomain}
                        theme={theme}
                        enableComments={global.enableComments}
                        navigation={navigation}
                        onIconPress={this._saveRemoveToggle}
                        storyListStyle={global.storyListStyle}
                        listAds={listAds}
                        ad={this.state.ad}
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
                        },
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
                        },
                    }}
                >
                    Article Removed From Saved List
                </Snackbar>
            </View>
        )
    }

    _scrollToTop = () => {
        this.flatListRef.scrollToOffset({ animated: true, offset: 0 })
    }

    _saveRef = (ref) => {
        this.flatListRef = ref
    }

    _saveAnimationRef = (ref) => {
        this.animation = ref
    }

    _saveRemoveToggle = (article) => {
        if (article.saved) {
            this._handleArticleRemove(article.id)
        } else {
            this._handleArticleSave(article)
        }
    }

    _handleArticleSave = (article) => {
        const { activeDomain, saveArticle } = this.props
        saveArticle(article, activeDomain.id)
        this.setState({
            snackbarSavedVisible: true,
        })
    }

    _handleArticleRemove = (articleId) => {
        const { activeDomain } = this.props
        this.props.removeSavedArticle(articleId, activeDomain.id)
        this.setState({
            snackbarRemovedVisible: true,
        })
    }

    _loadMore = () => {
        const { activeDomain, category, fetchMoreArticlesIfNeeded } = this.props
        fetchMoreArticlesIfNeeded({
            domain: activeDomain.url,
            category: category.categoryId,
        })
    }

    _handleRefresh = () => {
        const { activeDomain, category, invalidateArticles, fetchArticlesIfNeeded } = this.props
        invalidateArticles(category.categoryId)
        fetchArticlesIfNeeded({
            domain: activeDomain.url,
            category: category.categoryId,
        })
    }

    _playAnimation = () => {
        this.animation.reset()
        this.animation.play()
    }
}

const styles = StyleSheet.create({
    snackbar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    title: {
        ...Platform.select({
            ios: {
                fontSize: 17,
                fontWeight: '600',
            },
            android: {
                fontSize: 20,
                fontWeight: '500',
            },
            default: {
                fontSize: 18,
                fontWeight: '400',
            },
        }),
    },
})
