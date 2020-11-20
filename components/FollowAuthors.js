import React, { useState, useEffect, useRef } from 'react'
import { ScrollView, StyleSheet, Share, View, TouchableOpacity, Text, useWindowDimensions } from 'react-native'

import { FAB, Portal, Snackbar, Dialog, Button, Checkbox } from 'react-native-paper'


const FollowAuthors = (props) => {
    const { visible, onDismiss, authors } = props
    return (
        <Portal>
            <Dialog
                visible={visible}
                onDismiss={onDismiss}
                style={{ maxHeight: 0.7 * useWindowDimensions().height }}
            >
                <Dialog.Title>Please choose who you would like to follow</Dialog.Title>
                <Dialog.ScrollArea>
                    <ScrollView contentContainerStyle={{ paddingHorizontal: 24 }}>
                        {authors.map(author => {
                            return (<TouchableOpacity
                                            key={term.term_id}
                                            onPress={() => {
                                                if (status === 'unchecked') {
                                                    this.setState({
                                                        subscribeTo: [
                                                            ...this.state.subscribeTo,
                                                            {
                                                                id: term.term_id,
                                                                name: term.name,
                                                            },
                                                        ],
                                                    })
                                                } else {
                                                    const updatedList = this.state.subscribeTo.filter(
                                                        (writerObj) => writerObj.id !== term.term_id
                                                    )
                                                    this.setState({
                                                        subscribeTo: updatedList,
                                                    })
                                                }
                                            }}
                                        >
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    justifyContent: 'flex-start',
                                                }}
                                            >
                                                <Checkbox.Android
                                                    uncheckedColor='#757575'
                                                    status={status}
                                                />
                                                <Text
                                                    style={{
                                                        marginLeft: 5,
                                                    }}
                                                >
                                                    {term.name}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>)
                        })}
                        {article.custom_fields.terms &&
                            !article.custom_fields.terms.errors &&
                            article.custom_fields.terms.map((term) => {
                                const found = this.state.subscribeTo.filter(
                                    (writerObj) => writerObj.id === term.term_id
                                )
                                const status = found.length > 0 ? 'checked' : 'unchecked'
                                if (
                                    unsubscribedWriters.some(
                                        (writerObj) => writerObj.term_id === term.term_id
                                    )
                                ) {
                                    return (
                                        
                                    )
                                } else {
                                    return (
                                        <TouchableOpacity key={term.term_id}>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    justifyContent: 'flex-start',
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        marginRight: 5,
                                                        marginLeft: 40,
                                                    }}
                                                >
                                                    {term.name}
                                                </Text>
                                                <Text
                                                    style={{
                                                        marginLeft: 5,
                                                        fontWeight: 'bold',
                                                    }}
                                                >
                                                    - Already subscribed
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                }
                            })}
                    </ScrollView>
                </Dialog.ScrollArea>
                <Dialog.Actions>
                    <Button onPress={() => this.setState({ showDialog: false, subscribeTo: [] })}>
                        Cancel
                    </Button>
                    <Button
                        onPress={() => {
                            if (this.state.subscribeTo.length > 0) {
                                subscribe({
                                    subscriptionType: 'writers',
                                    ids: this.state.subscribeTo,
                                    domainId: activeDomain.id,
                                })
                            }
                            this.setState({ showDialog: false, subscribeTo: [] })
                        }}
                    >
                        Okay
                    </Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    )
}

const mapStateToProps = (state) => ({
    theme: state.theme,
    activeDomain: getActiveDomain(state),
    pushToken: getPushToken(state),
    writerSubscriptions: getWriterSubscriptions(state),
    enableComments: state.global.enableComments,
    storyAds: getStoryAds(state),
})

const mapDispatchToProps = (dispatch) => ({
    saveArticle: (article, domainId) =>
        dispatch(savedArticleActions.saveArticle(article, domainId)),
    subscribe: (payload) => dispatch(userActions.subscribe(payload)),
    sendAdAnalytic: (url, imageId, field) =>
        dispatch(adActions.sendAdAnalytic(url, imageId, field)),
    fetchSnoAdImage: (adSpotId, fallbackUrl) =>
        dispatch(adActions.fetchSnoAdImage(adSpotId, fallbackUrl)),
})

export default connect(mapStateToProps, mapDispatchToProps)(FullArticleScreen)
