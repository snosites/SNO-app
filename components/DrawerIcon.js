import React from 'react'
import { View } from 'react-native'
// import * as Icon from '@expo/vector-icons'
import { FontAwesome, Foundation } from '@expo/vector-icons'

export default DrawerIcon = (props) => {
    const { iconFamily, name, size, color } = props
    let iconName = 'play'
    if (name) {
        let splitName = name.split('-')
        iconName = splitName[1]
    }
    if (iconFamily == 'fa') {
        return (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <FontAwesome name={iconName} size={size} color={color} />
            </View>
        )
    } else {
        return (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Foundation name={iconName} size={size} color={color} />
            </View>
        )
    }
}
