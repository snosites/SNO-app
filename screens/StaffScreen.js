import React from 'react'
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    Image,
    ActivityIndicator,
    FlatList
} from 'react-native'
import Moment from 'moment'
import Color from 'color'
import { connect } from 'react-redux'

import { actions as profileActions } from '../redux/profiles'
import { getActiveDomain } from '../redux/domains'

import { NavigationEvents } from 'react-navigation'

import LottieView from 'lottie-react-native'
import { Colors as PaperColors, Card, Button } from 'react-native-paper'
import Colors from '../constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import HeaderButtons, { HeaderButton, Item } from 'react-navigation-header-buttons'

// header icon native look component
const IoniconsHeaderButton = passMeFurther => (
    <HeaderButton
        {...passMeFurther}
        IconComponent={Ionicons}
        iconSize={30}
        color={Colors.tintColor}
    />
)

class StaffScreen extends React.Component {
    static navigationOptions = ({ navigation, screenProps }) => {
        const { theme } = screenProps
        let primaryColor = Color(theme.colors.primary)
        let isDark = primaryColor.isDark()
        const logo = navigation.getParam('headerLogo', null)
        return {
            title: navigation.getParam('menuTitle', 'Staff'),
            headerRight: (
                <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
                    <Item
                        title='menu'
                        iconName='ios-menu'
                        buttonStyle={{ color: isDark ? 'white' : 'black' }}
                        onPress={() => navigation.openDrawer()}
                    />
                </HeaderButtons>
            ),
            headerLeft: logo && (
                <Image
                    source={{ uri: logo }}
                    style={{ width: 60, height: 30, borderRadius: 7, marginLeft: 10 }}
                    resizeMode='cover'
                />
            )
        }
    }

    state = {
        activeYears: [],
        selectedIndex: 0,
        doneLoading: false
    }

    componentDidMount() {
        const { navigation, global } = this.props
        navigation.setParams({
            headerLogo: global.headerSmall
        })
        let yearsParam = navigation.getParam('activeYears', [])
        let customDisplay = navigation.getParam('customDisplay', null)
        let staffDisplay = navigation.getParam('staffDisplay', null)

        let years = []
        if (yearsParam && !Array.isArray(yearsParam)) {
            Object.keys(yearsParam).map(objKey => {
                years.push(yearsParam[objKey])
            })
        } else {
            years = yearsParam
        }

        let sortedYears = years.sort()
        let indexNum
        if (customDisplay) {
            indexNum = sortedYears.indexOf(staffDisplay)
        } else {
            const thisYear = Moment().year()
            const nextYear = Moment()
                .add(1, 'y')
                .format('YYYY')
            const thisMonth = Moment().month()
            if (thisMonth >= Number(staffDisplay - 1)) {
                indexNum = years.findIndex(year => {
                    return year.includes(thisYear && nextYear)
                })
            } else {
                indexNum = years.findIndex(year => {
                    return year.includes(thisYear)
                })
            }
        }

        this.setState({
            activeYears: sortedYears,
            selectedIndex: indexNum
        })
        if (this.animation) {
            this._playAnimation()
        }
        // needed for ref of flatlist to be available in did mount
        // setTimeout(() => {
        //     this._scrollToIndex(indexNum);
        // }, 500)
        setTimeout(() => {
            this.setState({
                doneLoading: true
            })
        }, 2000)
        this._getProfiles(years[indexNum])
    }

    render() {
        const { navigation, profiles, theme } = this.props
        const { activeYears, selectedIndex, doneLoading } = this.state

        if (!doneLoading) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={styles.animationContainer}>
                        <LottieView
                            ref={animation => {
                                this.animation = animation
                            }}
                            style={{
                                width: 300,
                                height: 300
                            }}
                            loop={true}
                            speed={0.8}
                            autoPlay={true}
                            source={require('../assets/lottiefiles/simple-loader-dots')}
                        />
                    </View>
                </View>
            )
        }
        return (
            <View style={{ flex: 1 }}>
                <View>
                    <FlatList
                        data={activeYears}
                        extraData={this.state.selectedIndex}
                        ref={ref => {
                            this.flatListRef = ref
                        }}
                        initialScrollIndex={selectedIndex}
                        keyExtractor={item => item}
                        horizontal={true}
                        renderItem={this._renderItem}
                        getItemLayout={(data, index) => ({
                            length: 155,
                            offset: 155 * index,
                            index
                        })}
                    />
                </View>
                {profiles.isLoaded ? (
                    <ScrollView style={{ flex: 1 }}>
                        <NavigationEvents
                        // onWillFocus={payload => this._loadProfile(payload)}
                        />
                        <Text
                            style={{
                                fontSize: 30,
                                textAlign: 'center',
                                paddingTop: 20,
                                paddingBottom: 10
                            }}
                        >
                            Staff Profiles
                        </Text>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                flexWrap: 'wrap'
                            }}
                        >
                            {profiles.items.map(profile => {
                                // const temp = profile.schoolYears.filter(schoolyear => {
                                //     return schoolyear === activeYears[selectedIndex]
                                // })
                                // if (temp.length > 0) {
                                return (
                                    <View
                                        key={profile.ID}
                                        style={{ padding: 20, alignItems: 'center', width: 175 }}
                                    >
                                        {profile.featuredImage ? (
                                            <Image
                                                source={{ uri: profile.featuredImage }}
                                                style={{
                                                    width: 150,
                                                    height: 150,
                                                    borderRadius: 75
                                                }}
                                            />
                                        ) : (
                                            <Image
                                                source={require('../assets/images/anon.png')}
                                                style={{
                                                    width: 150,
                                                    height: 150,
                                                    borderRadius: 75
                                                }}
                                            />
                                        )}
                                        <Text
                                            style={{
                                                textAlign: 'center',
                                                fontSize: 25,
                                                paddingTop: 10
                                            }}
                                            numberOfLines={2}
                                            ellipsizeMode='tail'
                                        >
                                            {profile.post_title}
                                        </Text>
                                        <Text style={{ fontSize: 18, color: 'grey' }}>
                                            {profile.post_excerpt}
                                        </Text>
                                        <Button
                                            mode='contained'
                                            color={theme.colors.accent}
                                            style={{ borderRadius: 4, margin: 5 }}
                                            onPress={() => this._handleProfileClick(profile.ID)}
                                        >
                                            View
                                        </Button>
                                    </View>
                                )
                            })}
                        </View>
                    </ScrollView>
                ) : (
                    <View style={{ justifyContent: 'center', paddingTop: 20 }}>
                        <ActivityIndicator />
                    </View>
                )}
            </View>
        )
    }

    _getProfiles = year => {
        const { activeDomain, fetchProfiles } = this.props
        const url = activeDomain.url
        fetchProfiles(url, year)
    }

    _scrollToIndex = index => {
        this.flatListRef.scrollToIndex({ animated: true, index: index, viewPosition: 0.5 })
    }

    _handleProfileClick = id => {
        const { navigation } = this.props
        navigation.navigate('Profile', {
            writerId: id
        })
    }

    _renderItem = ({ item, index }) => {
        const { activeYears, selectedIndex } = this.state
        const { theme } = this.props
        let accentColor = Color(theme.colors.accent)
        let isDark = accentColor.isDark()
        return (
            <Card
                key={index}
                style={
                    selectedIndex === index
                        ? [
                              styles.yearContainer,
                              { backgroundColor: accentColor, color: isDark ? 'white' : 'dark' }
                          ]
                        : styles.yearContainer
                }
                onPress={() => {
                    this.setState({
                        selectedIndex: index
                    })
                    this._scrollToIndex(index)
                    this._getProfiles(activeYears[index])
                }}
            >
                <Card.Content>
                    <Text
                        style={
                            selectedIndex === index
                                ? [{ fontSize: 18 }, { color: isDark ? 'white' : 'black' }]
                                : { fontSize: 18 }
                        }
                    >
                        {item}
                    </Text>
                </Card.Content>
            </Card>
        )
    }

    _playAnimation = () => {
        this.animation.reset()
        this.animation.play()
    }
}

const styles = StyleSheet.create({
    yearContainer: {
        width: 155,
        margin: 5,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    animationContainer: {
        width: 300,
        height: 300,
        alignItems: 'center'
    }
})

const mapStateToProps = state => {
    return {
        theme: state.theme,
        activeDomain: getActiveDomain(state),
        global: state.global,
        profiles: state.profiles
    }
}

const mapDispatchToProps = dispatch => ({
    fetchProfiles: (domainUrl, year) => dispatch(profileActions.fetchProfiles(domainUrl, year))
})

export default connect(mapStateToProps, mapDispatchToProps)(StaffScreen)
