import React from 'react'
import {
    ScrollView,
    StyleSheet,
    Share,
    StatusBar,
    View,
    TouchableOpacity,
    Text
} from 'react-native'
import * as Amplitude from 'expo-analytics-amplitude'
import LottieView from 'lottie-react-native'
import { connect } from 'react-redux'
import { NavigationEvents, SafeAreaView } from 'react-navigation'

import { actions as savedArticleActions } from '../redux/savedArticles'
import { getActiveDomain } from '../redux/domains'
import { actions as userActions, getPushToken, getWriterSubscriptions } from '../redux/user'

import { FAB, Portal, Snackbar, Dialog, Button, Checkbox } from 'react-native-paper'

import { CustomArticleHeader } from '../components/ArticleHeader'
import ArticleBodyContent from '../views/ArticleBodyContent'

import layout from '../constants/Layout'

class FullArticleScreen extends React.Component {
    static navigationOptions = ({ navigation, navigation: { state } }) => {
        return {
            headerTitle: <CustomArticleHeader state={state} navigation={navigation} />
        }
    }

    state = {
        fabOpen: false,
        showPortal: true,
        snackbarSavedVisible: false,
        expandCaption: false,
        showDialog: false,
        subscribeTo: []
    }

    componentDidMount() {
        if (this.animation) {
            this.animation.play()
        }
    }

    _getFilteredWriters = (domainId, terms, writerSubscriptions) => {
        const filteredWriters = terms.filter(termObj => {
            const foundSub = writerSubscriptions.find(
                writerObj =>
                    writerObj.writer_id === termObj.term_id &&
                    writerObj.organization_id === domainId
            )
            if (foundSub) {
                return false
            } else {
                return true
            }
        })
        return filteredWriters
    }

    _renderFabActions = terms => {
        const { pushToken, activeDomain, writerSubscriptions } = this.props
        const filteredWriters = this._getFilteredWriters(activeDomain.id, terms, writerSubscriptions)
        const fabActions = [
            {
                icon: 'comment',
                label: 'Comment',
                onPress: () =>
                    navigation.navigate('Comments', {
                        comments: article.comments,
                        articleId: article.id
                    })
            },
            {
                icon: 'send',
                label: 'Share',
                onPress: () => {
                    this._shareArticle(article)
                }
            },
            {
                icon: 'bookmark',
                label: 'Save',
                onPress: () => this._handleArticleSave(article)
            }
        ]

        if (filteredWriters.length > 0) {
            fabActions.unshift({
                icon: 'add-alert',
                label: 'Subscribe to this writer',
                onPress: () => this._handleSubscribeToWriter(terms)
            })
        }

        return fabActions
    }

    _handleSubscribeToWriter = terms => {
        this.setState({
            showDialog: true
        })
    }

    render() {
        const {
            navigation,
            theme,
            pushToken,
            subscribe,
            activeDomain,
            writerSubscriptions
        } = this.props
        const { snackbarSavedVisible } = this.state

        let article = navigation.getParam('article', 'loading')
        let articleChapters = navigation.getParam('articleChapters', [])

        console.log('this is the article', article)

        if (!article || article === 'loading') {
            return (
                <View
                    style={{
                        flex: 1,
                        alignContent: 'center',
                        justifyContent: 'center'
                    }}
                >
                    {/* <ActivityIndicator /> */}
                    <LottieView
                        style={StyleSheet.absoluteFill}
                        ref={animation => {
                            this.animation = animation
                        }}
                        loop
                        autoPlay
                        source={require('../assets/lottiefiles/article-loading-animation')}
                    />
                </View>
            )
        }

        const unsubscribedWriters = this._getFilteredWriters(
            activeDomain.id,
            article.custom_fields.terms,
            writerSubscriptions
        )

        return (
            <View style={{ flex: 1 }}>
                <ScrollView>
                    <NavigationEvents
                        onDidFocus={() =>
                            this.setState({
                                showPortal: true
                            })
                        }
                        onWillBlur={() => {
                            StatusBar.setHidden(false)
                            this.setState({
                                showPortal: false,
                                expandCaption: false
                            })
                        }}
                    />
                    <ArticleBodyContent
                        navigation={navigation}
                        article={article}
                        theme={theme}
                        handleCaptionClick={this._handleCaptionClick}
                        expandCaption={this.state.expandCaption}
                    />
                    {articleChapters.map(article => (
                        <ArticleBodyContent
                            key={article.id}
                            navigation={navigation}
                            article={article}
                            theme={theme}
                            handleCaptionClick={this._handleCaptionClick}
                            expandCaption={this.state.expandCaption}
                        />
                    ))}

                    {this.state.showPortal && (
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
                                        }
                                    }}
                                >
                                    Article Added To Saved List
                                </Snackbar>
                                <FAB.Group
                                    style={{
                                        flex: 1,
                                        position: 'relative',
                                        paddingBottom: snackbarSavedVisible ? 100 : 50
                                    }}
                                    open={this.state.fabOpen}
                                    icon={this.state.fabOpen ? 'clear' : 'add'}
                                    actions={this._renderFabActions(article.custom_fields.terms)}
                                    onStateChange={({ open }) =>
                                        this.setState({
                                            fabOpen: open
                                        })
                                    }
                                    onPress={() => {
                                        if (this.state.open) {
                                            // do something if the speed dial is open
                                        }
                                    }}
                                />
                            </SafeAreaView>
                        </Portal>
                    )}
                    <Portal>
                        <Dialog
                            visible={this.state.showDialog}
                            onDismiss={() => this.setState({ showDialog: false })}
                            style={{ maxHeight: 0.7 * layout.window.height }}
                        >
                            <Dialog.Title>Please choose who you would like to follow</Dialog.Title>
                            <Dialog.ScrollArea>
                                <ScrollView contentContainerStyle={{ paddingHorizontal: 24 }}>
                                    {article.custom_fields.terms.map(term => {
                                        const found = this.state.subscribeTo.filter(
                                            writerObj => writerObj.id === term.term_id
                                        )
                                        const status = found.length > 0 ? 'checked' : 'unchecked'
                                        if (unsubscribedWriters.some(writerObj => writerObj.term_id === term.term_id)){
                                            return (
                                                <TouchableOpacity
                                                    key={term.term_id}
                                                    onPress={() => {
                                                        if (status === 'unchecked') {
                                                            this.setState({
                                                                subscribeTo: [
                                                                    ...this.state.subscribeTo,
                                                                    {
                                                                        id: term.term_id,
                                                                        name: term.name
                                                                    }
                                                                ]
                                                            })
                                                        } else {
                                                            const updatedList = this.state.subscribeTo.filter(
                                                                writerObj =>
                                                                    writerObj.id !== term.term_id
                                                            )
                                                            this.setState({
                                                                subscribeTo: updatedList
                                                            })
                                                        }
                                                    }}
                                                >
                                                    <View
                                                        style={{
                                                            flexDirection: 'row',
                                                            alignItems: 'center',
                                                            justifyContent: 'flex-start'
                                                        }}
                                                    >
                                                        <Checkbox.Android
                                                            uncheckedColor='#757575'
                                                            status={status}
                                                        />
                                                        <Text
                                                            style={{
                                                                marginLeft: 5
                                                            }}
                                                        >
                                                            {term.name}
                                                        </Text>
                                                    </View>
                                                </TouchableOpacity>
                                            )
                                        } else {
                                            return (
                                                <TouchableOpacity
                                                    key={term.term_id}
                                                >
                                                    <View
                                                        style={{
                                                            flexDirection: 'row',
                                                            alignItems: 'center',
                                                            justifyContent: 'flex-start'
                                                        }}
                                                    >
                                                        <Text
                                                            style={{
                                                                marginRight: 5,
                                                                marginLeft: 40,
                                                            }}
                                                        >
                                                            {term.name}
                                                        </Text>
                                                        <Text
                                                            style={{
                                                                marginLeft: 5,
                                                                fontWeight: 'bold'
                                                            }}
                                                        >
                                                            - Already subscribed
                                                        </Text>
                                                    </View>
                                                </TouchableOpacity>
                                            )
                                        }
                                            
                                    })}
                                </ScrollView>
                            </Dialog.ScrollArea>
                            <Dialog.Actions>
                                <Button
                                    onPress={() =>
                                        this.setState({ showDialog: false, subscribeTo: [] })
                                    }
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onPress={() => {
                                        if (this.state.subscribeTo.length > 0) {
                                            subscribe({
                                                subscriptionType: 'writers',
                                                ids: this.state.subscribeTo,
                                                domainId: activeDomain.id
                                            })
                                        }
                                        this.setState({ showDialog: false, subscribeTo: [] })
                                        console.log('sub to list', this.state.subscribeTo)
                                    }}
                                >
                                    Okay
                                </Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>
                </ScrollView>
            </View>
        )
    }

    _shareArticle = article => {
        // log share to analytics
        Amplitude.logEventWithProperties('social share', {
            storyId: article.id
        })
        Share.share({
            title: article.title.rendered,
            message: article.title.rendered,
            url: article.link
        })
    }

    _handleArticleSave = article => {
        const { activeDomain, saveArticle } = this.props
        saveArticle(article, activeDomain.id)
        this.setState({
            snackbarSavedVisible: true
        })
    }

    _handleCaptionClick = () => {
        this.setState({
            expandCaption: !this.state.expandCaption
        })
    }
}

const styles = StyleSheet.create({
    storyContainer: {
        flex: 1
    },
    animationContainer: {
        width: 400,
        height: 400
    },
    snackbar: {
        position: 'absolute',
        bottom: 50,
        left: 0,
        right: 0
    }
})

const mapStateToProps = state => ({
    theme: state.theme,
    activeDomain: getActiveDomain(state),
    pushToken: getPushToken(state),
    writerSubscriptions: getWriterSubscriptions(state)
})

const mapDispatchToProps = dispatch => ({
    saveArticle: (article, domainId) =>
        dispatch(savedArticleActions.saveArticle(article, domainId)),
    subscribe: payload => dispatch(userActions.subscribe(payload))
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FullArticleScreen)
