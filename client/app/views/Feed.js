import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default class Feed extends React.Component {
  render() {
    return (
      <View>
        <Text style={styles.textFirst}> FEED </Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  textFirst: {
  fontSize: 50,
  fontWeight: 'bold',
  textAlign: 'center',
  marginTop: 300,
  },
});
