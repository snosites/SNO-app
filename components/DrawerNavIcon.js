import React from 'react';
import { Icon } from 'expo';
import { FontAwesome, Foundation } from '@expo/vector-icons';

import Colors from '../constants/Colors';


export default class DrawerNavIcon extends React.Component {
    render() {
        const {style, name} = this.props;
        if(style == 'fa'){
            return (
                <FontAwesome 
                    name={name}
                    size={26}
                />
            )
        }
        else {
            return (
                <Foundation
                    name={name}
                    size={26}
                // style={{ marginBottom: -3 }}
                // color={this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
                />
            );
        }
    }
}