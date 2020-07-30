import React from 'react'
import { View, Dimensions } from 'react-native'

import Slideshow from '../views/Slideshow'
import RelatedStories from '../views/RelatedStories'
import AdBlock from '../components/AdBlock'

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window')

const MEDIASIZE = viewportHeight * 0.35
const MEDIAWIDTH = viewportWidth * 0.9

export function slideshowRenderer(htmlAttribs, children, convertedCSSStyles, passProps = {}) {
    if (!htmlAttribs['data-photo-ids']) {
        return
    }
    const photoIds = htmlAttribs['data-photo-ids']
    // get photo IDs into array form
    const photoIdArr = photoIds.split(',')
    return (
        <View key={passProps.key} style={{ marginLeft: -20 }}>
            <Slideshow accentColor={'#2099ce'} imageIds={photoIdArr} />
        </View>
    )
}

export function relatedRenderer(htmlAttribs, children, convertedCSSStyles, passProps = {}) {
    if (!htmlAttribs['data-post-ids']) {
        return
    }
    const storyIds = htmlAttribs['data-post-ids']
    const storyIdArr = storyIds.split(',')
    return (
        <View
            key={passProps.key}
            style={{
                width: viewportWidth,
                marginLeft: -20,
                marginVertical: 20,
                // paddingHorizontal: 10,
                backgroundColor: '#eeeeee',
            }}
        >
            <RelatedStories relatedStoryIds={storyIdArr} />
        </View>
    )
}

export function adBlockRenderer(htmlAttribs, children, convertedCSSStyles, passProps = {}) {
    if (!passProps.renderersProps || !passProps.renderersProps.adImage) return

    return (
        <View
            key={passProps.key}
            style={{
                width: viewportWidth,
                position: 'relative',
                left: -20,
                overflow: 'visible',
            }}
        >
            <AdBlock style={{ marginVertical: 20 }} image={passProps.renderersProps.adImage} />
        </View>
    )
    return (
        <View
            key={passProps.key}
            style={{
                width: viewportWidth,
                height: 250,
                marginLeft: -20,
                marginVertical: 10,
                backgroundColor: 'red',
            }}
        >
            <View style={{ flex: 1, backgroundColor: 'green', marginLeft: -20 }} />
        </View>
    )
}
