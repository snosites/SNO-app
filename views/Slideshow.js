import React from 'react'
import {
    Platform,
    Dimensions,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native'
import Carousel, { Pagination, ParallaxImage } from 'react-native-snap-carousel'
import HTML from 'react-native-render-html'
import Colors from '../constants/Colors'
import TouchableItem from '../constants/TouchableItem'

import { getActiveDomain } from '../redux/domains'

import { connect } from 'react-redux'

const IS_IOS = Platform.OS === 'ios'
const SLIDER_FIRST_ITEM = 0

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window')

function wp(percentage) {
    const value = (percentage * viewportWidth) / 100
    return Math.round(value)
}

const slideHeight = viewportHeight * 0.39
const slideWidth = wp(80)
const itemHorizontalMargin = wp(0.5)

const sliderWidth = viewportWidth
const itemWidth = slideWidth + itemHorizontalMargin * 2

class Slideshow extends React.Component {
    state = {
        activeSlide: SLIDER_FIRST_ITEM,
        photos: [],
        error: false
    }

    componentDidMount() {
        if (this.props.imageIds) {
            console.log('getting ids')
            this._getImageData(this.props.imageIds)
        }
    }

    render() {
        const { activeSlide, photos, error } = this.state
        if (error) {
            return (
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <Text style={{ textAlign: 'center', margin: 20 }}>Error loading slideshow</Text>
                </View>
            )
        }
        if (this.props.imageIds && photos.length == 0) {
            return (
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <ActivityIndicator />
                </View>
            )
        }
        return (
            <View style={{ flex: 1 }}>
                <Carousel
                    // layout={'stack'}
                    // layoutCardOffset={18}
                    ref={c => {
                        this._carousel = c
                    }}
                    data={this.props.imageIds ? photos : this.props.images}
                    renderItem={this._renderItem}
                    sliderWidth={sliderWidth}
                    itemWidth={itemWidth}
                    firstItem={SLIDER_FIRST_ITEM}
                    hasParallaxImages={true}
                    loop={true}
                    loopClonesPerSide={2}
                    autoplay={true}
                    autoplayDelay={1000}
                    autoplayInterval={3000}
                    inactiveSlideScale={0.94}
                    inactiveSlideOpacity={0.7}
                    containerCustomStyle={styles.slider}
                    onSnapToItem={index =>
                        this.setState({
                            activeSlide: index
                        })
                    }
                />
                <Pagination
                    dotsLength={this.props.imageIds ? photos.length : this.props.images.length}
                    activeDotIndex={activeSlide}
                    containerStyle={styles.paginationContainer}
                    dotColor={this.props.accentColor}
                    dotStyle={styles.paginationDot}
                    inactiveDotColor={'#1a1917'}
                    inactiveDotOpacity={0.4}
                    inactiveDotScale={0.6}
                    carouselRef={this._carousel}
                    tappableDots={!!this._carousel}
                />
            </View>
        )
    }

    _getImage = async imageId => {
        const { activeDomain } = this.props
        const result = await fetch(`http://${activeDomain.url}/wp-json/wp/v2/media/${imageId}`)
        return await result.json()
    }

    _getImageData = async imageIds => {
        try {
            console.log('img ids', imageIds)
            const images = await Promise.all(
                imageIds.map(async id => {
                    return await this._getImage(id)
                })
            )
            console.log('images', images)
            this.setState({
                photos: images
            })
        } catch (err) {
            console.log('error getting slideshow images', err)
            this.setState({
                error: true
            })
        }
    }

    _renderItem({ item, index }, parallaxProps) {
        const photographer =
            item.meta_fields && item.meta_fields.photographer
                ? item.meta_fields.photographer[0]
                : ''
        return (
            <TouchableOpacity activeOpacity={1} style={styles.slideInnerContainer}>
                <View style={styles.shadow} />
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: item.media_details.sizes.full.source_url }}
                        style={styles.image}
                    />
                    <View style={styles.radiusMask} />
                </View>
                <View style={styles.textContainer}>
                    {item.caption && item.caption.rendered ? (
                        <HTML
                            html={item.caption.rendered}
                            baseFontStyle={{ fontSize: 12 }}
                            customWrapper={text => {
                                return (
                                    <Text ellipsizeMode='tail' numberOfLines={2}>
                                        {text}
                                    </Text>
                                )
                            }}
                            tagsStyles={{
                                rawtext: {
                                    color: 'white',
                                    fontSize: 12,
                                    fontWeight: 'bold',
                                    letterSpacing: 0.5
                                }
                            }}
                        />
                    ) : null}
                    {photographer ? (
                        <Text style={styles.subtitle} numberOfLines={2}>
                            {photographer}
                        </Text>
                    ) : null}
                </View>
            </TouchableOpacity>
        )
    }
}

const entryBorderRadius = 8

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
        backgroundColor: 'white',
        shadowColor: Colors.black,
        shadowOpacity: 0.45,
        shadowOffset: { width: 10, height: 10 },
        shadowRadius: 10,
        borderRadius: entryBorderRadius
    },
    imageContainer: {
        flex: 1,
        marginBottom: IS_IOS ? 0 : -1, // Prevent a random Android rendering issue
        backgroundColor: Colors.black,
        borderTopLeftRadius: entryBorderRadius,
        borderTopRightRadius: entryBorderRadius
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: 'contain',
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
        paddingBottom: 4 + entryBorderRadius,
        paddingHorizontal: 16,
        backgroundColor: Colors.black,
        borderBottomLeftRadius: entryBorderRadius,
        borderBottomRightRadius: entryBorderRadius
    },
    title: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 0.5
    },
    subtitle: {
        // marginTop: 6,
        color: Colors.gray,
        fontSize: 12,
        fontStyle: 'italic'
    },
    slider: {
        marginTop: 15,
        overflow: 'visible' // for custom animations
    },
    paginationContainer: {
        paddingVertical: 8
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 8
    }
})

const mapStateToProps = state => ({
    activeDomain: getActiveDomain(state)
})

export default connect(mapStateToProps)(Slideshow)
