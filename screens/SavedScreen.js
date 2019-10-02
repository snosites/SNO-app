import React from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Platform
} from 'react-native';
import Moment from 'moment';
import { connect } from 'react-redux';
import HTML from 'react-native-render-html';
import { DangerZone } from 'expo';

import * as Haptic from 'expo-haptics';

const { Lottie } = DangerZone;

import Colors from '../constants/Colors'
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { Snackbar, Badge } from 'react-native-paper';

import { removeSavedArticle } from '../redux/actionCreators';
import ArticleListContent from '../views/ArticleListContent';

class ListScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const logo = navigation.getParam('headerLogo', null)
        return {
            title: 'Saved Stories',
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
        snackbarVisible: false
    }

    componentDidMount() {
        const { navigation, menus } = this.props;
        if (this.animation) {
            this._playAnimation();
        }
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

    render() {
        const { savedArticles, activeDomain, theme, navigation } = this.props;
        const { snackbarVisible } = this.state;
        if (savedArticles === 'loading') {
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
        if (savedArticles.length == 0) {
            return (
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={{ fontSize: 18, textAlign: 'center', padding: 20, fontWeight: 'bold' }}>
                        You don't have any saved articles for this school yet
                    </Text>
                </View>
            )
        }
        return (
            <View style={{ flex: 1 }}>
                <ArticleListContent
                    articleList={savedArticles}
                    saveRef={this._saveRef}
                    activeDomain={activeDomain}
                    theme={theme}
                    navigation={navigation}
                    onIconPress={this._handleArticleRemove}
                    deleteIcon={true}
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
                    Article Removed
                </Snackbar>
            </View>

        );
    }

    _saveRef = (ref) => {
        this.flatListRef = ref;
    }

    _scrollToTop = () => {
        this.flatListRef.scrollToOffset({ animated: true, offset: 0 });
    }

    _handleArticleRemove = article => {
        const { activeDomain } = this.props;
        this.props.dispatch(removeSavedArticle(article.id, activeDomain.id))
        this.setState({
            snackbarVisible: true
        })
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
    snackbar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0
    }
});

const mapStateToProps = store => ({
    activeDomain: store.activeDomain,
    theme: store.theme,
    menus: store.menus,
    savedArticles: store.savedArticlesBySchool[store.activeDomain.id]
})

export default connect(mapStateToProps)(ListScreen);