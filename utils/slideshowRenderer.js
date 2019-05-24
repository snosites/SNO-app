import React from 'react';
import {
    View,
    Dimensions,
} from 'react-native';

import Slideshow from '../views/Slideshow';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

const MEDIASIZE = viewportHeight * 0.35;
const MEDIAWIDTH = viewportWidth * 0.90;


export function slideshowRenderer(htmlAttribs, children, convertedCSSStyles, passProps = {}) {
    if (!htmlAttribs['data-photo-ids']) {
        return;
    }
    const photoIds = htmlAttribs['data-photo-ids'];
    // get photo IDs into array form
    const photoIdArr = photoIds.split(',');
    return (
        <View 
        key={passProps.key}
        style={{marginLeft: -20}}
        >
            <Slideshow 
                accentColor={'#2099ce'}
                imageIds={photoIdArr}
            />
        </View>
    )
}
