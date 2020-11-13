import React, { useState, useRef } from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import LottieView from 'lottie-react-native'
import * as Device from 'expo-device'

import { useIsTablet } from '../utils/helpers'

import ArticleListContent from '../views/ArticleListContent'
import TabletArticleListContent from '../views/TabletArticleListContent'

const SavedScreen = (props) => {
    const { savedArticles, activeDomain, theme, navigation, global, removeSavedArticle } = props
    const isTablet = useIsTablet()

    const flatListRef = useRef(null)

    const _saveRef = (ref) => {
        flatListRef = ref
    }

    if (!savedArticles.length) {
        return (
            <View style={{ flex: 1, alignItems: 'center' }}>
                <Text
                    style={{
                        fontSize: 18,
                        textAlign: 'center',
                        padding: 20,
                        fontFamily: 'openSansBold',
                    }}
                >
                    You don't have any saved articles for this school yet
                </Text>
            </View>
        )
    }
    return (
        <View style={{ flex: 1 }}>
            {isTablet ? (
                <TabletArticleListContent
                    articleList={savedArticles}
                    saveRef={_saveRef}
                    activeDomain={activeDomain}
                    theme={theme}
                    navigation={navigation}
                    enableComments={global.enableComments}
                    onIconPress={(article) => removeSavedArticle(article.id, activeDomain.id)}
                    deleteIcon={true}
                    onPress={() => {}}
                />
            ) : (
                <ArticleListContent
                    articleList={savedArticles}
                    saveRef={_saveRef}
                    activeDomain={activeDomain}
                    theme={theme}
                    navigation={navigation}
                    enableComments={global.enableComments}
                    onIconPress={(article) => removeSavedArticle(article.id, activeDomain.id)}
                    deleteIcon={true}
                    storyListStyle={global.storyListStyle}
                    onPress={() => {}}
                />
            )}
        </View>
    )
}

// componentDidUpdate() {
//         if (this.animation) {
//             this._playAnimation()
//         }
//         const { navigation } = this.props
//         if (navigation.state.params && navigation.state.params.scrollToTop) {
//             if (this.flatListRef) {
//                 // scroll list to top
//                 this._scrollToTop()
//             }
//             navigation.setParams({ scrollToTop: false })
//         }
//     }

// _scrollToTop = () => {
//     this.flatListRef.scrollToOffset({ animated: true, offset: 0 })
// }

export default SavedScreen
