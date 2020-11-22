import React, { useState, useEffect, useLayoutEffect } from 'react'
import {
    StyleSheet,
    Text,
    View,
    Image,
    Platform,
    FlatList,
    TextInput,
    TouchableOpacity,
    Modal,
    Keyboard,
    KeyboardAvoidingView,
    ActivityIndicator,
} from 'react-native'

import Moment from 'moment'
import HTML from 'react-native-render-html'
import { Ionicons } from '@expo/vector-icons'
import { Button, TextInput as PaperTextInput, Snackbar } from 'react-native-paper'

import CommentItem from '../components/listItems/CommentItem'

import { SafeAreaView } from 'react-native-safe-area-context'

const CommentScreen = (props) => {
    const { navigation, activeDomain, userInfo, theme, addComment, isLoading, article } = props

    const [commentInput, setCommentInput] = useState('')
    const [comments, setComments] = useState([])

    useEffect(() => {})

    useEffect(() => {
        if (article.comments) setComments(article.comments)
    }, [article.comments])

    const _addComment = () => {
        Keyboard.dismiss()
        if (!userInfo.username || !userInfo.email) {
            navigation.push('UserInfoModal')
        } else {
            addComment({
                domain: activeDomain.url,
                articleId: article.id,
                username: userInfo.username,
                email: userInfo.email,
                comment: commentInput,
            })
            setCommentInput('')
        }
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            tabBarLabel: ({ focused, color }) => (
                <View>
                    <Text
                        style={{
                            textAlign: 'center',
                            textTransform: 'uppercase',
                            fontSize: 13,
                            margin: 4,
                            backgroundColor: 'transparent',
                            color,
                        }}
                    >
                        Comments
                    </Text>
                    {comments.length ? (
                        <View
                            style={{
                                position: 'absolute',
                                top: -9,
                                right: -9,
                                height: 18,
                                width: 18,
                                borderRadius: 9,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: theme.colors.accent,
                            }}
                        >
                            <Text
                                style={{
                                    textAlign: 'center',
                                    fontSize: 12,
                                    color: theme.accentIsDark ? 'white' : 'black',
                                }}
                            >
                                {comments.length > 99 ? '99+' : comments.length}
                            </Text>
                        </View>
                    ) : null}
                </View>
            ),
        })
    }, [navigation, comments])

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <FlatList
                Style={{ flex: 1 }}
                data={comments}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <CommentItem key={item.id} comment={item} theme={theme} />
                )}
                ListEmptyComponent={() => (
                    <View>
                        <Text
                            style={{
                                fontFamily: 'ralewayBold',
                                fontSize: 18,
                                textAlign: 'center',
                                paddingHorizontal: 20,
                                color: theme.colors.text,
                            }}
                        >
                            There are no comments for this article yet
                        </Text>
                    </View>
                )}
            />
            <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={140} enabled>
                <View
                    style={[styles.commentContainer, { backgroundColor: theme.colors.background }]}
                >
                    <Ionicons
                        name={Platform.OS === 'ios' ? 'ios-chatboxes' : 'md-chatboxes'}
                        size={25}
                        color='#eeeeee'
                        style={{ paddingRight: 20 }}
                    />
                    <TextInput
                        style={{ flex: 1, fontSize: 16, color: theme.colors.text }}
                        placeholder='Write a comment'
                        placeholderTextColor={theme.colors.text}
                        onSubmitEditing={_addComment}
                        returnKeyType='send'
                        value={commentInput}
                        onChangeText={(text) => setCommentInput(text)}
                        multiline={true}
                        textAlignVertical='top'
                    />
                    <View style={styles.sendContainer}>
                        <TouchableOpacity
                            style={[
                                styles.sendContainer,
                                { backgroundColor: theme.colors.primary },
                            ]}
                            onPress={_addComment}
                        >
                            {isLoading ? (
                                <ActivityIndicator />
                            ) : (
                                <Ionicons
                                    name={Platform.OS === 'ios' ? 'ios-send' : 'md-send'}
                                    size={25}
                                    color={theme.primaryIsDark ? 'white' : 'black'}
                                    style={{ marginBottom: -3 }}
                                />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    commentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 60,
        margin: 5,
        bottom: 0,
        right: 0,
        left: 0,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        zIndex: 5,
        borderRadius: 30,
        overflow: 'hidden',
        paddingHorizontal: 15,
    },
    sendContainer: {
        height: 40,
        width: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    commentInfoContainer: {
        padding: 15,
    },
    authorContainer: {
        flexDirection: 'row',
        paddingBottom: 8,
    },
})

export default CommentScreen
