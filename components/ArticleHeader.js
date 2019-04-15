import React from 'react';
import {
    Text,
    View,
    TouchableOpacity
} from 'react-native';
import { withTheme } from 'react-native-paper';

export const ArticleHeader = (props) => {
    const { navigation, state } = props;
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
                        color: state.routeName === 'FullArticle' ? props.theme.colors.primary : props.theme.colors.disabled,
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
                    navigation.navigate('Comments')
                }}

            >
                <Text
                    style={{
                        paddingHorizontal: 5,
                        color: state.routeName === 'Comments' ? props.theme.colors.primary : props.theme.colors.disabled,
                        fontSize: 19
                    }}>Comments</Text>
            </TouchableOpacity>
        </View>
    )
}

export const CustomArticleHeader = withTheme(ArticleHeader);