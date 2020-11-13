import React, { useEffect } from 'react'
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    Image,
    ActivityIndicator,
    FlatList,
    TouchableOpacity,
} from 'react-native'

import Moment from 'moment'
import { LinearGradient } from 'expo-linear-gradient'
import * as WebBrowser from 'expo-web-browser'
import { handleArticlePress } from '../utils/articlePress'

import { Feather, MaterialIcons } from '@expo/vector-icons'
import HTML from 'react-native-render-html'
import { NavigationEvents } from 'react-navigation'

import { Divider, Colors, Chip } from 'react-native-paper'

const ProfileScreen = (props) => {
    const {
        route,
        navigation,
        theme,
        profiles,
        activeDomain,
        clearProfileArticles,
        clearProfileError,
        fetchProfileArticles,
    } = props

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            _loadProfile()
        })

        return unsubscribe
    }, [navigation])

    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            clearProfileArticles()
            clearProfileError()
        })

        return unsubscribe
    }, [navigation])

    let writerId = route.params && route.params.writerId ? route.params.writerId : null
    let writerTermId = route.params && route.params.writerTermId ? route.params.writerTermId : null
    let profile = route.params && route.params.profile ? route.params.profile : 'loading'

    const _loadProfile = async () => {
        try {
            if (writerId) {
                fetchProfile(writerId)
            } else if (writerTermId) {
                const profileIdRes = await fetch(
                    `https://${activeDomain.url}/wp-json/sns-v2/get_profile?autherTermId=${writerTermId}`,
                    {
                        headers: {
                            'Cache-Control': 'no-cache',
                        },
                    }
                )
                const profileIdResponse = await profileIdRes.json()
                if (profileIdResponse[0] && profileIdResponse[0].ID) {
                    fetchProfile(profileIdResponse[0].ID)
                } else {
                    navigation.setParams({
                        profile: 'none',
                    })
                }
            } else {
                navigation.setParams({
                    profile: 'error',
                })
            }
        } catch (err) {
            console.log('error fetching profile page', err)
            navigation.setParams({
                profile: 'error',
            })
        }
    }

    const fetchProfile = async (profileId) => {
        const response = await fetch(
            `https://${activeDomain.url}/wp-json/wp/v2/staff_profile/${profileId}`,
            {
                headers: {
                    'Cache-Control': 'no-cache',
                },
            }
        )
        const profile = await response.json()
        if (profile) {
            // if featured image is avail then get it
            if (profile._links['wp:featuredmedia']) {
                const response = await fetch(profile._links['wp:featuredmedia'][0].href)
                const profileImage = await response.json()
                profile.profileImage = profileImage.source_url
            }
            //set profile
            navigation.setParams({
                profile: profile,
            })

            const autherTermId = profile.custom_fields.terms.find((termObj) => {
                if (termObj.taxonomy === 'staff_name') {
                    return termObj
                }
            })
            // get list of articles written by writer
            fetchProfileArticles(activeDomain.url, autherTermId.term_id)
        } else {
            navigation.setParams({ profile: 'none' })
        }
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
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
                            {profile.profileImage ? (
                                <Image
                                    style={styles.profileImage}
                                    source={{ uri: profile.profileImage }}
                                />
                            ) : (
                                <Image
                                    style={styles.noProfileImage}
                                    source={require('../assets/images/anon.png')}
                                />
                            )}
                        </View>
                        {profile.title.rendered ? (
                            <HTML
                                html={profile.title.rendered}
                                textSelectable={true}
                                baseFontStyle={styles.title}
                            />
                        ) : (
                            <Text style={styles.title}>No Profile Name</Text>
                        )}
                        <Text style={styles.position}>{profile.excerpt}</Text>
                        {profile.content.rendered ? (
                            <HTML
                                html={profile.content.rendered}
                                textSelectable={true}
                                containerStyle={styles.textContainer}
                                onLinkPress={(e, href) => WebBrowser.openBrowserAsync(href)}
                                tagsStyles={{
                                    p: {
                                        fontSize: 17,
                                    },
                                }}
                                onParsed={(dom, RNElements) => {
                                    return RNElements
                                }}
                            />
                        ) : (
                            <View style={{ height: 150 }}>No Profile Content</View>
                        )}
                    </View>
                    <View
                        style={{
                            flex: 1,
                            paddingBottom: 20,
                            backgroundColor: theme.extraColors.lightGray,
                        }}
                    >
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <LinearGradient
                                colors={[theme.colors.primary, theme.colors.accent]}
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
                                        color: theme.primaryIsDark ? 'white' : 'black',
                                        textAlign: 'center',
                                    }}
                                >
                                    Recent Work By This Staff Member
                                </Text>
                            </LinearGradient>
                        </View>
                        {profiles.error == 'error fetching posts by author' ? (
                            <View style={{ flex: 1, justifyContent: 'center' }}>
                                <Text
                                    style={{
                                        textAlign: 'center',
                                        fontSize: 17,
                                        paddingTop: 60,
                                    }}
                                >
                                    Error loading articles by author
                                </Text>
                            </View>
                        ) : profiles.articles.length ? (
                            <View style={{ paddingTop: 55 }}>
                                {profiles.articles.map((story) => {
                                    return (
                                        <TouchableOpacity
                                            key={story.id.toString()}
                                            style={styles.storyContainer}
                                            onPress={() => handleArticlePress(story, activeDomain)}
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
                                                    customWrapper={(text) => {
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
                                                            color: theme.accentIsDark
                                                                ? 'white'
                                                                : 'black',
                                                        },
                                                    }}
                                                />
                                                <Text
                                                    style={{
                                                        flex: 1,
                                                        fontSize: 12,
                                                        textAlign: 'left',
                                                        color: theme.accentIsDark
                                                            ? 'white'
                                                            : 'black',
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
                                                        paddingTop: 5,
                                                    }}
                                                >
                                                    <MaterialIcons
                                                        name={
                                                            story.custom_fields.writer &&
                                                            story.custom_fields.writer[0] ==
                                                                profile.title.rendered
                                                                ? 'edit'
                                                                : 'camera-alt'
                                                        }
                                                        size={16}
                                                        color={
                                                            theme.accentIsDark ? 'white' : 'black'
                                                        }
                                                    />
                                                    <Text
                                                        style={{
                                                            color: theme.accentIsDark
                                                                ? 'white'
                                                                : 'black',
                                                            paddingLeft: 3,
                                                        }}
                                                    >
                                                        {story.custom_fields.writer &&
                                                        story.custom_fields.writer[0] ==
                                                            profile.title.rendered
                                                            ? 'story'
                                                            : 'media'}
                                                    </Text>
                                                </View>
                                            </View>
                                            <Feather
                                                style={{ marginLeft: 20 }}
                                                name='chevron-right'
                                                size={32}
                                                color={theme.accentIsDark ? 'white' : 'black'}
                                            />
                                        </TouchableOpacity>
                                    )
                                })}
                            </View>
                        ) : (
                            <View
                                style={{
                                    flex: 1,
                                    alignItems: 'center',
                                    marginTop: 80,
                                    marginBottom: 40,
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

const styles = StyleSheet.create({
    profileImageContainer: {
        width: 200,
        height: 200,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
        marginBottom: 5,
    },
    noProfileImage: {
        width: 150,
        height: 150,
        margin: 10,
        borderRadius: 75,
    },
    profileImage: {
        width: 200,
        height: 200,
        margin: 10,
        borderRadius: 100,
    },
    title: {
        fontSize: 25,
        textAlign: 'center',
        letterSpacing: 1,
    },
    position: {
        fontSize: 19,
        textAlign: 'center',
        color: Colors.grey400,
    },
    textContainer: {
        paddingTop: 20,
        paddingBottom: 70,
        paddingHorizontal: 20,
    },
    storyContainer: {
        // height: 70,
        // width: 300,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 20,
        marginVertical: 15,
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
        top: -40,
    },
    featuredImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
})

export default ProfileScreen
