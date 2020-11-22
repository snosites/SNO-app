import React from 'react'
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native'
import Moment from 'moment'
import Color from 'color'

import { NavigationEvents } from 'react-navigation'

import LottieView from 'lottie-react-native'
import { DataTable, Card, Button, Modal, Portal, RadioButton } from 'react-native-paper'

import { Ionicons } from '@expo/vector-icons'
import HeaderButtons, { HeaderButton, Item } from 'react-navigation-header-buttons'
import moment from 'moment'

class SportcenterScreen extends React.Component {
    static navigationOptions = ({ navigation, screenProps }) => {
        const { theme } = screenProps
        let primaryColor = Color(theme.colors.primary)
        let isDark = primaryColor.isDark()
        const logo = navigation.getParam('headerLogo', null)
        return {
            title: 'Sports Center',
            headerLeft: logo && (
                <Image
                    source={{ uri: logo }}
                    style={{ width: 60, height: 30, borderRadius: 7, marginLeft: 10 }}
                    resizeMode='cover'
                />
            ),
            headerTitleAlign: 'center',
        }
    }

    state = {
        selectedButton: 'game_schedule',
        sportcenterOptions: { sports: [], years: [] },
        selectedSport: null,
        selectedYear: null,
        data: [],
        modalVisible: false,
        doneLoading: false,
        noSports: false,
        tabLoading: false,
    }

    _showModal = () => this.setState({ modalVisible: true })
    _hideModal = () => this.setState({ modalVisible: false })

    componentDidMount() {
        const { navigation, global } = this.props
        navigation.setParams({
            headerLogo: global.headerSmall,
        })

        if (this.animation) {
            this._playAnimation()
        }

        this._loadOptions()
    }

    _renderEmptyText = () => {
        if (this.state.selectedButton === 'game_schedule') {
            return 'There is no schedule for the selected sport and year'
        } else if (this.state.selectedButton === 'athlete') {
            return 'There is no roster for the selected sport and year'
        } else {
            return 'There are no standings for the selected sport and year'
        }
    }

    render() {
        const { navigation, theme } = this.props
        const { selectedYear, selectedSport, doneLoading, noSports } = this.state

        if (!doneLoading) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={styles.animationContainer}>
                        <LottieView
                            ref={(animation) => {
                                this.animation = animation
                            }}
                            style={{
                                width: 250,
                                height: 250,
                            }}
                            loop={true}
                            speed={0.8}
                            autoPlay={true}
                            source={require('../assets/lottiefiles/circle-loader')}
                        />
                    </View>
                </View>
            )
        }
        if (noSports) {
            return (
                <View
                    style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}
                >
                    <Text style={{ fontSize: 28, textAlign: 'center' }}>
                        There are currently no sports added to Sport Center
                    </Text>
                </View>
            )
        }
        return (
            <View style={{ flex: 1 }}>
                <Button
                    icon='chevron-right'
                    mode='text'
                    onPress={this._showModal}
                    color='black'
                    style={{ margin: 20 }}
                >
                    <Text
                        style={{
                            fontSize: 28,
                            textAlign: 'center',
                            paddingTop: 10,
                            paddingBottom: 10,
                        }}
                    >
                        {selectedSport === 'all'
                            ? `All Sports ${selectedYear}`
                            : `${selectedSport} ${selectedYear}`}
                    </Text>
                </Button>
                {this.state.selectedSport === 'all' ? (
                    <Text
                        style={{
                            fontSize: 14,
                            textAlign: 'center',
                            paddingBottom: 10,
                            color: theme.colors.gray,
                        }}
                    >
                        Select a sport to view the full schedule and toggle between other options
                    </Text>
                ) : null}
                {/* <View style={{ flexDirection: 'row' }}> */}
                <View style={{ flex: 1 }}>
                    <View>
                        <ScrollView
                            directionalLockEnabled={true}
                            horizontal={true}
                            contentContainerStyle={{
                                justifyContent: 'center',
                                flex: 1,
                            }}
                        >
                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                <Button
                                    icon='calendar'
                                    mode={
                                        this.state.selectedButton === 'game_schedule'
                                            ? 'contained'
                                            : 'outlined'
                                    }
                                    onPress={() => this._handleTabChange('game_schedule')}
                                >
                                    Schedule
                                </Button>
                                <Button
                                    disabled={this.state.selectedSport === 'all'}
                                    icon='view-day'
                                    mode={
                                        this.state.selectedButton === 'athlete'
                                            ? 'contained'
                                            : 'outlined'
                                    }
                                    onPress={() => this._handleTabChange('athlete')}
                                >
                                    Roster
                                </Button>
                                <Button
                                    icon='trending-up'
                                    disabled={this.state.selectedSport === 'all'}
                                    mode={
                                        this.state.selectedButton === 'standing'
                                            ? 'contained'
                                            : 'outlined'
                                    }
                                    onPress={() => this._handleTabChange('standing')}
                                >
                                    Standings
                                </Button>
                            </View>
                        </ScrollView>
                    </View>
                    <ScrollView style={{ flex: 1 }}>
                        {this.state.tabLoading ? (
                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    paddingTop: 50,
                                }}
                            >
                                <ActivityIndicator />
                            </View>
                        ) : (
                            <View style={{ flex: 1, marginVertical: 20 }}>
                                {this.state.data.length === 0 ? (
                                    <View
                                        style={{
                                            margin: 10,
                                            marginHorizontal: 20,
                                            padding: 20,
                                            paddingHorizontal: 20,
                                            backgroundColor: '#F1F1F1',
                                            borderRadius: 15,
                                        }}
                                    >
                                        <Text style={{ fontSize: 18, textAlign: 'center' }}>
                                            {this._renderEmptyText()}
                                        </Text>
                                    </View>
                                ) : this.state.selectedButton === 'standing' ? (
                                    <View>
                                        <Text
                                            style={{
                                                fontSize: 18,
                                                fontWeight: 'bold',
                                                paddingTop: 15,
                                                paddingLeft: 20,
                                            }}
                                        >
                                            Conference Standings
                                        </Text>
                                        {this.state.data.map((game, i) =>
                                            this._renderStandingItem(game, i, 'conference')
                                        )}
                                        <Text
                                            style={{
                                                fontSize: 18,
                                                fontWeight: 'bold',
                                                paddingTop: 20,
                                                paddingLeft: 20,
                                            }}
                                        >
                                            State Rankings
                                        </Text>
                                        {this.state.data.map((game, i) =>
                                            this._renderStandingItem(game, i, 'state')
                                        )}
                                    </View>
                                ) : this.state.selectedSport === 'all' ? (
                                    <View style={{ flex: 1 }}>
                                        <Text
                                            style={{
                                                fontSize: 18,
                                                fontWeight: 'bold',
                                                paddingTop: 20,
                                                paddingLeft: 20,
                                            }}
                                        >
                                            Recent Results
                                        </Text>
                                        {[...this.state.data]
                                            .reverse()
                                            .map((game, i) =>
                                                this._renderAllItem(game, i, 'previous')
                                            )}
                                        <Text
                                            style={{
                                                fontSize: 18,
                                                fontWeight: 'bold',
                                                paddingTop: 20,
                                                paddingLeft: 20,
                                            }}
                                        >
                                            Upcoming
                                        </Text>
                                        {this.state.data.map((game, i) =>
                                            this._renderAllItem(game, i, 'upcoming')
                                        )}
                                    </View>
                                ) : (
                                    this.state.data.map((game, i) => this._renderItem(game, i))
                                )}
                            </View>
                        )}
                    </ScrollView>
                </View>
                {/* <View style={{ flex: 1 }} /> */}
                <Portal>
                    <Modal
                        visible={this.state.modalVisible}
                        onDismiss={this._hideModal}
                        contentContainerStyle={{
                            flex: 1,
                            marginVertical: 200,
                            margin: 50,
                            shadowColor: 'black',
                            shadowOffset: { width: 3, height: 3 },
                            shadowOpacity: 0.2,
                            shadowRadius: 5,
                        }}
                    >
                        <View
                            style={{
                                flex: 1,
                                padding: 20,
                                backgroundColor: '#F1F1F1',
                                borderRadius: 15,
                            }}
                        >
                            <ScrollView style={{ flex: 1 }}>
                                <Text
                                    style={{ fontSize: 21, textAlign: 'center', paddingBottom: 10 }}
                                >
                                    Select Sport and Year
                                </Text>
                                <Text style={{ fontSize: 18, paddingVertical: 10 }}>Sport</Text>
                                <RadioButton.Group
                                    onValueChange={(value) =>
                                        this.setState({ selectedSport: value })
                                    }
                                    value={this.state.selectedSport}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <RadioButton value={'all'} />
                                        <TouchableOpacity
                                            style={{ marginLeft: 10 }}
                                            onPress={() => this.setState({ selectedSport: 'all' })}
                                        >
                                            <Text>All Sports</Text>
                                        </TouchableOpacity>
                                    </View>
                                    {this.state.sportcenterOptions.sports.map((sport, i) => (
                                        <View
                                            key={i}
                                            style={{ flexDirection: 'row', alignItems: 'center' }}
                                        >
                                            <RadioButton value={sport.name} />
                                            <TouchableOpacity
                                                style={{ marginLeft: 10 }}
                                                onPress={() =>
                                                    this.setState({ selectedSport: sport.name })
                                                }
                                            >
                                                <Text>{sport.name}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                </RadioButton.Group>
                                <Text style={{ fontSize: 18, paddingVertical: 10, paddingTop: 20 }}>
                                    Year
                                </Text>
                                <RadioButton.Group
                                    onValueChange={(value) =>
                                        this.setState({ selectedYear: value })
                                    }
                                    value={this.state.selectedYear}
                                >
                                    {this.state.sportcenterOptions.years.map((year, i) => {
                                        return (
                                            <View
                                                key={i}
                                                style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <RadioButton value={year.name} />
                                                <TouchableOpacity
                                                    style={{ marginLeft: 10 }}
                                                    onPress={() =>
                                                        this.setState({ selectedYear: year.name })
                                                    }
                                                >
                                                    <Text>{year.name}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        )
                                    })}
                                </RadioButton.Group>
                            </ScrollView>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                <Button mode='text' onPress={this._hideModal} color='red'>
                                    Cancel
                                </Button>
                                <Button mode='text' onPress={this._handleModalClose} color='green'>
                                    Okay
                                </Button>
                            </View>
                        </View>
                    </Modal>
                </Portal>
            </View>
        )
    }

    _renderStandingItem = (game, i, type) => {
        const { customFields } = game

        if (type === 'conference') {
            return (
                <View key={`index-${i}`}>
                    <View
                        style={{
                            margin: 10,
                            marginHorizontal: 20,
                            padding: 20,
                            paddingHorizontal: 20,
                            backgroundColor: '#F1F1F1',
                            borderRadius: 15,
                        }}
                    >
                        <View style={styles.gameItem}>
                            <Text style={styles.textHeader}>School:</Text>
                            <Text>{customFields.school && customFields.school[0]}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.textHeader}>Conference:</Text>
                                <Text>
                                    {customFields.conferencewins && customFields.conferencewins[0]}-
                                    {customFields.conferencelosses &&
                                        customFields.conferencelosses[0]}
                                    {customFields.conference_ties &&
                                        '-' + customFields.conference_ties[0]}
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.textHeader}>Overall:</Text>
                                <Text>
                                    {customFields.totalwins && customFields.totalwins[0]}-
                                    {customFields.totallosses && customFields.totallosses[0]}
                                    {customFields.total_ties && '-' + customFields.total_ties[0]}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            )
        } else if (type === 'state') {
            return (
                <View key={`index-${i}`}>
                    <View
                        style={{
                            margin: 10,
                            marginHorizontal: 20,
                            padding: 20,
                            paddingHorizontal: 20,
                            backgroundColor: '#F1F1F1',
                            borderRadius: 15,
                        }}
                    >
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            }}
                        >
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.textHeader}>School:</Text>
                                <Text>{customFields.school && customFields.school[0]}</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.textHeader}>State Rank:</Text>
                                <Text>{customFields.staterank && customFields.staterank[0]}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            )
        }
    }

    _renderAllItem = (game, i, type) => {
        const { customFields } = game
        const { selectedButton, selectedSport } = this.state

        console.log(
            'in the render all',
            type,
            moment(customFields.date[0]),
            moment(customFields.date[0]).isBefore(moment())
        )

        if (type === 'previous') {
            if (customFields.date && moment(customFields.date[0]).isBefore(moment())) {
                return (
                    <View key={`index-${i}`}>
                        <View
                            style={{
                                margin: 10,
                                marginHorizontal: 20,
                                padding: 20,
                                paddingHorizontal: 20,
                                backgroundColor: '#F1F1F1',
                                borderRadius: 15,
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 5,
                                }}
                            >
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={styles.textHeader}>Date:</Text>
                                    <Text>
                                        {customFields.date &&
                                            Moment(customFields.date[0]).format('MMM Do, YYYY')}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={styles.textHeader}>Time:</Text>
                                    <Text>{customFields.time && customFields.time[0]}</Text>
                                </View>
                            </View>
                            <View style={styles.gameItem}>
                                <Text style={styles.textHeader}>Opponent:</Text>
                                <Text>{customFields.opponent && customFields.opponent[0]}</Text>
                            </View>
                            <View style={styles.gameItem}>
                                <Text style={styles.textHeader}>Location:</Text>
                                <Text>{customFields.location && customFields.location[0]}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={styles.gameItem}>
                                    <Text style={styles.textHeader}>Result:</Text>
                                    <Text>
                                        {customFields.ourscore &&
                                        customFields.ourscore[0] &&
                                        customFields.theirscore &&
                                        customFields.theirscore[0]
                                            ? `${customFields.ourscore[0]}-${customFields.theirscore[0]}`
                                            : ''}
                                    </Text>
                                </View>
                                {customFields.ourscore &&
                                customFields.ourscore[0] &&
                                customFields.theirscore &&
                                customFields.theirscore[0] ? (
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            marginLeft: 'auto',
                                            paddingBottom: 5,
                                        }}
                                    >
                                        <Text style={styles.textHeader}>W/L:</Text>
                                        <Text>
                                            {customFields.ourscore[0] > customFields.theirscore[0]
                                                ? 'W'
                                                : customFields.ourscore[0] ===
                                                  customFields.theirscore[0]
                                                ? 'Tie'
                                                : 'L'}
                                        </Text>
                                    </View>
                                ) : null}
                            </View>
                        </View>
                    </View>
                )
            }
        }
        if (type === 'upcoming') {
            if (customFields.date && moment(customFields.date[0]).isAfter(moment())) {
                return (
                    <View key={`index-${i}`}>
                        <View
                            style={{
                                margin: 10,
                                marginHorizontal: 20,
                                padding: 20,
                                paddingHorizontal: 20,
                                backgroundColor: '#F1F1F1',
                                borderRadius: 15,
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 5,
                                }}
                            >
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={styles.textHeader}>Date:</Text>
                                    <Text>
                                        {customFields.date &&
                                            Moment(customFields.date[0]).format('MMM Do, YYYY')}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={styles.textHeader}>Time:</Text>
                                    <Text>{customFields.time && customFields.time[0]}</Text>
                                </View>
                            </View>
                            <View style={styles.gameItem}>
                                <Text style={styles.textHeader}>Opponent:</Text>
                                <Text>{customFields.opponent && customFields.opponent[0]}</Text>
                            </View>
                            <View style={styles.gameItem}>
                                <Text style={styles.textHeader}>Location:</Text>
                                <Text>{customFields.location && customFields.location[0]}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={styles.gameItem}>
                                    <Text style={styles.textHeader}>Result:</Text>
                                    <Text>
                                        {customFields.ourscore &&
                                        customFields.ourscore[0] &&
                                        customFields.theirscore &&
                                        customFields.theirscore[0]
                                            ? `${customFields.ourscore[0]}-${customFields.theirscore[0]}`
                                            : ''}
                                    </Text>
                                </View>
                                {customFields.ourscore &&
                                customFields.ourscore[0] &&
                                customFields.theirscore &&
                                customFields.theirscore[0] ? (
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            marginLeft: 'auto',
                                            paddingBottom: 5,
                                        }}
                                    >
                                        <Text style={styles.textHeader}>W/L:</Text>
                                        <Text>
                                            {customFields.ourscore[0] > customFields.theirscore[0]
                                                ? 'W'
                                                : customFields.ourscore[0] ===
                                                  customFields.theirscore[0]
                                                ? 'Tie'
                                                : 'L'}
                                        </Text>
                                    </View>
                                ) : null}
                            </View>
                        </View>
                    </View>
                )
            }
        }
    }

    _renderItem = (game, i) => {
        const { customFields } = game
        const { selectedButton, selectedSport } = this.state

        if (selectedButton === 'game_schedule') {
            return (
                <View key={`index-${i}`}>
                    <View
                        style={{
                            margin: 10,
                            marginHorizontal: 20,
                            padding: 20,
                            paddingHorizontal: 20,
                            backgroundColor: '#F1F1F1',
                            borderRadius: 15,
                        }}
                    >
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginBottom: 5,
                            }}
                        >
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.textHeader}>Date:</Text>
                                <Text>
                                    {customFields.date &&
                                        Moment(customFields.date[0]).format('MMM Do, YYYY')}
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.textHeader}>Time:</Text>
                                <Text>{customFields.time && customFields.time[0]}</Text>
                            </View>
                        </View>
                        <View style={styles.gameItem}>
                            <Text style={styles.textHeader}>Opponent:</Text>
                            <Text>{customFields.opponent && customFields.opponent[0]}</Text>
                        </View>
                        <View style={styles.gameItem}>
                            <Text style={styles.textHeader}>Location:</Text>
                            <Text>{customFields.location && customFields.location[0]}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={styles.gameItem}>
                                <Text style={styles.textHeader}>Result:</Text>
                                <Text>
                                    {customFields.ourscore &&
                                    customFields.ourscore[0] &&
                                    customFields.theirscore &&
                                    customFields.theirscore[0]
                                        ? `${customFields.ourscore[0]}-${customFields.theirscore[0]}`
                                        : ''}
                                </Text>
                            </View>
                            {customFields.ourscore &&
                            customFields.ourscore[0] &&
                            customFields.theirscore &&
                            customFields.theirscore[0] ? (
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginLeft: 'auto',
                                        paddingBottom: 5,
                                    }}
                                >
                                    <Text style={styles.textHeader}>W/L:</Text>
                                    <Text>
                                        {customFields.ourscore[0] > customFields.theirscore[0]
                                            ? 'W'
                                            : customFields.ourscore[0] ===
                                              customFields.theirscore[0]
                                            ? 'Tie'
                                            : 'L'}
                                    </Text>
                                </View>
                            ) : null}
                        </View>
                    </View>
                </View>
            )
        } else if (selectedButton === 'athlete') {
            return (
                <View key={`index-${i}`}>
                    <View
                        style={{
                            margin: 10,
                            marginHorizontal: 20,
                            padding: 20,
                            paddingHorizontal: 20,
                            backgroundColor: '#F1F1F1',
                            borderRadius: 15,
                        }}
                    >
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginBottom: 5,
                            }}
                        >
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.textHeader}>Athlete Name:</Text>
                                <Text>{game.post_title}</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.textHeader}>Jersey #:</Text>
                                <Text>
                                    {customFields.roster_jersey && customFields.roster_jersey[0]}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.gameItem}>
                            <Text style={styles.textHeader}>Position:</Text>
                            <Text>
                                {customFields.roster_position && customFields.roster_position[0]}
                            </Text>
                        </View>
                        <View style={styles.gameItem}>
                            <Text style={styles.textHeader}>Grade:</Text>
                            <Text>{customFields.roster_grade && customFields.roster_grade[0]}</Text>
                        </View>
                    </View>
                </View>
            )
        }
    }

    _handleTabChange = (selectedTab) => {
        this.setState({ selectedButton: selectedTab, tabLoading: true })
        this._loadData(this.state.selectedYear, this.state.selectedSport, selectedTab)
    }

    _handleModalClose = () => {
        this._hideModal()
        this.setState({ doneLoading: false })
        this._loadData(this.state.selectedYear, this.state.selectedSport, this.state.selectedButton)
    }

    _loadOptions = async () => {
        const { activeDomain } = this.props
        const response = await fetch(
            `https://${activeDomain.url}/wp-json/sns-v2/sportcenter_options`,
            {
                headers: {
                    'Cache-Control': 'no-cache',
                },
            }
        )
        const options = await response.json()

        if (options.sports.length && options.years.length) {
            options.years.reverse()
            this.setState({
                sportcenterOptions: {
                    sports: options.sports,
                    years: options.years,
                },
                selectedSport: 'all',
                selectedYear: options.years[0].name,
            })
            this._loadData(options.years[0].name, 'all', this.state.selectedButton)
        } else {
            this.setState({ doneLoading: true, noSports: true })
        }
    }

    _loadData = async (year, sport, type) => {
        // if (sport === 'all') {
        //     console.log('in it', sport, year, type)
        //     this.setState({ data: [], doneLoading: true, tabLoading: false })
        //     return
        // }
        const { activeDomain } = this.props
        const response = await fetch(
            `https://${activeDomain.url}/wp-json/sns-v2/sportcenter_query?sport=${sport}&year=${year}&type=${type}`,
            {
                headers: {
                    'Cache-Control': 'no-cache',
                },
            }
        )
        const result = await response.json()
        console.log('this is game schedule', result)
        result.sort(function (a, b) {
            a = new Date(a.customFields.date && a.customFields.date[0])
            b = new Date(b.customFields.date && b.customFields.date[0])
            return a < b ? -1 : a > b ? 1 : 0
        })
        this.setState({ data: result, doneLoading: true, tabLoading: false })
    }

    _playAnimation = () => {
        this.animation.reset()
        this.animation.play()
    }
}

const styles = StyleSheet.create({
    yearContainer: {
        width: 125,
        margin: 5,
        borderRadius: 5,
        justifyContent: 'center',
    },
    animationContainer: {
        width: 300,
        height: 300,
        alignItems: 'center',
    },
    gameItem: {
        flexDirection: 'row',
        paddingBottom: 5,
    },
    textHeader: {
        fontSize: 15,
        fontWeight: 'bold',
        paddingRight: 10,
    },
})

export default SportcenterScreen
