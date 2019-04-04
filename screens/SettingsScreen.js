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
import Colors from '../constants/Colors';
import { List, Divider, Switch, Checkbox } from 'react-native-paper';

const testData = [
    {
        name: 'Travis Demo',
        active: true,
        notifications: true
    },
    {
        name: 'Blitzer Test',
        active: false,
        notifications: false
    },
    {
        name: 'Buffalo High School',
        active: false,
        notifications: true
    }
]

export default class SettingsScreen extends React.Component {
    static navigationOptions = {
        title: 'Settings',
    };

    state = {
        isSwitchOn: false,
        isSwitchOn2: false,
        activeDomain: 1,

    };

    render() {
        const { isSwitchOn, } = this.state;
        return (
            <ScrollView style={styles.container}>
                <List.Section>
                    <List.Subheader>Saved Organizations</List.Subheader>
                    {testData.map(item => {
                        return (
                            <List.Item
                                title={item.name}
                                description={item.active ? 'active' : null}
                                left={() => {
                                    return (
                                        <List.Icon icon={`star${!item.active ? '-border' : ''}`} />
                                    )
                                }}
                                right={() => {
                                    return (
                                        <List.Icon icon={`delete`} />
                                    )
                                }}
                                onPress={() => { alert('toggle') }}
                            />
                        )
                    })}
                </List.Section>
                <Divider />
                <List.Item style={{ paddingVertical: 0 }}
                    title='Add New Organization'
                    left={() => <List.Icon icon={`add`} />}
                    
                />
                <Divider />
                <List.Section>
                    <List.Subheader>Push Notifications</List.Subheader>
                    {testData.map(item => {
                        return (
                            <List.Item style={{ paddingVertical: 0 }}
                                title={item.name}
                                left={() => <List.Icon icon={`notifications${!item.notifications ? '-off' : ''}`} />}
                                right={() => {
                                    return (
                                        <Switch
                                            style={{ margin: 10 }}
                                            value={isSwitchOn}
                                            onValueChange={() => { this.setState({ isSwitchOn: !isSwitchOn }); }
                                            }
                                        />
                                    )
                                }}
                            />
                        )
                    })}
                </List.Section>
            </ScrollView>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerContainer: {
        padding: 10,
        backgroundColor: '#e2e2e2'
    },
    settingsContainer: {
        flex: 1,
        padding: 20
    },
    header: {
        fontSize: 20
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    }
})