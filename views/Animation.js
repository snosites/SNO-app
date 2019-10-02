import React from 'react';
import { View } from 'react-native';

import LottieView from 'lottie-react-native'


export default class Animation extends React.Component {

    render() {
        const { style, saveRef } = this.props;
        return (
            <View style={{ flex: 1 }}>
                <View style={{...style}}>
                    <LottieView
                        ref={animation => saveRef(animation)}
                        style={{...style}}
                        loop={true}
                        autoPlay={true}
                        {...this.props}
                    />
                </View>
            </View>
        )
    }
}