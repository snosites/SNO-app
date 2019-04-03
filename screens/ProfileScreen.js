import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    Image,
    ActivityIndicator,
    AsyncStorage
} from 'react-native';

export default class ProfileScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Profile' //navigation.getParam('menuTitle', 'Stories'),
        };
    };

    componentDidMount() {
        this._getProfile()
        this._getProfileImage()
    }

    componentDidUpdate() {
        this._getProfileImage()
    }

    render() {
        const { navigation } = this.props;
        const profile = navigation.getParam('profile', 'loading');
        if(profile == 'loading') {
            return (
                <View style={{flex: 1, paddingTop: 20, alignItems: 'center'}}>
                    <ActivityIndicator />
                </View>
            )
        }
        return (
            <ScrollView style={styles.container}>
                <View style={styles.profileInfoContainer}>
                    <View style={styles.profileImageContainer}>
                        {this._renderProfileImage()}
                    </View>
                    
                </View>
            </ScrollView>
        );
    }

    _getProfile = async () => {
        const { navigation } = this.props;
        const article = navigation.getParam('article', 'loading');
        const userDomain = await AsyncStorage.getItem('userDomain');
        if(article !== 'loading') {
            const response = await fetch(`${userDomain}/wp-json/wp/v2/posts?search=${article.custom_fields.writer[0]}`)
            const profiles = await response.json();
            console.log('profile results', profiles)
        }
        
    }

    _renderProfileImage = () => {
        const { navigation } = this.props;
        const profileImage = navigation.getParam('profileImage', 'loading');
        if (profileImage == 'loading') {
            return (
                <ActivityIndicator />
            )
        }
        else if (profileImage == 'none') {
            return (
                <Image
                    style={styles.profileImage}
                    source={require('../assets/images/anon.png')}
                />
            )
        }
        else {
            return (
                <Image
                    style={styles.profileImage}
                    source={{ uri: profileImage.media_details.sizes.full.source_url }}
                />
            )
        }
    }

    _getProfileImage = async () => {
        const { navigation } = this.props;
        const article = navigation.getParam('article', 'loading');
        if (article._links['wp:featuredmedia']) {
            const response = await fetch(article._links['wp:featuredmedia'][0].href);
            const profileImage = await response.json();
            navigation.setParams({ profileImage })
        }
        else {
            navigation.setParams({ profileImage: 'none' })
        }
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 15,
        backgroundColor: '#fff',
    },
    profileInfoContainer: {
        alignItems: 'center',
        padding: 10
    },
    profileImageContainer: {
        width: 200,
        height: 200,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center'
    },
    profileImage: {
        width: 200,
        height: 200,
        borderRadius: 100,
    }
});