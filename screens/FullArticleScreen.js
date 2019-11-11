import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Share,
    StatusBar,
    View,
    ActivityIndicator
} from 'react-native';
import * as Amplitude from 'expo-analytics-amplitude';
import LottieView from 'lottie-react-native'
import { connect } from 'react-redux';
import { NavigationEvents, SafeAreaView } from 'react-navigation';

import { actions as savedArticleActions } from '../redux/savedArticles'

import { FAB, Portal, Snackbar } from 'react-native-paper';

import { CustomArticleHeader } from '../components/ArticleHeader';
import ArticleBodyContent from '../views/ArticleBodyContent';

class FullArticleScreen extends React.Component {
    static navigationOptions = ({ navigation, navigation: { state } }) => {
        return {
            headerTitle: <CustomArticleHeader state={state} navigation={navigation} />
        };
    };

    state = {
        fabOpen: false,
        showPortal: true,
        snackbarSavedVisible: false,
        expandCaption: false
    };

    componentDidMount() {
        if(this.animation){
            this.animation.play();
        }
    }

    render() {
        const { navigation, theme } = this.props;
        const { snackbarSavedVisible } = this.state;

        let article = navigation.getParam('article', 'loading')
        let articleChapters = navigation.getParam('articleChapters', [])

        if (article === 'loading') {
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
                            this.animation = animation;
                        }}
                        loop
                        autoPlay
                        source={require('../assets/lottiefiles/article-loading-animation')}
                    />
                </View>
            )
        }

        return (
            <View style={{ flex: 1 }}>
                <ScrollView>
                    <NavigationEvents
                        onDidFocus={() => this.setState({
                            showPortal: true
                        })}
                        onWillBlur={() => {
                            StatusBar.setHidden(false);
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

                    {this.state.showPortal && <Portal>
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
                                style={{ flex: 1, position: 'relative', paddingBottom: snackbarSavedVisible ? 100 : 50 }}
                                open={this.state.fabOpen}
                                icon={this.state.fabOpen ? 'clear' : 'add'}
                                actions={[
                                    {
                                        icon: 'comment', label: 'Comment', onPress: () => navigation.navigate('Comments', {
                                            comments: article.comments,
                                            articleId: article.id
                                        })
                                    },
                                    {
                                        icon: 'send', label: 'Share', onPress: () => {
                                            this._shareArticle(article)
                                        }
                                    },
                                    { icon: 'bookmark', label: 'Save', onPress: () => this._handleArticleSave(article) },
                                ]}
                                onStateChange={({ open }) => this.setState({
                                    fabOpen: open
                                })}
                                onPress={() => {
                                    if (this.state.open) {
                                        // do something if the speed dial is open
                                    }
                                }}
                            />
                        </SafeAreaView>
                    </Portal>}

                </ScrollView>
            </View>

        );
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
        right: 0
    },
})

const mapStateToProps = state => ({
    theme: state.theme,
    activeDomain: state.activeDomain
})

const mapDispatchToProps = dispatch => ({
    saveArticle: (article, domainId) => dispatch(savedArticleActions.saveArticle(article, domainId))
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FullArticleScreen)