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
import { ListItem, Button } from 'react-native-elements'
import { Haptic } from 'expo';
import {secrets} from '../env';

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
                        onPress={() => this._handleSelect(item.id)}
                    />
                    ))
                }
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        this.props.navigation.navigate('Main')
                    }}>
                    <View style={{flex: 1, marginTop: 25, padding: 25}}>
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{fontSize: 25, paddingBottom: 10, color: '#D17931', fontWeight: 'bold'}}>Great!</Text>
                            <Text style={{fontSize: 17, paddingBottom: 25}}>
                                Your selected organization has been saved.  If you ever want to change this you can find it in your settings.
                            </Text>
                            <Button
                                title='Dismiss'
                                buttonStyle={{ backgroundColor: '#9A1D20', borderRadius: 10, paddingHorizontal: 30 }}
                                onPress={() => {
                                    this.setState({
                                        modalVisible: false
                                    })
                                    this.props.navigation.navigate('Main')
                                }}
                                titleStyle={{ color: 'white' }}
                                />
                        </View>
                    </View>
                    </Modal>
            </ScrollView>
            
        );
    }

    _handleSelect = async (orgId) => {
        Haptic.selection();
        try {
            await AsyncStorage.setItem('userOrg', String(orgId));
            this.setState({
                modalVisible: true
            })
          } 
          catch (error) {
            console.log('error saving users org')
          }
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});