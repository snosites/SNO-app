import React from 'react'
import { ScrollView, View, Text, Modal, SafeAreaView, Platform } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import * as Haptics from 'expo-haptics'
import { connect } from 'react-redux'
import { Button, List, Divider } from 'react-native-paper'
import { actions as domainActions } from '../redux/domains'

class ErrorScreen extends React.Component {
    static navigationOptions = {
        header: null,
    }

    state = {
        modalVisible: false,
    }

    render() {
        const { domains, navigation } = this.props
        const { modalVisible } = this.state
        const errorMessage = navigation.getParam('errorMessage', null)
        return (
            <SafeAreaView style={{ flex: 1, alignItems: 'center' }}>
                <StatusBar style='dark' />
                <Text
                    style={{
                        textAlign: 'center',
                        padding: 20,
                        paddingBottom: 50,
                        fontSize: 20,
                        fontWeight: 'bold',
                    }}
                >
                    {errorMessage}
                </Text>
                <Button
                    mode='contained'
                    theme={{
                        roundness: 7,
                        colors: {
                            primary: '#2099CE',
                        },
                    }}
                    style={{ padding: 5, marginBottom: 20 }}
                    onPress={this._handleSelectAgain}
                >
                    Select a New School
                </Button>
                <Text style={{ textAlign: 'center', paddingBottom: 20 }}>Or</Text>
                <Button
                    mode='contained'
                    theme={{
                        roundness: 7,
                        colors: {
                            primary: '#2099CE',
                        },
                    }}
                    style={{ padding: 5 }}
                    onPress={this._handleSelectActive}
                >
                    Choose From Your Saved Schools
                </Button>
                <Modal
                    animationType='slide'
                    presentationStyle='fullScreen'
                    transparent={false}
                    visible={modalVisible}
                    // onDismiss={this._hideModal}
                >
                    <SafeAreaView style={{ flex: 1, padding: 0, backgroundColor: '#f6f6f6' }}>
                        <ScrollView>
                            {domains.map((item) => {
                                return (
                                    <View key={item.id}>
                                        <List.Item
                                            title={item.name}
                                            style={{ paddingVertical: 0 }}
                                            left={(props) => (
                                                <List.Icon {...props} icon='chevron-right' />
                                            )}
                                            onPress={() => this._handleSelect(item.id)}
                                        />
                                        <Divider />
                                    </View>
                                )
                            })}
                        </ScrollView>
                    </SafeAreaView>
                </Modal>
            </SafeAreaView>
        )
    }

    _handleSelectAgain = () => {
        this.props.navigation.navigate('Auth')
    }

    _handleSelectActive = () => {
        this.setState({
            modalVisible: true,
        })
    }

    _handleSelect = async (id) => {
        try {
            Haptics.selectionAsync()

            const { setActiveDomain, navigation } = this.props
            setActiveDomain(id)
            this.setState({
                modalVisibile: false,
            })
            navigation.navigate('AuthLoading')
        } catch (error) {
            console.log('error selecting school from error page')
            this.setState({
                modalVisibile: false,
            })
            navigation.navigate('AuthLoading')
        }
    }
}

const mapStateToProps = (store) => ({
    domains: store.domains,
})

const mapDispatchToProps = (dispatch) => ({
    setActiveDomain: (domainId) => dispatch(domainActions.setActiveDomain(domainId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ErrorScreen)
