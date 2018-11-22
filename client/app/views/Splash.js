import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import LinearGradient from 'react-native-linear-gradient'

export default class Splash extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    return (
      <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.linearGradient}>
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <Text style={{textAlign: 'center', fontSize: 48, fontWeight: 'bold', color: 'white'}}>Fit Battles</Text>
        </View>
      </LinearGradient>
    )
  }
}

const styles = StyleSheet.create({
})
