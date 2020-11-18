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
        activeDomain,
        theme,
        fetchProfile,
        profile,
        profileIsLoading,
        profileError,
        subscribe,
        subscribeLoading,
        unsubscribe,
        unsubscribeLoading,
        writerSubscriptions,
    } = props

    const [subscribed, setSubscribed] = useState(false)

    useEffect(() => {
        if (route.params?.profileId) {
            fetchProfile(route.params.profileId)
        }
    }, [route.params?.profileId])

    useEffect(() => {
        if (route.params?.profileId && writerSubscriptions) {
            const { profileName, profileId } = route.params
            const foundSub = writerSubscriptions.find(
                (writerObj) =>
                    writerObj.writer_id === profileId &&
                    writerObj.organization_id === activeDomain.id
            )
            if (foundSub) setSubscribed(foundSub.id)
            else setSubscribed(false)
        }
    }, [route.params?.profileId, writerSubscriptions, activeDomain])

    console.log('profile modal', writerSubscriptions)

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
                            loading={subscribeLoading || unsubscribeLoading}
                            onPress={() => {
                                if (route.params?.profileId && route.params?.profileName) {
                                    if (!subscribed) {
                                        subscribe({
                                            subscriptionType: 'writers',
                                            ids: [
                                                {
                                                    id: route.params.profileId,
                                                    name: route.params.profileName,
                                                },
                                            ],
                                            domainId: activeDomain.id,
                                        })
                                    } else {
                                        unsubscribe({
                                            subscriptionType: 'writers',
                                            ids: [subscribed],
                                            domainId: activeDomain.id,
                                        })
                                    }
                                } else {
                                    console.log('no data', route)
                                }
                            }}
                        >
                            {subscribed ? 'Unfollow' : 'Follow'}
                        </Button>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default ProfileModalScreen
