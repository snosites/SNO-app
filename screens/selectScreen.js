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
import { connect } from 'react-redux';
import { addDomain, changeActiveDomain } from '../redux/actions/actions';

import { ListItem, Button, Icon } from 'react-native-elements'
import { Haptic } from 'expo';
import { secrets } from '../env';

import InitModal from './InitModal';

class SelectScreen extends React.Component {
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
        if (cityLocation) {
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
                    return responseJson.parties.filter(item => {
                        return item.fields.length > 0;
                    })
                })
                // filter out parties that don't have a domain
                .then(filteredArr => {
                    return filteredArr.filter(item => {
                        for (let field of item.fields) {
                            if (field.definition.id == 309073) {
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
                })
                .catch((error) => {
                    console.error(error);
                });
        }
        if (orgName) {
            return fetch(`https://api.capsulecrm.com/api/v2/parties/search?q=${orgName}&embed=fields,tags`, {
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
                    return responseJson.parties.filter(item => {
                        return item.fields.length > 0;
                    })
                })
                // filter out parties that don't have a domain
                .then(filteredArr => {
                    return filteredArr.filter(item => {
                        for (let field of item.fields) {
                            if (field.definition.id == 534081) {
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
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }

    render() {
        const { navigation } = this.props;
        const cityLocation = navigation.getParam('location', null);
        if (this.state.isLoading) {
            return (
                <View style={{ flex: 1, padding: 20 }}>
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
                        onPress={() => this._handleSelect(item.id, item)}
                    />
                ))
                }
                <InitModal
                    modalVisible={this.state.modalVisible}
                    handleDismiss={this._handleModalDismiss}
                    navigation={this.props.navigation}
                />
            </ScrollView>

        );
    }

    _handleSelect = async (orgId, item) => {
        const domains = this.props.domains;
        Haptic.selection();
        let domain = '';
        for (let field of item.fields) {
            if (field.definition.id == 3747) {
                domain = field.value;
            }
        }
        try {
            // save new domain
            this.props.dispatch(addDomain({
                id: orgId,
                name: item.name,
                active: true,
                notificationCategories: [],
                url: String(domain)
            }))
            // set new domain as active
            this.props.dispatch(changeActiveDomain(orgId))
            this.setState({
            modalVisible: true
        })
    }
    catch(error) {
        console.log('error saving users org')
    }
}
// dismiss modal and redirect back to auth loading
_handleModalDismiss = () => {
    this.setState({
        modalVisible: false
    })
    this.props.navigation.navigate('AuthLoading');
}

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});

const mapStateToProps = state => ({
    domains: state.domains
})

export default connect()(SelectScreen);