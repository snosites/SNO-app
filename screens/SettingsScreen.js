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
import { saveUserInfo } from '../redux/actions/actions';
import { List, Divider, Switch, IconButton, Colors, Snackbar } from 'react-native-paper';
import { toggleNotifications, changeActiveDomain, } from '../redux/actions/actions';

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

const NotificationIcon = ({ item }) => (
    <List.Icon
        icon={`notifications${!item.notifications ? '-off' : ''}`}
        color={Colors.yellow600}
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
        this.setState({
            username: this.props.userInfo.username,
            email: this.props.userInfo.email
        })
    }

    render() {
        const { snackbarVisible, editingUsername, editingEmail, username, email } = this.state;
        const { domains, userInfo, menus, dispatch } = this.props;
        return (
            <ScrollView style={styles.container}>
                <View style={{flex: 1}}>
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
                                    left={props => <List.Icon {...props} icon="expand-more" />}
                                    right={() => {
                                        return (
                                            <Switch
                                                style={{ margin: 10 }}
                                                // value={item.notifications}
                                                value={true}
                                                // onValueChange={() => { this._toggleNotifications('all') }
                                                // }
                                            />
                                        )
                                    }}
                                >
                                    {menus.items.map(item => (
                                        <List.Item
                                        key={item.ID}
                                        style={{ paddingVertical: 0 }}
                                        title={item.title}
                                        left={() => <NotificationIcon item={item} />}
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
                                    ))}
                                </List.Accordion>
                            )
                        })}
                    </List.Section>
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
            </ScrollView>
        )
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

    _toggleNotifications = (orgId) => {
        this.props.dispatch(toggleNotifications(orgId))
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