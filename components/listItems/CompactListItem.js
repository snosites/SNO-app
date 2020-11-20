import React from 'react'
import { Text, View, TouchableOpacity, StyleSheet, Image } from 'react-native'
import Moment from 'moment'
import HTML from 'react-native-render-html'

import { Html5Entities } from 'html-entities'

import { getWritersString } from '../../utils/helpers'

const entities = new Html5Entities()

Moment.updateLocale('en', {
    relativeTime: {
        d: '1 day',
    },
})

const CompactListItem = (props) => {
    const {
        theme,
        writers,
        title,
        excerpt,
        date,
        featuredImageUri,
        onPress,
        imageRight = false,
    } = props

    const { accent, background, text, grayText } = theme.colors

    const writersString = getWritersString(writers)

    const storyInfoStyle = {
        justifyContent: imageRight ? 'flex-end' : 'flex-start',
    }

    return (
        <TouchableOpacity
            style={{ flex: 1, backgroundColor: background, borderRadius: 10 }}
            onPress={onPress}
        >
            <View style={styles.storyContainer}>
                {featuredImageUri && !imageRight ? (
                    <Image
                        source={{ uri: featuredImageUri }}
                        style={[styles.featuredImage, { marginRight: 10 }]}
                    />
                ) : null}
                <View
                    style={[
                        styles.storyInfo,
                        {
                            justifyContent: imageRight ? 'flex-end' : 'flex-start',
                        },
                    ]}
                >
                    <Text
                        ellipsizeMode='tail'
                        numberOfLines={2}
                        style={{
                            fontSize: 17,
                            fontFamily: 'ralewayBold',
                            color: text,
                        }}
                    >
                        {entities.decode(title)}
                    </Text>
                    {excerpt ? (
                        <HTML
                            html={excerpt}
                            baseFontStyle={{ fontSize: 14 }}
                            customWrapper={(text) => {
                                return (
                                    <Text ellipsizeMode='tail' numberOfLines={2}>
                                        {text}
                                    </Text>
                                )
                            }}
                            tagsStyles={{
                                rawtext: {
                                    fontSize: 14,
                                    fontFamily: 'ralewayLight',
                                    color: text,
                                },
                            }}
                        />
                    ) : null}
                    <View
                        style={{
                            flexDirection: 'row',
                            flex: 1,
                            alignItems: 'flex-end',
                            justifyContent: 'flex-start',
                            marginTop: 8,
                        }}
                    >
                        <Text
                            ellipsizeMode='tail'
                            numberOfLines={1}
                            style={{
                                color: accent,
                                fontSize: 14,
                            }}
                        >
                            {writersString.length < 15 ? writersString : ''}
                        </Text>
                        {writersString && writersString.length < 15 ? (
                            <Text
                                style={{
                                    fontSize: 14,
                                    fontFamily: 'ralewayBold',
                                    paddingHorizontal: 10,
                                }}
                            >
                                ·
                            </Text>
                        ) : null}
                        <Text
                            style={{
                                fontSize: 14,
                                color: grayText,
                            }}
                        >
                            {Moment().isAfter(Moment(date).add(7, 'days'))
                                ? String(Moment(date).format('MMM D, YYYY'))
                                : String(Moment(date).fromNow())}
                        </Text>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        ></View>
                    </View>
                </View>
                {featuredImageUri && imageRight ? (
                    <Image
                        source={{ uri: featuredImageUri }}
                        style={[styles.featuredImage, { marginLeft: 10 }]}
                    />
                ) : null}
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    storyContainer: {
        flexDirection: 'row',
        flex: 1,
        margin: 10,
    },
    featuredImage: {
        width: 145,
        height: 95,
        borderRadius: 8,
    },
    storyInfo: {
        flex: 1,
    },
})

export default CompactListItem
