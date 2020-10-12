import React from 'react'
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

import { connect } from 'react-redux'

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

import { actions as domainActions, getActiveDomain } from '../redux/domains'
import { types as userTypes, actions as userActions } from '../redux/user'
import { actions as globalActions } from '../redux/global'
import { createLoadingSelector } from '../redux/loading'
import { createErrorMessageSelector } from '../redux/errors'

const deleteUserLoadingSelector = createLoadingSelector([userTypes.DELETE_USER])
const deleteUserErrorSelector = createErrorMessageSelector([userTypes.DELETE_USER])

const unsubscribeLoadingSelector = createLoadingSelector([userTypes.UNSUBSCRIBE])

const ActiveDomainIcon = ({ color }) => <List.Icon icon={`star`} color={color} />

class SettingsScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const logo = navigation.getParam('headerLogo', null)
        return {
            title: 'Settings',
            headerLeft: logo && (
                <Image
                    source={{ uri: logo }}
                    style={{ width: 60, height: 35, borderRadius: 7, marginLeft: 10 }}
                    resizeMode='contain'
                />
            ),
            headerTitleAlign: 'center',
        }
    }

    state = {
        snackbarVisible: false,
        editingUsername: false,
        editingEmail: false,
        username: '',
        email: '',
        notifications: {},
        dialog: false,
        clearedAllSettings: false,
        showDeviceId: false,
    }

    componentDidMount() {
        const { userInfo, domains, global, navigation } = this.props
        this.setState({
            username: userInfo.username,
            email: userInfo.email,
        })
        navigation.setParams({
            headerLogo: global.headerSmall,
        })

        this.setState({
            notifications: domains.reduce(function (map, domain) {
                map[domain.id] = domain.notificationCategories.reduce(function (map, notification) {
                    map[notification.id] = notification.active
                    return map
                }, {})
                return map
            }, {}),
        })
    }

    render() {
        const {
            snackbarVisible,
            editingUsername,
            editingEmail,
            username,
            email,
            notifications,
        } = this.state
        const {
            domains,
            userInfo,
            theme,
            errors,
            deleteUser,
            saveUserInfo,
            isLoading,
            unsubscribe,
            unsubscribeLoading,
        } = this.props

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
                                onBlur={(text) => {
                                    saveUserInfo({
                                        username: username,
                                        email: email,
                                    })
                                    this.setState({
                                        editingUsername: false,
                                    })
                                }}
                                autoFocus={true}
                                returnKeyType='done'
                                value={username}
                                onChangeText={(text) => this.setState({ username: text })}
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
                                            onPress={() => this._handleUserInfoEdit('username')}
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
                                    this.setState({
                                        editingEmail: false,
                                    })
                                }}
                                autoFocus={true}
                                returnKeyType='done'
                                value={email}
                                onChangeText={(text) => this.setState({ email: text })}
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
                                            onPress={() => this._handleUserInfoEdit('email')}
                                        />
                                    )
                                }}
                            />
                        )}
                    </List.Section>
                    <Divider />
                    <List.Section>
                        <List.Subheader>Saved Organizations</List.Subheader>
                        {domains.map((item) => {
                            return (
                                <List.Item
                                    key={item.id}
                                    title={item.name}
                                    style={!item.active ? styles.inactiveItem : null}
                                    description={item.active ? 'active' : null}
                                    left={() => {
                                        if (item.active) {
                                            return <ActiveDomainIcon color={theme.colors.accent} />
                                        } else {
                                            return null
                                        }
                                    }}
                                    right={() => {
                                        return (
                                            <IconButton
                                                icon='delete'
                                                color={Colors.red700}
                                                size={28}
                                                onPress={() => this._handleDeleteOrg(item)}
                                            />
                                        )
                                    }}
                                    onPress={() => {
                                        this._switchDomain(item.id)
                                    }}
                                />
                            )
                        })}
                    </List.Section>
                    <Divider />
                    <List.Item
                        style={{ paddingVertical: 0 }}
                        title='Add New Organization'
                        left={() => <List.Icon icon={`plus`} />}
                        onPress={this._handleAddNewOrg}
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
                                        left={(props) => (
                                            <List.Icon {...props} icon='folder-open' />
                                        )}
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
                                                                            subscriptionType:
                                                                                'writers',
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
                                                                        this._toggleNotifications(
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
                                                                    notifications[domain.id][
                                                                        item.id
                                                                    ]
                                                                }
                                                                onValueChange={(value) => {
                                                                    this._toggleNotifications(
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
                                You have disabled push notifications for this app
                            </Text>
                        )}
                    </List.Section>
                    <Divider />
                    <List.Item
                        title='Privacy Policy'
                        style={{ paddingVertical: 0 }}
                        left={(props) => <List.Icon {...props} icon='account-supervisor' />}
                        onPress={this._viewLink}
                    />
                    <View>
                        <Button
                            icon='delete-forever'
                            mode='outlined'
                            color={Colors.red700}
                            style={{ padding: 10 }}
                            onPress={() => {
                                this.setState({
                                    dialog: true,
                                    showDeviceId: !this.state.showDeviceId,
                                })
                            }}
                        >
                            Clear All Settings
                        </Button>
                    </View>
                </View>
                <Snackbar
                    visible={snackbarVisible}
                    duration={3000}
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                    }}
                    onDismiss={() => this.setState({ snackbarVisible: false })}
                    action={{
                        label: 'Dismiss',
                        onPress: () => {
                            this.setState({ snackbarVisible: false })
                        },
                    }}
                >
                    Organization Removed
                </Snackbar>
                <Snackbar
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
                </Snackbar>
                <Portal>
                    {this.state.dialog
                        ? Alert.alert(
                              'Clear all settings?',
                              'This will clear all of your saved schools, articles, and notification settings.',
                              [
                                  {
                                      text: 'Cancel',
                                      onPress: this._hideDialog,
                                      style: 'cancel',
                                  },
                                  {
                                      text: 'Clear',
                                      onPress: () => {
                                          deleteUser()
                                          this._hideDialog()
                                      },
                                  },
                              ],
                              { cancelable: false }
                          )
                        : null}
                </Portal>
                {this.state.showDeviceId && (
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
            </ScrollView>
        )
    }

    _hideDialog = () => this.setState({ dialog: false })

    _viewLink = async () => {
        let result = await WebBrowser.openBrowserAsync('https://snosites.com/privacy-policy/')
    }

    _handleAddNewOrg = () => {
        Haptics.selectionAsync()
        this.props.navigation.navigate('Auth')
    }

    _handleDeleteOrg = (domain) => {
        Haptics.selectionAsync()
        const { domains, navigation, deleteDomain, unsubscribe, removeSchoolSub } = this.props

        // get all the category IDs to remove them from DB
        const categoryIds = domain.notificationCategories.map((category) => {
            return category.id
        })
        if (categoryIds) {
            unsubscribe({
                subscriptionType: 'categories',
                ids: categoryIds,
                domainId: domain.id,
            })
        }

        this.setState({
            snackbarVisible: true,
        })
        // send analytics data
        Amplitude.logEventWithProperties('remove school', {
            domainId: domain.id,
        })

        //new analytics
        removeSchoolSub(domain.url)

        if (domain.active) {
            let found = domains.find((domain) => {
                return !domain.active
            })
            if (found) {
                this._switchDomain(found.id)
            } else {
                navigation.navigate('AuthLoading')
            }
        }

        deleteDomain(domain.id)
    }

    _handleUserInfoEdit = (userPref) => {
        if (userPref === 'username') {
            this.setState({
                editingUsername: true,
            })
        } else if (userPref === 'email') {
            this.setState({
                editingEmail: true,
            })
        }
    }

    _toggleNotifications = (notificationId, value, domain, notification) => {
        Haptics.selectionAsync()
        // stops lag of DB call for switch value
        this.setState({
            notifications: {
                ...this.state.notifications,
                [domain.id]: {
                    ...this.state.notifications[domain.id],
                    [notificationId]: value,
                },
            },
        })

        const { subscribe, unsubscribe } = this.props
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

    _switchDomain = (id) => {
        Haptics.selectionAsync()
        const { changeActiveDomain, navigation } = this.props

        changeActiveDomain(id)
        navigation.navigate('AuthLoading')
    }
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

const mapStateToProps = (state) => {
    return {
        theme: state.theme,
        domains: state.domains,
        userInfo: state.user,
        global: state.global,
        activeDomain: getActiveDomain(state),
        errors: deleteUserErrorSelector(state),
        isLoading: deleteUserLoadingSelector(state),
        unsubscribeLoading: unsubscribeLoadingSelector(state),
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        changeActiveDomain: (domainId) => dispatch(domainActions.setActiveDomain(domainId)),
        deleteUser: () => dispatch(userActions.deleteUser()),
        saveUserInfo: (payload) => dispatch(userActions.saveUserInfo(payload)),
        deleteDomain: (domainId) => dispatch(domainActions.deleteDomain(domainId)),
        subscribe: (payload) => dispatch(userActions.subscribe(payload)),
        unsubscribe: (payload) => dispatch(userActions.unsubscribe(payload)),
        removeSchoolSub: (url) => dispatch(globalActions.removeSchoolSub(url)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen)
