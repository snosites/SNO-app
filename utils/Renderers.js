import React from 'react'
import { View, Dimensions } from 'react-native'

import Slideshow from '../views/Slideshow'
import RelatedStories from '../views/RelatedStories'
import AdBlock from '../components/AdBlock'
import theme from '../redux/theme'

const { width: viewportWidth } = Dimensions.get('window')

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
    const backgroundColor = passProps.renderersProps?.backgroundColor
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
                marginLeft: -10,
                marginVertical: 20,
                backgroundColor: backgroundColor || '#eeeeee',
            }}
        >
            <RelatedStories relatedStoryIds={storyIdArr} />
        </View>
    )
}

export function adBlockRenderer(htmlAttribs, children, convertedCSSStyles, passProps = {}) {
    const adImage = passProps.renderersProps?.adImage
    const snoAdImage = passProps.renderersProps?.snoAdImage
    const themeIsDark = passProps.renderersProps?.themeIsDark
    if (!passProps.renderersProps || (!adImage && !snoAdImage)) return

    return (
        <View
            key={passProps.key}
            style={{
                width: viewportWidth,
                marginLeft: -10,
                marginVertical: 20,
            }}
        >
            <AdBlock
                themeIsDark={themeIsDark}
                style={{}}
                snoAd={snoAdImage ? true : false}
                image={
                    snoAdImage
                        ? {
                              url: snoAdImage.image.url,
                              link: snoAdImage.link.link,
                              id: snoAdImage.id,
                          }
                        : adImage
                }
            />
        </View>
    )
}
