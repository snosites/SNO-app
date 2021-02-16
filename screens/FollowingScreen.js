import React, { useEffect, useState } from 'react'
import { ScrollView, FlatList, ActivityIndicator, View, Text, Platform } from 'react-native'

import ErrorView from '../components/ErrorView'
import ListItemRenderer from '../components/listItems/ListItemRenderer'
import { asyncFetchArticle } from '../utils/sagaHelpers'
import { handleArticlePress } from '../utils/articlePress'

import * as Linking from 'expo-linking'
import * as IntentLauncher from 'expo-intent-launcher'
import * as Permissions from 'expo-permissions'
import * as Amplitude from 'expo-analytics-amplitude'
import * as Haptics from 'expo-haptics'
import * as WebBrowser from 'expo-web-browser'
import Constants from 'expo-constants'

import HTML from 'react-native-render-html'

import {
    List,
    Divider,
    Switch,
    IconButton,
    Colors,
    Snackbar,
    Button,
    Portal,
} from 'react-native-paper'

import { Html5Entities } from 'html-entities'
import theme from '../redux/theme'
import user from '../redux/user'

const entities = new Html5Entities()

const ActiveDomainIcon = ({ color }) => <List.Icon icon={`star`} color={color} />

const FollowingScreen = (props) => {
    const {
        theme,
        userInfo,
        domains,
        activeDomain,
        writerSubscriptions,
        subscribe,
        unsubscribe,
        updateUser,
        subscribeLoading,
        unsubscribeLoading,
        removeSchoolSub,
    } = props

    const unread_ids = userInfo.user?.unread_ids

    const [unreadArticles, setUnreadArticles] = useState([])
    const [loadingUnreadArticles, setLoadingUnreadArticles] = useState(true)

    useEffect(() => {
        if (unread_ids?.length) {
            fetchUnreadArticles()
        } else {
            setLoadingUnreadArticles(false)
        }
    }, [unread_ids])

    const fetchUnreadArticles = async () => {
        const asyncRes = await Promise.all(
            unread_ids.map(async (id) => {
                const article = await asyncFetchArticle(activeDomain.url, id)
                return article
            })
        )
        setUnreadArticles(asyncRes)
        setLoadingUnreadArticles(false)
    }

    const clearUnreadArticles = () => {
        updateUser('unread_ids', null)
    }

    const [notifications, setNotifications] = useState(
        domains.reduce((map, domain) => {
            map[domain.id] = domain.notificationCategories.reduce((map, notification) => {
                map[notification.id] = notification.active
                return map
            }, {})
            return map
        }, {})
    )

    const _toggleNotifications = (notificationId, value, domain, notification) => {
        Haptics.selectionAsync()
        // stops lag of DB call for switch value
        setNotifications({
            ...notifications,
            [domain.id]: {
                ...notifications[domain.id],
                [notificationId]: value,
            },
        })

        if (value) {
            subscribe({
                subscriptionType: 'categories',
                ids: [notificationId],
                domainId: domain.id,
            })
        } else {
            unsubscribe({
                subscriptionType: 'categories',
                ids: [notificationId],
                domainId: domain.id,
            })
        }
    }

    const handleTurnNotificationsOn = async () => {
        if (Platform.OS === 'ios') {
            //ios
            const bundleIdentifier = Constants.manifest.ios.bundleIdentifier
            const settingsUrl = `app-settings://notification/${bundleIdentifier}`
            const canOpenSettingsUrl = await Linking.canOpenURL(settingsUrl)
            if (canOpenSettingsUrl) {
                try {
                    const x = await Linking.openURL(settingsUrl)
                    console.log('x', x)
                } catch (err) {
                    console.error('An error occurred opening settings', err)
                }
            } else {
                Linking.openURL('app-settings:').catch((err) =>
                    console.error('An error occurred opening general settings', err)
                )
            }
        } else {
            //android
            const pkg = Constants.manifest.releaseChannel
                ? Constants.manifest.android.package // When published, considered as using standalone build
                : 'host.exp.exponent'

            IntentLauncher.startActivityAsync(IntentLauncher.ACTION_APP_NOTIFICATION_SETTINGS, {
                data: 'package:' + pkg,
            })
        }
    }

    return (
        <ScrollView style={{ padding: 15 }} contentContainerStyle={{ paddingBottom: 80 }}>
            {!userInfo.user?.push_token ? (
                <View
                    style={{
                        padding: 10,
                        backgroundColor: theme.colors.surface,
                        borderRadius: 8,
                        shadowColor: theme.colors.text,
                        shadowOffset: {
                            width: 0,
                            height: 7,
                        },
                        shadowOpacity: 0.51,
                        shadowRadius: 8.11,
                        elevation: 10,
                        alignItems: 'center',
                    }}
                >
                    <Text style={{ color: theme.colors.text, fontFamily: 'raleway', fontSize: 14 }}>
                        You currently do not allow push notifications for this app. You won't
                        recieve any of the below notifications.
                    </Text>
                    <Button
                        mode='contained'
                        theme={{ roundness: 8 }}
                        style={{
                            backgroundColor: theme.colors.accent,
                            marginTop: 10,
                        }}
                        compact={true}
                        onPress={handleTurnNotificationsOn}
                        labelStyle={{ fontSize: 12 }}
                    >
                        Turn on notifications
                    </Button>
                </View>
            ) : null}
            <List.Accordion
                title='Topics'
                description='New content that gets posted to these topics'
                titleStyle={{
                    fontFamily: 'ralewayExtraBold',
                    fontSize: 28,
                    color: theme.colors.primary,
                    // paddingBottom: 10,
                }}
                descriptionStyle={{
                    fontFamily: 'ralewayLight',
                    fontSize: 14,
                    color: theme.colors.text,
                    paddingBottom: 10,
                }}

                // left={(props) => <List.Icon {...props} icon='category' />}
            >
                {activeDomain.notificationCategories.map((item, i) => {
                    return (
                        <List.Item
                            key={item.id}
                            style={{ paddingVertical: 0, paddingLeft: 60 }}
                            titleEllipsizeMode='tail'
                            titleNumberOfLines={1}
                            title={
                                item.category_name == 'custom_push'
                                    ? 'Alerts'
                                    : entities.decode(item.category_name)
                            }
                            titleStyle={{ fontWeight: 'bold', fontSize: 18 }}
                            right={() => {
                                return (
                                    <Switch
                                        style={{ margin: 10 }}
                                        value={notifications[activeDomain.id][item.id]}
                                        onValueChange={(value) => {
                                            _toggleNotifications(item.id, value, activeDomain, item)
                                        }}
                                    />
                                )
                            }}
                        />
                    )
                })}
            </List.Accordion>
            <List.Accordion
                title='Authors'
                description='New content that gets posted by these authors'
                titleStyle={{
                    fontFamily: 'ralewayExtraBold',
                    fontSize: 28,
                    color: theme.colors.primary,
                }}
                descriptionStyle={{
                    fontFamily: 'ralewayLight',
                    fontSize: 14,
                    color: theme.colors.text,
                    paddingBottom: 10,
                }}
                // left={(props) => <List.Icon {...props} icon='category' />}
            >
                {writerSubscriptions.map((writer) => {
                    return (
                        <List.Item
                            key={writer.id}
                            style={{
                                paddingVertical: 0,
                                paddingLeft: 60,
                            }}
                            title={writer.writer_name}
                            titleStyle={{ fontWeight: 'bold', fontSize: 18 }}
                            right={() => {
                                return (
                                    <IconButton
                                        icon='delete'
                                        color={Colors.red700}
                                        size={20}
                                        onPress={() =>
                                            unsubscribe({
                                                subscriptionType: 'writers',
                                                ids: [writer.id],
                                                domainId: writer.organization_id,
                                            })
                                        }
                                    />
                                )
                            }}
                        />
                    )
                })}
            </List.Accordion>
            <View
                style={{
                    paddingHorizontal: 10,
                    paddingBottom: 15,
                    borderRadius: 15,
                    backgroundColor: theme.colors.surface,
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <Text
                        style={{
                            fontFamily: 'ralewayBold',
                            fontSize: 23,
                            color: theme.colors.primary,
                            paddingTop: 10,
                            paddingBottom: 20,
                        }}
                    >
                        From Notifications
                    </Text>
                    {unreadArticles.length ? (
                        <Button
                            mode='outline'
                            theme={{ roundness: 8 }}
                            compact={true}
                            onPress={clearUnreadArticles}
                            labelStyle={{ fontSize: 12 }}
                        >
                            Clear All
                        </Button>
                    ) : null}
                </View>
                {loadingUnreadArticles ? (
                    <View style={{ padding: 30 }}>
                        <ActivityIndicator />
                    </View>
                ) : unreadArticles.length ? (
                    <FlatList
                        Style={{ flex: 1 }}
                        contentContainerStyle={{ padding: 10 }}
                        data={unreadArticles}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item, index, separators }) => {
                            return (
                                <ListItemRenderer
                                    theme={theme}
                                    item={item}
                                    index={index}
                                    separators={separators}
                                    onPress={() => handleArticlePress(item, activeDomain)}
                                    listStyle={'small'}
                                    ad={null}
                                />
                            )
                        }}
                        ItemSeparatorComponent={() => (
                            <View style={{ height: 10, backgroundColor: theme.colors.surface }} />
                        )}
                    />
                ) : (
                    <View
                        style={{
                            borderRadius: 15,
                            padding: 20,
                            backgroundColor: theme.colors.lightGray,
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: 'ralewayBold',
                                fontSize: 17,
                                color: theme.colors.text,
                                textAlign: 'center',
                            }}
                        >
                            You are all caught up!
                        </Text>
                    </View>
                )}
            </View>
        </ScrollView>
    )
}

export default FollowingScreen
