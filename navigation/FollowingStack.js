import React from 'react'
import { Image } from 'react-native'
import { connect } from 'react-redux'
import { createStackNavigator } from '@react-navigation/stack'

import FollowingScreenContainer from '../containers/screens/FollowingScreenContainer'
import SearchAuthorsScreenContainer from '../containers/screens/SearchAuthorsScreenContainer'

import Searchbar from '../components/SearchBar'

const Stack = createStackNavigator()

const FollowingStack = (props) => {
    const { theme, headerLogo } = props

    return (
        <Stack.Navigator
            screenOptions={({ navigation }) => ({
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
                headerBackTitleVisible: false,
                headerTitleAlign: 'center',
                headerTitle: () => (
                    <Searchbar
                        navigation={navigation}
                        placeholder='Search Authors'
                        authors={true}
                    />
                ),
            })}
        >
            <Stack.Screen name='Following' component={FollowingScreenContainer} />
            <Stack.Screen
                name='SearchAuthors'
                component={SearchAuthorsScreenContainer}
                // options={{ title: 'Recent Stories' }}
            />
        </Stack.Navigator>
    )
}

const mapStateToProps = (state) => ({
    theme: state.theme,
    headerLogo: state.global.headerSmall,
})

export default connect(mapStateToProps)(FollowingStack)
