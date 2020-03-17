import React from 'react'
import { View, FlatList, ActivityIndicator, StyleSheet } from 'react-native'
import Moment from 'moment'

import SmallThumbnailListItem from '../components/SmallThumbnailListItem'
import AlternatingThumbnailListItem from '../components/AlternatingThumbnailListItem'
import LargeThumbnailListItem from '../components/LargeThumbnailListItem'
import SmallLargeListItem from '../components/SmallLargeListItem'

Moment.updateLocale('en', {
    relativeTime: {
        d: '1 day'
    }
})

export default class ArticleListContent extends React.Component {
    render() {
        const {
            articleList,
            isRefreshing,
            isFetching,
            saveRef,
            loadMore,
            handleRefresh
        } = this.props
        return (
            <View style={{ flex: 1 }}>
                <FlatList
                    Style={{ flex: 1, marginVertical: 5 }}
                    data={articleList}
                    keyExtractor={item => item.id.toString()}
                    ref={ref => {
                        if (saveRef) {
                            saveRef(ref)
                        }
                        return
                    }}
                    onEndReachedThreshold={0.25}
                    onEndReached={() => {
                        if (!this.onEndReachedCalledDuringMomentum && loadMore) {
                            loadMore()
                            this.onEndReachedCalledDuringMomentum = true
                        }
                    }}
                    onRefresh={handleRefresh ? handleRefresh : null}
                    refreshing={isRefreshing}
                    onMomentumScrollBegin={() => {
                        this.onEndReachedCalledDuringMomentum = false
                    }}
                    ListFooterComponent={() => {
                        if (!isFetching) {
                            return null
                        }
                        return (
                            <View style={styles.loadingMore}>
                                <ActivityIndicator />
                            </View>
                        )
                    }}
                    renderItem={this._renderItem}
                />
            </View>
        )
    }

    _renderItem = ({ item, index }) => {
        const {
            theme,
            onIconPress,
            deleteIcon,
            activeDomain,
            enableComments,
            storyListStyle
        } = this.props

        console.log('ctive domin', activeDomain)

        const article = item

        if (storyListStyle === 'large') {
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
        } else if (storyListStyle === 'alternating') {
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
        } else if (storyListStyle === 'mix') {
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
        } else {
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
}

const styles = StyleSheet.create({
    loadingMore: {
        flex: 1,
        paddingTop: 20,
        paddingBottom: 30,
        alignItems: 'center'
    },
    storyContainer: {
        flexDirection: 'row',
        flex: 1,
        marginHorizontal: 10,
        marginVertical: 10
    },
    featuredImage: {
        width: 125,
        height: 80,
        borderRadius: 8
    },
    storyInfo: {
        flex: 1,
        marginLeft: 10,
        justifyContent: 'space-between'
    }
})
