import React from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import { withTheme, Badge, Colors } from 'react-native-paper'
import Color from 'color'
import { connect } from 'react-redux'

const ArticleHeader = props => {
    const { navigation, state, theme, enableComments } = props
    let commentNumber = navigation.getParam('commentNumber', 0)
    let comments = navigation.getParam('comments', null)
    let articleId = navigation.getParam('articleId', null)
    let primaryColor = Color(theme.colors.primary)
    let isDark = primaryColor.isDark()

    return (
        <View
            style={{
                flexDirection: 'row',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate('FullArticle')
                }}
            >
                <Text
                    style={{
                        paddingHorizontal: 5,
                        color:
                            state.routeName === 'FullArticle'
                                ? isDark
                                    ? 'white'
                                    : 'black'
                                : isDark
                                ? '#bdbdbd'
                                : '#9e9e9e',
                        fontSize: 19
                    }}
                >
                    Article
                </Text>
            </TouchableOpacity>
            {enableComments && (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text
                        style={{
                            color: isDark ? 'white' : 'black',
                            fontSize: 19
                        }}
                    >
                        |
                    </Text>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('Comments', {
                                comments,
                                articleId
                            })
                        }}
                    >
                        <Text
                            style={{
                                paddingHorizontal: 5,
                                color:
                                    state.routeName === 'Comments'
                                        ? isDark
                                            ? 'white'
                                            : 'black'
                                        : isDark
                                        ? '#bdbdbd'
                                        : '#9e9e9e',
                                fontSize: 19
                            }}
                        >
                            Comments
                        </Text>
                        {commentNumber ? (
                            <Badge
                                style={{
                                    position: 'absolute',
                                    top: -10,
                                    right: -10,
                                    backgroundColor: isDark ? 'white' : 'black'
                                }}
                            >
                                {commentNumber}
                            </Badge>
                        ) : null}
                    </TouchableOpacity>
                </View>
            )}
        </View>
    )
}

const mapState = state => {
    return {
        enableComments: state.global.enableComments
    }
}

export const CustomArticleHeader = connect(mapState)(withTheme(ArticleHeader))
