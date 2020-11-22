import React from 'react'
import {
    View,
    FlatList,
    Text,
    Image,
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
} from 'react-native'
import Moment from 'moment'
import Color from 'color'
import HTML from 'react-native-render-html'

import { handleArticlePress } from '../../utils/articlePress'

import { FontAwesome } from '@expo/vector-icons'
import { MaterialIcons } from '@expo/vector-icons'
import { Badge } from 'react-native-paper'

const screenWidth = Dimensions.get('window').width

Moment.updateLocale('en', {
    relativeTime: {
        d: '1 day',
    },
})

export default class TabletArticleListContent extends React.Component {
    state = {
        height: 0,
        width: 0,
    }

    _handleLayout = (e) => {
        const { height, width } = e.nativeEvent.layout

        if (this.state.height !== height || this.state.width !== width) {
            this.setState({ height, width })
        }
    }

    render() {
        const {
            articleList,
            isRefreshing,
            isFetching,
            saveRef,
            loadMore,
            handleRefresh,
        } = this.props
        return (
            <View style={{ flex: 1 }} onLayout={this._handleLayout}>
                <FlatList
                    numColumns={2}
                    Style={{ flex: 1, marginVertical: 5 }}
                    data={articleList}
                    keyExtractor={(item) => item.id.toString()}
                    // ref={(ref) => {
                    //     if (saveRef) {
                    //         saveRef(ref)
                    //     }
                    //     return
                    // }}
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
                    columnWrapperStyle={{
                        borderBottomColor: '#9e9e9e',
                        borderBottomWidth: 0.5,
                    }}
                />
            </View>
        )
    }

    // TODO: show adds in tablet version
    _renderItem = ({ item, index }) => {
        const {
            theme,
            onIconPress,
            deleteIcon,
            activeDomain,
            enableComments,
            listAds,
            ad,
        } = this.props
        const { width, height } = this.state
        const article = item
        const hasFeaturedImage = article.featuredImage

        const imageWidth = screenWidth / 2 - 40
        const imageHeight = imageWidth * 0.55

        const containerWidth = index % 8 === 0 ? width : null

        if (true) {
            return (
                <TouchableOpacity
                    style={{
                        flex: 1,
                        height: imageHeight + 175,
                        borderRightWidth: 0.5,
                        borderRightColor: '#9e9e9e',
                    }}
                    onPress={() => handleArticlePress(article, activeDomain)}
                >
                    <View style={{ flex: 1, margin: 20 }}>
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
                                    ? this._renderWriters(article.custom_fields.writer)
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
                                                style={{ paddingVertical: 50 }}
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
                            <View style={{ flexDirection: 'row' }}>
                                {this._renderDate(article.date)}
                            </View>
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
        return (
            <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => handleArticlePress(article, activeDomain)}
            >
                <View style={{ flex: 1, margin: 20 }}>
                    <HTML
                        html={article.title.rendered}
                        baseFontStyle={{ fontSize: 23 }}
                        customWrapper={(text) => {
                            return (
                                <Text ellipsizeMode='tail' numberOfLines={2}>
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
                    <View style={{ alignSelf: 'flex-end' }}>
                        <Text
                            ellipsizeMode='tail'
                            numberOfLines={1}
                            style={{
                                color: theme.colors.accent,
                                fontSize: 15,
                            }}
                        >
                            {article.custom_fields.writer
                                ? this._renderWriters(article.custom_fields.writer)
                                : ''}
                        </Text>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            <View style={{ flexDirection: 'row' }}>
                                {this._renderDate(article.date)}
                            </View>
                        </View>
                        <View
                            style={{
                                justifySelf: 'end',
                                justifyContent: 'space-between',
                            }}
                        >
                            <View>
                                <FontAwesome name='comment' size={21} color='#e0e0e0' />
                                <Badge
                                    size={16}
                                    style={{
                                        position: 'absolute',
                                        bottom: 2,
                                        right: 4,
                                        backgroundColor: theme.colors.accent,
                                    }}
                                >
                                    {article.comments.length > 99 ? '99' : article.comments.length}
                                </Badge>
                            </View>
                            <MaterialIcons
                                name={
                                    deleteIcon
                                        ? 'delete'
                                        : article.saved
                                        ? 'bookmark'
                                        : 'bookmark-border'
                                }
                                color={deleteIcon ? '#c62828' : theme.colors.accent}
                                style={{ paddingHorizontal: 5 }}
                                size={24}
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

    _renderDate = (date) => {
        return (
            <Text
                style={{
                    fontSize: 17,
                    color: '#9e9e9e',
                }}
            >
                {Moment().isAfter(Moment(date).add(7, 'days'))
                    ? String(Moment(date).format('MMM D, YYYY'))
                    : String(Moment(date).fromNow())}
            </Text>
        )
    }

    _renderWriters = (writers) => {
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
