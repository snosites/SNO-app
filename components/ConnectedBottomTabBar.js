import React from 'react'
import { View, TouchableWithoutFeedback } from 'react-native'
import { connect } from 'react-redux'
import { BottomTabBar } from 'react-navigation'

const HiddenView = () => <View style={{ display: 'none' }} />
const TouchableWithoutFeedbackWrapper = ({
    onPress,
    onLongPress,
    testID,
    accessibilityLabel,
    ...props
}) => (
    <TouchableWithoutFeedback
        onPress={onPress}
        onLongPress={onLongPress}
        testID={testID}
        hitSlop={{
            left: 15,
            right: 15,
            top: 5,
            bottom: 5
        }}
        accessibilityLabel={accessibilityLabel}
    >
        <View {...props} />
    </TouchableWithoutFeedback>
)

class CustomBottomTabBar extends React.Component {
    render() {
        const { theme, sportCenterEnabled, ...other } = this.props
        return (
            <BottomTabBar
                {...other}
                activeTintColor={theme.colors.primary}
                getButtonComponent={({ route }) => {
                    if (route.key === 'SportcenterStack' && !sportCenterEnabled) {
                        return HiddenView
                    }
                    return TouchableWithoutFeedbackWrapper
                }}
            />
        )
    }
}

const mapStateToProps = state => ({
    theme: state.theme,
    sportCenterEnabled: state.global.sportCenterEnabled
})

export default connect(mapStateToProps)(CustomBottomTabBar)
