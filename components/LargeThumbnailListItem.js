import React from 'react'
import { Text, View, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native'
import { withTheme, Badge, Colors } from 'react-native-paper'
import Color from 'color'
import Moment from 'moment'
import HTML from 'react-native-render-html'

import { handleArticlePress } from '../utils/articlePress'

import { FontAwesome, MaterialIcons } from '@expo/vector-icons'

const screenWidth = Dimensions.get('window').width

const renderDate = (date) => {
    return (
        <Text
            style={{
                fontSize: 15,
                color: '#9e9e9e',
            }}
        >
            {Moment().isAfter(Moment(date).add(7, 'days'))
                ? String(Moment(date).format('MMM D, YYYY'))
                : String(Moment(date).fromNow())}
        </Text>
    )
}

const renderWriters = (writers) => {
    let newArr = ''
    for (let i = 0; i < writers.length; i++) {
        if (i === writers.length - 2) {
            newArr += `${writers[i]} & `
        } else if (i === writers.length - 1) {
            newArr += `${writers[i]}`
        } else {
            newArr += `${writers[i]}, `
        }
    }
    return newArr
}

export default (props) => {
    const { article, theme, enableComments, onIconPress, deleteIcon, activeDomain } = props

    const hasFeaturedImage = article.featuredImage
    const imageWidth = screenWidth - 20
    const imageHeight = imageWidth * 0.55

    return (
        <TouchableOpacity
            style={{
                flex: 1,
                // height: imageHeight + 100,
                borderBottomWidth: 0.5,
                borderBottomColor: '#9e9e9e',
            }}
            onPress={() => handleArticlePress(article, activeDomain)}
        >
            <View style={{ flex: 1, margin: 10 }}>
                {hasFeaturedImage ? (
                    <Image
                        source={{ uri: article.featuredImage.uri }}
                        style={{
                            width: imageWidth,
                            height: imageHeight,
                            borderRadius: 8,
                        }}
                    />
                ) : null}
                <View style={styles.storyInfo}>
                    <HTML
                        html={article.title.rendered}
                        baseFontStyle={{ fontSize: 28 }}
                        customWrapper={(text) => {
                            return (
                                <Text
                                    style={{
                                        fontSize: 27,
                                        fontWeight: 'bold',
                                        color: theme.dark ? 'white' : 'black',
                                    }}
                                    ellipsizeMode='tail'
                                    numberOfLines={2}
                                >
                                    {text}
                                </Text>
                            )
                        }}
                        tagsStyles={{
                            rawtext: {
                                fontSize: 23,
                                fontWeight: 'bold',
                                color: theme.dark ? 'white' : 'black',
                            },
                        }}
                    />
                    <Text
                        ellipsizeMode='tail'
                        numberOfLines={1}
                        style={{
                            color: theme.colors.accent,
                            fontSize: 20,
                        }}
                    >
                        {article.custom_fields.writer
                            ? renderWriters(article.custom_fields.writer)
                            : ''}
                    </Text>
                    {!hasFeaturedImage ? (
                        <HTML
                            html={article.excerpt.rendered}
                            baseFontStyle={{ fontSize: 18 }}
                            customWrapper={(text) => {
                                return (
                                    <Text
                                        ellipsizeMode='tail'
                                        numberOfLines={5}
                                        style={{ paddingVertical: 25 }}
                                    >
                                        {text}
                                    </Text>
                                )
                            }}
                            tagsStyles={{
                                rawtext: {
                                    fontSize: 21,
                                    color: theme.dark ? 'white' : 'black',
                                },
                            }}
                        />
                    ) : null}
                </View>
                <View
                    style={{
                        marginTop: 'auto',
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <View style={{ flexDirection: 'row' }}>{renderDate(article.date)}</View>
                    <View
                        style={{
                            flexDirection: 'row',
                            marginLeft: 'auto',
                        }}
                    >
                        {enableComments && (
                            <View>
                                <View>
                                    <FontAwesome name='comment' size={28} color='#e0e0e0' />
                                    <Badge
                                        size={20}
                                        style={{
                                            position: 'absolute',
                                            top: -4,
                                            right: -6,
                                            backgroundColor: theme.colors.accent,
                                        }}
                                    >
                                        {article.comments.length > 99
                                            ? '99'
                                            : article.comments.length}
                                    </Badge>
                                </View>
                            </View>
                        )}
                        <MaterialIcons
                            name={
                                deleteIcon
                                    ? 'delete'
                                    : article.saved
                                    ? 'bookmark'
                                    : 'bookmark-border'
                            }
                            color={deleteIcon ? '#c62828' : theme.colors.accent}
                            style={{ paddingHorizontal: 5, paddingLeft: 15 }}
                            size={28}
                            onPress={() => {
                                onIconPress(article)
                            }}
                        />
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    loadingMore: {
        flex: 1,
        paddingTop: 20,
        paddingBottom: 30,
        alignItems: 'center',
    },
    storyContainer: {
        flex: 1,
    },
    featuredImage: {
        width: 125,
        height: 80,
        borderRadius: 8,
    },
    storyInfo: {
        flex: 1,
    },
})
