import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    Image,
    ActivityIndicator,
    FlatList,
    TouchableOpacity
} from 'react-native';
import Moment from 'moment';
import { connect } from 'react-redux';
import { fetchProfiles } from '../redux/actions/actions';

import { NavigationEvents } from 'react-navigation';

import { Divider, Colors as PaperColors, Card } from 'react-native-paper';
import Colors from '../constants/Colors'
import { Ionicons } from '@expo/vector-icons';
import HeaderButtons, { HeaderButton, Item } from 'react-navigation-header-buttons';


// header icon native look component
const IoniconsHeaderButton = passMeFurther => (
    <HeaderButton {...passMeFurther} IconComponent={Ionicons} iconSize={30} color={Colors.tintColor} />
);

class StaffScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const logo = navigation.getParam('headerLogo', null)
        return {
            title: navigation.getParam('menuTitle', 'Staff'),
            headerRight: (
                <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
                    <Item title="menu" iconName="ios-menu" onPress={() => navigation.openDrawer()} />
                </HeaderButtons>
            ),
            headerLeft: (
                logo &&
                <Image
                    source={{ uri: logo }}
                    style={{ width: 60, height: 30, borderRadius: 7, marginLeft: 10 }}
                    resizeMode='cover'
                />
            ),
        };
    };

    state = {
        activeYears: [],
        selectedIndex: 0
    }

    componentDidMount() {
        const { menus, navigation } = this.props;
        // if (this.animation) {
        //     this._playAnimation();
        // }
        navigation.setParams({
            headerLogo: menus.headerSmall
        })
        this.setState({
            activeYears: navigation.getParam('activeYears', null)
        })
        this._getProfiles();
    }

    render() {
        const { navigation, profiles } = this.props;
        const { activeYears, selectedIndex } = this.state;
        return (
            <View style={{ flex: 1 }}>
                <View>
                    <FlatList
                        data={activeYears}
                        extraData={this.state.selectedIndex}
                        horizontal={true}
                        renderItem={this._renderItem}
                    />
                </View>

                <ScrollView style={{ flex: 1 }}>
                    <NavigationEvents
                        onWillFocus={payload => this._loadProfile(payload)}
                    />
                    <Text style={{ fontSize: 30, textAlign: 'center', paddingTop: 20, paddingBottom: 10 }}>
                        Staff Profiles
                    </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
                        {profiles.items.map(profile => {
                            const temp = profile.schoolYears.filter(schoolyear => {
                                return schoolyear === activeYears[selectedIndex]
                            })
                            console.log('temp', temp)
                            if (temp.length > 0) {
                                return (
                                    <View key={profile.ID} style={{ padding: 20, alignItems: 'center', width: 175 }}>
                                        {profile.featuredImage ?
                                            <Image
                                                source={{ uri: profile.featuredImage }}
                                                style={{
                                                    width: 150,
                                                    height: 150,
                                                    borderRadius: 75
                                                }}
                                            />
                                            :
                                            <Image
                                                source={{ uri: require('../assets/images/anon.png') }}
                                                style={{
                                                    width: 150,
                                                    height: 150,
                                                    borderRadius: 75
                                                }}
                                            />
                                        }
                                        <Text style={{ textAlign: 'center', fontSize: 25, paddingTop: 10}}
                                        numberOfLines={2} ellipsizeMode='tail' 
                                        >{profile.customFields.name[0]}</Text>
                                        <Text style={{ fontSize: 18, color: 'grey' }}>{profile.customFields.staffposition[0]}</Text>
                                    </View>
                                )
                            }

                        })}
                    </View>
                </ScrollView>
            </View>

        );
    }

    _getProfiles = () => {
        const { activeDomain, dispatch } = this.props;
        const url = activeDomain.url;
        dispatch(fetchProfiles(url));
    }

    _renderItem = ({ item, index }) => {
        const { selectedIndex } = this.state;
        return (
            <Card
                key={index}
                style={selectedIndex === index ? [styles.yearContainer, styles.selectedYear] : styles.yearContainer}
                onPress={() => {
                    this.setState({
                        selectedIndex: index
                    })
                }}
            >
                <Card.Content>
                    <Text style={selectedIndex === index ? [styles.year, styles.selectedYear] : styles.year}>{item}</Text>
                </Card.Content>
            </Card>

        )
    }

}



const styles = StyleSheet.create({
    yearContainer: {
        margin: 5,
        borderRadius: 5,
        justifyContent: 'center'
    },
    year: {
        // padding: 5,
        color: '#757575',
        fontSize: 18
    },
    selectedYear: {
        backgroundColor: '#0277bd',
        color: 'white'
    }
});

const mapStateToProps = (state) => {
    return {
        activeDomain: state.activeDomain,
        menus: state.menus,
        profiles: state.profiles
    }
}

export default connect(mapStateToProps)(StaffScreen);