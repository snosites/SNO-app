import React from 'react'
import * as Icon from '@expo/vector-icons'

import { tabIconDefault } from '../constants/Colors'

export default (props) => {
    const { color, name, focused, size } = props
    return (
        <Icon.Ionicons
            name={name}
            size={size}
            style={{ marginBottom: -3 }}
            color={focused ? color : tabIconDefault}
        />
    )
}
