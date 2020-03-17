import React from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import LottieView from 'lottie-react-native'
import * as Device from 'expo-device'

import { Snackbar } from 'react-native-paper'

import { actions as savedArticleActions } from '../redux/savedArticles'
import { getActiveDomain } from '../redux/domains'

import ArticleListContent from '../views/ArticleListContent'
import TabletArticleListContent from '../views/TabletArticleListContent'

class SavedArticlesScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const logo = navigation.getParam('headerLogo', null)
        return {
            title: 'Saved Stories',
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
        snackbarVisible: false,
        isTablet: false
    }

    componentDidMount() {
        const { navigation, global } = this.props
        if (this.animation) {
            this._playAnimation()
        }
        navigation.setParams({
            headerLogo: global.headerSmall
        })
        this.getDeviceTypeComponent()
    }

    async getDeviceTypeComponent() {
        const deviceType = await Device.getDeviceTypeAsync()

        if (Device.DeviceType[deviceType] === 'TABLET') {
            this.setState({ isTablet: true })
        } else {
            this.setState({ isTablet: false })
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
        const { savedArticles, activeDomain, theme, navigation, global } = this.props
        const { snackbarVisible, isTablet } = this.state
        if (savedArticles === 'loading') {
            return (
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <View style={styles.animationContainer}>
                        <LottieView
                            ref={animation => {
                                this.animation = animation
                            }}
                            style={{
                                width: 400,
                                height: 400
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
        if (savedArticles.length == 0) {
            return (
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text
                        style={{
                            fontSize: 18,
                            textAlign: 'center',
                            padding: 20,
                            fontWeight: 'bold'
                        }}
                    >
                        You don't have any saved articles for this school yet
                    </Text>
                </View>
            )
        }
        return (
            <View style={{ flex: 1 }}>
                {isTablet ? (
                    <TabletArticleListContent
                        articleList={savedArticles}
                        saveRef={this._saveRef}
                        activeDomain={activeDomain}
                        theme={theme}
                        navigation={navigation}
                        enableComments={global.enableComments}
                        onIconPress={this._handleArticleRemove}
                        deleteIcon={true}
                    />
                ) : (
                    <ArticleListContent
                        articleList={savedArticles}
                        saveRef={this._saveRef}
                        activeDomain={activeDomain}
                        theme={theme}
                        navigation={navigation}
                        enableComments={global.enableComments}
                        onIconPress={this._handleArticleRemove}
                        deleteIcon={true}
                        storyListStyle={global.storyListStyle}
                    />
                )}
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
                    Article Removed
                </Snackbar>
            </View>
        )
    }

    _saveRef = ref => {
        this.flatListRef = ref
    }

    _scrollToTop = () => {
        this.flatListRef.scrollToOffset({ animated: true, offset: 0 })
    }

    _handleArticleRemove = article => {
        const { activeDomain, removeSavedArticle } = this.props
        removeSavedArticle(article.id, activeDomain.id)
        this.setState({
            snackbarVisible: true
        })
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
        activeDomain,
        theme: state.theme,
        global: state.global,
        savedArticles: state.savedArticlesBySchool[activeDomain.id]
            ? state.savedArticlesBySchool[activeDomain.id]
            : []
    }
}

const mapDispatchToProps = dispatch => ({
    removeSavedArticle: (articleId, domainId) =>
        dispatch(savedArticleActions.removeSavedArticle(articleId, domainId))
})

export default connect(mapStateToProps, mapDispatchToProps)(SavedArticlesScreen)
