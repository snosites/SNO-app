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
    KeyboardAvoidingView,
    Modal,
    SafeAreaView,
    Keyboard,
    ActivityIndicator,
} from 'react-native'

import Moment from 'moment'
import Color from 'color'
import HTML from 'react-native-render-html'
import { CustomArticleHeader } from '../components/ArticleNavigatorHeader'
import { Ionicons } from '@expo/vector-icons'
import { Button, TextInput as PaperTextInput, Snackbar } from 'react-native-paper'

import { HeaderBackButton } from 'react-navigation'

const CommentScreen = (props) => {
    const { navigation, route, userInfo, saveUserInfo, theme, setCommentPosted } = props

    const [ commentInput, setCommentInput ] = useState('')
    const [username, setUsername] = useState(userInfo.username)
    const [email, setEmail] = useState(userInfo.email)
    const [modalVisible, setModalVisible] = useState(false)
    const [commentSent, setCommentSent] = useState(false)

    let comments = route.params && route.params.comments ? route.params.comments : []

    return (
        <View style={{ flex: 1 }}>
                <KeyboardAvoidingView
                    contentContainerStyle={{ flex: 1 }}
                    style={{ flex: 1 }}
                    behavior='position'
                    keyboardVerticalOffset={80}
                    enabled
                >
                    <View style={{ flex: 1, paddingBottom: 60 }}>
                        <FlatList
                            Style={{ flex: 1, marginVertical: 5 }}
                            data={comments}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={this._renderItem}
                        />
                        <View style={styles.commentContainer}>
                            <Ionicons
                                name={Platform.OS === 'ios' ? 'ios-chatboxes' : 'md-chatboxes'}
                                size={45}
                                color='#eeeeee'
                                style={{ paddingHorizontal: 20 }}
                            />
                            <TextInput
                                style={{ height: 60, flex: 1, fontSize: 19 }}
                                placeholder='Write a comment'
                                onSubmitEditing={() => {
                                    if (!userInfo.username) {
                                        this._showModal()
                                    } else {
                                        this._addComment()
                                    }
                                }}
                                returnKeyType='send'
                                value={commentInput}
                                onChangeText={(text) => this.setState({ commentInput: text })}
                            />
                            <View style={styles.sendContainer}>
                                <TouchableOpacity
                                    style={[
                                        styles.sendContainer,
                                        { backgroundColor: primaryColor },
                                    ]}
                                    onPress={() => {
                                        Keyboard.dismiss()
                                        if (!userInfo.username || !userInfo.email) {
                                            this._showModal()
                                        } else {
                                            this._addComment()
                                        }
                                    }}
                                >
                                    {this.state.commentSent ? (
                                        <ActivityIndicator />
                                    ) : (
                                        <Ionicons
                                            name={Platform.OS === 'ios' ? 'ios-send' : 'md-send'}
                                            size={45}
                                            color={isDark ? 'white' : 'black'}
                                        />
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </KeyboardAvoidingView>
                
                <Snackbar
                    visible={userInfo.commentPosted}
                    onDismiss={() => {
                        setCommentPosted(false)
                        this.setState({
                            commentSent: false,
                        })
                    }}
                    duration={3000}
                    action={{
                        label: 'Dismiss',
                        onPress: () => {
                            setCommentPosted(false)
                            this.setState({
                                commentSent: false,
                            })
                        },
                    }}
                >
                    {userInfo.commentPosted && userInfo.commentPosted === 'posted'
                        ? 'Success!  Your comment is awaiting review'
                        : 'There was an error posting your comment.  Please try again.'}
                </Snackbar>
            </View>
    )
}

class CommentsScreen extends React.Component {
    

    state = {
        commentInput: '',
        modalVisible: false,
        username: '',
        email: '',
        commentSent: false,
    }

    render() {
        

        let primaryColor = Color(theme.colors.primary)
        let isDark = primaryColor.isDark()

        return (
            
        )
    }

    _showModal = () => this.setState({ modalVisible: true })
    _hideModal = () => this.setState({ modalVisible: false })

    _addComment = () => {
        const { activeDomain, userInfo, addComment, navigation } = this.props
        const articleId = navigation.getParam('articleId', null)
        addComment({
            domain: activeDomain.url,
            articleId,
            username: userInfo.username,
            email: userInfo.email,
            comment: this.state.commentInput,
        })

        this.setState({
            commentInput: '',
            commentSent: true,
        })
    }

    _renderItem = ({ item, index }) => {
        return (
            <View style={styles.commentInfoContainer}>
                <View style={styles.authorContainer}>
                    {item.author_avatar_urls && item.author_avatar_urls[48] ? (
                        <Image
                            source={{ uri: item.author_avatar_urls[48] }}
                            style={{
                                width: 50,
                                height: 50,
                                resizeMode: 'cover',
                                borderRadius: 25,
                            }}
                        />
                    ) : null}
                    <View style={{ flex: 1, justifyContent: 'space-around', marginLeft: 20 }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{item.author_name}</Text>
                        <Text style={{ color: 'grey' }}>{String(Moment(item.date).fromNow())}</Text>
                    </View>
                </View>
                <View style={styles.textCommentContainer}>
                    <HTML
                        html={item.content.rendered}
                        textSelectable={true}
                        // onLinkPress={(e, href) => this._viewLink(href)}
                        // tagsStyles={{
                        //     p: {
                        //         fontSize: 18,
                        //         marginBottom: 15
                        //     }
                        // }}
                    />
                    {/* <Text>{item.content.rendered}</Text> */}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    commentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 60,
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        borderTopWidth: 1,
        borderColor: '#e0e0e0',
        backgroundColor: 'white',
        zIndex: 5,
    },
    sendContainer: {
        height: 60,
        width: 60,
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
