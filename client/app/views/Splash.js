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
      <LinearGradient colors={['#54d7ff', '#739aff']} style={{flex: 1}}>
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <Text style={{textAlign: 'center', fontSize: 48, fontWeight: 'bold', color: 'white'}}>Fit Battles</Text>
        </View>
      </LinearGradient>
    )
  }
}

const styles = StyleSheet.create({
})
