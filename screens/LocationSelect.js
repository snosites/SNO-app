import React from 'react';
import {
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    View,
    Text,
    Platform,
    Image,
    SafeAreaView
} from 'react-native';
import { connect } from 'react-redux';
import { addDomain, changeActiveDomain, clearAvailableDomains, setAllNotifications } from '../redux/actionCreators';
import { isPointWithinRadius, getDistance } from 'geolib';


import { List, Divider } from 'react-native-paper'
import Slider from "react-native-slider";

import { Haptic, Constants } from 'expo';
import Sentry from 'sentry-expo';

import InitModal from './InitModal';

import { Amplitude } from 'expo';


class LocationSelectScreen extends React.Component {
    static navigationOptions = {
        title: 'Select Your School',
    };

    state = {
        modalVisible: false,
        selectedDomain: '',
        schoolsInRadius: [],
        radius: 20,
        reloading: false
    }

    componentDidMount() {
       this._handleRadiusSearch();
    }

    _handleRadiusSearch = () => {
        const { navigation, availableDomains } = this.props;
        const coords = navigation.getParam('coords', null);

        this.setState({
            reloading: true
        })

        let searchRadius = this.state.radius * 1609.34

        // filter schools based on users location and the radius they selected
        const filteredSchools = availableDomains.filter(school => {
            return isPointWithinRadius(
                {latitude: coords.latitude, longitude: coords.longitude},
                {latitude: school.latitude, longitude: school.longitude},
                searchRadius
            )
        })

        const filteredSchoolsWithDistance = filteredSchools.map(school => {
            let distance = getDistance(
                { latitude: coords.latitude, longitude: coords.longitude },
                { latitude: school.latitude, longitude: school.longitude },
            )
            school.distanceAway = distance / 1609.34;
            return school;
        })

        filteredSchoolsWithDistance.sort(function (a, b) {
            if (a.distanceAway < b.distanceAway)
                return -1;
            if (a.distanceAway > b.distanceAway)
                return 1;
            return 0;
        })
        // check for dev schools
        if (__DEV__) {
            this.setState({
                reloading: false,
                schoolsInRadius: filteredSchoolsWithDistance
            })
        } else {
            const filteredDevDomains = filteredSchoolsWithDistance.filter(domain => {
                return !domain.development
            })
            this.setState({
                reloading: false,
                schoolsInRadius: filteredDevDomains
            })
        } 
    }

    render() {
        
        const { navigation, availableDomains } = this.props;
        const { schoolsInRadius, radius, reloading } = this.state;
        const cityLocation = navigation.getParam('location', null);
        console.log(schoolsInRadius)
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
                    <Text style={{ textAlign: 'center' }}>Sorry no school's available.</Text>
                </View>
            )
        }

        return (
            <SafeAreaView style={{flex: 1}}>
                <View style={{padding: 20}}>
                    <Text style={{
                        textAlign: 'center',
                        fontSize: 18,
                        fontWeight: 'bold'
                    }}>
                        Schools within {radius} miles
                    </Text>
                    <Text style={{
                        textAlign: 'center',
                        fontSize: 18,
                        fontWeight: 'bold'
                    }}>
                        of {cityLocation.city}, {cityLocation.region}
                    </Text>
                    <Slider
                        value={20}
                        onValueChange={radius => this.setState({ radius })}
                        onSlidingComplete={this._handleRadiusSearch}
                        minimumValue={5}
                        maximumValue={100}
                        step={5}
                        thumbTintColor={Constants.manifest.releaseChannel === 'sns' ? Constants.manifest.extra.highSchool.primary : Constants.manifest.extra.college.primary}
                        thumbTouchSize={{
                            width: 80,
                            height: 80
                        }}
                    />
                </View>
                <Divider />
                {reloading ?
                <View style={{ flex: 1, padding: 20 }}>
                    <ActivityIndicator />
                </View>
                :
                schoolsInRadius.length == 0 ?
                    <View style={{ flex: 1, padding: 20 }}>
                            <Text style={{ textAlign: 'center' }}>Sorry there are no schools available within your selected radius</Text>
                    </View>
                :
                <ScrollView style={styles.container}>
                        {schoolsInRadius.map(item => {
                        return (
                            item.school &&
                            <View key={item.id}>
                                <List.Item
                                    title={item.school}
                                    titleEllipsizeMode='tail'
                                    description={`${item.publication}  •  ${item.city}, ${item.state}\n${item.distanceAway.toFixed(2)} miles away`}
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
                
                }
            </SafeAreaView>
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
            // save new domain and send analytics
            Amplitude.logEventWithProperties('add school', {
                domainId: orgId
            })

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
    // container: {
    //     flex: 1,
    //     backgroundColor: '#fff',
    // },
});

const mapStateToProps = state => ({
    availableDomains: state.availableDomains,
    domains: state.domains
})

export default connect(mapStateToProps)(LocationSelectScreen);