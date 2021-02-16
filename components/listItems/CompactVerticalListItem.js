import React from 'react'
import { Text, View, TouchableOpacity, StyleSheet, Image, useWindowDimensions } from 'react-native'
import { withTheme, Badge, Colors } from 'react-native-paper'
import Moment from 'moment'
import HTML from 'react-native-render-html'

import { handleArticlePress } from '../../utils/articlePress'

import { FontAwesome, MaterialIcons } from '@expo/vector-icons'

import { Html5Entities } from 'html-entities'
import theme from '../../redux/theme'

const entities = new Html5Entities()

import { getWritersString } from '../../utils/helpers'

const CompactVerticalListItem = (props) => {
    const { theme, writers, title, excerpt, date, featuredImageUri, onPress } = props

    const { accent, background, text, grayText } = theme.colors

    const CARD_WIDTH = useWindowDimensions().width / 2 - 20

    const IMAGE_WIDTH = CARD_WIDTH
    const IMAGE_HEIGHT = IMAGE_WIDTH * 0.85

    const writersString = getWritersString(writers)

    return (
        <TouchableOpacity
            style={{ width: CARD_WIDTH, backgroundColor: background, borderRadius: 10 }}
            onPress={onPress}
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
                        fontSize: 18,
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
                        overflow: 'hidden',
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
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    storyInfo: {
        flex: 1,
        justifyContent: 'space-between',
    },
})

export default CompactVerticalListItem
