import React, { useState, useEffect, useRef } from 'react'
import {
    Text,
    View,
    Modal,
    SafeAreaView,
    ActivityIndicator,
    KeyboardAvoidingView,
    TouchableOpacity,
} from 'react-native'

import Moment from 'moment'
import HTML from 'react-native-render-html'
import { Ionicons, Feather } from '@expo/vector-icons'
import { Button, TextInput as PaperTextInput, Snackbar } from 'react-native-paper'
import theme from '../redux/theme'

const UserInfoModal = (props) => {
    const { navigation, theme, userInfo, saveUserInfo } = props

    const [username, setUsername] = useState(userInfo.username)
    const [email, setEmail] = useState(userInfo.email)

    const saveInfo = () => {
        saveUserInfo({
            username: username,
            email: email,
        })
    }

    return (
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
            <KeyboardAvoidingView behavior='padding' enabled>
                <View
                    style={{
                        height: 300,
                        backgroundColor: theme.colors.background,
                        borderTopLeftRadius: 15,
                        borderTopRightRadius: 15,
                        padding: 15,
                        alignItems: 'center',
                    }}
                >
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: theme.colors.primaryLightened,
                            width: 34,
                            height: 34,
                            borderRadius: 17,
                            alignSelf: 'flex-start',
                        }}
                    >
                        <Feather
                            style={{
                                marginBottom: -3,
                            }}
                            name={'x'}
                            size={20}
                            color={theme.colors.primary}
                        />
                    </TouchableOpacity>
                    <Text
                        style={{
                            fontFamily: 'raleway',
                            fontSize: 18,
                            marginBottom: 10,
                            marginTop: -10,
                            textAlign: 'center',
                        }}
                    >
                        Edit Preferences
                    </Text>
                    <View>
                        <PaperTextInput
                            dense
                            label='Username'
                            theme={{ roundness: 10 }}
                            style={{ width: 250, borderRadius: 5 }}
                            placeholder='Not set'
                            mode='outlined'
                            value={username}
                            onChangeText={(text) => setUsername(text)}
                            selectionColor={theme.colors.primary}
                        />
                        <Text
                            style={{
                                fontFamily: 'ralewayBold',
                                fontSize: 12,
                                color: theme.colors.grayText,
                                marginBottom: 10,
                            }}
                        >
                            This is what will display publicly
                        </Text>
                        <PaperTextInput
                            dense
                            label='Email'
                            placeholder='Not set'
                            keyboardType='email-address'
                            style={{ width: 250, borderRadius: 10 }}
                            theme={{ roundness: 10 }}
                            mode='outlined'
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                            selectionColor={theme.colors.primary}
                        />
                        <Text
                            style={{
                                fontFamily: 'ralewayBold',
                                fontSize: 12,
                                color: theme.colors.grayText,
                                marginBottom: 10,
                            }}
                        >
                            We need this for comment submission
                        </Text>
                    </View>
                    <Button
                        mode='contained'
                        dark={theme.primaryIsDark}
                        theme={{ roundness: 10 }}
                        style={{
                            backgroundColor: theme.colors.primary,
                            fontSize: 18,
                            marginTop: 'auto',
                            marginBottom: 10,
                            width: 250,
                        }}
                        onPress={() => {
                            saveInfo()
                            navigation.goBack()
                        }}
                    >
                        Save
                    </Button>
                </View>
            </KeyboardAvoidingView>
        </View>
    )
    // return (
    //     <Modal
    //         animationType='slide'
    //         transparent={false}
    //         visible={modalVisible}
    //         onDismiss={this._hideModal}
    //     >
    //         <SafeAreaView
    //             style={{
    //                 flex: 1,
    //                 alignItems: 'center',
    //                 padding: 20,
    //                 backgroundColor: '#f6f6f6',
    //             }}
    //         >
    //             <Text style={{ textAlign: 'center', fontSize: 19, padding: 30 }}>
    //                 You need to enter some information before you can post comments. You will only
    //                 have to do this once.
    //             </Text>
    //             <View style={{ flex: 1, alignItems: 'center' }}>
    //                 <PaperTextInput
    //                     label='Username'
    //                     theme={{ roundness: 10 }}
    //                     style={{ width: 300, borderRadius: 5, marginBottom: 20 }}
    //                     placeholder='This is what will display publicly'
    //                     mode='outlined'
    //                     value={username}
    //                     onChangeText={(text) => this.setState({ username: text })}
    //                 />
    //                 <PaperTextInput
    //                     label='Email'
    //                     placeholder='We need this for verification purposes'
    //                     keyboardType='email-address'
    //                     style={{ width: 300, borderRadius: 10 }}
    //                     theme={{ roundness: 10 }}
    //                     mode='outlined'
    //                     value={email}
    //                     onChangeText={(text) => this.setState({ email: text })}
    //                 />
    //                 <View style={{ flexDirection: 'row' }}>
    //                     <Button
    //                         mode='contained'
    //                         theme={{ roundness: 10 }}
    //                         style={{
    //                             paddingHorizontal: 20,
    //                             margin: 20,
    //                             backgroundColor: '#f44336',
    //                             fontSize: 20,
    //                         }}
    //                         onPress={this._hideModal}
    //                     >
    //                         Cancel
    //                     </Button>
    //                     <Button
    //                         mode='contained'
    //                         theme={{ roundness: 10 }}
    //                         style={{ paddingHorizontal: 20, margin: 20, fontSize: 20 }}
    //                         onPress={() => {
    //                             saveUserInfo({
    //                                 username,
    //                                 email,
    //                             })
    //                             this._hideModal()
    //                         }}
    //                     >
    //                         Save
    //                     </Button>
    //                 </View>
    //             </View>
    //         </SafeAreaView>
    //     </Modal>
    // )
}

export default UserInfoModal
