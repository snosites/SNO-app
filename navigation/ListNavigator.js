import React, { useLayoutEffect } from 'react'
import { Image, TouchableOpacity } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer'

import { connect } from 'react-redux'

import CustomDrawer from '../components/CustomDrawer'
import ListScreenContainer from '../containers/ListScreenContainer'

import { Ionicons } from '@expo/vector-icons'

import { Html5Entities } from 'html-entities'

const entities = new Html5Entities()

const Drawer = createDrawerNavigator()

const Stack = createStackNavigator()

const getActiveCategoryTitle = (menus, categoryId) => {
    const category = menus.find((menu) => menu.object_id == categoryId)
    if (category) {
        return category.title
    }
    return ''
}

const ListStack = (props) => {
    const { theme, headerLogo, activeCategoryTitle, navigation } = props

    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: theme.colors.primary,
                },
                headerTintColor: theme.primaryIsDark ? '#fff' : '#000',
                headerLeft: () => {
                    if (headerLogo) {
                        return (
                            <Image
                                source={{ uri: headerLogo }}
                                style={{ width: 60, height: 35, borderRadius: 7, marginLeft: 10 }}
                                resizeMode='contain'
                            />
                        )
                    }
                    return null
                },
                headerRight: () => {
                    return (
                        <TouchableOpacity
                            onPress={() => navigation.openDrawer()}
                            style={{ flex: 1, paddingHorizontal: 15 }}
                        >
                            <Ionicons
                                style={{
                                    justifyContent: 'center',
                                    alignItems: 'stretch',
                                }}
                                name={'ios-menu'}
                                size={35}
                                style={{ marginBottom: -3 }}
                                color={theme.primaryIsDark ? '#fff' : '#000'}
                            />
                        </TouchableOpacity>
                    )
                },
                headerBackTitleVisible: false,
                headerTitleAlign: 'center',
            }}
        >
            <Stack.Screen
                name='List'
                component={ListScreenContainer}
                options={{ title: entities.decode(activeCategoryTitle) }}
            />
        </Stack.Navigator>
    )
}

const mapStateToProps = (state) => ({
    theme: state.theme,
    headerLogo: state.global.headerSmall,
    activeCategoryTitle: getActiveCategoryTitle(
        state.global.menuItems,
        state.global.activeCategory
    ),
})

const ConnectedListStack = connect(mapStateToProps)(ListStack)

const DrawerNavigator = ({ theme }) => {
    return (
        <Drawer.Navigator
            hideStatusBar={true}
            statusBarAnimation={true}
            drawerStyle={{
                backgroundColor: theme.colors.surface,
                width: 280,
            }}
            drawerContent={(props) => <CustomDrawer {...props} />}
        >
            <Drawer.Screen name='ListStack' component={ConnectedListStack} />
        </Drawer.Navigator>
    )
}

export default connect(mapStateToProps)(DrawerNavigator)
