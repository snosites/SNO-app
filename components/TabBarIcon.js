import React from 'react'
import { View, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import Colors from '../constants/Colors'

export default (props) => {
    const { color, name, focused, size, badge = null, tabColor = 'white' } = props

    const badgeColor = '#b51010'

    if (badge === 'dot') {
        return (
            <View>
                <Ionicons
                    name={name}
                    size={size}
                    style={{ marginBottom: -3 }}
                    color={focused ? color : Colors.tabIconDefault}
                />
                <View
                    style={{
                        position: 'absolute',
                        top: -1,
                        right: -3,
                        width: 11,
                        height: 11,
                        borderRadius: 5.5,
                        backgroundColor: tabColor,
                        overflow: 'hidden',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <View
                        style={{
                            width: 8,
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: badgeColor,
                        }}
                    />
                </View>
            </View>
        )
    }
    if (badge) {
        return (
            <View>
                <Ionicons
                    name={name}
                    size={size}
                    style={{ marginBottom: -3 }}
                    color={focused ? color : Colors.tabIconDefault}
                />
                <View
                    style={{
                        position: 'absolute',
                        top: -5,
                        right: -12,
                        width: 20,
                        height: 20,
                        borderRadius: 10,
                        backgroundColor: tabColor,
                        overflow: 'hidden',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <View
                        style={{
                            width: 18,
                            height: 18,
                            borderRadius: 9,
                            backgroundColor: badgeColor,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: 'raleway',
                                fontSize: 12,
                                color: 'white',
                                marginTop: -3,
                            }}
                        >
                            {badge}
                        </Text>
                    </View>
                </View>
            </View>
        )
    }
    return (
        <Ionicons
            name={name}
            size={size}
            style={{ marginBottom: -3 }}
            color={focused ? color : Colors.tabIconDefault}
        />
    )
}
