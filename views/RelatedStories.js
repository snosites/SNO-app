import React, { useState, useEffect } from 'react'
import {
    View,
    FlatList,
    Text,
    Image,
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity,
    Platform,
} from 'react-native'
import Moment from 'moment'
import HTML from 'react-native-render-html'

import { getActiveDomain } from '../redux/domains'
import { handleArticlePress } from '../utils/articlePress'
import { asyncFetchArticle } from '../utils/sagaHelpers'

import { connect } from 'react-redux'

import ArticleAuthors from '../components/Article/ArticleAuthors'

Moment.updateLocale('en', {
    relativeTime: {
        d: '1 day',
    },
})

const RelatedStoriesWidget = ({ relatedStoryIds, activeDomain, theme }) => {
    const [stories, setStories] = useState([])
    const [error, setError] = useState('')

    useEffect(() => {
        if (relatedStoryIds) {
            _fetchRelatedStories(relatedStoryIds)
        }
    }, [relatedStoryIds])

    const _fetchRelatedStories = async (storyIds) => {
        try {
            const stories = await Promise.all(
                storyIds.map(async (id) => {
                    return await asyncFetchArticle(activeDomain.url, Number(id))
                })
            )
            setStories(stories)
        } catch (err) {
            console.log('error fetching related stories', err)
            setError(true)
        }
    }

    const _renderDate = (date) => {
        if (Moment().isAfter(Moment(date).add(7, 'days'))) return Moment(date).format('MMM D, YYYY')
        return String(Moment(date).fromNow())
    }

    const _renderRelatedStories = () => {
        if (error) {
            return <Text style={{ textAlign: 'center' }}>Error loading related stories</Text>
        } else if (relatedStoryIds && !stories.length) {
            return <ActivityIndicator />
        } else {
            return (
                <View style={{ flex: 1 }}>
                    {stories.map((story) => {
                        return (
                            <TouchableOpacity
                                key={story.id}
                                style={{ flex: 1 }}
                                onPress={() => handleArticlePress(story, activeDomain)}
                            >
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        flex: 1,
                                        marginHorizontal: 10,
                                        marginVertical: 10,
                                        padding: 10,
                                    }}
                                >
                                    {story.featuredImage ? (
                                        <Image
                                            source={{ uri: story.featuredImage.uri }}
                                            style={{
                                                width: 95,
                                                height: 60,
                                                borderRadius: 8,
                                            }}
                                        />
                                    ) : null}
                                    <View
                                        style={{
                                            flex: 1,
                                            marginLeft: 10,
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <HTML
                                            html={story.title?.rendered || ''}
                                            baseFontStyle={{ fontSize: 16 }}
                                            customWrapper={(text) => {
                                                return (
                                                    <Text ellipsizeMode='tail' numberOfLines={2}>
                                                        {text}
                                                    </Text>
                                                )
                                            }}
                                            tagsStyles={{
                                                rawtext: {
                                                    fontSize: 16,
                                                    fontWeight: 'bold',
                                                    color: theme.colors.text,
                                                },
                                            }}
                                        />
                                        <ArticleAuthors article={story} theme={theme} />
                                        {/* <Text
                                            ellipsizeMode='tail'
                                            numberOfLines={1}
                                            style={{
                                                color: theme.colors.accent,
                                                fontSize: 14,
                                            }}
                                        >
                                            <ArticleAuthors
                                                navigation={navigation}
                                                article={article}
                                                theme={theme}
                                            />
                                            {article.custom_fields.writer
                                                ? this._renderWriters(article.custom_fields.writer)
                                                : ''}
                                        </Text> */}
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text
                                                    style={{
                                                        fontSize: 14,
                                                        color: theme.colors.grayText,
                                                    }}
                                                >
                                                    {_renderDate(story.date)}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )
                    })}
                </View>
            )
        }
    }

    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                padding: 10,
                borderRadius: 8,
            }}
        >
            <Text
                style={{
                    textAlign: 'center',
                    color: theme.colors.grayText,
                    fontSize: 19,
                    fontFamily: 'ralewayBold',
                    paddingVertical: 10,
                }}
            >
                Related Stories
            </Text>
            {_renderRelatedStories()}
        </View>
    )
}

const mapStateToProps = (state) => ({
    activeDomain: getActiveDomain(state),
    theme: state.theme,
})

export default connect(mapStateToProps)(RelatedStoriesWidget)
