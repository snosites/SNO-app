import React, { useRef } from 'react'
import { View, Text } from 'react-native'

import LottieView from 'lottie-react-native'
import { Button } from 'react-native-paper'

const ErrorView = ({ theme, onRefresh = () => {} }) => {
    const animationRef = useRef(null)

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View
                style={{
                    width: 150,
                    height: 150,
                    alignItems: 'center',
                }}
            >
                <LottieView
                    ref={animationRef}
                    style={{
                        width: 150,
                        height: 150,
                    }}
                    loop={true}
                    autoPlay={true}
                    source={require('../assets/lottiefiles/broken-stick-error')}
                />
            </View>
            <Text
                style={{ textAlign: 'center', fontSize: 17, padding: 30, color: theme.colors.text }}
            >
                Sorry, something went wrong. If you are the site owner, please submit a support
                request.
            </Text>
            <Button
                mode='contained'
                theme={{
                    roundness: 7,
                    colors: {
                        primary: theme ? theme.colors.primary : '#2099CE',
                    },
                }}
                style={{ padding: 5 }}
                onPress={onRefresh}
            >
                Refresh
            </Button>
        </View>
    )
}

export default ErrorView
