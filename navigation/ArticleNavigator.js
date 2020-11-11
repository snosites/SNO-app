import React from 'react'
import { TouchableOpacity, Image, Text } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import * as Icon from '@expo/vector-icons'
import { connect } from 'react-redux'

import ArticleNavigatorHeader from '../components/ArticleNavigatorHeader'
import TestScreen from '../screens/TestScreen'

import HTML from 'react-native-render-html'

const Stack = createStackNavigator()

const ArticleNavigator = (props) => {
    const { homeScreenMode, theme, activeCategory, navigation, route } = props

    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: theme.colors.primary,
                },
                headerTintColor: theme.primaryIsDark ? '#fff' : '#000',
                headerBackTitleVisible: false,
                headerTitleAlign: 'center',
                headerTitle: () => <ArticleNavigatorHeader route={route} navigation={navigation} />,
            }}
        >
            <Stack.Screen name='Article' component={TestScreen} />
            <Stack.Screen name='Comments' component={TestScreen} />
        </Stack.Navigator>
    )
}
const mapStateToProps = (state) => ({
    theme: state.theme,
})

export default connect(mapStateToProps)(ArticleNavigator)
