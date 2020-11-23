import React, { useState, useEffect } from 'react'
import { ScrollView, StyleSheet, Text, View, Image } from 'react-native'
import { Drawer, Colors, Searchbar } from 'react-native-paper'
import HTML from 'react-native-render-html'

import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer'

import { actions as articlesActions } from '../redux/articles'
import { getActiveDomain } from '../redux/domains'
import { actions as globalActions } from '../redux/global'

import DrawerIcon from './DrawerIcon'
import { connect } from 'react-redux'

import * as Amplitude from 'expo-analytics-amplitude'
import theme from '../redux/theme'

const CustomDrawerContent = (props) => {
    const {
        navigation,
        theme,
        fetchArticlesIfNeeded,
        menus,
        activeDomain,
        global,
        setActiveCategory,
    } = props

    const _handleMenuPress = (item, index) => {
        navigation.closeDrawer()
        if (item.object === 'category') {
            // log category press to analytics
            Amplitude.logEventWithProperties('click category', {
                categoryId: item.object_id,
            })

            fetchArticlesIfNeeded(activeDomain.url, item.object_id)

            //TODO: scroll back to top with category switch
            navigation.navigate('List')
            setActiveCategory(item.object_id)
        } else if (item.object === 'page') {
            if (item.template === 'snostaff.php') {
                // log to analytics
                Amplitude.logEventWithProperties('click page', {
                    pageType: 'staff',
                })

                navigation.navigate('Staff', {
                    title: item.title,
                    activeYears: item.active_years,
                    customDisplay: item.customStaffDisplay,
                    staffDisplay: item.staffDisplay,
                })
                setActiveCategory(item.object_id)
            } else {
                console.log('item', item)
                navigation.navigate('DefaultPage', {
                    pageId: item.object_id,
                })

                // navigation.navigate('DefaultPage', {
                //     menuTitle: item.title,
                //     pageId: item.object_id,
                // })
                setActiveCategory(item.object_id)
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
                    style={{
                        fontSize: 20,
                        fontFamily: 'ralewayBold',
                        padding: 20,
                        color: theme.colors.text,
                        textAlign: 'center',
                    }}
                >
                    {activeDomain.publication}
                </Text>
            )}
            <Drawer.Section style={{ paddingTop: 10 }}>
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
                                                <Text
                                                    ellipsizeMode='tail'
                                                    numberOfLines={1}
                                                    style={{ color: theme.colors.text }}
                                                >
                                                    {text}
                                                </Text>
                                            )
                                        }}
                                    />
                                )
                            }}
                            onPress={() => _handleMenuPress(item, index)}
                            focused={global.activeCategory == item.object_id}
                            activeTintColor={theme.colors.accent}
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

const mapStateToProps = (state) => ({
    activeDomain: getActiveDomain(state),
    menus: state.global.menuItems,
    global: state.global,
    theme: state.theme,
})

const mapDispatchToProps = (dispatch) => ({
    fetchArticlesIfNeeded: (domainUrl, category) =>
        dispatch(
            articlesActions.fetchArticlesIfNeeded({
                domain: domainUrl,
                category,
            })
        ),
    setActiveCategory: (categoryId) => dispatch(globalActions.setActiveCategory(categoryId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(CustomDrawerContent)
