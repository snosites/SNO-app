import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

export default class selectScreen extends React.Component {
  static navigationOptions = {
    title: 'Select Your Organization',
  };

  render() {
      const {navigation} = this.props;
      const cityLocation = navigation.getParam('location', null);
    return (
      <ScrollView style={styles.container}>
        {cityLocation && <Text>{JSON.stringify(cityLocation)}</Text>}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});