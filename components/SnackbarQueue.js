import React, { useEffect, useState } from 'react'
import { Snackbar } from 'react-native-paper'

import { connect } from 'react-redux'

import { actions as snackbarQueueActions } from '../redux/snackbarQueue'

import { useSafeAreaInsets } from 'react-native-safe-area-context'

const SnackbarQueue = (props) => {
    const { snackbarQueue, removeMessage } = props
    const [visible, setVisible] = useState(false)
    const [message, setMessage] = useState(null)

    const insets = useSafeAreaInsets()

    useEffect(() => {
        if (snackbarQueue.length) {
            setMessage(snackbarQueue[0])
            setVisible(true)
        }
    }, [snackbarQueue])

    useEffect(() => {
        if (!visible) {
        }
    }, [visible])

    removeSnackbarMessage = () => {
        setVisible(false)
        removeMessage()
    }

    return (
        <Snackbar
            visible={visible}
            style={{
                position: 'absolute',
                bottom: insets.bottom,
                left: 0,
                right: 0,
                borderRadius: 10,
            }}
            duration={4000}
            onDismiss={removeSnackbarMessage}
            action={{
                label: 'Dismiss',
                onPress: () => setVisible(false),
            }}
        >
            {message}
        </Snackbar>
    )
}

const mapStateToProps = (state) => ({
    snackbarQueue: state.snackbarQueue,
})

const mapDispatchToProps = (dispatch) => ({
    removeMessage: () => dispatch(snackbarQueueActions.removeMessage()),
})

export default connect(mapStateToProps, mapDispatchToProps)(SnackbarQueue)
