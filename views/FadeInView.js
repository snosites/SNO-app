import React from 'react'
import { Animated, PanResponder } from 'react-native'

export default class FadeInView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            slideAnim: new Animated.Value(-140),
        }

        this._panResponder = PanResponder.create({
            onMoveShouldSetPanResponder: (evt, gestureState) => false,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
                //return true if user is swiping, return false if it's a single click
                const { dx, dy } = gestureState
                return dy > 2 || dy < -2
            },
            onPanResponderTerminationRequest: (evt, gestureState) => true,
            onPanResponderGrant: (evt, gestureState) => {},
            onPanResponderMove: Animated.event(
                [
                    null,
                    {
                        dy: this.state.slideAnim,
                    },
                ],
                { useNativeDriver: true }
            ),
            onPanResponderRelease: (e, gestureState) => {
                if (gestureState.dy < -40) {
                    this._hide()
                } else {
                    this._show()
                }
            },
        })
    }

    componentDidMount() {
        if (this.props.visible) {
            this._show()
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.visible !== this.props.visible) {
            this._toggle()
        }
    }

    _toggle = () => {
        if (this.props.visible) {
            this._show()
        } else {
            this._hide()
        }
    }

    _show = () => {
        Animated.timing(this.state.slideAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
        }).start()
    }

    _hide = () => {
        clearTimeout(this._hideTimeout)

        Animated.timing(this.state.slideAnim, {
            toValue: -140,
            duration: 400,
            useNativeDriver: true,
        }).start(({ finished }) => {
            if (finished) {
                //
            }
        })
    }

    render() {
        let { slideAnim } = this.state

        return (
            <Animated.View
                {...this._panResponder.panHandlers}
                style={{
                    ...this.props.style,
                    // opacity: this.state.slideAnim,
                    transform: [
                        {
                            // translateY: slideAnim
                            translateY: slideAnim.interpolate({
                                inputRange: [-140, 0],
                                outputRange: [0, 140],
                                extrapolateRight: 'clamp',
                            }),
                        },
                        { perspective: 1000 },
                    ],
                }}
            >
                {this.props.children}
            </Animated.View>
        )
    }
}
