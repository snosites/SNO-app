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
    console.log('article', article)
    const _handleProfilePress = (writerId, writerName) => {
        Haptics.selectionAsync()
        navigation.navigate('ProfileModal', {
            profileId: writerId,
            profileName: writerName,
        })
    }

    if (article.custom_fields.terms && article.custom_fields.terms[0]) {
        let writers = article.custom_fields.terms
        //if arr of writers dont include job title
        if (writers.length > 1) {
            return writers.map((writer, i) => {
                if (i === writers.length - 2) {
                    return (
                        <TouchableItem
                            key={i}
                            onPress={() => _handleProfilePress(writer.term_id, writer.name)}
                        >
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
                        <TouchableItem
                            key={i}
                            onPress={() => _handleProfilePress(writer.term_id, writer.name)}
                        >
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
                        <TouchableItem
                            key={i}
                            onPress={() => _handleProfilePress(writer.term_id, writer.name)}
                        >
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
                    onPress={() =>
                        _handleProfilePress(
                            article.custom_fields.terms[0].term_id,
                            article.custom_fields.terms[0].name
                        )
                    }
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
                    onPress={() =>
                        _handleProfilePress(
                            article.custom_fields.terms[0].term_id,
                            article.custom_fields.terms[0].name
                        )
                    }
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
        // let writers = article.custom_fields.writer
        console.log('no term IDs for article authors but has writer field', article)
    } else {
        console.log('no term IDs for article authors', article)
        return null
    }
    return null
}

export default ArticleAuthors
