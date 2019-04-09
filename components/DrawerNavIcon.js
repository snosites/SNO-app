import React from 'react';
import { Icon } from 'expo';
import { FontAwesome, Foundation } from '@expo/vector-icons';

export default DrawerNavIcon = (props) => {
    const { style, name, size, color } = this.props;
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
            <FontAwesome
                name={iconName}
                size={size}
                color={color}
            />
        )
    }
    else {
        return (
            <Foundation
                name={iconName}
                size={size}
                color={color}
            />
        );
    }
}