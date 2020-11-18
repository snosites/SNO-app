import React, { useState, useEffect, useRef } from 'react'
import { Text, View, Modal, TouchableOpacity } from 'react-native'

import Moment from 'moment'
import HTML from 'react-native-render-html'
import { Feather } from '@expo/vector-icons'
import { Button, Snackbar } from 'react-native-paper'

import { SafeAreaView } from 'react-native-safe-area-context'

const ArticleActionsScreen = (props) => {
    const { navigation, theme } = props
    return (
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
            <View
                style={{
                    height: 250,
                    backgroundColor: theme.colors.surface,
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                    padding: 15,
                }}
            >
                <TouchableOpacity
                    onPress={() => {}}
                    style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 8 }}
                >
                    <Feather
                        style={{
                            paddingRight: 15,
                            marginBottom: -3,
                        }}
                        name={'share'}
                        size={18}
                        // style={{ marginBottom: -3 }}
                        color={theme.colors.text}
                    />
                    <Text
                        style={{
                            fontFamily: 'openSansBold',
                            fontSize: 15,
                            color: theme.colors.text,
                        }}
                    >
                        Share
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {}}
                    style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8 }}
                >
                    <Feather
                        style={{
                            paddingRight: 15,
                            marginBottom: -3,
                        }}
                        name={'archive'}
                        size={18}
                        color={theme.colors.text}
                    />
                    <Text
                        style={{
                            fontFamily: 'openSansBold',
                            fontSize: 15,
                            color: theme.colors.text,
                        }}
                    >
                        Save
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {}}
                    style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8 }}
                >
                    <Feather
                        style={{
                            paddingRight: 15,
                            marginBottom: -3,
                        }}
                        name={'copy'}
                        size={18}
                        color={theme.colors.text}
                    />
                    <Text
                        style={{
                            fontFamily: 'openSansBold',
                            fontSize: 15,
                            color: theme.colors.text,
                        }}
                    >
                        Copy text
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {}}
                    style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8 }}
                >
                    <Feather
                        style={{
                            paddingRight: 15,
                            marginBottom: -3,
                        }}
                        name={'user-plus'}
                        size={18}
                        color={theme.colors.text}
                    />
                    <Text
                        style={{
                            fontFamily: 'openSansBold',
                            fontSize: 15,
                            color: theme.colors.text,
                        }}
                    >
                        Follow authors
                    </Text>
                </TouchableOpacity>
                <Button
                    mode='contained'
                    theme={{ roundness: 10 }}
                    style={{
                        backgroundColor: theme.extraColors.gray,
                        fontSize: 18,
                        marginTop: 'auto',
                        marginBottom: 10,
                    }}
                    onPress={() => navigation.goBack()}
                >
                    Close
                </Button>
            </View>
        </View>
    )
    return (
        <Modal
            animationType='slide'
            transparent={false}
            visible={modalVisible}
            onDismiss={this._hideModal}
        >
            <SafeAreaView
                style={{
                    flex: 1,
                    alignItems: 'center',
                    padding: 20,
                    backgroundColor: '#f6f6f6',
                }}
            >
                <Text style={{ textAlign: 'center', fontSize: 19, padding: 30 }}>
                    You need to enter some information before you can post comments. You will only
                    have to do this once.
                </Text>
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <PaperTextInput
                        label='Username'
                        theme={{ roundness: 10 }}
                        style={{ width: 300, borderRadius: 5, marginBottom: 20 }}
                        placeholder='This is what will display publicly'
                        mode='outlined'
                        value={username}
                        onChangeText={(text) => this.setState({ username: text })}
                    />
                    <PaperTextInput
                        label='Email'
                        placeholder='We need this for verification purposes'
                        keyboardType='email-address'
                        style={{ width: 300, borderRadius: 10 }}
                        theme={{ roundness: 10 }}
                        mode='outlined'
                        value={email}
                        onChangeText={(text) => this.setState({ email: text })}
                    />
                    <View style={{ flexDirection: 'row' }}>
                        <Button
                            mode='contained'
                            theme={{ roundness: 10 }}
                            style={{
                                paddingHorizontal: 20,
                                margin: 20,
                                backgroundColor: '#f44336',
                                fontSize: 20,
                            }}
                            onPress={this._hideModal}
                        >
                            Cancel
                        </Button>
                        <Button
                            mode='contained'
                            theme={{ roundness: 10 }}
                            style={{ paddingHorizontal: 20, margin: 20, fontSize: 20 }}
                            onPress={() => {
                                saveUserInfo({
                                    username,
                                    email,
                                })
                                this._hideModal()
                            }}
                        >
                            Save
                        </Button>
                    </View>
                </View>
            </SafeAreaView>
        </Modal>
    )
}

export default ArticleActionsScreen
