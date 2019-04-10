import React from 'react';
import { View } from 'react-native'
import { Icon } from 'expo';
import { FontAwesome, Foundation } from '@expo/vector-icons';

export default DrawerNavIcon = (props) => {
    const { style, name, size, color } = props;
    let iconName = '';
    if (name) {
        let splitName = name.split('-');
        iconName = splitName[1];
    }
    if (!name) {
        iconName = 'play'
    }
    if (style == 'fa') {
        return (
            <View style={{ width: 40, alignItems: 'center', justifyContent: 'center' }}>
                <FontAwesome
                    name={iconName}
                    size={size}
                    color={color}
                />
            </View>

        )
    }
    else {
        return (
            <View style={{ width: 40, alignItems: 'center', justifyContent: 'center' }}>
                <Foundation
                    name={iconName}
                    size={size}
                    color={color}
                />
            </View>

        );
    }
}