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

import { SafeAreaView } from 'react-native-safe-area-context'
import ProfileArticleListItem from '../components/listItems/ProfileArticleListItem'

import { Html5Entities } from 'html-entities'

const entities = new Html5Entities()

const ProfileScreen = (props) => {
    const { route, navigation, theme, profile, activeDomain } = props
    console.log('profile', profile)

    const profileTermId =
        profile.post_terms && profile.post_terms[0] ? profile.post_terms[0].term_id : null

    const getMediaType = (terms) => {
        if (!profileTermId || !terms || !terms.length) return 'story'
        const match = terms.some((term) => term.term_id == profileTermId)
        if (match) return 'story'
        else return 'media'
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ padding: 10 }}>
                <View style={{ alignItems: 'center' }}>
                    <Image
                        style={{
                            width: 150,
                            height: 150,
                            borderRadius: 75,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        resizeMode='contain'
                        source={
                            profile.post_thumbnail
                                ? { uri: profile.post_thumbnail }
                                : require('../assets/images/anon.png')
                        }
                    />
                    <Text style={styles.title}>
                        {entities.decode(
                            profile.post_title ? profile.post_title : 'No Profile Name'
                        )}
                    </Text>
                    <Text style={styles.position}>{entities.decode(profile.post_excerpt)}</Text>
                    {profile.post_content ? (
                        <HTML
                            html={profile.post_content}
                            textSelectable={true}
                            containerStyle={styles.textContainer}
                            onLinkPress={(e, href) => WebBrowser.openBrowserAsync(href)}
                            tagsStyles={{
                                p: {
                                    fontSize: 17,
                                },
                            }}
                            allowedStyles={[]}
                        />
                    ) : (
                        <View style={{ height: 150 }}>
                            <Text>No Profile Content</Text>
                        </View>
                    )}
                </View>
                <LinearGradient
                    colors={[theme.colors.primary, theme.colors.accent]}
                    start={[0, 0.5]}
                    end={[1, 0.5]}
                    style={{
                        padding: 10,
                        paddingHorizontal: 20,
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 80,
                        borderRadius: 10,
                    }}
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
            <FlatList
                Style={{ flex: 1 }}
                contentContainerStyle={{ padding: 10 }}
                data={profile.articles}
                keyExtractor={(item) => item.ID.toString()}
                renderItem={({ item, index, separators }) => (
                    <ProfileArticleListItem
                        theme={theme}
                        title={item.post_title || ''}
                        date={item.date}
                        excerpt={item.post_excerpt}
                        featuredImageUri={item.featuredImage}
                        onPress={() => {
                            handleArticlePress(item, activeDomain)
                        }}
                        mediaType={getMediaType(item.customFields?.terms)}
                    />
                )}
                ItemSeparatorComponent={() => (
                    <View style={{ height: 10, backgroundColor: 'transparent' }} />
                )}
                ListEmptyComponent={() => (
                    <View>
                        <Text
                            style={{
                                fontFamily: 'ralewayBold',
                                fontSize: 18,
                                textAlign: 'center',
                                padding: 20,
                            }}
                        >
                            There are no items to display for this author
                        </Text>
                    </View>
                )}
            />
        </SafeAreaView>
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
