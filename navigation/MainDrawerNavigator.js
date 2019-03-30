import React from 'react';
import {
    Platform,
    Button,
    ScrollView,
    StyleSheet,
    Text,
    View,
    AsyncStorage,
    StatusBar,
    ActivityIndicator
} from 'react-native';
import { createDrawerNavigator, createStackNavigator, DrawerItems, SafeAreaView, createSwitchNavigator } from 'react-navigation';

import TouchableItem from '../constants/TouchableItem';

import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import TabBarIcon from '../components/TabBarIcon';
import DrawerNavIcon from '../components/DrawerNavIcon';

import ListScreen from '../screens/ListScreen';

import HeaderButtons, { HeaderButton, Item } from 'react-navigation-header-buttons';

// header icon native look component
const IoniconsHeaderButton = passMeFurther => (
    <HeaderButton {...passMeFurther} IconComponent={Ionicons} iconSize={30} color="blue" />
);


class FullArticleScreen extends React.Component {
    static navigationOptions = {
        title: 'FullArticleScreen',
    };

    render() {
        return (
            <Button
                onPress={() => this.props.navigation.goBack()}
                title="Go back to List Screen"
            />
        );
    }
}

const ArticleStack = createStackNavigator({
    List: ListScreen,
    FullArticle: FullArticleScreen,
});

ArticleStack.navigationOptions = {

};

class CustomDrawerComponent extends React.Component {
    state = {
        userDomain: '',
        menus: []
    }
    componentDidMount() {
        this._asyncLoadMenus();
    }

    render() {
        // console.log('items', this.state.menus)
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
                                        <View style={styles.item}>
                                            <View
                                                style={[
                                                    styles.icon,
                                                    this.props.focused ? null : styles.inactiveIcon
                                                ]}
                                            >
                                                <DrawerNavIcon
                                                    style={item.menu_icon_dir}
                                                    name={item.menu_icon_name}
                                                />
                                            </View>
                                            <Text
                                                style={styles.label}
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
        const stories = await this._getArticles(item.object_id)
        this.props.navigation.closeDrawer();
        this.props.navigation.navigate("List", {
            menuTitle: item.title,
            categoryId: item.object_id,
            content: stories
        })
    }

    _getArticles = async (category) => {
        const response = await fetch(`${this.state.userDomain}/wp-json/wp/v2/posts?categories=${category}`)
        const stories = await response.json();
        return stories;
    }
}

class HomeLoadingScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            loadingSettings: true
        }
    }

    componentDidMount(){
        setTimeout(() => {
            this.setState({loadingSettings: false})
            this.props.navigation.navigate('HomeMain');
        }, 2000)
    }

    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center'}}>
                <StatusBar barStyle="dark-content" />
                <ActivityIndicator size="large" color='purple' />
            </View>
        );
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


const MyDrawerNavigator = createDrawerNavigator(
    {
        Home: ArticleStack,
    },
    {
        contentComponent: CustomDrawerComponent
    }
);


MyDrawerNavigator.navigationOptions = {
    tabBarLabel: 'Home',
    tabBarIcon: ({ focused }) => (
        <TabBarIcon
            focused={focused}
            name={
                Platform.OS === 'ios'
                    ? `ios-home`
                    : 'md-home'
            }
        />
    ),
};

const HomeLoadingStack = createSwitchNavigator({
    HomeLoading: HomeLoadingScreen,
    HomeMain: MyDrawerNavigator
})

HomeLoadingStack.navigationOptions = {
    tabBarLabel: 'Home',
    tabBarIcon: ({ focused }) => (
        <TabBarIcon
            focused={focused}
            name={
                Platform.OS === 'ios'
                    ? `ios-home`
                    : 'md-home'
            }
        />
    ),
};


export default HomeLoadingStack;