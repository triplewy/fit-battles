import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient'
import rankingsInstructions from '../../icons/rankings-instructions.png'

export default class RankingsInstructions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    }
  }

  render() {
    return (
      <LinearGradient colors={['#54d7ff', '#739aff']} style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{color: 'white', fontSize: 28, fontWeight: '300', marginBottom: 60}}>Rankings</Text>
        <Image source={rankingsInstructions} style={{height: 256, width: 256, marginBottom: 30}} />
        <Text style={{color: 'white', fontSize: 18, fontWeight: '300', marginBottom: 60, textAlign: 'center', paddingHorizontal: 80}}>
          Check out the winner after each day's fit battles
        </Text>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('Final')}>
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
