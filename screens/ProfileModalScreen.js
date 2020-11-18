import React, { useState, useEffect, useRef } from 'react'
import {
    Dimensions,
    Text,
    View,
    Modal,
    TouchableOpacity,
    ActivityIndicator,
    Image,
} from 'react-native'

import { LinearGradient } from 'expo-linear-gradient'
import Moment from 'moment'
import HTML from 'react-native-render-html'
import { Feather } from '@expo/vector-icons'
import { Button, Snackbar } from 'react-native-paper'

import { SafeAreaView } from 'react-native-safe-area-context'

const { width: viewportWidth } = Dimensions.get('window')

import { Html5Entities } from 'html-entities'

const entities = new Html5Entities()

const ProfileModalScreen = (props) => {
    const {
        route,
        navigation,
        theme,
        fetchProfile,
        profile,
        profileIsLoading,
        profileError,
    } = props

    useEffect(() => {
        if (route.params?.profileId) {
            console.log('route.params.profileId', route.params.profileId, route)
            fetchProfile(route.params.profileId)
        }
    }, [route.params?.profileId])

    console.log('profile modal', profile, route)

    if (profileIsLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                <View
                    style={{
                        height: 325,
                        backgroundColor: theme.colors.surface,
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                    }}
                >
                    <LinearGradient
                        colors={[theme.colors.accent, theme.colors.accentLightened]}
                        style={{
                            height: 100,
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: theme.colors.accentLightened,
                                width: 34,
                                height: 34,
                                borderRadius: 17,
                                margin: 10,
                            }}
                        >
                            <Feather
                                style={{
                                    marginBottom: -3,
                                }}
                                name={'x'}
                                size={20}
                                color={theme.accentIsDark ? 'white' : 'black'}
                            />
                        </TouchableOpacity>
                    </LinearGradient>
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            padding: 20,
                            backgroundColor: theme.colors.surface,
                        }}
                    >
                        <ActivityIndicator />
                    </View>
                </View>
            </View>
        )
    }
    if (profileError) {
        return (
            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                <View
                    style={{
                        height: 325,
                        backgroundColor: theme.colors.surface,
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                    }}
                >
                    <LinearGradient
                        colors={[theme.colors.accent, theme.colors.accentLightened]}
                        style={{
                            height: 100,
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: theme.colors.accentLightened,
                                width: 34,
                                height: 34,
                                borderRadius: 17,
                                margin: 10,
                            }}
                        >
                            <Feather
                                style={{
                                    marginBottom: -3,
                                }}
                                name={'x'}
                                size={20}
                                color={theme.accentIsDark ? 'white' : 'black'}
                            />
                        </TouchableOpacity>
                        <View
                            style={{
                                position: 'absolute',
                                top: 15,
                                left: viewportWidth / 2 - 35,
                                width: 70,
                                height: 70,
                                borderRadius: 35,
                                backgroundColor: theme.extraColors.lightGray,
                                overflow: 'hidden',
                            }}
                        >
                            <Image
                                style={{ width: 70, height: 70 }}
                                resizeMode='contain'
                                source={require('../assets/images/anon.png')}
                            />
                        </View>
                    </LinearGradient>
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            padding: 10,
                            backgroundColor: theme.colors.surface,
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: 'openSansBold',
                                fontSize: 18,
                                color: theme.colors.text,
                                textAlign: 'center',
                            }}
                        >
                            There was an error loading the selected profile
                        </Text>
                    </View>
                </View>
            </View>
        )
    }

    if (!profile) {
        return (
            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                <View
                    style={{
                        height: 325,
                        backgroundColor: theme.colors.surface,
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                    }}
                >
                    <LinearGradient
                        colors={[theme.colors.accent, theme.colors.accentLightened]}
                        style={{
                            height: 100,
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: theme.colors.accentLightened,
                                width: 34,
                                height: 34,
                                borderRadius: 17,
                                margin: 10,
                            }}
                        >
                            <Feather
                                style={{
                                    marginBottom: -3,
                                }}
                                name={'x'}
                                size={20}
                                color={theme.accentIsDark ? 'white' : 'black'}
                            />
                        </TouchableOpacity>
                        <View
                            style={{
                                position: 'absolute',
                                top: 15,
                                left: viewportWidth / 2 - 35,
                                width: 70,
                                height: 70,
                                borderRadius: 35,
                                backgroundColor: theme.extraColors.lightGray,
                                overflow: 'hidden',
                            }}
                        >
                            <Image
                                style={{ width: 70, height: 70 }}
                                resizeMode='contain'
                                source={require('../assets/images/anon.png')}
                            />
                        </View>
                    </LinearGradient>
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            padding: 10,
                            backgroundColor: theme.colors.surface,
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: 'openSansBold',
                                fontSize: 18,
                                color: theme.colors.text,
                            }}
                        >
                            No profile was found for this person
                        </Text>
                    </View>
                </View>
            </View>
        )
    }

    return (
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
            <View
                style={{
                    height: 325,
                    backgroundColor: theme.colors.surface,
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                    overflow: 'hidden',
                }}
            >
                <LinearGradient
                    colors={[theme.colors.accent, theme.colors.accentLightened]}
                    style={{
                        height: 100,
                    }}
                >
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: theme.colors.accentLightened,
                            width: 34,
                            height: 34,
                            borderRadius: 17,
                            margin: 10,
                        }}
                    >
                        <Feather
                            style={{
                                marginBottom: -3,
                            }}
                            name={'x'}
                            size={20}
                            color={theme.accentIsDark ? 'white' : 'black'}
                        />
                    </TouchableOpacity>
                    <View
                        style={{
                            position: 'absolute',
                            top: 15,
                            left: viewportWidth / 2 - 35,
                            width: 70,
                            height: 70,
                            borderRadius: 35,
                            backgroundColor: theme.extraColors.lightGray,
                            overflow: 'hidden',
                        }}
                    >
                        <Image
                            style={{ width: 70, height: 70 }}
                            resizeMode='contain'
                            source={
                                profile.post_thumbnail
                                    ? { uri: profile.post_thumbnail }
                                    : require('../assets/images/anon.png')
                            }
                        />
                    </View>
                </LinearGradient>
                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        padding: 10,
                        backgroundColor: theme.colors.surface,
                    }}
                >
                    <TouchableOpacity
                        onPress={() => {}}
                        style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 5 }}
                    >
                        <Text
                            style={{
                                fontFamily: 'openSansBold',
                                fontSize: 18,
                                color: theme.colors.text,
                            }}
                        >
                            {entities.decode(profile.post_title)}
                        </Text>
                        <Feather
                            style={{
                                marginBottom: -3,
                            }}
                            name={'chevron-right'}
                            size={18}
                            color={theme.colors.text}
                        />
                    </TouchableOpacity>
                    <Text
                        style={{
                            fontFamily: 'openSans',
                            fontSize: 16,
                            color: theme.extraColors.gray,
                            marginBottom: 10,
                        }}
                    >
                        {entities.decode(profile.post_excerpt)}
                    </Text>
                    <Text
                        numberOfLines={2}
                        ellipsizeMode='tail'
                        style={{
                            fontFamily: 'openSans',
                            fontSize: 14,
                            color: theme.colors.text,
                        }}
                    >
                        {entities.decode(profile.post_content)}
                    </Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            padding: 20,
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            alignSelf: 'stretch',
                        }}
                    >
                        <View style={{ alignItems: 'flex-start' }}>
                            <Text
                                style={{
                                    fontFamily: 'openSansBold',
                                    fontSize: 18,
                                    color: theme.colors.primary,
                                }}
                            >
                                {profile.articles.length > 300 ? '300+' : profile.articles.length}
                            </Text>
                            <Text
                                style={{
                                    fontFamily: 'openSansBold',
                                    fontSize: 14,
                                    color: theme.colors.text,
                                }}
                            >
                                Total Media Items
                            </Text>
                        </View>
                        <Button
                            mode='contained'
                            theme={{ roundness: 10 }}
                            dark={theme.primaryIsDark}
                            style={{
                                backgroundColor: theme.colors.primary,
                                fontSize: 18,
                                marginTop: 'auto',
                                marginBottom: 10,
                            }}
                            onPress={() => navigation.goBack()}
                        >
                            Follow
                        </Button>
                    </View>
                </View>
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

export default ProfileModalScreen
