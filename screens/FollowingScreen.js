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

import { Html5Entities } from 'html-entities'
import theme from '../redux/theme'

const entities = new Html5Entities()

const ActiveDomainIcon = ({ color }) => <List.Icon icon={`star`} color={color} />

const FollowingScreen = (props) => {
    const { theme, userInfo, domains, activeDomain, subscribe, unsubscribe } = props

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

    console.log('user info', userInfo, activeDomain)
    return (
        <ScrollView style={{ padding: 15 }}>
            {domains.map((domain) => {
                const writerSubs = userInfo.writerSubscriptions.filter(
                    (writer) => writer.organization_id === domain.id
                )
                console.log('writer subs', writerSubs)
                return
            })}
            <List.Accordion
                title='Categories'
                titleStyle={{
                    fontFamily: 'openSansExtraBold',
                    fontSize: 28,
                    color: theme.colors.primary,
                    paddingBottom: 10,
                }}
                left={(props) => <List.Icon {...props} icon='category' />}
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
        </ScrollView>
    )
}
const SettingsScreen = (props) => {
    const {
        navigation,
        userInfo,
        domains,
        theme,
        errors,
        deleteUser,
        saveUserInfo,
        isLoading,
        subscribe,
        unsubscribe,
        unsubscribeLoading,
        deleteDomain,
        removeSchoolSub,
        setActiveDomain,
        setInitialized,
    } = props
    const [username, setUsername] = useState(userInfo.username)
    const [email, setEmail] = useState(userInfo.email)
    const [editingUsername, setEditingUsername] = useState(false)
    const [editingEmail, setEditingEmail] = useState(false)
    const [dialog, setDialog] = useState(false)
    const [showDeviceId, setShowDeviceId] = useState(false)
    const [notifications, setNotifications] = useState(
        domains.reduce((map, domain) => {
            map[domain.id] = domain.notificationCategories.reduce(function (map, notification) {
                map[notification.id] = notification.active
                return map
            }, {})
            return map
        }, {})
    )

    const _handleUserInfoEdit = (userPref) => {
        if (userPref === 'username') setEditingUsername(true)
        if (userPref === 'email') setEditingEmail(true)
    }

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
        <ScrollView style={styles.container}>
            <View style={{ flex: 1 }}>
                <List.Section>
                    <List.Subheader>User Preferences</List.Subheader>
                    {editingUsername ? (
                        <TextInput
                            style={{ height: 40, width: 250, fontSize: 15, paddingLeft: 60 }}
                            onBlur={() => {
                                saveUserInfo({
                                    username: username,
                                    email: email,
                                })
                                setEditingUsername(false)
                            }}
                            autoFocus={true}
                            returnKeyType='done'
                            value={username}
                            onChangeText={(text) => setUsername(text)}
                        />
                    ) : (
                        <List.Item
                            title={userInfo.username || 'Not Set'}
                            description={'Username'}
                            style={styles.inactiveItem}
                            right={() => {
                                return (
                                    <IconButton
                                        icon='plus'
                                        color={Colors.grey300}
                                        size={28}
                                        onPress={() => _handleUserInfoEdit('username')}
                                    />
                                )
                            }}
                        />
                    )}
                    {editingEmail ? (
                        <TextInput
                            style={{ height: 40, width: 250, fontSize: 15, paddingLeft: 60 }}
                            onBlur={() => {
                                saveUserInfo({
                                    username: username,
                                    email: email,
                                })
                                setEditingEmail(false)
                            }}
                            autoFocus={true}
                            returnKeyType='done'
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                        />
                    ) : (
                        <List.Item
                            title={userInfo.email || 'Not Set'}
                            description={'email'}
                            style={styles.inactiveItem}
                            right={() => {
                                return (
                                    <IconButton
                                        icon='plus'
                                        color={Colors.grey300}
                                        size={28}
                                        onPress={() => _handleUserInfoEdit('email')}
                                    />
                                )
                            }}
                        />
                    )}
                </List.Section>
                <Divider />
                <List.Section>
                    <List.Subheader>Saved Organizations</List.Subheader>
                </List.Section>
                <Divider />
                <List.Item
                    style={{ paddingVertical: 0 }}
                    title='Add New Organization'
                    left={() => <List.Icon icon={`plus`} />}
                    onPress={() => {
                        Haptics.selectionAsync()
                        setActiveDomain(null)
                    }}
                />
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
                <List.Item
                    title='Privacy Policy'
                    style={{ paddingVertical: 10 }}
                    left={(props) => <List.Icon {...props} icon='account-supervisor' />}
                    onPress={() =>
                        WebBrowser.openBrowserAsync('https://snosites.com/privacy-policy/')
                    }
                />
                <View>
                    <Button
                        icon='delete-forever'
                        mode='outlined'
                        color={Colors.red700}
                        style={{ padding: 10 }}
                        onPress={() => {
                            setDialog(true)
                            setShowDeviceId(!showDeviceId)
                        }}
                    >
                        Clear All Settings
                    </Button>
                </View>
            </View>
            {/* <Snackbar
                visible={errors}
                duration={3000}
                style={{
                    position: 'absolute',
                    bottom: 100,
                    left: 0,
                    right: 0,
                }}
                onDismiss={() => {}}
                action={{
                    label: 'Dismiss',
                    onPress: () => {},
                }}
            >
                Sorry there was an error clearing your settings. Please try again later.
            </Snackbar> */}
            {showDeviceId && (
                <Text
                    style={{
                        alignSelf: 'flex-end',
                        marginTop: 'auto',
                        fontSize: 9,
                        color: Colors.grey400,
                    }}
                >
                    {`${Constants.manifest.version} - ${Constants.installationId}`}
                </Text>
            )}
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        // justifyContent: 'space-between',
    },
    inactiveItem: {
        paddingLeft: 60,
    },
})

export default FollowingScreen