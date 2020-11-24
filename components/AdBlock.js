import React, { useState, useEffect } from 'react'
import { Text, TouchableOpacity, Image, useWindowDimensions } from 'react-native'

import * as WebBrowser from 'expo-web-browser'
import { connect } from 'react-redux'

import { getActiveDomain } from '../redux/domains'
import { actions as adActions } from '../redux/ads'

import * as Linking from 'expo-linking'

const AdBlock = ({
    image,
    style,
    activeDomain,
    sendAdAnalytic,
    sendSnoAdAnalytic,
    themeIsDark = false,
    snoAd = false,
}) => {
    const AD_CONTAINER_WIDTH = useWindowDimensions().width

    const backgroundColor = themeIsDark ? '#212121' : '#e0e0e0'

    return (
        <TouchableOpacity
            style={{
                flex: 1,
                alignItems: 'center',
                backgroundColor,
                marginVertical: 10,
                ...style,
                width: AD_CONTAINER_WIDTH,
                marginLeft: -10,
            }}
            onPress={async () => {
                if (!snoAd) {
                    if (image.id) sendAdAnalytic(activeDomain.url, image.id, 'ad_clicks')
                    if (image.link) await WebBrowser.openBrowserAsync(image.link)
                } else {
                    if (image.link) await WebBrowser.openBrowserAsync(image.link)
                    if (image.id) sendSnoAdAnalytic(image.id)
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
                    margin: 10,
                }}
                resizeMode='contain'
                source={{
                    uri: image.url,
                }}
            />
        </TouchableOpacity>
    )
}

const mapStateToProps = (state) => ({
    activeDomain: getActiveDomain(state),
})

const mapDispatchToProps = (dispatch) => ({
    sendAdAnalytic: (url, imageId, field) =>
        dispatch(adActions.sendAdAnalytic(url, imageId, field)),
    sendSnoAdAnalytic: (id) => dispatch(adActions.sendSnoAdAnalytic(id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(AdBlock)
