import React from 'react';
import { Text } from 'react-native';

const TABICOLORDEFAULT = '#ccc';

export default class TabBarLabel extends React.Component {
    render() {
        const { color } = this.props;
        return (
            <Text
                style={{
                    color: this.props.focused ? color : TABICOLORDEFAULT,
                    fontSize: 11,
                    textAlign: 'center'
                }}
            >
                {this.props.label}
            </Text>
        );
    }
}