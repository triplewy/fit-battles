import React from 'react';
import {View, StyleSheet, Text, Image, Animated} from 'react-native';
import LinearGradient from 'react-native-linear-gradient'
import dripIcon from '../icons/drip-icon-no-background.png'

export default class Splash extends React.Component {
  constructor(props) {
    super(props);
    this.fadeValue = new Animated.Value(0)
    this.state = {
    };

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
    ).start(() => setTimeout(() => {
      this.props.setAnimationEnded()
    }, 300))
  }

  render() {
    return (
      <LinearGradient colors={['#54d7ff', '#739aff']} style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Animated.View style={{opacity: this.fadeValue}}>
          <Image source={dripIcon} style={{height: 200, width: 200, marginBottom: 30}} />
          <Text style={{textAlign: 'center', fontSize: 28, fontWeight: '300', color: 'white'}}>Fit Battles</Text>
        </Animated.View>
      </LinearGradient>
    )
  }
}
