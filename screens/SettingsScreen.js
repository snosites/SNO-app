import React from 'react';
import {
    ScrollView,
    StyleSheet,
    View,
    TextInput
} from 'react-native';
import { connect } from 'react-redux';
import { persistor } from '../redux/configureStore';
import { saveUserInfo } from '../redux/actions/actions';
import { List, Divider, Switch, IconButton, Colors, Snackbar, Button } from 'react-native-paper';
import { changeActiveDomain, addNotification, removeNotification, fetchNotifications } from '../redux/actions/actions';


const ActiveDomainIcon = ({color}) => (
    <List.Icon
        icon={`star`}
        color={color}
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
        const { userInfo, dispatch, activeDomain } = this.props;
        this.setState({
            username: userInfo.username,
            email: userInfo.email
        })
        if (userInfo.tokenId) {
            dispatch(fetchNotifications({
                tokenId: userInfo.tokenId,
                domain: activeDomain.id
            }))
        }
    }

    render() {
        const { snackbarVisible, editingUsername, editingEmail, username, email } = this.state;
        const { domains, userInfo, dispatch, theme } = this.props;
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
                                            return <ActiveDomainIcon color={theme.colors.accent}/>
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
                                    {domain.notificationCategories.map((item, i) => {
                                        console.log('not cat', item)
                                        return (
                                        <List.Item
                                            key={item.id}
                                            style={{ paddingVertical: 0, paddingLeft: 60 }}
                                            title={item.category_name}
                                            right={() => {
                                                return (
                                                    <Switch
                                                        style={{ margin: 10 }}
                                                        value={item.active}
                                                        onValueChange={(value) => { this._toggleNotifications(item.id, value, domain) }
                                                        }

                                                    />
                                                )
                                            }}
                                        />
                                    )
                                        }
                                    )}
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

    _toggleNotifications = (notificationId, value, domain) => {
        const { dispatch, userInfo } = this.props;
        if(value) {
            dispatch(addNotification({
                tokenId: userInfo.tokenId,
                categoryId: notificationId,
                domain: domain.id
            }))
        }
        else {
            dispatch(removeNotification({
                tokenId: userInfo.tokenId,
                categoryId: notificationId,
                domain: domain.id
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
    theme: store.theme,
    domains: store.domains,
    userInfo: store.userInfo,
    menus: store.menus,
    activeDomain: store.activeDomain
})

export default connect(mapStateToProps)(SettingsScreen)