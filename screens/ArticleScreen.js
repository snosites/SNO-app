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
    let articleChapters =
        route.params && route.params.articleChapters ? route.params.articleChapters : []

    const _handleCaptionClick = () => {
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
                {articleChapters.map((article) => (
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
                ))}

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
