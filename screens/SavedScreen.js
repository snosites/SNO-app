import React, { useState, useRef } from 'react'
import { View, Text, Image, FlatList } from 'react-native'

import { useIsTablet } from '../utils/helpers'

import ListItemRenderer from '../components/listItems/ListItemRenderer'

import { handleArticlePress } from '../utils/articlePress'

const SavedScreen = (props) => {
    const { savedArticles, activeDomain, theme, navigation, global } = props
    const isTablet = useIsTablet()

    const flatListRef = useRef(null)

    // _scrollToTop = () => {
    //     this.flatListRef.scrollToOffset({ animated: true, offset: 0 })
    // }

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.surface }}>
            <FlatList
                Style={{ flex: 1 }}
                contentContainerStyle={{ padding: 10 }}
                data={savedArticles}
                keyExtractor={(item) => item.id.toString()}
                ref={flatListRef}
                renderItem={({ item, index, separators }) => (
                    <ListItemRenderer
                        theme={theme}
                        item={item}
                        index={index}
                        separators={separators}
                        onPress={() => handleArticlePress(item, activeDomain)}
                        listStyle={'small'}
                    />
                )}
                ItemSeparatorComponent={() => (
                    <View style={{ height: 10, backgroundColor: theme.colors.surface }} />
                )}
                ListEmptyComponent={() => (
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <Text
                            style={{
                                fontSize: 18,
                                textAlign: 'center',
                                padding: 20,
                                fontFamily: 'openSansBold',
                            }}
                        >
                            You don't have any saved articles for this school
                        </Text>
                    </View>
                )}
            />
        </View>
    )
}

export default SavedScreen
