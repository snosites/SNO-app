import React, { useState, useEffect } from 'react'
import { ScrollView, StyleSheet, Text, View, Image } from 'react-native'
import { Drawer, Colors, Searchbar } from 'react-native-paper'
import HTML from 'react-native-render-html'

import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer'

import { actions as articlesActions } from '../redux/articles'
import { actions as searchActions } from '../redux/search'
import { getActiveDomain } from '../redux/domains'
import { actions as globalActions } from '../redux/global'

import { SafeAreaView } from 'react-navigation'
import DrawerIcon from './DrawerIcon'
import { connect } from 'react-redux'

import * as Amplitude from 'expo-analytics-amplitude'

function CustomDrawerContent(props) {
    const {
        navigation,
        invalidateSearchArticles,
        fetchSearchArticlesIfNeeded,
        fetchArticlesIfNeeded,
        menus,
        activeDomain,
        global,
        setActiveCategory,
    } = props

    useEffect(() => {
        navigation.openDrawer()
    }, [])

    const [searchTerm, setSearchTerm] = useState('')
    // const [activeMenuIndex, setActiveMenuIndex] = useState(0)

    _searchArticles = () => {
        invalidateSearchArticles()
        fetchSearchArticlesIfNeeded(activeDomain.url, searchTerm)
        // navigation.navigate('Search', {
        //     searchTerm,
        // })
        // navigation.closeDrawer()
        setSearchTerm('')
    }

    _handleMenuPress = (item, index) => {
        navigation.closeDrawer()
        if (item.object === 'category') {
            console.log('category page', item)
            // log category press to analytics
            Amplitude.logEventWithProperties('click category', {
                categoryId: item.object_id,
            })

            fetchArticlesIfNeeded(activeDomain.url, item.object_id)
            // navigation.navigate('List', {
            //     menuTitle: item.title,
            //     categoryId: item.object_id,
            // })

            // setActiveMenuIndex(index)
            setActiveCategory(item.object_id)
        } else if (item.object === 'page') {
            if (item.template === 'snostaff.php') {
                console.log('staff page', item)
                // log to analytics
                Amplitude.logEventWithProperties('click page', {
                    pageType: 'staff',
                })

                // navigation.navigate('Staff', {
                //     menuTitle: item.title,
                //     activeYears: item.active_years,
                //     customDisplay: item.customStaffDisplay,
                //     staffDisplay: item.staffDisplay,
                // })
                setActiveCategory(item.object_id)
            } else if (!item.template) {
                // default template
                console.log('page default template')
                // navigation.navigate('DefaultPage', {
                //     menuTitle: item.title,
                //     pageId: item.object_id,
                // })
                setActiveCategory(item.object_id)
            } else {
                // redirect to page not found screen later
                console.log('page not found')
                return
            }
        }
    }

    return (
        <DrawerContentScrollView {...props}>
            {/* <DrawerItemList {...props} /> */}
            {global.header ? (
                <Image
                    source={{ uri: global.header }}
                    style={{ width: 280, height: 70 }}
                    resizeMode='contain'
                />
            ) : (
                <Text
                    numberOfLines={2}
                    ellipsizeMode='tail'
                    style={{ fontSize: 20, fontFamily: 'openSansBold', padding: 20 }}
                >
                    {activeDomain.publication}
                </Text>
            )}
            <Searchbar
                placeholder='Search Articles'
                onIconPress={_searchArticles}
                onSubmitEditing={_searchArticles}
                onChangeText={(query) => setSearchTerm(query)}
                value={searchTerm}
            />
            <Drawer.Section title='Categories' style={{ paddingTop: 10 }}>
                {menus.map((item, index) => {
                    return (
                        <DrawerItem
                            key={item.ID}
                            label={() => {
                                return (
                                    <HTML
                                        html={item.title}
                                        customWrapper={(text) => {
                                            return (
                                                <Text ellipsizeMode='tail' numberOfLines={1}>
                                                    {text}
                                                </Text>
                                            )
                                        }}
                                    />
                                )
                            }}
                            onPress={() => _handleMenuPress(item, index)}
                            focused={global.activeCategory == item.object_id}
                            activeTintColor={'green'}
                            icon={({ focused, color, size }) => (
                                <DrawerIcon
                                    color={color}
                                    size={size}
                                    name={item.menu_icon_name}
                                    iconFamily={item.menu_icon_dir}
                                />
                            )}
                        />
                    )
                })}
            </Drawer.Section>
        </DrawerContentScrollView>
    )
}

// class CustomDrawerComponent extends React.Component {
//     state = {
//         activeMenuIndex: 0,
//         searchTerm: '',
//     }

//     render() {
//         const { menus, activeDomain, globals, setActiveCategory } = this.props
//         return (
//             <View style={styles.rootContainer}>
//                 <SafeAreaView
//                     style={styles.rootContainer}
//                     forceInset={{ top: 'always', horizontal: 'never' }}
//                 >
//                     <ScrollView style={styles.container}></ScrollView>
//                 </SafeAreaView>
//             </View>
//         )
//     }
// }

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
    global: state.global,
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

export default connect(mapStateToProps, mapDispatchToProps)(CustomDrawerContent)
