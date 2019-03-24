import React from 'react';
import { ScrollView, StyleSheet, Text, ActivityIndicator, View } from 'react-native';
import { ListItem } from 'react-native-elements'
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
        console.log(cityLocation[0])
        console.log(Number(cityLocation[0].postalCode));
        if(cityLocation) {
            return fetch(`https://api.capsulecrm.com/api/v2/parties/search?q=${Number(cityLocation[0].postalCode)}`, {
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
                console.log(responseJson.parties);
                
            })
            .catch((error) => {
                console.error(error);
            });
        }
    }

    render() {
        const { navigation } = this.props;
        const cityLocation = navigation.getParam('location', null);
        if(this.state.isLoading){
            return(
              <View style={{flex: 1, padding: 20}}>
                <ActivityIndicator size="large" color="#0000ff" />
              </View>
            )
          }
        return (
            <ScrollView style={styles.container}>
                {/* {cityLocation && <Text>{JSON.stringify(this.state.orgs)}</Text>} */}
                {this.state.orgs.map(item => (
                    item.name && 
                    <ListItem
                        key={item.id}
                        title={item.name}
                        bottomDivider
                        onPress={() => this._handleSelect(item.id)}
                        // leftIcon={{ name: item.icon }}
                    />
                    ))
                }
            </ScrollView>
        );
    }

    _handleSelect = (orgId) => {
        console.log('org ID:', orgId)
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});