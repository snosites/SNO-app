import React from 'react';
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
    SafeAreaView
} from 'react-native';
import { connect } from 'react-redux';
import { saveUserInfo, addComment } from '../redux/actions/actions';
import Moment from 'moment';
import HTML from 'react-native-render-html';
import { CustomArticleHeader } from '../components/ArticleHeader';
import { Ionicons } from '@expo/vector-icons';
import { Button, TextInput as PaperTextInput } from 'react-native-paper';

import { HeaderBackButton } from 'react-navigation';

class CommentsScreen extends React.Component {
    static navigationOptions = ({ navigation, navigation: { state } }) => {
        return {
            headerTitle: <CustomArticleHeader state={state} navigation={navigation} />,
            headerLeft: <HeaderBackButton onPress={() => {
                navigation.navigate('List')
            }}
            />
        };
    };

    state = {
        commentInput: '',
        modalVisible: false,
        username: '',
        email: ''
    }

    render() {
        const { navigation, userInfo, dispatch } = this.props;
        const { modalVisible, username, email } = this.state;
        let comments = navigation.getParam('comments', null)
        console.log('comments', comments)
        return (
            <View style={{ flex: 1 }}>
                <KeyboardAvoidingView
                    contentContainerStyle={{ flex: 1, }}
                    style={{ flex: 1, }}
                    behavior="position"
                    keyboardVerticalOffset={60}
                    enabled
                >
                    <View style={{ flex: 1, paddingBottom: 60 }}>
                        <FlatList
                            Style={{ flex: 1, marginVertical: 5 }}
                            data={comments}
                            keyExtractor={item => item.id.toString()}
                            renderItem={this._renderItem}
                        />
                        <View style={styles.commentContainer}>
                            <Ionicons name={Platform.OS === 'ios' ? 'ios-chatboxes' : 'md-chatboxes'} size={45} color="#eeeeee" style={{ paddingHorizontal: 20 }} />
                            <TextInput
                                style={{ height: 60, flex: 1, fontSize: 19 }}
                                placeholder="Write a comment"
                                onSubmitEditing={this._addComment}
                                returnKeyType='send'
                                onChangeText={(text) => this.setState({ commentInput: text })}
                            />
                            <View style={styles.sendContainer}>
                                <TouchableOpacity
                                    style={styles.sendContainer}
                                    onPress={() => {
                                        if(!userInfo.username) {
                                            this._showModal();
                                        } else {
                                            this._addComment();
                                        }
                                    }}
                                >
                                    <Ionicons name={Platform.OS === 'ios' ? 'ios-send' : 'md-send'} size={45} color="white" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                </KeyboardAvoidingView>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={modalVisible}
                    onDismiss={this._hideModal}
                >
                    <SafeAreaView style={{ flex: 1, alignItems: 'center', padding: 20, backgroundColor: '#f6f6f6' }}>
                        <Text style={{ textAlign: 'center', fontSize: 19, padding: 30 }}>
                            You need to enter some information before you can post comments.  You will only have to do this once.
                        </Text>
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <PaperTextInput
                                label='Username'
                                theme={{ roundness: 7 }}
                                style={{ width: 300, borderRadius: 5, marginBottom: 20 }}
                                placeholder='This is what will display publicly'
                                mode='outlined'
                                value={username}
                                onChangeText={text => this.setState({ username: text })}
                            />
                            <PaperTextInput
                                label='Email'
                                placeholder='We need this for verification purposes'
                                keyboardType='email-address'
                                style={{ width: 300, borderRadius: 10 }}
                                theme={{ roundness: 7 }}
                                mode='outlined'
                                value={email}
                                onChangeText={text => this.setState({ email: text })}
                            />
                            <View style={{ flexDirection: 'row' }}>
                                <Button 
                                    mode="contained" 
                                    theme={{ roundness: 7 }}
                                    style={{ paddingHorizontal: 30, margin: 20, backgroundColor: '#f44336' }} 
                                    onPress={this._hideModal}
                                >
                                    <Text>Cancel</Text>
                                </Button>
                                <Button 
                                    mode="contained" 
                                    theme={{ roundness: 7 }}
                                    style={{ paddingHorizontal: 30, margin: 20}}
                                    onPress={() => {
                                    dispatch(saveUserInfo({
                                        username,
                                        email
                                    }))
                                    this._hideModal();
                                }}>
                                    <Text>Save</Text>
                                </Button>
                            </View>
                        </View>
                    </SafeAreaView>
                </Modal>
            </View>
        )
    }

    _showModal = () => this.setState({ modalVisible: true });
    _hideModal = () => this.setState({ modalVisible: false });

    _addComment = () => {
        const { activeDomain, userInfo, articleId, dispatch } = this.props;
        dispatch(addComment({
            domain: activeDomain.url, 
            articleId, 
            username: userInfo.username, 
            email: userInfo.email, 
            comment: this.state.commentInput
        }))
        this.setState({
            commentInput: ''
        })
    }

    _renderItem = ({ item, index }) => {
        return (
            <View style={styles.commentInfoContainer}>
                <View style={styles.authorContainer}>
                    <Image
                        source={{ uri: item.author_avatar_urls[48] }}
                        style={{
                            width: 48,
                            height: 48,
                        }}
                    />
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
        zIndex: 5
    },
    sendContainer: {
        height: 60,
        width: 60,
        paddingTop: 3,
        backgroundColor: '#7e57c2',
        alignItems: 'center',
        justifyContent: 'center'
    },
    commentInfoContainer: {
        padding: 20
    },
    authorContainer: {
        flexDirection: 'row',
        paddingBottom: 10
    },
})

mapStateToProps = state => {
    return {
        activeDomain: state.activeDomain,
        userInfo: state.userInfo
    }
}

export default connect(mapStateToProps)(CommentsScreen);