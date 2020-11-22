import React, { useLayoutEffect, useState } from 'react'
import {
    ScrollView,
    StyleSheet,
    View,
    TextInput,
    Text,
    Image,
    Alert,
    ActivityIndicator,
} from 'react-native'
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

import { Feather } from '@expo/vector-icons'

const SettingsScreen = (props) => {
    const {
        navigation,
        userInfo,
        domains,
        theme,
        deleteUser,
        isLoading,
        subscribe,
        unsubscribe,
        unsubscribeLoading,
        deleteDomain,
        removeSchoolSub,
        setActiveDomain,
        setInitialized,
    } = props

    const [switchOn, setSwitchOn] = useState(false)

    const [dialog, setDialog] = useState(false)
    const [notifications, setNotifications] = useState(
        domains.reduce((map, domain) => {
            map[domain.id] = domain.notificationCategories.reduce(function (map, notification) {
                map[notification.id] = notification.active
                return map
            }, {})
            return map
        }, {})
    )

    const _handleDeleteOrg = (domain) => {
        Haptics.selectionAsync()

        // get all the category IDs to remove them from DB
        const categoryIds = domain.notificationCategories.map((category) => category.id)
        if (categoryIds) {
            unsubscribe({
                subscriptionType: 'categories',
                ids: categoryIds,
                domainId: domain.id,
            })
        }

        // send old analytics data
        Amplitude.logEventWithProperties('remove school', {
            domainId: domain.id,
        })
        //new analytics
        removeSchoolSub(domain.url)

        if (domain.active) {
            let found = domains.find((domain) => {
                return !domain.active
            })
            Haptics.selectionAsync()
            if (found) {
                setActiveDomain(found.id)
                setInitialized(false)
            } else {
                setActiveDomain(null)
                setInitialized(false)
            }
        }

        deleteDomain(domain.id)
    }

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

    if (isLoading) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <ActivityIndicator />
            </View>
        )
    }
    return (
        <ScrollView
            style={{
                flex: 1,
                backgroundColor: theme.colors.surface,
            }}
        >
            <View style={{ flex: 1 }}>
                <List.Section>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <List.Subheader>User Preferences</List.Subheader>
                        <IconButton
                            style={{ marginRight: 20 }}
                            icon='wrench'
                            color={theme.colors.primary}
                            size={20}
                            onPress={() => navigation.push('UserInfoModal')}
                        ></IconButton>
                    </View>
                    <List.Item
                        title={userInfo.username || 'Not Set'}
                        description={'Username'}
                        style={{
                            paddingLeft: 60,
                        }}
                    />
                    <List.Item
                        title={userInfo.email || 'Not Set'}
                        description={'email'}
                        style={{
                            paddingLeft: 60,
                        }}
                    />
                </List.Section>
                <Divider />
                <List.Section>
                    <List.Subheader>Saved Organizations</List.Subheader>
                    {domains.map((item) => {
                        return (
                            <List.Item
                                key={item.id}
                                title={item.name}
                                style={!item.active ? { paddingLeft: 60 } : null}
                                description={item.active ? 'active' : null}
                                left={() =>
                                    item.active ? (
                                        <List.Icon icon={`star`} color={theme.colors.accent} />
                                    ) : null
                                }
                                right={() => (
                                    <IconButton
                                        icon='delete'
                                        color={theme.extraColors.errorBackground}
                                        size={28}
                                        onPress={() => _handleDeleteOrg(item)}
                                    />
                                )}
                                onPress={() => {
                                    Haptics.selectionAsync()
                                    setActiveDomain(item.id)
                                    setInitialized(false)
                                }}
                            />
                        )
                    })}
                    <Button
                        icon='plus'
                        mode='text'
                        contentStyle={{ padding: 10 }}
                        onPress={() => {
                            Haptics.selectionAsync()
                            setActiveDomain(null)
                        }}
                    >
                        Add New Organization
                    </Button>
                </List.Section>
                <Divider />
                <List.Section>
                    <List.Subheader>Push Notifications</List.Subheader>
                    {userInfo.user.push_token ? (
                        domains.map((domain) => {
                            const writerSubs = userInfo.writerSubscriptions.filter(
                                (writer) => writer.organization_id === domain.id
                            )
                            return (
                                <List.Accordion
                                    key={domain.id}
                                    title={domain.name}
                                    left={(props) => <List.Icon {...props} icon='folder-open' />}
                                >
                                    <List.Subheader>Writer Notifications</List.Subheader>
                                    {writerSubs.length > 0 ? (
                                        writerSubs.map((writerObj) => {
                                            return (
                                                <List.Item
                                                    key={writerObj.id}
                                                    style={{
                                                        paddingVertical: 0,
                                                        paddingLeft: 60,
                                                    }}
                                                    title={writerObj.writer_name}
                                                    right={() => {
                                                        return unsubscribeLoading ? (
                                                            <ActivityIndicator
                                                                style={{ paddingRight: 10 }}
                                                            />
                                                        ) : (
                                                            <IconButton
                                                                icon='delete'
                                                                color={Colors.red700}
                                                                size={20}
                                                                onPress={() =>
                                                                    unsubscribe({
                                                                        subscriptionType: 'writers',
                                                                        ids: [writerObj.id],
                                                                        domainId: domain.id,
                                                                    })
                                                                }
                                                            />
                                                        )
                                                    }}
                                                />
                                            )
                                        })
                                    ) : (
                                        <Text
                                            style={{
                                                fontSize: 18,
                                                fontWeight: 'bold',
                                                paddingBottom: 10,
                                            }}
                                        >
                                            You aren't following any writers yet
                                        </Text>
                                    )}

                                    <List.Subheader>Category Notifications</List.Subheader>
                                    {domain.notificationCategories.map((item, i) => {
                                        if (item.category_name == 'custom_push') {
                                            return (
                                                <List.Item
                                                    key={item.id}
                                                    style={{
                                                        paddingVertical: 0,
                                                        paddingLeft: 60,
                                                    }}
                                                    title='Alerts'
                                                    right={() => {
                                                        return (
                                                            <Switch
                                                                style={{ margin: 10 }}
                                                                value={
                                                                    notifications[domain.id][
                                                                        item.id
                                                                    ]
                                                                }
                                                                onValueChange={(value) => {
                                                                    _toggleNotifications(
                                                                        item.id,
                                                                        value,
                                                                        domain,
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
                                                title={
                                                    <HTML
                                                        html={item.category_name}
                                                        customWrapper={(text) => {
                                                            return (
                                                                <Text
                                                                    ellipsizeMode='tail'
                                                                    numberOfLines={1}
                                                                    style={{ fontSize: 16 }}
                                                                >
                                                                    {text}
                                                                </Text>
                                                            )
                                                        }}
                                                        baseFontStyle={{ fontSize: 16 }}
                                                    />
                                                }
                                                right={() => {
                                                    return (
                                                        <Switch
                                                            style={{ margin: 10 }}
                                                            value={
                                                                notifications[domain.id][item.id]
                                                            }
                                                            onValueChange={(value) => {
                                                                _toggleNotifications(
                                                                    item.id,
                                                                    value,
                                                                    domain,
                                                                    item
                                                                )
                                                            }}
                                                        />
                                                    )
                                                }}
                                            />
                                        )
                                    })}
                                </List.Accordion>
                            )
                        })
                    ) : (
                        <Text
                            style={{
                                textAlign: 'center',
                                fontSize: 18,
                                fontWeight: 'bold',
                                paddingBottom: 10,
                            }}
                        >
                            You have disabled push notifications for this app. Turn it in on your
                            phone settings.
                        </Text>
                    )}
                </List.Section>
                <Divider />
                <List.Subheader>Extras</List.Subheader>
                <List.Item
                    title='Privacy Policy'
                    style={{ paddingVertical: 10 }}
                    left={(props) => <List.Icon {...props} icon='account-supervisor' />}
                    onPress={() =>
                        WebBrowser.openBrowserAsync('https://snosites.com/privacy-policy/')
                    }
                />
                <List.Item
                    title='Terms of Service'
                    style={{ paddingVertical: 10 }}
                    left={(props) => <List.Icon {...props} icon='library-books' />}
                    onPress={() =>
                        WebBrowser.openBrowserAsync('https://snosites.com/terms-of-service/')
                    }
                />
                <List.Item
                    title={'Device ID'}
                    description={Constants.installationId}
                    descriptionStyle={{ fontSize: 12 }}
                    style={{ paddingVertical: 10 }}
                    left={(props) => <List.Icon {...props} icon='cellphone-information' />}
                />
                <List.Item
                    title='Clear All Settings'
                    titleStyle={{ color: theme.extraColors.errorBackground }}
                    style={{ paddingVertical: 10 }}
                    left={(props) => (
                        <List.Icon
                            {...props}
                            icon='delete-forever'
                            color={theme.extraColors.errorBackground}
                        />
                    )}
                    onPress={() => {
                        setDialog(true)
                    }}
                />
                <Divider />
                <View
                    style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 20 }}
                >
                    <Text
                        style={{
                            fontFamily: 'raleway',
                            textAlign: 'center',
                        }}
                    >
                        The Source version: {Constants.manifest.version}
                    </Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Switch
                            value={switchOn}
                            onValueChange={(value) => setSwitchOn(value)}
                            color={theme.colors.primary}
                        />
                        <Feather
                            style={{ marginLeft: 20, alignSelf: 'center' }}
                            name={switchOn ? 'moon' : 'sun'}
                            size={20}
                            color={switchOn ? 'black' : '#ebbb0e'}
                        />
                    </View>
                </View>
            </View>
            <Portal>
                {dialog
                    ? Alert.alert(
                          'Clear all settings?',
                          'This will clear all of your saved schools, articles, and notification settings.',
                          [
                              {
                                  text: 'Cancel',
                                  onPress: () => setDialog(false),
                                  style: 'cancel',
                              },
                              {
                                  text: 'Clear',
                                  onPress: () => {
                                      deleteUser()
                                      setDialog(false)
                                  },
                              },
                          ],
                          { cancelable: false }
                      )
                    : null}
            </Portal>
        </ScrollView>
    )
}

export default SettingsScreen
