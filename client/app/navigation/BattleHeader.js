import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Header } from 'react-navigation'
import LinearGradient from 'react-native-linear-gradient'

export default class BattleHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    return (
      <View>
        <LinearGradient colors={['#54d7ff', '#739aff']} style={{flex: 1}}>
          <Header {...this.props} />
        </LinearGradient>
      </View>
    )
  }
}
