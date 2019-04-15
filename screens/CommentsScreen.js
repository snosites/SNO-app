import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    Image,
    ActivityIndicator,
    AsyncStorage
} from 'react-native';
import { CustomArticleHeader } from '../components/ArticleHeader';
import { Ionicons } from '@expo/vector-icons';

import { HeaderBackButton } from 'react-navigation';

import HeaderButtons, { HeaderButton, Item } from 'react-navigation-header-buttons';


const IoniconsHeaderButton = passMeFurther => (
    // the `passMeFurther` variable here contains props from <Item .../> as well as <HeaderButtons ... />
    // and it is important to pass those props to `HeaderButton`
    // then you may add some information like icon size or color (if you use icons)
    <HeaderButton {...passMeFurther} IconComponent={Ionicons} iconSize={28} color="#2f95dc" />
);



export default class CommentsScreen extends React.Component {
    static navigationOptions = ({ navigation, navigation: { state } }) => {
        console.log('navis', navigation, state)
        return {
            headerTitle: <CustomArticleHeader state={state} navigation={navigation} />,
            headerLeft: <HeaderBackButton onPress={() => {
                navigation.navigate('List')
            }}
            />
        };
    };


    render() {
        return (
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={{fontSize: 30, textAlign: 'center', padding: 20}}>Comment screen</Text>
            </ScrollView>
        )
    }



}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'space-between',
    },
})