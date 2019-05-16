import React from 'react';
import { View } from 'react-native';

import { DangerZone } from 'expo';
const { Lottie } = DangerZone;


export default class Animation extends React.Component {

    render() {
        const { style, saveRef } = this.props;
        return (
            <View style={{ flex: 1 }}>
                <View style={{...style}}>
                    <Lottie
                        ref={animation => saveRef(animation)}
                        style={{...style}}
                        loop={true}
                        autoPlay={true}
                        // source={require(source)}
                        {...this.props}
                    />
                </View>
            </View>
        )
    }
}