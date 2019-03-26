import React from 'react';
import { 
    ScrollView, 
    StyleSheet, 
    Text,
    TouchableHighlight,
    ActivityIndicator, 
    View, 
    AsyncStorage,
    Modal
    } from 'react-native';
import { ListItem, Button, Icon } from 'react-native-elements'
import { Haptic } from 'expo';
import {secrets} from '../env';

import InitModal from './InitModal';

export default class selectScreen extends React.Component {
    static navigationOptions = {
        title: 'Select Your Organization',
    };

    state = {
        isLoading: true,
        modalVisible: false,
        orgs: []
    }

    componentDidMount() {
        const { navigation } = this.props;
        const cityLocation = navigation.getParam('location', null);
        const orgName = navigation.getParam('orgName', null);
        const zipCode = navigation.getParam('zipCode', null);
        console.log(Number(cityLocation[0].postalCode));
        if(cityLocation) {
            // fetch capsule entries by city and state
            return fetch(`https://api.capsulecrm.com/api/v2/parties/search?q=${cityLocation[0].city} ${cityLocation[0].region}&embed=fields,tags`, {
                method: 'GET',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${secrets.CAPSULEBEARER}`
                }
            })
            .then((response) => response.json())
            // filter out parties that don't have fields
            .then((responseJson) => {
                // console.log('responseJson', responseJson.parties)

                // console.log('responseJson Length', responseJson.parties.length)
                return responseJson.parties.filter(item => {
                    return item.fields.length > 0;
                })
            })
            // filter out parties that don't have a domain
            .then(filteredArr => {
                return filteredArr.filter(item => {
                    for(let field of item.fields) {
                        if(field.definition.id == 309073){
                            return true;
                        }
                    }
                })
            })
            .then(newFilteredArr => {
                this.setState({
                    isLoading: false,
                    orgs: newFilteredArr,
                });
                console.log('newFilteredArr', newFilteredArr);
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
                <ActivityIndicator color="#9A1D20" />
              </View>
            )
          }
        return (
            <ScrollView style={styles.container}>
                {this.state.orgs.map(item => (
                    item.name && 
                    <ListItem
                        key={item.id}
                        title={item.name}
                        bottomDivider
                        chevron
                        onPress={() => this._handleSelect(item.id, item.fields)}
                    />
                    ))
                }
                <InitModal 
                    modalVisible={this.state.modalVisible} 
                    handleDismiss={this._handleModalDismiss} 
                    nav={this.props.navigation.navigate}    
                />
            </ScrollView>
            
        );
    }

    _handleSelect = async (orgId, fields) => {
        Haptic.selection();
        let domain = '';
        for(let field of fields) {
            if(field.definition.id == 3747) {
                domain = field.value;
            }
        }
        try {
            await AsyncStorage.setItem('userOrg', String(orgId));
            await AsyncStorage.setItem('userDomain', String(domain));
            this.setState({
                modalVisible: true
            })
          } 
          catch (error) {
            console.log('error saving users org')
          }
    }

    _handleModalDismiss = () => {
        this.setState({
            modalVisible: false
        })
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});