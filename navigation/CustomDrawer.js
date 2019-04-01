import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    AsyncStorage,
    StatusBar,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-navigation';

import TouchableItem from '../constants/TouchableItem';

import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import DrawerNavIcon from '../components/DrawerNavIcon';


export default class CustomDrawerComponent extends React.Component {
    state = {
        userDomain: '',
        menus: [],
        activeMenu: null
    }
    componentDidMount() {
        this._asyncLoadMenus();
    }

    render() {
        // console.log('items', this.props)
        return (
            <ScrollView style={styles.container}>
                <SafeAreaView style={styles.rootContainer} forceInset={{ top: 'always', horizontal: 'never' }}>
                    {this.state.menus &&
                        <ScrollView >
                            {this.state.menus.map((item, i) => {
                                return (
                                    <TouchableItem
                                        key={i}
                                        accessible
                                        accessibilityLabel={item.title}
                                        onPress={() => {
                                            this._handleMenuPress(item);
                                        }}
                                        delayPressIn={0}
                                    >
                                        <View style={[styles.item, this.state.activeMenu == item.object_id ? { backgroundColor: '#f2f2f2' } : null]}>
                                            <View
                                                style={[
                                                    styles.icon,
                                                    this.state.activeMenu == item.object_id ? null : styles.inactiveIcon
                                                ]}
                                            >
                                                <DrawerNavIcon
                                                    style={item.menu_icon_dir}
                                                    name={item.menu_icon_name}
                                                />
                                            </View>
                                            <Text
                                                style={[styles.label, this.state.activeMenu == item.object_id ? { color: '#727272' } : null]}
                                            >
                                                {item.title}
                                            </Text>
                                        </View>
                                    </TouchableItem>
                                )
                            })}
                        </ScrollView>
                    }
                </SafeAreaView>
            </ScrollView>
        )
    }

    _asyncLoadMenus = async () => {
        const userDomain = await AsyncStorage.getItem('userDomain');
        // pull in menus
        const response = await fetch(`${userDomain}/wp-json/custom/menus/mobile-app-menu`)
        const menus = await response.json();
        this.setState({
            userDomain,
            menus
        })
        // pass inital category to screen
        this._handleMenuPress(this.state.menus[0]);
    };

    _handleMenuPress = async (item) => {
        this.props.navigation.closeDrawer();
        this.props.navigation.navigate('List', {
            content: 'loading'
        })
        const stories = await this._getArticles(item.object_id)
        this.props.navigation.navigate("List", {
            menuTitle: item.title,
            categoryId: item.object_id,
            content: stories
        })
        this.setState({
            activeMenu: item.object_id
        })
    }


    _getArticles = async (category) => {
        const response = await fetch(`${this.state.userDomain}/wp-json/wp/v2/posts?categories=${category}`)
        const stories = await response.json();
        await Promise.all(stories.map(async story => {
            try {
                const imgResponse = await fetch(`${story._links['wp:featuredmedia'][0].href}`)
                const featuredImage = await imgResponse.json();
                story.featuredImage = featuredImage.media_details.sizes.full.source_url;
                console.log('featured image', story.featuredImage)
            }
            catch (err) {
                console.log('error getting featured image', err)
            }
        }))
        return stories;
    }
}

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
    },
    container: {
        paddingVertical: 10,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginHorizontal: 16,
        width: 40,
        alignItems: 'center',
    },
    inactiveIcon: {
        /*
         * Icons have 0.54 opacity according to guidelines
         * 100/87 * 54 ~= 62
         */
        opacity: 0.62,
    },
    label: {
        margin: 16,
        fontWeight: 'bold',
        fontSize: 21
    },
});