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

import { Feather, MaterialIcons } from '@expo/vector-icons'
import HTML from 'react-native-render-html'
import { NavigationEvents } from 'react-navigation'

import { Divider, Colors, Chip } from 'react-native-paper'

import { SafeAreaView } from 'react-native-safe-area-context'

import { Html5Entities } from 'html-entities'

const entities = new Html5Entities()

Moment.updateLocale('en', {
    relativeTime: {
        d: '1 day',
    },
})

const ProfileArticleListItem = (props) => {
    const {
        theme,
        title,
        excerpt,
        date,
        featuredImageUri,
        onPress = () => {},
        mediaType = 'story',
    } = props

    const { accent, background, text, grayText } = theme.colors

    return (
        <TouchableOpacity
            style={{ flexDirection: 'row', flex: 1, padding: 10, backgroundColor: background }}
            onPress={onPress}
        >
            {featuredImageUri && (
                <Image
                    source={{ uri: featuredImageUri }}
                    style={{ width: 145, height: 95, borderRadius: 8 }}
                />
            )}
            <View style={{ flex: 1, paddingLeft: 20 }}>
                <Text
                    ellipsizeMode='tail'
                    numberOfLines={2}
                    style={{
                        fontFamily: 'ralewayBold',
                        fontSize: 19,
                        color: text,
                    }}
                >
                    {entities.decode(title)}
                </Text>
                <Text
                    style={{
                        fontFamily: 'ralewayBold',
                        fontSize: 17,
                        color: grayText,
                    }}
                >
                    {String(Moment(date).format('MMM D YYYY'))}
                </Text>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingTop: 5,
                    }}
                >
                    <MaterialIcons
                        name={mediaType === 'story' ? 'edit' : 'camera-alt'}
                        size={16}
                        color={accent}
                    />
                    <Text
                        style={{
                            fontFamily: 'ralewayThin',
                            fontSize: 14,
                            color: accent,
                            paddingLeft: 3,
                        }}
                    >
                        {mediaType}
                    </Text>
                </View>
            </View>
            <Feather style={{ marginLeft: 20 }} name='chevron-right' size={32} color={accent} />
        </TouchableOpacity>
    )
}

export default ProfileArticleListItem
