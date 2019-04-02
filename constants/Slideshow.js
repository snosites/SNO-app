import React from 'react';
import {
    Platform,
    Dimensions,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity
} from 'react-native';
import Carousel from 'react-native-snap-carousel';

import Colors from '../constants/Colors';
import TouchableItem from '../constants/TouchableItem';


const IS_IOS = Platform.OS === 'ios';
const SLIDER_1_FIRST_ITEM = 1;

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

function wp(percentage) {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
}

const slideHeight = viewportHeight * 0.36;
const slideWidth = wp(75);
const itemHorizontalMargin = wp(2);

const sliderWidth = viewportWidth;
const itemWidth = slideWidth + itemHorizontalMargin * 2;



export default class Slideshow extends React.Component {
    render() {
        console.log('in slideshow comp', this.props.images)
        console.log('sliderWidth:', sliderWidth, 'slideWidth:', slideWidth, 'itemwidth:', itemWidth)
        return (
            <Carousel
                // layout={'stack'}
                // layoutCardOffset={18}
                ref={(c) => { this._carousel = c; }}
                data={this.props.images}
                renderItem={this._renderItem}
                sliderWidth={sliderWidth}
                itemWidth={itemWidth}
                firstItem={SLIDER_1_FIRST_ITEM}
                loop={true}
                loopClonesPerSide={2}
                autoplay={true}
                autoplayDelay={1000}
                autoplayInterval={3000}
                inactiveSlideScale={0.94}
                inactiveSlideOpacity={0.7}
                containerCustomStyle={styles.slider}
            // contentContainerCustomStyle={styles.sliderContentContainer}
            />
        )
    }

    _renderItem({ item, index }) {
        console.log('in renderItem', item.media_details.sizes.full.source_url)
        const photographer = item.meta_fields && item.meta_fields.photographer ? item.meta_fields.photographer[0] : 'Unknown';
        return (
            <TouchableOpacity
                activeOpacity={1}
                style={styles.slideInnerContainer}
                onPress={() => { alert(`You've clicked`); }}
            >
                <View style={styles.shadow} />
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: item.media_details.sizes.full.source_url }}
                        style={styles.image}
                    />
                    <View style={styles.radiusMask} />
                </View>
                <View style={styles.textContainer}>
                    <Text
                        style={styles.title}
                        numberOfLines={2}
                    >
                        {item.caption ? item.caption.rendered.toUpperCase() : 'UNKNOWN'}
                    </Text>
                    <Text
                        style={styles.subtitle}
                        numberOfLines={2}
                    >
                        {photographer}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }
}

const entryBorderRadius = 8;

const styles = StyleSheet.create({
    slideInnerContainer: {
        width: itemWidth,
        height: slideHeight,
        paddingHorizontal: itemHorizontalMargin,
        paddingBottom: 18 // needed for shadow
    },
    shadow: {
        position: 'absolute',
        top: 0,
        left: itemHorizontalMargin,
        right: itemHorizontalMargin,
        bottom: 18,
        shadowColor: Colors.black,
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 10,
        borderRadius: entryBorderRadius
    },
    imageContainer: {
        flex: 1,
        marginBottom: IS_IOS ? 0 : -1, // Prevent a random Android rendering issue
        backgroundColor: 'white',
        borderTopLeftRadius: entryBorderRadius,
        borderTopRightRadius: entryBorderRadius
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: 'cover',
        borderRadius: IS_IOS ? entryBorderRadius : 0,
        borderTopLeftRadius: entryBorderRadius,
        borderTopRightRadius: entryBorderRadius
    },
    // image's border radius is buggy on iOS; let's hack it!
    radiusMask: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: entryBorderRadius,
        backgroundColor: Colors.black
    },
    textContainer: {
        justifyContent: 'center',
        paddingTop: 4,
        paddingBottom: 4,
        paddingHorizontal: 16,
        backgroundColor: Colors.black,
        borderBottomLeftRadius: entryBorderRadius,
        borderBottomRightRadius: entryBorderRadius
    },
    title: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    subtitle: {
        // marginTop: 6,
        color: Colors.gray,
        fontSize: 12,
        fontStyle: 'italic'
    },
    slider: {
        marginTop: 15,
        // overflow: 'visible' // for custom animations
    },
    sliderContentContainer: {
        // paddingVertical: 10 // for custom animation
    },
});
