import React, { useState, useEffect } from 'react'
import { Text, TouchableOpacity, Image } from 'react-native'

import * as WebBrowser from 'expo-web-browser'
import { connect } from 'react-redux'

import * as Linking from 'expo-linking'

import NavigationService from '../utils/NavigationService'

const AdBlock = ({ image, style }) => {
    console.log('image', image)
    return (
        <TouchableOpacity
            style={{
                flex: 1,
                alignItems: 'center',
                backgroundColor: '#e0e0e0',
                marginVertical: 10,
                ...style,
            }}
            onPress={async () => {
                if (image.link) {
                    await WebBrowser.openBrowserAsync(image.link)
                }
            }}
        >
            <Text
                ellipsizeMode='tail'
                numberOfLines={1}
                upp
                style={{
                    fontSize: 11,
                    paddingBottom: 5,
                    color: '#999999',
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    marginTop: 10,
                }}
            >
                Advertisement
            </Text>
            <Image
                style={{
                    width: 250,
                    height: 300,
                }}
                resizeMode='contain'
                source={{
                    uri: image.url,
                }}
            />
        </TouchableOpacity>
    )
}

export default AdBlock
