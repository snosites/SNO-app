import React from 'react'
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    Dimensions,
    ScrollView,
    Platform,
    ActivityIndicator,
} from 'react-native'

import Moment from 'moment'
import HTML from 'react-native-render-html'
import * as Haptics from 'expo-haptics'
import * as WebBrowser from 'expo-web-browser'
import { WebView } from 'react-native-webview'

import TouchableItem from '../../constants/TouchableItem'

const ArticleAuthors = ({ article, navigation, theme }) => {
    const _handleProfilePress = (writerId) => {
        Haptics.selectionAsync()
        navigation.navigate('ProfileModal', {
            profileId: writerId,
        })
    }

    if (article.custom_fields.terms && article.custom_fields.terms[0]) {
        let writers = article.custom_fields.terms
        //if arr of writers dont include job title
        if (writers.length > 1) {
            return writers.map((writer, i) => {
                if (i === writers.length - 2) {
                    return (
                        <TouchableItem key={i} onPress={() => _handleProfilePress(writer.term_id)}>
                            <Text
                                style={{
                                    fontSize: 17,
                                    textAlign: 'center',
                                    paddingTop: 20,
                                    color: theme.colors.accent,
                                }}
                            >
                                {`${writer.name} & `}
                            </Text>
                        </TouchableItem>
                    )
                } else if (i === writers.length - 1) {
                    return (
                        <TouchableItem key={i} onPress={() => _handleProfilePress(writer.term_id)}>
                            <Text
                                style={{
                                    fontSize: 17,
                                    textAlign: 'center',
                                    paddingTop: 20,
                                    color: theme.colors.accent,
                                }}
                            >
                                {writer.name}
                            </Text>
                        </TouchableItem>
                    )
                } else {
                    return (
                        <TouchableItem key={i} onPress={() => _handleProfilePress(writer.term_id)}>
                            <Text
                                style={{
                                    fontSize: 17,
                                    textAlign: 'center',
                                    paddingTop: 20,
                                    color: theme.colors.accent,
                                }}
                            >
                                {`${writer.name}, `}
                            </Text>
                        </TouchableItem>
                    )
                }
            })
        }
        // if writer has a jobtitle include it
        if (article.custom_fields.jobtitle) {
            return (
                <TouchableItem
                    onPress={() => _handleProfilePress(article.custom_fields.terms[0].term_id)}
                >
                    <Text
                        style={{
                            fontSize: 17,
                            textAlign: 'center',
                            paddingTop: 20,
                            color: theme.colors.accent,
                        }}
                    >
                        {`${article.custom_fields.terms[0].name} | ${article.custom_fields.jobtitle[0]}`}
                    </Text>
                </TouchableItem>
            )
        }
        // otherwise just display writer
        else {
            return (
                <TouchableItem
                    onPress={() => _handleProfilePress(article.custom_fields.terms[0].term_id)}
                >
                    <Text
                        style={{
                            fontSize: 17,
                            textAlign: 'center',
                            paddingTop: 20,
                            color: theme.colors.accent,
                        }}
                    >
                        {`${article.custom_fields.terms[0].name}`}
                    </Text>
                </TouchableItem>
            )
        }
    } else if (article.custom_fields.writer && article.custom_fields.writer[0]) {
        let writers = article.custom_fields.writer
        //if arr of writers dont include job title
        if (writers.length > 1) {
            return writers.map((writer, i) => {
                if (i === writers.length - 2) {
                    return (
                        <TouchableItem key={i} onPress={() => _handleProfilePress(null)}>
                            <Text
                                style={{
                                    fontSize: 17,
                                    textAlign: 'center',
                                    paddingTop: 20,
                                    color: theme.colors.accent,
                                }}
                            >
                                {`${writer} & `}
                            </Text>
                        </TouchableItem>
                    )
                } else if (i === writers.length - 1) {
                    return (
                        <TouchableItem key={i} onPress={() => _handleProfilePress(null)}>
                            <Text
                                style={{
                                    fontSize: 17,
                                    textAlign: 'center',
                                    paddingTop: 20,
                                    color: theme.colors.accent,
                                }}
                            >
                                {writer}
                            </Text>
                        </TouchableItem>
                    )
                } else {
                    return (
                        <TouchableItem key={i} onPress={() => _handleProfilePress(null)}>
                            <Text
                                style={{
                                    fontSize: 17,
                                    textAlign: 'center',
                                    paddingTop: 20,
                                    color: theme.colors.accent,
                                }}
                            >
                                {`${writer}, `}
                            </Text>
                        </TouchableItem>
                    )
                }
            })
        }
        // if writer has a jobtitle include it
        if (article.custom_fields.jobtitle) {
            return (
                <TouchableItem onPress={() => _handleProfilePress(null)}>
                    <Text
                        style={{
                            fontSize: 17,
                            textAlign: 'center',
                            paddingTop: 20,
                            color: theme.colors.accent,
                        }}
                    >
                        {`${article.custom_fields.writer[0]} | ${article.custom_fields.jobtitle[0]}`}
                    </Text>
                </TouchableItem>
            )
        }
        // otherwise just display writer
        else {
            return (
                <TouchableItem onPress={() => _handleProfilePress()}>
                    <Text
                        style={{
                            fontSize: 17,
                            textAlign: 'center',
                            paddingTop: 20,
                            color: theme.colors.accent,
                        }}
                    >
                        {`${article.custom_fields.writer[0]}`}
                    </Text>
                </TouchableItem>
            )
        }
    } else {
        return null
    }
}

export default ArticleAuthors
