import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import {secrets} from '../env';

export default class selectScreen extends React.Component {
    static navigationOptions = {
        title: 'Select Your Organization',
    };

    state = {
        isLoading: true,
        orgs: []
    }

    componentDidMount() {
        const { navigation } = this.props;
        const cityLocation = navigation.getParam('location', null);
        const orgName = navigation.getParam('orgName', null);
        const zipCode = navigation.getParam('zipCode', null);

        if(cityLocation) {
            return fetch(`https://api.capsulecrm.com/api/v2/parties/search?q=${cityLocation[0].city}${cityLocation[0].postalCode}`, {
                method: 'GET',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${secrets.CAPSULEBEARER}`
                }
            })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    isLoading: false,
                    orgs: responseJson.parties,
                });
            })
            .catch((error) => {
                console.error(error);
            });
        }
    }

    render() {
        const { navigation } = this.props;
        const cityLocation = navigation.getParam('location', null);
        return (
            <ScrollView style={styles.container}>
                {cityLocation && <Text>{JSON.stringify(orgs)}</Text>}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 15,
        backgroundColor: '#fff',
    },
});