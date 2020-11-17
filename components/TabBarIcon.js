import React from 'react'
import { Ionicons } from '@expo/vector-icons'

import Colors from '../constants/Colors'

export default (props) => {
    const { color, name, focused, size } = props
    return (
        <Ionicons
            name={name}
            size={size}
            style={{ marginBottom: -3 }}
            color={focused ? color : Colors.tabIconDefault}
        />
    )
}
