import React, { useEffect, useState, useRef } from 'react'
import { View, Text, StyleSheet, Platform } from 'react-native'

import { useIsTablet } from '../utils/helpers'
import LottieView from 'lottie-react-native'

import { Snackbar, Button } from 'react-native-paper'

import ArticleListContent from '../views/ArticleListContent'
import TabletArticleListContent from '../views/TabletArticleListContent'
import ErrorView from '../components/ErrorView'

const ListScreen = (props) => {
    const {
        route,
        navigation,
        theme,
        global,
        listAds,
        activeDomain,
        sendAdAnalytic,
        categoryId,
        category,
        articlesByCategory,
        invalidateArticles,
        fetchArticlesIfNeeded,
        fetchMoreArticlesIfNeeded,
        removeSavedArticle,
    } = props

    const [snackbarSavedVisible, setSnackbarSavedVisible] = useState(false)
    const [snackbarRemovedVisible, setSnackbarRemovedVisible] = useState(false)
    const isTablet = useIsTablet()
    const [ad, setAd] = useState(null)

    const animationRef = useRef(null)
    const flatListRef = useRef(null)

    useEffect(() => {
        _playAnimation()

        if (listAds && listAds.images && listAds.images.length) {
            const activeAdImage = listAds.images[Math.floor(Math.random() * listAds.images.length)]
            if (activeAdImage.id) {
                setAd(activeAdImage)
                sendAdAnalytic(activeDomain.url, activeAdImage.id, 'ad_views')
            }
        }
    }, [listAds])

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            if (ad && ad.id) {
                console.log('sending ad analytic')
                sendAdAnalytic(activeDomain.url, ad.id, 'ad_views')
            }
        })

        return unsubscribe
    }, [navigation])

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

    _handleArticleRemove = (articleId) => {
        removeSavedArticle(articleId, activeDomain.id)
        setSnackbarRemovedVisible(true)
    }

    _loadMore = () => {
        fetchMoreArticlesIfNeeded({
            domain: activeDomain.url,
            category: category.categoryId,
        })
    }

    _scrollToTop = () => {
        flatListRef.scrollToOffset({ animated: true, offset: 0 })
    }

    _saveRef = (ref) => {
        flatListRef = ref
    }

    _saveRemoveToggle = (article) => {
        if (article.saved) {
            _handleArticleRemove(article.id)
        } else {
            _handleArticleSave(article)
        }
    }

    _handleArticleSave = (article) => {
        const { activeDomain, saveArticle } = this.props
        saveArticle(article, activeDomain.id)
        this.setState({
            snackbarSavedVisible: true,
        })
    }

    console.log('extra', categoryId, articlesByCategory, category)

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
        return <ErrorView onRefresh={_handleRefresh} />
    }

    return (
        <View style={{ flex: 1 }}>
            {isTablet ? (
                <TabletArticleListContent
                    articleList={articlesByCategory}
                    isFetching={category.isFetching}
                    isRefreshing={category.didInvalidate || false}
                    loadMore={_loadMore}
                    handleRefresh={_handleRefresh}
                    saveRef={_saveRef}
                    activeDomain={activeDomain}
                    theme={theme}
                    enableComments={global.enableComments}
                    navigation={navigation}
                    onIconPress={_saveRemoveToggle}
                    listAds={listAds}
                    ad={ad}
                />
            ) : (
                <ArticleListContent
                    articleList={articlesByCategory}
                    isFetching={category.isFetching}
                    isRefreshing={category.didInvalidate || false}
                    loadMore={_loadMore}
                    handleRefresh={_handleRefresh}
                    saveRef={_saveRef}
                    activeDomain={activeDomain}
                    theme={theme}
                    enableComments={global.enableComments}
                    navigation={navigation}
                    onIconPress={_saveRemoveToggle}
                    storyListStyle={global.storyListStyle}
                    listAds={listAds}
                    ad={ad}
                />
            )}
            <Snackbar
                visible={snackbarSavedVisible}
                style={styles.snackbar}
                duration={3000}
                onDismiss={() => setSnackbarSavedVisible(false)}
                action={{
                    label: 'Dismiss',
                    onPress: () => {
                        setSnackbarSavedVisible(false)
                    },
                }}
            >
                Article Added To Saved List
            </Snackbar>
            <Snackbar
                visible={snackbarRemovedVisible}
                style={styles.snackbar}
                duration={3000}
                onDismiss={() => setSnackbarRemovedVisible(false)}
                action={{
                    label: 'Dismiss',
                    onPress: () => {
                        setSnackbarRemovedVisible(false)
                    },
                }}
            >
                Article Removed From Saved List
            </Snackbar>
        </View>
    )
}

// class ListScreen2 extends React.Component {
//     state = {
//         snackbarSavedVisible: false,
//         snackbarRemovedVisible: false,
//         isTablet: false,
//         ad: null,
//     }

//     // componentDidMount() {
//     //     const { navigation, global, listAds, activeDomain, sendAdAnalytic } = this.props
//     //     if (this.animation) {
//     //         this._playAnimation()
//     //     }
//     //     navigation.setParams({
//     //         headerLogo: global.headerSmall,
//     //     })
//     //     this.getDeviceTypeComponent()
//     // }

//     componentDidUpdate() {
//         if (this.animation) {
//             this._playAnimation()
//         }
//         const { navigation } = this.props
//         if (navigation.state.params && navigation.state.params.scrollToTop) {
//             if (this.flatListRef) {
//                 // scroll list to top
//                 this._scrollToTop()
//             }
//             navigation.setParams({ scrollToTop: false })
//         }
//     }

//     render() {
//         const {
//             navigation,
//             articlesByCategory,
//             category,
//             theme,
//             activeDomain,
//             global,
//             listAds,
//             sendAdAnalytic,
//         } = this.props
//         const { snackbarSavedVisible, snackbarRemovedVisible, isTablet, ad } = this.state
//         const categoryId = this.props.navigation.getParam('categoryId', null)

//         if (!categoryId) {
//             return (
//                 <SafeAreaView
//                     style={{
//                         flex: 1,
//                         marginTop: 20,
//                     }}
//                 >
//                     <LottieView
//                         ref={(animation) => this._saveAnimationRef(animation)}
//                         style={StyleSheet.absoluteFill}
//                         speed={0.8}
//                         loop={true}
//                         autoPlay={true}
//                         source={require('../assets/lottiefiles/multi-article-loading')}
//                     />
//                 </SafeAreaView>
//             )
//         }
//         if (articlesByCategory.length === 0 && category.isFetching) {
//             return (
//                 <SafeAreaView
//                     style={{
//                         flex: 1,
//                         marginTop: 20,
//                     }}
//                 >
//                     <LottieView
//                         ref={(animation) => this._saveAnimationRef(animation)}
//                         style={StyleSheet.absoluteFill}
//                         speed={0.8}
//                         loop={true}
//                         autoPlay={true}
//                         source={require('../assets/lottiefiles/multi-article-loading')}
//                     />
//                 </SafeAreaView>
//             )
//         }
//         if (category.error) {
//             return (
//                 <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//                     <View
//                         style={{
//                             width: 150,
//                             height: 150,
//                             alignItems: 'center',
//                         }}
//                     >
//                         <LottieView
//                             ref={(animation) => this._saveAnimationRef(animation)}
//                             style={{
//                                 width: 150,
//                                 height: 150,
//                             }}
//                             loop={true}
//                             autoPlay={true}
//                             source={require('../assets/lottiefiles/broken-stick-error')}
//                         />
//                     </View>
//                     <Text style={{ textAlign: 'center', fontSize: 17, padding: 30 }}>
//                         Sorry, something went wrong. If you are the site owner, please submit a
//                         support request.
//                     </Text>
//                     <Button
//                         mode='contained'
//                         theme={{
//                             roundness: 7,
//                             colors: {
//                                 primary: theme ? theme.colors.primary : '#2099CE',
//                             },
//                         }}
//                         style={{ padding: 5 }}
//                         onPress={this._handleRefresh}
//                     >
//                         Reload
//                     </Button>
//                 </View>
//             )
//         }

//         return (
//             <View style={{ flex: 1 }}>
//                 <NavigationEvents
//                     onDidFocus={() => {
//                         if (ad && ad.id) {
//                             console.log('sending ad analytic')
//                             sendAdAnalytic(activeDomain.url, ad.id, 'ad_views')
//                         }
//                     }}
//                 />
//                 {isTablet ? (
//                     <TabletArticleListContent
//                         articleList={articlesByCategory}
//                         isFetching={category.isFetching}
//                         isRefreshing={category.didInvalidate || false}
//                         loadMore={this._loadMore}
//                         handleRefresh={this._handleRefresh}
//                         saveRef={this._saveRef}
//                         activeDomain={activeDomain}
//                         theme={theme}
//                         enableComments={global.enableComments}
//                         navigation={navigation}
//                         onIconPress={this._saveRemoveToggle}
//                         listAds={listAds}
//                         ad={this.state.ad}
//                     />
//                 ) : (
//                     <ArticleListContent
//                         articleList={articlesByCategory}
//                         isFetching={category.isFetching}
//                         isRefreshing={category.didInvalidate || false}
//                         loadMore={this._loadMore}
//                         handleRefresh={this._handleRefresh}
//                         saveRef={this._saveRef}
//                         activeDomain={activeDomain}
//                         theme={theme}
//                         enableComments={global.enableComments}
//                         navigation={navigation}
//                         onIconPress={this._saveRemoveToggle}
//                         storyListStyle={global.storyListStyle}
//                         listAds={listAds}
//                         ad={this.state.ad}
//                     />
//                 )}
//                 <Snackbar
//                     visible={snackbarSavedVisible}
//                     style={styles.snackbar}
//                     duration={3000}
//                     onDismiss={() => this.setState({ snackbarSavedVisible: false })}
//                     action={{
//                         label: 'Dismiss',
//                         onPress: () => {
//                             this.setState({ snackbarSavedVisible: false })
//                         },
//                     }}
//                 >
//                     Article Added To Saved List
//                 </Snackbar>
//                 <Snackbar
//                     visible={snackbarRemovedVisible}
//                     style={styles.snackbar}
//                     duration={3000}
//                     onDismiss={() => this.setState({ snackbarRemovedVisible: false })}
//                     action={{
//                         label: 'Dismiss',
//                         onPress: () => {
//                             this.setState({ snackbarRemovedVisible: false })
//                         },
//                     }}
//                 >
//                     Article Removed From Saved List
//                 </Snackbar>
//             </View>
//         )
//     }
// }

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

export default ListScreen
