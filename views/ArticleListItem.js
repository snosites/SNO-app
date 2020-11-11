import React from 'react'
import { View, FlatList, ActivityIndicator, StyleSheet } from 'react-native'
import Moment from 'moment'

import SmallThumbnailListItem from '../components/SmallThumbnailListItem'
import AlternatingThumbnailListItem from '../components/AlternatingThumbnailListItem'
import LargeThumbnailListItem from '../components/LargeThumbnailListItem'
import SmallLargeListItem from '../components/SmallLargeListItem'
import AdBlock from '../components/AdBlock'

Moment.updateLocale('en', {
    relativeTime: {
        d: '1 day',
    },
})

export default (props) => {
    const {
        article,
        theme,
        onIconPress,
        deleteIcon,
        activeDomain,
        enableComments,
        storyListStyle,
    } = props

    const article = item

    switch (storyListStyle) {
        case 'large':
            return (
                <LargeThumbnailListItem
                    article={article}
                    activeDomain={activeDomain}
                    theme={theme}
                    deleteIcon={deleteIcon}
                    onIconPress={onIconPress}
                    enableComments={enableComments}
                />
            )
        case 'alternating':
            return (
                <AlternatingThumbnailListItem
                    article={article}
                    activeDomain={activeDomain}
                    theme={theme}
                    deleteIcon={deleteIcon}
                    onIconPress={onIconPress}
                    enableComments={enableComments}
                    alternate={index % 2 === 0}
                />
            )
        case 'mix':
            return (
                <SmallLargeListItem
                    article={article}
                    activeDomain={activeDomain}
                    theme={theme}
                    deleteIcon={deleteIcon}
                    onIconPress={onIconPress}
                    enableComments={enableComments}
                    large={index % 4 === 0}
                />
            )
        default:
            return (
                <SmallThumbnailListItem
                    article={article}
                    activeDomain={activeDomain}
                    theme={theme}
                    deleteIcon={deleteIcon}
                    onIconPress={onIconPress}
                    enableComments={enableComments}
                />
            )
    }
}

const styles = StyleSheet.create({
    loadingMore: {
        flex: 1,
        paddingTop: 20,
        paddingBottom: 30,
        alignItems: 'center',
    },
    storyContainer: {
        flexDirection: 'row',
        flex: 1,
        marginHorizontal: 10,
        marginVertical: 10,
    },
    featuredImage: {
        width: 125,
        height: 80,
        borderRadius: 8,
    },
    storyInfo: {
        flex: 1,
        marginLeft: 10,
        justifyContent: 'space-between',
    },
})
