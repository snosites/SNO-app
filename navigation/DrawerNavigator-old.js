import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'

import { connect } from 'react-redux'

import CustomDrawer from '../components/CustomDrawer'
import ArticleStackContainer from '../containers/ArticleStackContainer'

const Drawer = createDrawerNavigator()

export default ({ theme }) => {
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
            <Drawer.Screen name='DrawerHome' component={ArticleStackContainer} />
        </Drawer.Navigator>
    )
}

const mapStateToProps = (state) => ({
    theme: state.theme,
})

export default connect(mapStateToProps)(DrawerNavigator)
