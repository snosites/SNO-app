import React from 'react'
import { ScrollView, StyleSheet, Text, View, Image, Platform } from 'react-native'
import Color from 'color'
import { connect } from 'react-redux'
import HTML from 'react-native-render-html'
import * as WebBrowser from 'expo-web-browser'

import { getActiveDomain } from '../redux/domains'

import { NavigationEvents } from 'react-navigation'

import LottieView from 'lottie-react-native'
import { Colors as PaperColors, Card, Button } from 'react-native-paper'
import Colors from '../constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import HeaderButtons, { HeaderButton, Item } from 'react-navigation-header-buttons'

// header icon native look component
const IoniconsHeaderButton = passMeFurther => (
    <HeaderButton
        {...passMeFurther}
        IconComponent={Ionicons}
        iconSize={30}
        color={Colors.tintColor}
    />
)

const CustomHeaderTitle = ({ children, style }) => {
    return (
        <HTML
            html={children}
            customWrapper={text => {
                return (
                    <Text ellipsizeMode='tail' numberOfLines={1} style={[...style, styles.title]}>
                        {text}
                    </Text>
                )
            }}
            baseFontStyle={styles.title}
        />
    )
}

class DefaultPageScreen extends React.Component {
    static navigationOptions = ({ navigation, screenProps }) => {
        const { theme } = screenProps
        let primaryColor = Color(theme.colors.primary)
        let isDark = primaryColor.isDark()
        const logo = navigation.getParam('headerLogo', null)
        return {
            title: navigation.getParam('menuTitle', ''),
            headerTitle: CustomHeaderTitle,
            headerRight: (
                <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
                    <Item
                        title='menu'
                        iconName='ios-menu'
                        buttonStyle={{ color: isDark ? 'white' : 'black' }}
                        onPress={() => navigation.openDrawer()}
                    />
                </HeaderButtons>
            ),
            headerLeft: logo && (
                <Image
                    source={{ uri: logo }}
                    style={{ width: 60, height: 30, borderRadius: 7, marginLeft: 10 }}
                    resizeMode='cover'
                />
            )
        }
    }

    state = {
        doneLoading: false,
        error: null,
        page: null
    }

    componentDidMount() {
        const { navigation, global } = this.props
        const pageId = navigation.getParam('pageId', null)
        console.log('pageId', pageId)
        navigation.setParams({
            headerLogo: global.headerSmall
        })

        if (this.animation) {
            this._playAnimation()
        }
        if (pageId) {
            this._getPage(pageId)
        }
    }

    render() {
        const { navigation, profiles, theme } = this.props
        const { doneLoading, error, page } = this.state

        if (!doneLoading) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={styles.animationContainer}>
                        <LottieView
                            ref={animation => {
                                this.animation = animation
                            }}
                            style={{
                                width: 300,
                                height: 300
                            }}
                            loop={true}
                            speed={0.8}
                            autoPlay={true}
                            source={require('../assets/lottiefiles/simple-loader-dots')}
                        />
                    </View>
                </View>
            )
        }
        if (error) {
            return (
                <View style={{ flex: 1 }}>
                    <Text
                        style={{
                            fontSize: 30,
                            textAlign: 'center',
                            paddingTop: 20,
                            paddingBottom: 10
                        }}
                    >
                        Error loading page
                    </Text>
                </View>
            )
        }
        return (
            <View style={{ flex: 1 }}>
                <ScrollView style={{ flex: 1 }}>
                    {page.title.rendered ? (
                        <HTML
                            html={page.title.rendered}
                            baseFontStyle={{ fontSize: 30 }}
                            allowedStyles={[]}
                            customWrapper={text => {
                                return (
                                    <Text style={{ paddingTop: 30, paddingBottom: 10 }}>
                                        {text}
                                    </Text>
                                )
                            }}
                            tagsStyles={{
                                rawtext: {
                                    fontSize: 30,
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                    color: theme.dark ? 'white' : 'black'
                                }
                            }}
                        />
                    ) : (
                        <Text
                            style={{
                                fontSize: 30,
                                fontWeight: 'bold',
                                textAlign: 'center',
                                paddingTop: 20,
                                paddingBottom: 10,
                                color: theme.dark ? 'white' : 'black'
                            }}
                        >
                            ''
                        </Text>
                    )}
                    <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
                        {page.content.rendered && (
                            <HTML
                                html={page.content.rendered}
                                baseFontStyle={{ fontSize: 19 }}
                                allowedStyles={['color']}
                                onLinkPress={(e, href) => this._viewLink(href)}
                                tagsStyles={{
                                    rawtext: {
                                        fontSize: 19,
                                        color: theme.dark ? 'white' : 'black'
                                    }
                                }}
                            />
                        )}
                    </View>
                </ScrollView>
            </View>
        )
    }

    _viewLink = async href => {
        let result = await WebBrowser.openBrowserAsync(href)
    }

    _getPage = async pageId => {
        const { activeDomain } = this.props
        const url = activeDomain.url
        try {
            const response = await fetch(`https://${url}/wp-json/wp/v2/pages/${pageId}`, {
                headers: {
                    'Cache-Control': 'no-cache'
                }
            })
            if (response.status !== 200) {
                throw new Error('invalid response')
            }

            const page = await response.json()
            console.log('this is page', page)

            this.setState({
                doneLoading: true,
                page: page
            })
        } catch (err) {
            console.log('error fetching page', err)
            this.setState({
                doneLoading: true,
                error: true
            })
        }
    }

    _playAnimation = () => {
        this.animation.reset()
        this.animation.play()
    }
}

const styles = StyleSheet.create({
    animationContainer: {
        width: 300,
        height: 300,
        alignItems: 'center'
    },
    title: {
        ...Platform.select({
            ios: {
                fontSize: 17,
                fontWeight: '600'
            },
            android: {
                fontSize: 20,
                fontWeight: '500'
            },
            default: {
                fontSize: 18,
                fontWeight: '400'
            }
        })
    },
    pageTitle: {
        fontSize: 30
    }
})

const mapStateToProps = state => {
    return {
        theme: state.theme,
        activeDomain: getActiveDomain(state),
        global: state.global
    }
}

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(DefaultPageScreen)
