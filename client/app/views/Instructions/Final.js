import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient'
import dripIcon from '../../icons/drip-icon-no-background.png'

export default class Final extends React.Component {
  constructor(props) {
    super(props);
    this.fadeValue = new Animated.Value(0)
    this.state = {

    }

    this.handleFadeAnimation = this.handleFadeAnimation.bind(this)
  }

  componentDidMount() {
    this.handleFadeAnimation()
  }

  handleFadeAnimation() {
    this.fadeValue.setValue(0)
    Animated.timing(
      this.fadeValue,
      {
        toValue: 1,
        duration: 1200
      }
    ).start()
  }

  render() {
    return (
      <LinearGradient colors={['#54d7ff', '#739aff']} style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{color: 'white', fontSize: 28, fontWeight: '300', marginBottom: 30}}>Get that drip</Text>
        <Animated.View style={{opacity: this.fadeValue}}>
          <Image source={dripIcon} style={{height: 256, width: 256, marginBottom: 30}} />
        </Animated.View>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('Tabs')}>
          <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#80e1ff', '#6770e3']}
            style={{alignItems: 'center', borderRadius: 24, paddingVertical: 15, paddingHorizontal: 30}}
          >
            <Text style={{color: 'white', fontSize: 16, fontWeight: '300'}}>Done</Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    )
  }
}
