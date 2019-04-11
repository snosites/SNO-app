import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    Image,
    ActivityIndicator,
    AsyncStorage
} from 'react-native';
// import Colors from '../constants/Colors';
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

export default class SettingsScreen extends React.Component {
    static navigationOptions = {
        title: 'Settings',
    };

    state = {
        snackbarVisible: false,
    };

    render() {
        const { snackbarVisible } = this.state;
        const domains = this.props.domains;
        return (
            <ScrollView contentContainerStyle={styles.container}>
                <View>
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
                                                size={20}
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
                        {domains.map(item => {
                            return (
                                <List.Item
                                    key={item.id}
                                    style={{ paddingVertical: 0 }}
                                    title={item.name}
                                    left={() => <NotificationIcon item={item} />}
                                    right={() => {
                                        return (
                                            <Switch
                                                style={{ margin: 10 }}
                                                value={item.notifications}
                                                onValueChange={() => {this._toggleNotifications(item.id)}
                                                }
                                            />
                                        )
                                    }}
                                />
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
        justifyContent: 'space-between',
    },
    inactiveItem: {
        paddingLeft: 60
    }
})