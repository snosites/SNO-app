import React from 'react'
import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default ({ route }) => {
    return (
        <SafeAreaView
            style={{
                flex: 1,
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'orange',
            }}
        >
            <Text>This is top text.</Text>
            <Text>This is bottom text.</Text>
        </SafeAreaView>
    )
}
