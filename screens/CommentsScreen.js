import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    Image,
    ActivityIndicator,
    AsyncStorage,
    Platform,
    FlatList,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView
} from 'react-native';
import Moment from 'moment';
import HTML from 'react-native-render-html';
import { CustomArticleHeader } from '../components/ArticleHeader';
import { Ionicons } from '@expo/vector-icons';

import { HeaderBackButton } from 'react-navigation';

import HeaderButtons, { HeaderButton, Item } from 'react-navigation-header-buttons';


const IoniconsHeaderButton = passMeFurther => (
    // the `passMeFurther` variable here contains props from <Item .../> as well as <HeaderButtons ... />
    // and it is important to pass those props to `HeaderButton`
    // then you may add some information like icon size or color (if you use icons)
    <HeaderButton {...passMeFurther} IconComponent={Ionicons} iconSize={28} color="#2f95dc" />
);



export default class CommentsScreen extends React.Component {
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
        commentInput: ''
    }

    render() {
        const { navigation } = this.props;
        let comments = navigation.getParam('comments', null)
        console.log('comments', comments)
        return (
            <KeyboardAvoidingView
                contentContainerStyle={{ flex: 1,  }}
                style={{ flex: 1,  }}
                behavior="position"
                keyboardVerticalOffset={60}
                enabled
            >
                <View style={{ flex: 1, paddingBottom: 60 }}>
                    <FlatList
                        Style={{ flex: 1, marginVertical: 5 }}
                        data={comments}
                        keyExtractor={item => item.id.toString()}
                        // onEndReachedThreshold={0.25}
                        // onEndReached={this._loadMore}
                        // onRefresh={this._handleRefresh}
                        // refreshing={category.isFetching}
                        renderItem={this._renderItem}
                    />

                    <View style={styles.commentContainer}>
                        <Ionicons name={Platform.OS === 'ios' ? 'ios-chatboxes' : 'md-chatboxes'} size={45} color="#eeeeee" style={{ paddingHorizontal: 20 }} />
                        <TextInput
                            style={{ height: 60, flex: 1, fontSize: 19 }}
                            placeholder="Write a comment"
                            onSubmitEditing={() => console.log('pressed', this.state.commentInput)}
                            returnKeyType='send'
                            onChangeText={(text) => this.setState({ commentInput: text })}
                        />

                        <View style={styles.sendContainer}>
                            <TouchableOpacity
                                style={styles.sendContainer}
                                onPress={() => console.log('pressed', this.state.commentInput)}
                            >
                                <Ionicons name={Platform.OS === 'ios' ? 'ios-send' : 'md-send'} size={45} color="white" />
                            </TouchableOpacity>

                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        )
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
                            // marginRight: 20
                        }}
                    />
                    <View style={{ flex: 1, justifyContent: 'space-around', marginLeft: 20}}>
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