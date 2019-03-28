import React from 'react';
import { Icon } from 'expo';
import { FontAwesome, Foundation } from '@expo/vector-icons';

import Colors from '../constants/Colors';


export default class DrawerNavIcon extends React.Component {
    
    render() {
        const { style, name } = this.props;
        console.log('style', style)
        let iconName = '';
        if (name) {
            let splitName = name.split('-');
            iconName = splitName[1];
        }
        if(!name) {
            iconName = 'play'
        }
        
        if (style == 'fa') {
            return (
                <FontAwesome
                    name={iconName}
                    size={26}
                    color={Colors.tabIconSelected}
                />
            )
        }
        else {
            return (
                <Foundation
                    name={iconName}
                    size={26}
                    color={Colors.tabIconSelected}
                />
            );
        }
    }
}