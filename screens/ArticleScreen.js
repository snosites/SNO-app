import React, { useState, useEffect, useRef } from 'react'
import { ScrollView, StyleSheet, Share, View, TouchableOpacity, Text } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import * as Amplitude from 'expo-analytics-amplitude'
import LottieView from 'lottie-react-native'
import { connect } from 'react-redux'
import { NavigationEvents, SafeAreaView } from 'react-navigation'

import { actions as savedArticleActions } from '../redux/savedArticles'
import { getActiveDomain } from '../redux/domains'
import { actions as userActions, getPushToken, getWriterSubscriptions } from '../redux/user'
import { actions as adActions, getStoryAds } from '../redux/ads'

import { FAB, Portal, Snackbar, Dialog, Button, Checkbox } from 'react-native-paper'

import ArticleBodyContent from '../views/ArticleBodyContent'

import layout from '../constants/Layout'

const ArticleScreen = (props) => {
    const { route, navigation, theme, activeDomain } = props

    const [expandCaption, setExpandCaption] = useState(false)
    const [loadingLink, setLoadingLink] = useState(false)

    const animationRef = useRef(null)
    const scrollViewRef = useRef(null)

    let article = route.params && route.params.article ? route.params.article : null

    console.log('article', article)

    _handleCaptionClick = () => {
        setExpandCaption(!expandCaption)
    }

    if (!article) {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: '#fff',
                    alignContent: 'center',
                    justifyContent: 'center',
                }}
            >
                <LottieView
                    style={StyleSheet.absoluteFill}
                    ref={animationRef}
                    loop={true}
                    autoPlay={true}
                    source={require('../assets/lottiefiles/article-loading-animation')}
                />
            </View>
        )
    }

    return (
        <View style={{ flex: 1 }}>
            <ScrollView ref={scrollViewRef}>
                {/* <NavigationEvents
                    onDidFocus={() => {
                        this.setState({
                            showPortal: true,
                        })
                        if (ad && ad.id) {
                            sendAdAnalytic(activeDomain.url, ad.id, 'ad_views')
                        }
                        if (storyAds.snoAds && storyAds.snoAds.ad_spot_id) {
                            fetchSnoAdImage(storyAds.snoAds.ad_spot_id, storyAds.snoAds.ad_fill)
                        }
                    }}
                    onWillBlur={() => {
                        // StatusBar.setStatusBarHidden(true)
                        this.setState({
                            showPortal: false,
                            expandCaption: false,
                        })
                    }}
                /> */}
                <ArticleBodyContent
                    navigation={navigation}
                    article={article}
                    theme={theme}
                    handleCaptionClick={_handleCaptionClick}
                    expandCaption={expandCaption}
                    activeDomain={activeDomain}
                    setLoadingLink={(state) => setLoadingLink(state)}
                    // ad={ad}
                    // adPosition={storyAds ? storyAds.displayLocation : null}
                    // snoAd={storyAds && storyAds.snoAdImage ? storyAds.snoAdImage : null}
                />
                {/* {articleChapters.map((article) => (
                    <ArticleBodyContent
                        key={article.id}
                        navigation={navigation}
                        article={article}
                        theme={theme}
                        handleCaptionClick={this._handleCaptionClick}
                        expandCaption={this.state.expandCaption}
                        activeDomain={activeDomain}
                        setLoadingLink={(state) => this.setState({ loadingLink: state })}
                    />
                ))} */}

                {/* {this.state.showPortal && (
                    <Portal>
                        <SafeAreaView style={{ flex: 1, justifyContent: 'flex-end' }}>
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
                            <FAB.Group
                                style={{
                                    flex: 1,
                                    position: 'relative',
                                    paddingBottom: snackbarSavedVisible ? 100 : 50,
                                }}
                                open={this.state.fabOpen}
                                icon={this.state.fabOpen ? 'close' : 'plus'}
                                actions={this._renderFabActions(article)}
                                onStateChange={({ open }) =>
                                    this.setState({
                                        fabOpen: open,
                                    })
                                }
                                onPress={() => {
                                    if (this.state.open) {
                                        // do something if the speed dial is open
                                    }
                                }}
                            />
                        </SafeAreaView>
                    </Portal> */}
                {/* )} */}
            </ScrollView>
        </View>
    )
}

// const ArticleScreen2 = (props) => {
//     const {
//         route,
//         navigation,
//         storyAds,
//         fetchSnoAdImage,
//         activeDomain,
//         writerSubscriptions,
//         enableComments,
//         navigation,
//         theme,
//         pushToken,
//         subscribe,
//         activeDomain,
//         writerSubscriptions,
//         storyAds,
//         sendAdAnalytic,
//         fetchSnoAdImage,
//     } = props

//     const animationRef = useRef(null)

//     _getFilteredWriters = (domainId, terms, writerSubscriptions) => {
//         if (terms && terms.errors) {
//             return []
//         }
//         const filteredWriters = terms.filter((termObj) => {
//             const foundSub = writerSubscriptions.find(
//                 (writerObj) =>
//                     writerObj.writer_id === termObj.term_id &&
//                     writerObj.organization_id === domainId
//             )
//             if (foundSub) {
//                 return false
//             } else {
//                 return true
//             }
//         })
//         return filteredWriters
//     }

//     _renderFabActions = (article) => {
//         const {
//             custom_fields: { terms },
//         } = article
//         const { activeDomain, writerSubscriptions, navigation, enableComments } = this.props
//         const filteredWriters = this._getFilteredWriters(
//             activeDomain.id,
//             terms,
//             writerSubscriptions
//         )
//         const fabActions = [
//             {
//                 icon: 'send',
//                 label: 'Share',
//                 onPress: () => {
//                     this._shareArticle(article)
//                 },
//             },
//             {
//                 icon: 'bookmark',
//                 label: 'Save',
//                 onPress: () => this._handleArticleSave(article),
//             },
//         ]

//         if (enableComments) {
//             fabActions.unshift({
//                 icon: 'comment',
//                 label: 'Comment',
//                 onPress: () =>
//                     navigation.navigate('Comments', {
//                         comments: article.comments,
//                         articleId: article.id,
//                     }),
//             })
//         }

//         if (filteredWriters.length > 0 && terms && !terms.errors) {
//             fabActions.unshift({
//                 icon: 'account-plus',
//                 label: 'Subscribe to this writer',
//                 onPress: () => this._handleSubscribeToWriter(terms),
//             })
//         }

//         return fabActions
//     }

//     _handleSubscribeToWriter = (terms) => {
//         this.setState({
//             showDialog: true,
//         })
//     }

//      const { snackbarSavedVisible, loadingLink, ad } = this.state

//     let article = route.params && route.params.article ? route.params.article : null
//     //  let articleChapters = navigation.getParam('articleChapters', [])

//     if (!article) {
//         return (
//             <View
//                 style={{
//                     flex: 1,
//                     alignContent: 'center',
//                     justifyContent: 'center',
//                 }}
//             >
//                 <LottieView
//                     style={StyleSheet.absoluteFill}
//                     ref={animationRef}
//                     loop={true}
//                     autoPlay={true}
//                     source={require('../assets/lottiefiles/article-loading-animation')}
//                 />
//             </View>
//         )
//     }

//     return <View style={{ flex: 1, backgroundColor: 'blue' }}></View>

//     const unsubscribedWriters = this._getFilteredWriters(
//         activeDomain.id,
//         article.custom_fields.terms,
//         writerSubscriptions
//     )

// }

// class FullArticleScreen extends React.Component {
//     static navigationOptions = ({ navigation, navigation: { state } }) => {
//         return {
//             headerTitle: <CustomArticleHeader state={state} navigation={navigation} />,
//         }
//     }

//     state = {
//         fabOpen: false,
//         showPortal: true,
//         snackbarSavedVisible: false,
//         expandCaption: false,
//         showDialog: false,
//         subscribeTo: [],
//         loadingLink: false,
//         ad: null,
//     }

//     componentDidMount() {
//         // console.log('full article screen mounted')
//         const { storyAds, fetchSnoAdImage } = this.props
//         if (this.animation) {
//             this.animation.play()
//         }
//         if (storyAds && storyAds.images && !storyAds.snoAds) {
//             this.setState({
//                 ad: storyAds.images[Math.floor(Math.random() * storyAds.images.length)],
//             })
//         }
//     }

//     componentDidUpdate() {
//         const scrollToTop = this.props.navigation.getParam('scrollToTop', false)

//         if (scrollToTop && this.flatListRef) {
//             this._scrollToTop()
//         }
//     }

//     _saveRef = (ref) => {
//         this.flatListRef = ref
//     }

//     _scrollToTop = () => {
//         this.flatListRef.scrollTo({ x: 0, y: 0, animated: true })
//     }

//     _getFilteredWriters = (domainId, terms, writerSubscriptions) => {
//         if (terms && terms.errors) {
//             return []
//         }
//         const filteredWriters = terms.filter((termObj) => {
//             const foundSub = writerSubscriptions.find(
//                 (writerObj) =>
//                     writerObj.writer_id === termObj.term_id &&
//                     writerObj.organization_id === domainId
//             )
//             if (foundSub) {
//                 return false
//             } else {
//                 return true
//             }
//         })
//         return filteredWriters
//     }

//     _renderFabActions = (article) => {
//         const {
//             custom_fields: { terms },
//         } = article
//         const { activeDomain, writerSubscriptions, navigation, enableComments } = this.props
//         const filteredWriters = this._getFilteredWriters(
//             activeDomain.id,
//             terms,
//             writerSubscriptions
//         )
//         const fabActions = [
//             {
//                 icon: 'send',
//                 label: 'Share',
//                 onPress: () => {
//                     this._shareArticle(article)
//                 },
//             },
//             {
//                 icon: 'bookmark',
//                 label: 'Save',
//                 onPress: () => this._handleArticleSave(article),
//             },
//         ]

//         if (enableComments) {
//             fabActions.unshift({
//                 icon: 'comment',
//                 label: 'Comment',
//                 onPress: () =>
//                     navigation.navigate('Comments', {
//                         comments: article.comments,
//                         articleId: article.id,
//                     }),
//             })
//         }

//         if (filteredWriters.length > 0 && terms && !terms.errors) {
//             fabActions.unshift({
//                 icon: 'account-plus',
//                 label: 'Subscribe to this writer',
//                 onPress: () => this._handleSubscribeToWriter(terms),
//             })
//         }

//         return fabActions
//     }

//     _handleSubscribeToWriter = (terms) => {
//         this.setState({
//             showDialog: true,
//         })
//     }

//     render() {
//         const {
//             navigation,
//             theme,
//             pushToken,
//             subscribe,
//             activeDomain,
//             writerSubscriptions,
//             storyAds,
//             sendAdAnalytic,
//             fetchSnoAdImage,
//         } = this.props
//         const { snackbarSavedVisible, loadingLink, ad } = this.state

//         let article = navigation.getParam('article', 'loading')
//         let articleChapters = navigation.getParam('articleChapters', [])

//         if (!article || article === 'loading' || loadingLink) {
//             return (
//                 <View
//                     style={{
//                         flex: 1,
//                         alignContent: 'center',
//                         justifyContent: 'center',
//                     }}
//                 >
//                     {/* <ActivityIndicator /> */}
//                     <LottieView
//                         style={StyleSheet.absoluteFill}
//                         ref={(animation) => {
//                             this.animation = animation
//                         }}
//                         loop
//                         autoPlay
//                         source={require('../assets/lottiefiles/article-loading-animation')}
//                     />
//                 </View>
//             )
//         }

//         const unsubscribedWriters = this._getFilteredWriters(
//             activeDomain.id,
//             article.custom_fields.terms,
//             writerSubscriptions
//         )

//         return (
//             <View style={{ flex: 1 }}>
//                 <ScrollView
//                     ref={(ref) => {
//                         this.flatListRef = ref
//                     }}
//                 >
//                     <NavigationEvents
//                         onDidFocus={() => {
//                             this.setState({
//                                 showPortal: true,
//                             })
//                             if (ad && ad.id) {
//                                 sendAdAnalytic(activeDomain.url, ad.id, 'ad_views')
//                             }
//                             if (storyAds.snoAds && storyAds.snoAds.ad_spot_id) {
//                                 fetchSnoAdImage(storyAds.snoAds.ad_spot_id, storyAds.snoAds.ad_fill)
//                             }
//                         }}
//                         onWillBlur={() => {
//                             // StatusBar.setStatusBarHidden(true)
//                             this.setState({
//                                 showPortal: false,
//                                 expandCaption: false,
//                             })
//                         }}
//                     />
//                     <ArticleBodyContent
//                         navigation={navigation}
//                         article={article}
//                         theme={theme}
//                         handleCaptionClick={this._handleCaptionClick}
//                         expandCaption={this.state.expandCaption}
//                         activeDomain={activeDomain}
//                         setLoadingLink={(state) => this.setState({ loadingLink: state })}
//                         ad={ad}
//                         adPosition={storyAds ? storyAds.displayLocation : null}
//                         snoAd={storyAds && storyAds.snoAdImage ? storyAds.snoAdImage : null}
//                     />
//                     {articleChapters.map((article) => (
//                         <ArticleBodyContent
//                             key={article.id}
//                             navigation={navigation}
//                             article={article}
//                             theme={theme}
//                             handleCaptionClick={this._handleCaptionClick}
//                             expandCaption={this.state.expandCaption}
//                             activeDomain={activeDomain}
//                             setLoadingLink={(state) => this.setState({ loadingLink: state })}
//                         />
//                     ))}

//                     {this.state.showPortal && (
//                         <Portal>
//                             <SafeAreaView style={{ flex: 1, justifyContent: 'flex-end' }}>
//                                 <Snackbar
//                                     visible={snackbarSavedVisible}
//                                     style={styles.snackbar}
//                                     duration={3000}
//                                     onDismiss={() => this.setState({ snackbarSavedVisible: false })}
//                                     action={{
//                                         label: 'Dismiss',
//                                         onPress: () => {
//                                             this.setState({ snackbarSavedVisible: false })
//                                         },
//                                     }}
//                                 >
//                                     Article Added To Saved List
//                                 </Snackbar>
//                                 <FAB.Group
//                                     style={{
//                                         flex: 1,
//                                         position: 'relative',
//                                         paddingBottom: snackbarSavedVisible ? 100 : 50,
//                                     }}
//                                     open={this.state.fabOpen}
//                                     icon={this.state.fabOpen ? 'close' : 'plus'}
//                                     actions={this._renderFabActions(article)}
//                                     onStateChange={({ open }) =>
//                                         this.setState({
//                                             fabOpen: open,
//                                         })
//                                     }
//                                     onPress={() => {
//                                         if (this.state.open) {
//                                             // do something if the speed dial is open
//                                         }
//                                     }}
//                                 />
//                             </SafeAreaView>
//                         </Portal>
//                     )}
//                     <Portal>
//                         <Dialog
//                             visible={this.state.showDialog}
//                             onDismiss={() => this.setState({ showDialog: false })}
//                             style={{ maxHeight: 0.7 * layout.window.height }}
//                         >
//                             <Dialog.Title>Please choose who you would like to follow</Dialog.Title>
//                             <Dialog.ScrollArea>
//                                 <ScrollView contentContainerStyle={{ paddingHorizontal: 24 }}>
//                                     {article.custom_fields.terms &&
//                                         !article.custom_fields.terms.errors &&
//                                         article.custom_fields.terms.map((term) => {
//                                             const found = this.state.subscribeTo.filter(
//                                                 (writerObj) => writerObj.id === term.term_id
//                                             )
//                                             const status =
//                                                 found.length > 0 ? 'checked' : 'unchecked'
//                                             if (
//                                                 unsubscribedWriters.some(
//                                                     (writerObj) =>
//                                                         writerObj.term_id === term.term_id
//                                                 )
//                                             ) {
//                                                 return (
//                                                     <TouchableOpacity
//                                                         key={term.term_id}
//                                                         onPress={() => {
//                                                             if (status === 'unchecked') {
//                                                                 this.setState({
//                                                                     subscribeTo: [
//                                                                         ...this.state.subscribeTo,
//                                                                         {
//                                                                             id: term.term_id,
//                                                                             name: term.name,
//                                                                         },
//                                                                     ],
//                                                                 })
//                                                             } else {
//                                                                 const updatedList = this.state.subscribeTo.filter(
//                                                                     (writerObj) =>
//                                                                         writerObj.id !==
//                                                                         term.term_id
//                                                                 )
//                                                                 this.setState({
//                                                                     subscribeTo: updatedList,
//                                                                 })
//                                                             }
//                                                         }}
//                                                     >
//                                                         <View
//                                                             style={{
//                                                                 flexDirection: 'row',
//                                                                 alignItems: 'center',
//                                                                 justifyContent: 'flex-start',
//                                                             }}
//                                                         >
//                                                             <Checkbox.Android
//                                                                 uncheckedColor='#757575'
//                                                                 status={status}
//                                                             />
//                                                             <Text
//                                                                 style={{
//                                                                     marginLeft: 5,
//                                                                 }}
//                                                             >
//                                                                 {term.name}
//                                                             </Text>
//                                                         </View>
//                                                     </TouchableOpacity>
//                                                 )
//                                             } else {
//                                                 return (
//                                                     <TouchableOpacity key={term.term_id}>
//                                                         <View
//                                                             style={{
//                                                                 flexDirection: 'row',
//                                                                 alignItems: 'center',
//                                                                 justifyContent: 'flex-start',
//                                                             }}
//                                                         >
//                                                             <Text
//                                                                 style={{
//                                                                     marginRight: 5,
//                                                                     marginLeft: 40,
//                                                                 }}
//                                                             >
//                                                                 {term.name}
//                                                             </Text>
//                                                             <Text
//                                                                 style={{
//                                                                     marginLeft: 5,
//                                                                     fontWeight: 'bold',
//                                                                 }}
//                                                             >
//                                                                 - Already subscribed
//                                                             </Text>
//                                                         </View>
//                                                     </TouchableOpacity>
//                                                 )
//                                             }
//                                         })}
//                                 </ScrollView>
//                             </Dialog.ScrollArea>
//                             <Dialog.Actions>
//                                 <Button
//                                     onPress={() =>
//                                         this.setState({ showDialog: false, subscribeTo: [] })
//                                     }
//                                 >
//                                     Cancel
//                                 </Button>
//                                 <Button
//                                     onPress={() => {
//                                         if (this.state.subscribeTo.length > 0) {
//                                             subscribe({
//                                                 subscriptionType: 'writers',
//                                                 ids: this.state.subscribeTo,
//                                                 domainId: activeDomain.id,
//                                             })
//                                         }
//                                         this.setState({ showDialog: false, subscribeTo: [] })
//                                     }}
//                                 >
//                                     Okay
//                                 </Button>
//                             </Dialog.Actions>
//                         </Dialog>
//                     </Portal>
//                 </ScrollView>
//             </View>
//         )
//     }

//     _shareArticle = (article) => {
//         // log share to analytics
//         Amplitude.logEventWithProperties('social share', {
//             storyId: article.id,
//         })
//         Share.share({
//             title: article.title.rendered,
//             message: article.title.rendered,
//             url: article.link,
//         })
//     }

//     _handleArticleSave = (article) => {
//         const { activeDomain, saveArticle } = this.props
//         saveArticle(article, activeDomain.id)
//         this.setState({
//             snackbarSavedVisible: true,
//         })
//     }

//     _handleCaptionClick = () => {
//         this.setState({
//             expandCaption: !this.state.expandCaption,
//         })
//     }
// }

const styles = StyleSheet.create({
    storyContainer: {
        flex: 1,
    },
    animationContainer: {
        width: 400,
        height: 400,
    },
    snackbar: {
        position: 'absolute',
        bottom: 50,
        left: 0,
        right: 0,
    },
})

export default ArticleScreen
