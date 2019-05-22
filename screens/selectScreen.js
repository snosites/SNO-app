import React from 'react';
import {
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    View,
    Text,
    Platform
} from 'react-native';
import { connect } from 'react-redux';
import { addDomain, changeActiveDomain, clearAvailableDomains, setAllNotifications } from '../redux/actionCreators';

import { List, Divider } from 'react-native-paper'
import { Haptic } from 'expo';
import Sentry from 'sentry-expo';

import InitModal from './InitModal';

class SelectScreen extends React.Component {
    static navigationOptions = {
        title: 'Select Your Publication',
    };

    state = {
        modalVisible: false,
        selectedDomain: ''
    }

    // componentDidMount() {
    //     const { navigation } = this.props;
    //     const cityLocation = navigation.getParam('location', null);
    //     const orgName = navigation.getParam('orgName', null);
    //     const zipCode = navigation.getParam('zipCode', null);
    //     if (cityLocation) {
    //         // fetch capsule entries by city and state
    //         return fetch(`https://api.capsulecrm.com/api/v2/parties/search?q=${cityLocation[0].city} ${cityLocation[0].region}&embed=fields,tags`, {
    //             method: 'GET',
    //             headers: {
    //                 Accept: 'application/json',
    //                 'Content-Type': 'application/json',
    //                 Authorization: `Bearer ${secrets.CAPSULEBEARER}`
    //             }
    //         })
    //             .then((response) => response.json())
    //             // filter out parties that don't have fields
    //             .then((responseJson) => {
    //                 return responseJson.parties.filter(item => {
    //                     return item.fields.length > 0;
    //                 })
    //             })
    //             // filter out parties that don't have a domain
    //             .then(filteredArr => {
    //                 return filteredArr.filter(item => {
    //                     for (let field of item.fields) {
    //                         if (field.definition.id == 309073) {
    //                             return true;
    //                         }
    //                     }
    //                 })
    //             })
    //             .then(newFilteredArr => {
    //                 this.setState({
    //                     isLoading: false,
    //                     orgs: newFilteredArr,
    //                 });
    //             })
    //             .catch((error) => {
    //                 console.error(error);
    //             });
    //     }
    //     if (orgName) {
    //         return fetch(`https://api.capsulecrm.com/api/v2/parties/search?q=${orgName}&embed=fields,tags`, {
    //             method: 'GET',
    //             headers: {
    //                 Accept: 'application/json',
    //                 'Content-Type': 'application/json',
    //                 Authorization: `Bearer ${secrets.CAPSULEBEARER}`
    //             }
    //         })
    //             .then((response) => response.json())
    //             // filter out parties that don't have fields
    //             .then((responseJson) => {
    //                 return responseJson.parties.filter(item => {
    //                     return item.fields.length > 0;
    //                 })
    //             })
    //             // filter out parties that don't have a domain
    //             .then(filteredArr => {
    //                 return filteredArr.filter(item => {
    //                     for (let field of item.fields) {
    //                         if (field.definition.id == 534081) {
    //                             return true;
    //                         }
    //                     }
    //                 })
    //             })
    //             .then(newFilteredArr => {
    //                 this.setState({
    //                     isLoading: false,
    //                     orgs: newFilteredArr,
    //                 });
    //             })
    //             .catch((error) => {
    //                 console.error(error);
    //             });
    //     }
    // }

    render() {
        const { navigation, availableDomains } = this.props;
        console.log('available domains', availableDomains)
        // const cityLocation = navigation.getParam('location', null);
        if (availableDomains.length == 0) {
            return (
                <View style={{ flex: 1, padding: 20 }}>
                    <ActivityIndicator />
                </View>
            )
        }
        if (availableDomains[0] == 'none') {
            return (
                <View style={{ padding: 20 }}>
                    <Text style={{ textAlign: 'center' }}>Sorry no school's match that search term, please try searching again.</Text>
                </View>
            )
        }

        // city: "St. Louis Park"
        // development: null
        // domain_id: 40316786
        // id: 33
        // latitude: "44.959700"
        // level: "secondary"
        // longitude: "-93.370200"
        // publication: "Knight Errant"
        // school: "Benilde-St. Margaret's School"
        // state: "MN"
        // url: "bsmknighterrant.org"
        // zip: 55416
        return (
            <ScrollView style={styles.container}>
                {availableDomains.map(item => {
                    return (
                        item.school &&
                        <View key={item.id}>
                            <List.Item
                                title={item.school}
                                titleEllipsizeMode='tail'
                                // description={<Text>{item.publication}{"\n"}{item.city}, {item.state}</Text>}
                                description={`${item.publication}  •  ${item.city}, ${item.state}`}
                                descriptionEllipsizeMode='tail'
                                style={{ paddingVertical: 0 }}
                                left={props => <List.Icon {...props}
                                    icon="chevron-right" />
                                }
                                onPress={() => {
                                    this._handleSelect(item.domain_id, item)
                                    this.setState({
                                        selectedDomain: item.domain_id
                                    })
                                }}
                            />
                            <Divider />
                        </View>
                    )
                })}
                <InitModal
                    modalVisible={this.state.modalVisible}
                    handleDismiss={this._handleModalDismiss}
                    navigation={this.props.navigation}
                />
            </ScrollView>

        );
    }

    _handleSelect = async (orgId, item) => {
        if(Platform.OS === 'ios') {
            Haptic.selection();
        }
        try {
            const { domains } = this.props;
            const found = domains.find(domain => {
                return domain.id == orgId
            })
            // if already added set as active -- dont save
            if (found) {
                this.props.dispatch(changeActiveDomain(orgId));
                this.props.navigation.navigate('AuthLoading');
                return;
            }
            // save new domain
            this.props.dispatch(addDomain({
                id: orgId,
                name: item.school,
                publication: item.publication,
                active: true,
                notificationCategories: [],
                url: item.url
            }))
            // set new domain as active
            this.props.dispatch(changeActiveDomain(orgId))
            this.setState({
                modalVisible: true
            })

        }
        catch (error) {
            console.log('error saving users org')
        }
    }
    // dismiss modal and redirect back to auth loading
    _handleModalDismiss = (allNotifications) => {
        if (Platform.OS === 'ios') {
            Haptic.selection();
        }
        this.props.dispatch(setAllNotifications(this.state.selectedDomain, allNotifications))
        this.props.navigation.navigate('AuthLoading');
        this.props.dispatch(clearAvailableDomains());
        this.setState({
            modalVisible: false,
            selectedDomain: ''
        })
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});

const mapStateToProps = state => ({
    availableDomains: state.availableDomains,
    domains: state.domains
})

export default connect(mapStateToProps)(SelectScreen);