import React from 'react'
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    Image,
    ActivityIndicator,
    FlatList,
    TouchableOpacity
} from 'react-native'

import { actions as profileActions } from '../redux/profiles'
import { getActiveDomain } from '../redux/domains'

import Moment from 'moment'
import Color from 'color'
import { connect } from 'react-redux'
import { LinearGradient } from 'expo-linear-gradient'
import * as WebBrowser from 'expo-web-browser'
import { handleArticlePress } from '../utils/articlePress'

import { Feather, MaterialIcons } from '@expo/vector-icons'
import HTML from 'react-native-render-html'
// import Colors from '../constants/Colors';
import { NavigationEvents } from 'react-navigation'

import { Divider, Colors, Chip } from 'react-native-paper'

class ProfileScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Profile'
        }
    }

    render() {
        const {
            navigation,
            theme,
            profiles,
            activeDomain,
            clearProfileArticles,
            clearProfileError
        } = this.props
        const profile = navigation.getParam('profile', 'loading')
        let primaryColor = Color(theme.colors.primary)
        let primaryIsDark = primaryColor.isDark()
        let accentColor = Color(theme.colors.accent)
        let accentIsDark = accentColor.isDark()
        return (
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <NavigationEvents
                    onWillFocus={payload => this._loadProfile(payload)}
                    onWillBlur={() => {
                        clearProfileArticles()
                        clearProfileError()
                    }}
                />
                {profile == 'loading' ? (
                    <View style={{ flex: 1, paddingTop: 20, alignItems: 'center' }}>
                        <ActivityIndicator />
                    </View>
                ) : profile == 'none' ? (
                    <View style={{ flex: 1, alignItems: 'center', padding: 20 }}>
                        <Image
                            style={styles.noProfileImage}
                            source={require('../assets/images/anon.png')}
                        />
                        <Text style={{ fontSize: 28, textAlign: 'center', paddingVertical: 20 }}>
                            This person does not appear to have a profile page
                        </Text>
                    </View>
                ) : profile == 'error' ? (
                    <View style={{ flex: 1, alignItems: 'center', padding: 20 }}>
                        <Image
                            style={styles.noProfileImage}
                            source={require('../assets/images/anon.png')}
                        />
                        <Text style={{ fontSize: 28, textAlign: 'center', paddingVertical: 20 }}>
                            There was an error loading the selected profile
                        </Text>
                    </View>
                ) : (
                    <View style={{ flex: 1 }}>
                        <View style={{ alignItems: 'center' }}>
                            <View style={styles.profileImageContainer}>
                                {this._renderProfileImage(profile)}
                            </View>
                            <Text style={styles.title}>{profile.title.rendered}</Text>
                            <Text style={styles.position}>
                                {profile.custom_fields.staffposition[0]}
                            </Text>
                            {profile.content.rendered ? (
                                <HTML
                                    html={profile.content.rendered}
                                    textSelectable={true}
                                    containerStyle={styles.textContainer}
                                    onLinkPress={(e, href) => this._viewLink(href)}
                                    tagsStyles={{
                                        p: {
                                            fontSize: 17
                                        }
                                    }}
                                />
                            ) : (
                                <View style={{ height: 150 }}></View>
                            )}
                        </View>
                        <View style={{ flex: 1, paddingBottom: 20, backgroundColor: accentColor }}>
                            <View style={{ flex: 1, alignItems: 'center' }}>
                                <LinearGradient
                                    colors={[theme.colors.primary, theme.colors.primary]}
                                    start={[0, 0.5]}
                                    end={[1, 0.5]}
                                    style={styles.listHeader}
                                >
                                    <Text
                                        numberOfLines={3}
                                        ellipsizeMode='tail'
                                        style={{
                                            backgroundColor: 'transparent',
                                            fontSize: 19,
                                            color: primaryIsDark ? 'white' : 'black',
                                            textAlign: 'center'
                                        }}
                                    >
                                        {`Recent Work By ${profile.custom_fields.name[0]}`}
                                    </Text>
                                </LinearGradient>
                            </View>
                            {profiles.error == 'error fetching posts by author' ? (
                                <View style={{ flex: 1, justifyContent: 'center' }}>
                                    <Text
                                        style={{
                                            textAlign: 'center',
                                            fontSize: 17,
                                            paddingTop: 60
                                        }}
                                    >
                                        Error loading articles by author
                                    </Text>
                                </View>
                            ) : profiles.articles.length > 0 ? (
                                <FlatList
                                    contentContainerStyle={{ flex: 1, marginTop: 40 }}
                                    data={profiles.articles}
                                    keyExtractor={item => (item.id ? item.id.toString() : null)}
                                    ItemSeparatorComponent={() => <Divider />}
                                    renderItem={props => {
                                        const story = props.item
                                        return (
                                            <TouchableOpacity
                                                style={styles.storyContainer}
                                                onPress={() =>
                                                    handleArticlePress(story, activeDomain)
                                                }
                                            >
                                                {story.featuredImage ? (
                                                    <Image
                                                        source={{ uri: story.featuredImage.uri }}
                                                        style={styles.featuredImage}
                                                    />
                                                ) : null}
                                                <View style={{ flex: 1, paddingHorizontal: 20 }}>
                                                    <HTML
                                                        html={story.title.rendered}
                                                        baseFontStyle={{ fontSize: 19 }}
                                                        customWrapper={text => {
                                                            return (
                                                                <Text
                                                                    ellipsizeMode='tail'
                                                                    numberOfLines={2}
                                                                >
                                                                    {text}
                                                                </Text>
                                                            )
                                                        }}
                                                        tagsStyles={{
                                                            rawtext: {
                                                                flex: 1,
                                                                fontSize: 19,
                                                                textAlign: 'left',
                                                                color: accentIsDark
                                                                    ? 'white'
                                                                    : 'black'
                                                            }
                                                        }}
                                                    />
                                                    <Text
                                                        style={{
                                                            flex: 1,
                                                            fontSize: 12,
                                                            textAlign: 'left',
                                                            color: accentIsDark ? 'white' : 'black'
                                                        }}
                                                    >
                                                        {String(
                                                            Moment(story.date).format('MMM D YYYY')
                                                        )}
                                                    </Text>
                                                    <View
                                                        style={{
                                                            flexDirection: 'row',
                                                            alignItems: 'center',
                                                            paddingTop: 5
                                                        }}
                                                    >
                                                        <MaterialIcons
                                                            name={
                                                                story.custom_fields.writer &&
                                                                story.custom_fields.writer[0] ==
                                                                    profile.custom_fields.name[0]
                                                                    ? 'edit'
                                                                    : 'camera-alt'
                                                            }
                                                            size={16}
                                                            color={accentIsDark ? 'white' : 'black'}
                                                        />
                                                        <Text
                                                            style={{
                                                                color: accentIsDark
                                                                    ? 'white'
                                                                    : 'black',
                                                                paddingLeft: 3
                                                            }}
                                                        >
                                                            {story.custom_fields.writer &&
                                                            story.custom_fields.writer[0] ==
                                                                profile.custom_fields.name[0]
                                                                ? 'story'
                                                                : 'media'}
                                                        </Text>
                                                    </View>
                                                </View>
                                                <Feather
                                                    style={{ marginLeft: 20 }}
                                                    name='chevron-right'
                                                    size={32}
                                                    color={accentIsDark ? 'white' : 'black'}
                                                />
                                            </TouchableOpacity>
                                        )
                                    }}
                                />
                            ) : (
                                <View
                                    style={{
                                        flex: 1,
                                        alignItems: 'center',
                                        marginTop: 80,
                                        marginBottom: 40
                                    }}
                                >
                                    <ActivityIndicator />
                                </View>
                            )}
                        </View>
                    </View>
                )}
            </ScrollView>
        )
    }

    _loadProfile = async payload => {
        const { navigation, activeDomain, fetchProfileArticles } = this.props
        try {
            const writerName = navigation.getParam('writerName', 'unknown')
            if (writerName !== 'unknown') {
                const response = await fetch(
                    `https://${activeDomain.url}/wp-json/custom_meta/my_meta_query?meta_query[0][key]=name&meta_query[0][value]=${writerName}`
                )
                const profile = await response.json()
                if (profile.length > 0) {
                    // if more than one matches use first one
                    const profileId = profile[0].ID
                    const newResponse = await fetch(
                        `https://${activeDomain.url}/wp-json/wp/v2/staff_profile/${profileId}`, {
                            headers: {
                                'Cache-Control': 'no-cache'
                            }
                        }
                    )
                    const writerProfile = await newResponse.json()
                    // if featured image is avail then get it
                    if (writerProfile._links['wp:featuredmedia']) {
                        const response = await fetch(
                            writerProfile._links['wp:featuredmedia'][0].href
                        )
                        const profileImage = await response.json()
                        writerProfile.profileImage = profileImage.source_url
                    }
                    //set profile
                    navigation.setParams({
                        profile: writerProfile
                    })
                    // get list of articles written by writer
                    fetchProfileArticles(activeDomain.url, writerName)
                } else {
                    navigation.setParams({ profile: 'none' })
                }
            }
        } catch (err) {
            console.log('error fetching profile page', err)
            navigation.setParams({
                profile: 'error'
            })
        }
    }

    _renderProfileImage = profile => {
        if (profile.profileImage) {
            return <Image style={styles.profileImage} source={{ uri: profile.profileImage }} />
        } else {
            return (
                <Image style={styles.profileImage} source={require('../assets/images/anon.png')} />
            )
        }
    }

    _viewLink = async href => {
        let result = await WebBrowser.openBrowserAsync(href)
    }
}

const styles = StyleSheet.create({
    profileImageContainer: {
        width: 200,
        height: 200,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
        marginBottom: 5
    },
    noProfileImage: {
        width: 150,
        height: 150,
        borderRadius: 75
    },
    profileImage: {
        width: 200,
        height: 200,
        borderRadius: 100
    },
    title: {
        fontSize: 25,
        textAlign: 'center',
        letterSpacing: 1
    },
    position: {
        fontSize: 19,
        textAlign: 'center',
        color: Colors.grey400
    },
    textContainer: {
        paddingTop: 20,
        paddingBottom: 70,
        paddingHorizontal: 20
    },
    storyContainer: {
        // height: 70,
        // width: 300,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 20,
        marginVertical: 15
    },
    listHeader: {
        padding: 15,
        paddingHorizontal: 25,
        justifyContent: 'center',
        height: 80,
        alignItems: 'center',
        borderRadius: 10,
        position: 'absolute',
        marginHorizontal: 30,
        top: -40
    },
    featuredImage: {
        width: 60,
        height: 60,
        borderRadius: 30
    }
})

const mapStateToProps = state => {
    return {
        activeDomain: getActiveDomain(state),
        theme: state.theme,
        profiles: state.profiles
    }
}

const mapDispatchToProps = dispatch => ({
    fetchProfileArticles: (domainUrl, name) =>
        dispatch(profileActions.fetchProfileArticles(domainUrl, name)),
    clearProfileArticles: () => dispatch(profileActions.clearProfileArticles()),
    clearProfileError: () => dispatch(profileActions.clearProfileError())
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProfileScreen)
