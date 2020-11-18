import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { connect } from 'react-redux'

import ArticleScreenContainer from '../containers/ArticleScreenContainer'
import TestScreen from '../screens/TestScreen'

//TODO: Add comments screen

const Tab = createMaterialTopTabNavigator()

const ArticleNavigator = ({ theme, enableComments }) => {
    // const comments = route && route.params && route.params.comments ? route.params.comments : []
    // const articleId = route && route.params ? route.params.articleId : null
    if (enableComments) {
        return (
            <Tab.Navigator
                initialRouteName='Article'
                backBehavior='order'
                tabBarOptions={{ indicatorStyle: { backgroundColor: theme.colors.primary } }}
            >
                <Tab.Screen name='Article' component={ArticleScreenContainer} />
                <Tab.Screen name='Comments' component={TestScreen} />
            </Tab.Navigator>
        )
    }
    return <ArticleScreenContainer />
}

const mapStateToProps = (state) => ({
    theme: state.theme,
    enableComments: state.global.enableComments,
})

export default connect(mapStateToProps)(ArticleNavigator)
