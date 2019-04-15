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
import {fetchProfiles} from '../redux/actions/actions';

import { NavigationEvents } from 'react-navigation';

import { Divider, Colors as PaperColors } from 'react-native-paper';
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
        articlesByWriter: []
    }

    componentDidMount() {
        const { menus, navigation } = this.props;
        // if (this.animation) {
        //     this._playAnimation();
        // }
        navigation.setParams({
            headerLogo: menus.headerSmall
        })
        this._getProfiles();
    }

    render() {
        const { navigation } = this.props;

        return (
            <ScrollView contentContainerStyle={{ flexGrow: 1, }}>
                <NavigationEvents
                    onWillFocus={payload => this._loadProfile(payload)}
                />
                <Text style={{ fontSize: 30, textAlign: 'center', padding: 20 }}>
                    Staff Page
                </Text>
            </ScrollView>
        );
    }

    _getProfiles = () => {
        const { activeDomain, dispatch } = this.props;
        const url = activeDomain.url;
        dispatch(fetchProfiles(url));
    }

}



const styles = StyleSheet.create({

});

const mapStateToProps = (state) => {
    return {
        activeDomain: state.activeDomain,
        menus: state.menus,
        profiles: state.profiles
    }
}

export default connect(mapStateToProps)(StaffScreen);