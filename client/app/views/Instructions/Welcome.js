import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient'

export default class Welcome extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };


  }

  componentDidMount() {
  }

  render() {
    return (
      <LinearGradient colors={['#54d7ff', '#739aff']} style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{color: 'white', fontSize: 28, fontWeight: '300', marginBottom: 60}}>Welcome to Fit Battles</Text>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('BattlesInstructions')}>
          <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#80e1ff', '#6770e3']}
            style={{alignItems: 'center', borderRadius: 24, paddingVertical: 15, paddingHorizontal: 30}}
          >
            <Text style={{color: 'white', fontSize: 16, fontWeight: '300'}}>Continue</Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    )
  }
}
