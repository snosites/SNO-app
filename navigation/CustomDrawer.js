import React from 'react'
import { ScrollView, StyleSheet, Text, View, Image } from 'react-native'
import { Drawer, Colors, Searchbar } from 'react-native-paper'
import HTML from 'react-native-render-html'

import { actions as articlesActions } from '../redux/articles'
import { actions as searchActions } from '../redux/search'
import { getActiveDomain } from '../redux/domains'
import { actions as globalActions } from '../redux/global'

import { SafeAreaView } from 'react-navigation'
import DrawerNavIcon from '../components/DrawerNavIcon'
import { connect } from 'react-redux'

import * as Amplitude from 'expo-analytics-amplitude'

class CustomDrawerComponent extends React.Component {
    state = {
        activeMenuIndex: 0,
        searchTerm: '',
    }

    // componentDidMount() {
    //     const { menus } = this.props
    //     if (menus.length > 0) {
    //         this.props.navigation.navigate('List', {
    //             menuTitle: menus[0].title,
    //             categoryId: menus[0].object_id,
    //         })
    //     }
    // }

    render() {
        const { menus, activeDomain, globals, setActiveCategory } = this.props
        return (
            <View style={styles.rootContainer}>
                <SafeAreaView
                    style={styles.rootContainer}
                    forceInset={{ top: 'always', horizontal: 'never' }}
                >
                    <ScrollView style={styles.container}>
                        {globals.header ? (
                            <Image
                                source={{ uri: globals.header }}
                                style={{ width: 280, height: 70 }}
                                resizeMode='contain'
                            />
                        ) : (
                            <Text
                                numberOfLines={2}
                                ellipsizeMode='tail'
                                style={{ fontSize: 20, fontWeight: 'bold', padding: 20 }}
                            >
                                {activeDomain.publication}
                            </Text>
                        )}
                        <Searchbar
                            placeholder='Search Articles'
                            onIconPress={this._searchArticles}
                            onSubmitEditing={this._searchArticles}
                            onChangeText={(query) => {
                                this.setState({ searchTerm: query })
                            }}
                            value={this.state.searchTerm}
                        />
                        <Drawer.Section title='Categories'>
                            {menus.map((item, index) => {
                                return (
                                    <Drawer.Item
                                        key={item.ID}
                                        label={
                                            <HTML
                                                html={item.title}
                                                customWrapper={(text) => {
                                                    return (
                                                        <Text
                                                            ellipsizeMode='tail'
                                                            numberOfLines={1}
                                                        >
                                                            {text}
                                                        </Text>
                                                    )
                                                }}
                                            />
                                        }
                                        active={globals.activeCategory == item.object_id}
                                        onPress={() => this._handleMenuPress(item, index)}
                                        icon={(passedProps) => {
                                            return DrawerNavIcon({
                                                ...passedProps,
                                                style: item.menu_icon_dir,
                                                name: item.menu_icon_name,
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

    _searchArticles = () => {
        const {
            activeDomain,
            navigation,
            invalidateSearchArticles,
            fetchSearchArticlesIfNeeded,
        } = this.props
        const { searchTerm } = this.state
        invalidateSearchArticles()
        fetchSearchArticlesIfNeeded(activeDomain.url, searchTerm)
        navigation.navigate('Search', {
            searchTerm,
        })
        navigation.closeDrawer()
        this.setState({
            searchTerm: '',
        })
    }

    _handleMenuPress = (item, index) => {
        const { setActiveCategory } = this.props
        this.props.navigation.closeDrawer()
        if (item.object === 'category') {
            // log category press to analytics
            Amplitude.logEventWithProperties('click category', {
                categoryId: item.object_id,
            })

            this._getArticles(item.object_id)
            this.props.navigation.navigate('List', {
                menuTitle: item.title,
                categoryId: item.object_id,
            })
            this.setState({
                activeMenuIndex: index,
            })
            setActiveCategory(item.object_id)
        } else if (item.object === 'page') {
            if (item.template === 'snostaff.php') {
                console.log('staff page', item)
                // log to analytics
                Amplitude.logEventWithProperties('click page', {
                    pageType: 'staff',
                })

                this.props.navigation.navigate('Staff', {
                    menuTitle: item.title,
                    activeYears: item.active_years,
                    customDisplay: item.customStaffDisplay,
                    staffDisplay: item.staffDisplay,
                })
                this.setState({
                    activeMenuIndex: index,
                })
                setActiveCategory(item.object_id)
            } else if (!item.template) {
                // default template
                this.props.navigation.navigate('DefaultPage', {
                    menuTitle: item.title,
                    pageId: item.object_id,
                })
                this.setState({
                    activeMenuIndex: index,
                })
                setActiveCategory(item.object_id)
            } else {
                // redirect to page not found screen later
                console.log('page not found')
                return
            }
        }
    }

    _getArticles = (category) => {
        const { fetchArticlesIfNeeded, activeDomain } = this.props
        fetchArticlesIfNeeded(activeDomain.url, category)
    }
}

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: Colors.surface,
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
        fontSize: 21,
    },
})

const mapStateToProps = (state) => ({
    activeDomain: getActiveDomain(state),
    menus: state.global.menuItems,
    articlesByCategory: state.articlesByCategory,
    globals: state.global,
})

const mapDispatchToProps = (dispatch) => ({
    fetchArticlesIfNeeded: (domainUrl, category) =>
        dispatch(
            articlesActions.fetchArticlesIfNeeded({
                domain: domainUrl,
                category,
            })
        ),
    fetchSearchArticlesIfNeeded: (domainUrl, searchTerm) =>
        dispatch(searchActions.fetchSearchArticlesIfNeeded(domainUrl, searchTerm)),
    invalidateSearchArticles: () => dispatch(searchActions.invalidateSearchArticles()),
    setActiveCategory: (categoryId) => dispatch(globalActions.setActiveCategory(categoryId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(CustomDrawerComponent)
