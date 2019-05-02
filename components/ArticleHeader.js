import React from 'react';
import {
    Text,
    View,
    TouchableOpacity
} from 'react-native';
import { withTheme, Badge, Colors } from 'react-native-paper';

const ArticleHeader = (props) => {
    const { navigation, state, theme } = props;
    let commentNumber = navigation.getParam('commentNumber', 0)
    let comments = navigation.getParam('comments', null)
    let article = navigation.getParam('article', null)
    let articleId = navigation.getParam('articleId', null)

    return (
        <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate('FullArticle')
                }}
            >
                <Text
                    style={{
                        paddingHorizontal: 5,
                        color: state.routeName === 'FullArticle' ? theme.colors.primary : theme.colors.disabled,
                        fontSize: 19
                    }}>Article</Text>
            </TouchableOpacity>
            <Text
                style={{
                    color: 'black',
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
                        color: state.routeName === 'Comments' ? props.theme.colors.primary : props.theme.colors.disabled,
                        fontSize: 19
                    }}>
                    Comments
                </Text>
                {commentNumber ?
                    <Badge style={{
                        position: 'absolute',
                        top: -10,
                        right: -10,
                        backgroundColor: '#4fc3f7'
                    }}>{commentNumber}</Badge>
                    :
                    null
                }
            </TouchableOpacity>
        </View>
    )
}

export const CustomArticleHeader = withTheme(ArticleHeader);