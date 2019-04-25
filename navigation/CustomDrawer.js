import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    AsyncStorage,
    StatusBar,
    ActivityIndicator,
    Image
} from 'react-native';
import {
    Drawer,
    withTheme,
    Switch,
    TouchableRipple,
    Text as PaperText,
    Colors,
    Divider,
    Searchbar
} from 'react-native-paper';

import { fetchArticlesIfNeeded } from '../redux/actions/actions';

import { SafeAreaView } from 'react-navigation';

import TouchableItem from '../constants/TouchableItem';
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import DrawerNavIcon from '../components/DrawerNavIcon';
import { connect } from 'react-redux';


class CustomDrawerComponent extends React.Component {
    state = {
        activeMenuIndex: 0
    }

    componentDidMount() {
        const { menus } = this.props;
        this.props.navigation.navigate('List', {
            menuTitle: menus.items[0].title,
            categoryId: menus.items[0].object_id,
        })
    }

    render() {
        const { menus, activeDomain } = this.props;
        return (
            <View style={styles.rootContainer}>
                <SafeAreaView style={styles.rootContainer} forceInset={{ top: 'always', horizontal: 'never' }}>
                    <ScrollView style={styles.container}>
                        {menus.header ?
                            <Image
                                source={{ uri: menus.header }}
                                style={{ width: 280, height: 70 }}
                                resizeMode='contain'
                            />
                            :
                            <Text
                                numberOfLines={2}
                                ellipsizeMode='tail'
                                style={{ fontSize: 20, fontWeight: 'bold', padding: 20 }}>
                                {activeDomain.name}
                            </Text>
                        }
                        <Searchbar
                            placeholder="Search Articles"
                            // onChangeText={query => { this.setState({ firstQuery: query }); }}
                            // value={firstQuery}
                        />
                        <Drawer.Section title="Categories">
                            {this.props.menus.items.map((item, index) => {
                                return (
                                    <Drawer.Item
                                        key={item.ID}
                                        label={item.title}
                                        active={this.state.activeMenuIndex === index}
                                        onPress={() => this._handleMenuPress(item, index)}
                                        icon={passedProps => {
                                            return DrawerNavIcon({
                                                ...passedProps,
                                                style: item.menu_icon_dir, name: item.menu_icon_name
                                            })
                                        }}
                                    />
                                )
                            })}
                        </Drawer.Section>
                        
                    </ScrollView>
                </SafeAreaView>
            </View>
        )
    }

    _handleMenuPress = (item, index) => {
        this.props.navigation.closeDrawer();
        if (item.object === 'category') {
            this._getArticles(item.object_id);
            this.props.navigation.navigate('List', {
                menuTitle: item.title,
                categoryId: item.object_id
            })
            this.setState({
                activeMenuIndex: index
            })
        }
        else if (item.object === 'page') {
            if (item.template === 'snostaff.php') {
                this.props.navigation.navigate('Staff', {
                    menuTitle: item.title,
                    activeYears: item.active_years
                })
                this.setState({
                    activeMenuIndex: index
                })
            }
            else {
                // redirect to page not found screen
                console.log('page not found');
            }
        }

    }


    _getArticles = (category) => {
        const { articlesByCategory } = this.props;
        this.props.dispatch(fetchArticlesIfNeeded({
            domain: this.props.activeDomain.url,
            category,
        }))
    }
}

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,

    },
    container: {
        flex: 1,
        backgroundColor: Colors.surface
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

const mapStateToProps = store => ({
    activeDomain: store.activeDomain,
    menus: store.menus,
    articlesByCategory: store.articlesByCategory
})


export default connect(mapStateToProps)(CustomDrawerComponent);