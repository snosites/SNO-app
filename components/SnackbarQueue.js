import React, { useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import { Snackbar } from 'react-native-paper'

import { connect } from 'react-redux'

import { actions as snackbarQueueActions } from '../redux/snackbarQueue'

const SnackbarQueue = (props) => {
    const { snackbarQueue, removeMessage } = props
    const [visible, setVisible] = useState(false)
    const [message, setMessage] = useState(null)

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
            style={{ position: 'absolute', bottom: 80, left: 0, right: 0 }}
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
