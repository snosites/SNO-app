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
import { List, Divider, Switch, IconButton, Colors } from 'react-native-paper';
import {addDomain, changeActiveDomain} from '../redux/actions/actions';

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
        color={Colors.blue500}
    />
)

const NotificationIcon = ({item}) => (
    <List.Icon 
        icon={`notifications${!item.notifications ? '-off' : ''}`} 
        color={Colors.yellow700}
    />
)

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
        const domains = this.props.domains;
        const { isSwitchOn, } = this.state;
        return (
            <ScrollView style={styles.container}>
                <List.Section>
                    <List.Subheader>Saved Organizations</List.Subheader>
                    {testData.map(item => {
                        return (
                            <List.Item
                                title={item.name}
                                style={!item.active ? styles.inactiveItem : null}
                                description={item.active ? 'active' : null}
                                left={() => {
                                    if(item.active){
                                        return <ActiveDomainIcon />
                                    }
                                    else {
                                        return null
                                    }
                                }}
                                right={() => {
                                    return (
                                        <DeleteButton />
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
                    onPress={this._handleAddNewOrg}
                />
                <Divider />
                <List.Section>
                    <List.Subheader>Push Notifications</List.Subheader>
                    {testData.map(item => {
                        return (
                            <List.Item style={{ paddingVertical: 0 }}
                                title={item.name}
                                left={() => <NotificationIcon item={item} />}
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

    _handleAddNewOrg = () => {
        this.props.navigation.navigate('Auth')
    }


}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    inactiveItem: {
        paddingLeft: 60
    }
})