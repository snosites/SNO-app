import React from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import { Badge } from 'react-native-paper'
import { connect } from 'react-redux'

import { actions as snackbarQueueActions } from '../redux/snackbarQueue'

const ArticleNavigatorHeader = (props) => {
    const {
        route,
        navigation,
        state,
        theme,
        enableComments,
        commentNumber,
        comments,
        articleId,
    } = props
    // let commentNumber = navigation.getParam('commentNumber', 0)
    // let comments = navigation.getParam('comments', null)
    // let articleId = navigation.getParam('articleId', null)
    // let primaryColor = Color(theme.colors.primary)
    // let isDark = primaryColor.isDark()

    const baseStyle = {
        paddingHorizontal: 5,
        fontSize: 19,
    }
    const activeColorStyle = theme.primaryIsDark ? 'white' : 'black'
    const inactiveColorStyle = theme.primaryIsDark ? '#bdbdbd' : '#9e9e9e'

    const articleStyle =
        route.name === 'Article'
            ? { ...baseStyle, color: activeColorStyle }
            : { ...baseStyle, color: inactiveColorStyle }

    const commentStyle =
        route.name === 'Comments'
            ? { ...baseStyle, color: activeColorStyle }
            : { ...baseStyle, color: inactiveColorStyle }

    return (
        <View
            style={{
                flexDirection: 'row',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate('Article')
                }}
            >
                <Text style={articleStyle}>Article</Text>
            </TouchableOpacity>
            {!enableComments && (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text
                        style={{
                            color: theme.primaryIsDark ? 'white' : 'black',
                            fontSize: 19,
                        }}
                    >
                        |
                    </Text>
                    <TouchableOpacity
                        onPress={() => {
                            // navigation.navigate('Comments', {
                            //     comments,
                            //     articleId,
                            // })
                        }}
                    >
                        <Text style={commentStyle}>Comments</Text>
                        {/* {commentNumber ? (
                            <Badge
                                style={{
                                    position: 'absolute',
                                    top: -10,
                                    right: -10,
                                    backgroundColor: theme.primaryIsDark ? 'white' : 'black',
                                }}
                            >
                                {commentNumber}
                            </Badge>
                        ) : null} */}
                    </TouchableOpacity>
                </View>
            )}
        </View>
    )
}
const mapStateToProps = (state) => ({
    enableComments: state.global.enableComments,
    theme: state.theme,
})

export default connect(mapStateToProps)(ArticleNavigatorHeader)
