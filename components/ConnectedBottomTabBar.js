import React from 'react';
import { connect } from 'react-redux';
import { BottomTabBar } from 'react-navigation';


class CustomBottomTabBar extends React.Component {
    render() {
        const { theme, ...other } = this.props;
        return <BottomTabBar {...other} activeTintColor={theme.colors.primary} />
    }
}

const mapStateToProps = state => ({
    theme: state.theme
})

export default connect(mapStateToProps)(CustomBottomTabBar);