import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    Image,
    ActivityIndicator,
    AsyncStorage,
    TextInput
} from 'react-native';
import { connect } from 'react-redux';
import { persistor } from '../redux/configureStore';
import { saveUserInfo } from '../redux/actions/actions';
import { List, Divider, Switch, IconButton, Colors, Snackbar, Button } from 'react-native-paper';
import { changeActiveDomain, addNotification, removeNotification, fetchNotifications } from '../redux/actions/actions';


const DeleteButton = () => (
    <IconButton
        icon="delete"
        color={Colors.red700}
        size={20}
        onPress={() => console.log('Pressed')}
    />
);

const ActiveDomainIcon = () => (
    <List.Icon
        icon={`star`}
        color={Colors.blue800}
    />
)

class SettingsScreen extends React.Component {
    static navigationOptions = {
        title: 'Settings',
    };

    state = {
        snackbarVisible: false,
        editingUsername: false,
        editingEmail: false,
        username: '',
        email: ''
    };

    componentDidMount() {
        const { userInfo, dispatch } = this.props;
        this.setState({
            username: userInfo.username,
            email: userInfo.email
        })
        if (userInfo.tokenId) {
            dispatch(fetchNotifications(userInfo.tokenId))
        }
    }

    render() {
        const { snackbarVisible, editingUsername, editingEmail, username, email } = this.state;
        const { domains, userInfo, dispatch } = this.props;
        return (
            <ScrollView style={styles.container}>
                <View style={{ flex: 1 }}>
                    <List.Section>
                        <List.Subheader>User Preferences</List.Subheader>
                        {editingUsername ?
                            <TextInput
                                style={{ height: 40, width: 250, fontSize: 15, paddingLeft: 60 }}
                                onBlur={(text) => {
                                    dispatch(saveUserInfo({
                                        username: username,
                                        email: email
                                    }))
                                    this.setState({
                                        editingUsername: false,
                                    })
                                }}
                                autoFocus={true}
                                returnKeyType='done'
                                value={username}
                                onChangeText={(text) => this.setState({ username: text })}
                            />
                            :
                            <List.Item
                                title={userInfo.username || 'Not Set'}
                                description={'Username'}
                                style={styles.inactiveItem}
                                right={() => {
                                    return (
                                        <IconButton
                                            icon="create"
                                            color={Colors.grey300}
                                            size={28}
                                            onPress={() => this._handleUserInfoEdit('username')}
                                        />
                                    )
                                }}
                            />
                        }
                        {
                            editingEmail ?
                                <TextInput
                                    style={{ height: 40, width: 250, fontSize: 15, paddingLeft: 60 }}
                                    onBlur={() => {
                                        dispatch(saveUserInfo({
                                            username: username,
                                            email: email
                                        }))
                                        this.setState({
                                            editingEmail: false,
                                        })
                                    }}
                                    autoFocus={true}
                                    returnKeyType='done'
                                    value={email}
                                    onChangeText={(text) => this.setState({ email: text })}
                                />
                                :
                                <List.Item
                                    title={userInfo.email || 'Not Set'}
                                    description={'email'}
                                    style={styles.inactiveItem}
                                    right={() => {
                                        return (
                                            <IconButton
                                                icon="create"
                                                color={Colors.grey300}
                                                size={28}
                                                onPress={() => this._handleUserInfoEdit('email')}
                                            />
                                        )
                                    }}
                                />
                        }
                    </List.Section>
                    <Divider />
                    <List.Section>
                        <List.Subheader>Saved Organizations</List.Subheader>
                        {domains.map(item => {
                            return (
                                <List.Item
                                    key={item.id}
                                    title={item.name}
                                    style={!item.active ? styles.inactiveItem : null}
                                    description={item.active ? 'active' : null}
                                    left={() => {
                                        if (item.active) {
                                            return <ActiveDomainIcon />
                                        }
                                        else {
                                            return null
                                        }
                                    }}
                                    right={() => {
                                        return (
                                            <IconButton
                                                icon="delete"
                                                color={Colors.red700}
                                                size={28}
                                                onPress={() => this._handleDeleteOrg(item.id)}
                                            />
                                        )
                                    }}
                                    onPress={() => { this._switchDomain(item.id) }}
                                />
                            )
                        })}
                    </List.Section>
                    <Divider />
                    <List.Item style={{ paddingVertical: 0 }}
                        title='Add New Organization'
                        left={() => <List.Icon icon={`add`} />}
                        onPress={this._handleAddNewOrg}
                    />
                    <Divider />
                    <List.Section>
                        <List.Subheader>Push Notifications</List.Subheader>
                        {domains.map(domain => {
                            return (
                                <List.Accordion
                                    key={domain.id}
                                    title={domain.name}
                                    left={props => <List.Icon {...props} icon="folder-open" />}
                                >
                                    <List.Item
                                        style={{ paddingVertical: 0, paddingLeft: 60 }}
                                        titleStyle={{ fontWeight: 'bold' }}
                                        title={'All Notifications'}
                                        right={() => {
                                            return (
                                                <Switch
                                                    style={{ margin: 10 }}
                                                    value={false}
                                                // onValueChange={() => { this._toggleNotifications(item.id) }
                                                // }
                                                />
                                            )
                                        }}
                                    />
                                    {menus.items.map((item, i) => (
                                        <List.Item
                                            key={item.id}
                                            style={{ paddingVertical: 0, paddingLeft: 60 }}
                                            title={item.category_name}

                                            right={() => {
                                                return (
                                                    <Switch
                                                        style={{ margin: 10 }}
                                                        value={this._checkIfActive(item.id)}
                                                        onValueChange={(value) => { this._toggleNotifications(item.id, value) }
                                                        }

                                                    />
                                                )
                                            }}
                                        />
                                    ))}
                                </List.Accordion>
                            )
                        })}
                    </List.Section>
                    <View>
                        <Button
                            icon="delete-forever"
                            mode="outlined"
                            color={Colors.red700}
                            style={{padding: 10, }}
                            onPress={() => {
                                persistor.purge();
                                this.props.dispatch({
                                    type: 'PURGE_STATE'
                                })
                                this.props.navigation.navigate('AuthLoading')
                            }}
                        >
                            Clear All Settings
                        </Button>
                    </View>
                </View>
                <Snackbar
                    visible={snackbarVisible}
                    duration={3000}
                    onDismiss={() => this.setState({ snackbarVisible: false })}
                    action={{
                        label: 'Dismiss',
                        onPress: () => {
                            this.setState({ snackbarVisible: false })
                        }
                    }}
                >
                    Organization Removed
                </Snackbar>
                <Button
                    icon="delete-forever"
                    mode="outlined"
                    color={Colors.red700}
                    style={{ padding: 10, }}
                    onPress={() => {
                        persistor.purge();
                        this.props.dispatch({
                            type: 'PURGE_STATE'
                        })
                        this.props.navigation.navigate('AuthLoading')
                    }}
                >
                    Clear All Settings
                </Button>
            </ScrollView>
        )
    }

    _checkIfActive = notificationId => {
        console.log('in check if active')
        const { userInfo: { notifications } } = this.props;
        let found = notifications.categories.find(notification => {
            return notification.id === notificationId
        })
        if(found) {return true}
        else {return false}
    }

    _handleAddNewOrg = () => {
        this.props.navigation.navigate('Auth')
    }

    _handleDeleteOrg = () => {
        this.setState({
            snackbarVisible: true
        })
    }

    _handleUserInfoEdit = (userPref) => {
        if (userPref === 'username') {
            this.setState({
                editingUsername: true
            })
        }
        else if (userPref === 'email') {
            this.setState({
                editingEmail: true
            })
        }
    }

    _toggleNotifications = (notificationId, value) => {
        const { dispatch, userInfo } = this.props;
        if(value) {
            dispatch(addNotification({
                tokenId: userInfo.tokenId,
                categoryId: notificationId
            }))
        }
        else {
            dispatch(removeNotification({
                tokenId: userInfo.tokenId,
                categoryId: notificationId
            }))
        }
    }

    _switchDomain = (id) => {
        const { dispatch, navigation } = this.props;
        dispatch(changeActiveDomain(id))
        navigation.navigate('AuthLoading');
    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        // justifyContent: 'space-between',
    },
    inactiveItem: {
        paddingLeft: 60
    }
})

const mapStateToProps = store => ({
    domains: store.domains,
    userInfo: store.userInfo,
    menus: store.menus
})

export default connect(mapStateToProps)(SettingsScreen)