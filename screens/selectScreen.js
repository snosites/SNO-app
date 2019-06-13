import React from 'react';
import {
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    View,
    Text,
    Platform,
    Image
} from 'react-native';
import { connect } from 'react-redux';
import { addDomain, changeActiveDomain, clearAvailableDomains, setAllNotifications } from '../redux/actionCreators';

import { List, Divider } from 'react-native-paper'
import { Haptic } from 'expo';
import Sentry from 'sentry-expo';

import InitModal from './InitModal';

class SelectScreen extends React.Component {
    static navigationOptions = {
        title: 'Select Your School',
    };

    state = {
        modalVisible: false,
        selectedDomain: ''
    }


    render() {
        const { navigation, availableDomains } = this.props;
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

        return (
            <ScrollView style={styles.container}>
                {availableDomains.map(item => {
                    return (
                        item.school &&
                        <View key={item.id}>
                            <List.Item
                                title={item.school}
                                titleEllipsizeMode='tail'
                                description={`${item.publication}  •  ${item.city}, ${item.state}`}
                                descriptionEllipsizeMode='tail'
                                style={{ paddingVertical: 0 }}
                                left={props => {
                                    if (item.icon) {
                                        return (
                                            <List.Icon {...props}
                                                icon={({ size, color }) => (
                                                    <Image
                                                        source={{
                                                            uri: item.icon
                                                        }}
                                                        style={{ 
                                                            width: size + 5, height: size + 5,
                                                            borderRadius: 4
                                                        }}
                                                    />
                                                )} />
                                        )
                                    } else {
                                        return (
                                            <List.Icon {...props}
                                                icon="chevron-right" />
                                        )
                                    }
                                }
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
        if (Platform.OS === 'ios') {
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
            console.log(error)
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