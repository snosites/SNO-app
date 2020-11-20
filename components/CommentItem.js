import React, { useState, useEffect, useRef } from 'react'
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

import { SafeAreaView } from 'react-native-safe-area-context'

const CommentItem = (props) => {
    const { comment } = props

    console.log('comment', comment)

    return (
        <View style={styles.container}>
            <View style={styles.authorContainer}>
                {comment.author_avatar_urls && comment.author_avatar_urls[48] ? (
                    <Image
                        source={{ uri: comment.author_avatar_urls[48] }}
                        style={{
                            width: 48,
                            height: 48,
                            resizeMode: 'cover',
                            borderRadius: 24,
                        }}
                    />
                ) : null}
                <View style={{ flex: 1, justifyContent: 'space-around', marginLeft: 20 }}>
                    <Text style={{ fontSize: 20, fontFamily: 'ralewayBold' }}>
                        {comment.author_name}
                    </Text>
                    <Text style={{ color: 'grey' }}>{String(Moment(comment.date).fromNow())}</Text>
                </View>
            </View>
            <View style={styles.textCommentContainer}>
                <HTML
                    html={comment.content.rendered}
                    textSelectable={true}
                    ignoredStyles={['height', 'width', 'display', 'font-family']}
                    allowedStyles={[]}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
    },
    commentInfoContainer: {
        padding: 15,
    },
    authorContainer: {
        flexDirection: 'row',
        paddingBottom: 8,
    },
    textCommentContainer: {},
})

export default CommentItem
