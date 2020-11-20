import React from 'react'
import { Text, View, Modal, TouchableOpacity, Share } from 'react-native'

import { Feather } from '@expo/vector-icons'
import { Button } from 'react-native-paper'

import { SafeAreaView } from 'react-native-safe-area-context'
import * as Amplitude from 'expo-analytics-amplitude'

import { Html5Entities } from 'html-entities'

const entities = new Html5Entities()

const ArticleActionsScreen = (props) => {
    const { activeDomain, navigation, theme, saveArticle, removeSavedArticle, article } = props

    const _shareArticle = () => {
        //log share to old analytics
        Amplitude.logEventWithProperties('social share', {
            storyId: article.id,
        })
        Share.share({
            title: entities.decode(article.title.rendered),
            message: entities.decode(article.title.rendered),
            url: article.link,
        })
    }

    const _saveRemoveToggle = () => {
        if (article.saved) {
            removeSavedArticle(article.id, activeDomain.id)
            setArticle({ ...article, saved: false })
        } else {
            saveArticle(article, activeDomain.id)
            setArticle({ ...article, saved: true })
        }
    }

    return (
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
            <View
                style={{
                    height: 250,
                    backgroundColor: theme.colors.surface,
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                    padding: 15,
                }}
            >
                <TouchableOpacity
                    onPress={_shareArticle}
                    style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 8 }}
                >
                    <Feather
                        style={{
                            paddingRight: 15,
                            marginBottom: -3,
                        }}
                        name={'share'}
                        size={18}
                        color={theme.colors.text}
                    />
                    <Text
                        style={{
                            fontFamily: 'openSansBold',
                            fontSize: 15,
                            color: theme.colors.text,
                        }}
                    >
                        Share
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={_saveRemoveToggle}
                    style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8 }}
                >
                    <Feather
                        style={{
                            paddingRight: 15,
                            marginBottom: -3,
                        }}
                        name={'archive'}
                        size={18}
                        color={theme.colors.text}
                    />
                    <Text
                        style={{
                            fontFamily: 'openSansBold',
                            fontSize: 15,
                            color: theme.colors.text,
                        }}
                    >
                        {article && article.saved ? 'Unsave' : 'Save'}
                    </Text>
                </TouchableOpacity>
                {/* TODO: copy text */}
                <TouchableOpacity
                    onPress={() => {}}
                    style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8 }}
                >
                    <Feather
                        style={{
                            paddingRight: 15,
                            marginBottom: -3,
                        }}
                        name={'copy'}
                        size={18}
                        color={theme.colors.text}
                    />
                    <Text
                        style={{
                            fontFamily: 'openSansBold',
                            fontSize: 15,
                            color: theme.colors.text,
                        }}
                    >
                        Copy text
                    </Text>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8 }}>
                    <Feather
                        style={{
                            paddingRight: 15,
                            marginBottom: -3,
                        }}
                        name={'user-plus'}
                        size={18}
                        color={theme.colors.text}
                    />
                    <View>
                        <Text
                            style={{
                                fontFamily: 'openSansBold',
                                fontSize: 15,
                                color: theme.colors.text,
                            }}
                        >
                            Follow authors
                        </Text>
                        <Text
                            style={{
                                fontFamily: 'openSans',
                                fontSize: 12,
                                color: theme.extraColors.gray,
                            }}
                        >
                            Click on author names to follow them
                        </Text>
                    </View>
                </View>
                <Button
                    mode='contained'
                    theme={{ roundness: 10 }}
                    style={{
                        backgroundColor: theme.extraColors.gray,
                        fontSize: 18,
                        marginTop: 'auto',
                        marginBottom: 10,
                    }}
                    onPress={() => navigation.goBack()}
                >
                    Close
                </Button>
            </View>
        </View>
    )
}

export default ArticleActionsScreen
