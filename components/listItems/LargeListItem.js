import React from 'react'
import { Text, View, TouchableOpacity, StyleSheet, Image, useWindowDimensions } from 'react-native'
import Moment from 'moment'
import HTML from 'react-native-render-html'

import { Html5Entities } from 'html-entities'

const entities = new Html5Entities()

import { getWritersString } from '../../utils/helpers'

Moment.updateLocale('en', {
    relativeTime: {
        d: '1 day',
    },
})

const LargeListItem = (props) => {
    const { theme, writers, title, excerpt, date, featuredImageUri, onPress } = props

    const { accent, background, text, grayText } = theme.colors

    const IMAGE_WIDTH = useWindowDimensions().width - 20
    const IMAGE_HEIGHT = IMAGE_WIDTH * 0.55

    const writersString = getWritersString(writers)

    return (
        <TouchableOpacity
            style={{
                flex: 1,
                backgroundColor: background,
                borderRadius: 10,
            }}
            onPress={onPress}
        >
            <View
                style={{
                    flex: 1,
                }}
            >
                {featuredImageUri && (
                    <Image
                        source={{ uri: featuredImageUri }}
                        style={{
                            width: IMAGE_WIDTH,
                            height: IMAGE_HEIGHT,
                            borderTopRightRadius: 10,
                            borderTopLeftRadius: 10,
                        }}
                    />
                )}
                <View style={{ padding: 10 }}>
                    <Text
                        ellipsizeMode='tail'
                        numberOfLines={2}
                        style={{
                            fontSize: 25,
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
                            marginTop: 12,
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
                            {writersString}
                        </Text>
                        {writersString ? (
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
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    storyInfo: {
        flex: 1,
        justifyContent: 'space-between',
    },
})

export default LargeListItem
