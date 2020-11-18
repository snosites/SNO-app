import React, { useState, useEffect, useRef } from 'react'
import { Text, View, Modal, SafeAreaView } from 'react-native'

import Moment from 'moment'
import HTML from 'react-native-render-html'
import { Ionicons } from '@expo/vector-icons'
import { Button, TextInput as PaperTextInput, Snackbar } from 'react-native-paper'

const UserInfoModal = (props) => {
    return <View style={{ flex: 1, backgroundColor: 'green' }}></View>
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

export default UserInfoModal
