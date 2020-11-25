import React, { useLayoutEffect, useState } from 'react'
import { ScrollView, StyleSheet, View, TextInput, Text, Image, Alert, Platform } from 'react-native'

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
        subscribeLoading,
        unsubscribeLoading,
        setActiveDomain,
        deleteDomain,
        removeSchoolSub,
        fetchProfile,
    } = props

    const [notifications, setNotifications] = useState(
        domains.reduce((map, domain) => {
            map[domain.id] = domain.notificationCategories.reduce(function (map, notification) {
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
            {!user.user?.push_token ? (
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
                        recieve notifications.
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
                title='Categories'
                description='New content that gets posted to these categories'
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
                    if (item.category_name == 'custom_push') {
                        return (
                            <List.Item
                                key={item.id}
                                style={{
                                    paddingVertical: 0,
                                    paddingLeft: 60,
                                }}
                                title='Alerts'
                                titleStyle={{ fontWeight: 'bold', fontSize: 18 }}
                                right={() => {
                                    return (
                                        <Switch
                                            style={{ margin: 10 }}
                                            value={notifications[activeDomain.id][item.id]}
                                            onValueChange={(value) => {
                                                _toggleNotifications(
                                                    item.id,
                                                    value,
                                                    activeDomain,
                                                    item
                                                )
                                            }}
                                        />
                                    )
                                }}
                            />
                        )
                    }
                    return (
                        <List.Item
                            key={item.id}
                            style={{ paddingVertical: 0, paddingLeft: 60 }}
                            titleEllipsizeMode='tail'
                            titleNumberOfLines={1}
                            title={entities.decode(item.category_name)}
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
        </ScrollView>
    )
}

// ;<List.Section>
//     <List.Subheader>Push Notifications</List.Subheader>
//     {userInfo.user.push_token ? (
//         domains.map((domain) => {
//             const writerSubs = userInfo.writerSubscriptions.filter(
//                 (writer) => writer.organization_id === domain.id
//             )
//             return (
//                 <List.Accordion
//                     key={domain.id}
//                     title={domain.name}
//                     left={(props) => <List.Icon {...props} icon='folder-open' />}
//                 >
//                     <List.Subheader>Writer Notifications</List.Subheader>
//                     {writerSubs.length > 0 ? (
//                         writerSubs.map((writerObj) => {
//                             return (
//                                 <List.Item
//                                     key={writerObj.id}
//                                     style={{
//                                         paddingVertical: 0,
//                                         paddingLeft: 60,
//                                     }}
//                                     title={writerObj.writer_name}
//                                     right={() => {
//                                         return unsubscribeLoading ? (
//                                             <ActivityIndicator style={{ paddingRight: 10 }} />
//                                         ) : (
//                                             <IconButton
//                                                 icon='delete'
//                                                 color={Colors.red700}
//                                                 size={20}
//                                                 onPress={() =>
//                                                     unsubscribe({
//                                                         subscriptionType: 'writers',
//                                                         ids: [writerObj.id],
//                                                         domainId: domain.id,
//                                                     })
//                                                 }
//                                             />
//                                         )
//                                     }}
//                                 />
//                             )
//                         })
//                     ) : (
//                         <Text
//                             style={{
//                                 fontSize: 18,
//                                 fontWeight: 'bold',
//                                 paddingBottom: 10,
//                             }}
//                         >
//                             You aren't following any writers yet
//                         </Text>
//                     )}

//                     <List.Subheader>Category Notifications</List.Subheader>
//                     {domain.notificationCategories.map((item, i) => {
//                         if (item.category_name == 'custom_push') {
//                             return (
//                                 <List.Item
//                                     key={item.id}
//                                     style={{
//                                         paddingVertical: 0,
//                                         paddingLeft: 60,
//                                     }}
//                                     title='Alerts'
//                                     right={() => {
//                                         return (
//                                             <Switch
//                                                 style={{ margin: 10 }}
//                                                 value={notifications[domain.id][item.id]}
//                                                 onValueChange={(value) => {
//                                                     _toggleNotifications(
//                                                         item.id,
//                                                         value,
//                                                         domain,
//                                                         item
//                                                     )
//                                                 }}
//                                             />
//                                         )
//                                     }}
//                                 />
//                             )
//                         }
//                         return (
//                             <List.Item
//                                 key={item.id}
//                                 style={{ paddingVertical: 0, paddingLeft: 60 }}
//                                 title={
//                                     <HTML
//                                         html={item.category_name}
//                                         customWrapper={(text) => {
//                                             return (
//                                                 <Text
//                                                     ellipsizeMode='tail'
//                                                     numberOfLines={1}
//                                                     style={{ fontSize: 16 }}
//                                                 >
//                                                     {text}
//                                                 </Text>
//                                             )
//                                         }}
//                                         baseFontStyle={{ fontSize: 16 }}
//                                     />
//                                 }
//                                 right={() => {
//                                     return (
//                                         <Switch
//                                             style={{ margin: 10 }}
//                                             value={notifications[domain.id][item.id]}
//                                             onValueChange={(value) => {
//                                                 _toggleNotifications(item.id, value, domain, item)
//                                             }}
//                                         />
//                                     )
//                                 }}
//                             />
//                         )
//                     })}
//                 </List.Accordion>
//             )
//         })
//     ) : (
//         <Text
//             style={{
//                 textAlign: 'center',
//                 fontSize: 18,
//                 fontWeight: 'bold',
//                 paddingBottom: 10,
//             }}
//         >
//             You have disabled push notifications for this app. Turn it in on your phone settings.
//         </Text>
//     )}
// </List.Section>

export default FollowingScreen
