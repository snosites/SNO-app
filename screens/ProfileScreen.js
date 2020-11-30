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

import { SafeAreaView } from 'react-native-safe-area-context'
import ProfileArticleListItem from '../components/listItems/ProfileArticleListItem'

import { asyncFetchArticle } from '../utils/sagaHelpers'

import { Html5Entities } from 'html-entities'

const entities = new Html5Entities()

const ProfileScreen = (props) => {
    const {
        route,
        navigation,
        theme,
        profile,
        activeDomain,
        articles,
        asyncFetchArticleError,
    } = props

    const profileTermId =
        profile.post_terms && profile.post_terms[0] ? profile.post_terms[0].term_id : null

    const getMediaType = (terms) => {
        if (!profileTermId || !terms || !terms.length) return 'story'
        const match = terms.some((term) => term.term_id == profileTermId)
        if (match) return 'story'
        else return 'media'
    }

    const profileArticlePress = async (articleId) => {
        if (articles && articles[articleId]) {
            handleArticlePress(articles[articleId], activeDomain)
        } else {
            try {
                const article = await asyncFetchArticle(activeDomain.url, articleId)
                handleArticlePress(article, activeDomain)
            } catch (e) {
                console.log('e', e)
                asyncFetchArticleError()
                navigation.pop()
            }
        }
    }

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                Style={{ flex: 1 }}
                contentContainerStyle={{ padding: 10 }}
                data={profile.articles}
                keyExtractor={(item) => item.ID.toString()}
                ListHeaderComponentStyle={{
                    marginBottom: 20,
                }}
                ListHeaderComponent={() => (
                    <View style={{ paddingH: 10 }}>
                        <View style={{ alignItems: 'center' }}>
                            <Image
                                style={{
                                    width: 120,
                                    height: 120,
                                    borderRadius: 60,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                                resizeMode='cover'
                                source={
                                    profile.post_thumbnail
                                        ? { uri: profile.post_thumbnail }
                                        : require('../assets/images/anon.png')
                                }
                            />
                            <Text
                                style={{
                                    fontSize: 28,
                                    fontFamily: 'ralewayBold',
                                    textAlign: 'center',
                                    letterSpacing: 1,
                                    color: theme.colors.text,
                                }}
                            >
                                {entities.decode(
                                    profile.post_title ? profile.post_title : 'No Profile Name'
                                )}
                            </Text>
                            <Text
                                style={{
                                    fontSize: 18,
                                    fontFamily: 'raleway',
                                    textAlign: 'center',
                                    letterSpacing: 1,
                                    color: theme.colors.grayText,
                                }}
                            >
                                {entities.decode(profile.post_excerpt)}
                            </Text>
                            {profile.post_content ? (
                                <HTML
                                    html={profile.post_content}
                                    textSelectable={true}
                                    containerStyle={{
                                        paddingVertical: 20,
                                    }}
                                    onLinkPress={(e, href) => WebBrowser.openBrowserAsync(href)}
                                    tagsStyles={{
                                        p: {
                                            fontSize: 18,
                                            color: theme.colors.text,
                                        },
                                        rawtext: {
                                            fontSize: 18,
                                            color: theme.colors.text,
                                        },
                                    }}
                                    allowedStyles={[]}
                                />
                            ) : (
                                <View style={{ height: 150 }}>
                                    <Text
                                        style={{
                                            fontSize: 18,
                                            textAlign: 'center',
                                            color: theme.colors.text,
                                        }}
                                    >
                                        No Profile Content
                                    </Text>
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
                )}
                renderItem={({ item, index, separators }) => (
                    <ProfileArticleListItem
                        theme={theme}
                        title={item.post_title || ''}
                        date={item.date}
                        excerpt={item.post_excerpt}
                        featuredImageUri={item.featuredImage}
                        onPress={() => profileArticlePress(item.ID)}
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
        </View>
    )
}

export default ProfileScreen
