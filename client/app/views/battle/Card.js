import React from 'react';
import { Dimensions, View, Text, StyleSheet, Image, ImageBackground, TouchableOpacity, Animated, Easing } from 'react-native';
import { follow, unfollow } from '../Follow'
import { formatDate } from '../Date'
import DoubleTap from '../DoubleTap'
import votedIcon from '../../icons/voted-icon.png'

export default class Card extends React.Component {
  constructor(props) {
    super(props);
    this.fadeValue = new Animated.Value(0)
    this.state = {
      wins: this.props.wins,
      matches: this.props.matches,
      voted: false
    }

    // this.cardFollow = this.cardFollow.bind(this)
    // this.cardUnfollow = this.cardUnfollow.bind(this)
    this.handleFadeAnimation = this.handleFadeAnimation.bind(this)
    this.handleVote = this.handleVote.bind(this)
  }

  // cardFollow(userId) {
  //   follow(userId)
  //   .then(message => {
  //     if (message === 'success') {
  //       this.setState({following: true})
  //     } else {
  //       console.log(message);
  //     }
  //   })
  //   .catch(e => {
  //     console.log(e);
  //   })
  // }
  //
  // cardUnfollow(userId) {
  //   unfollow(userId)
  //   .then(message => {
  //     if (message === 'success') {
  //       this.setState({following: false})
  //     } else {
  //       console.log(message);
  //     }
  //   })
  //   .catch(e => {
  //     console.log(e);
  //   })
  // }

  handleFadeAnimation() {
    this.fadeValue.setValue(0)
    this.setState({wins: this.state.wins + 1, matches: this.state.matches + 1, voted: true})
    Animated.timing(
      this.fadeValue,
      {
        toValue: 1,
        duration: 800,
        easing: Easing.ease
      }
    ).start(() => this.handleVote())
  }

  handleVote() {
    setTimeout(() => {
      Animated.timing(
        this.fadeValue,
        {
          toValue: 0,
          duration: 800,
          easing: Easing.ease
        }
      ).start(() => {
        this.setState({voted: false})
        this.props.handleVote(this.props.index)
      })
    }, 500)
  }

  render() {
    const win = Dimensions.get('window');
    return (
      <View style={{backgroundColor: 'white', borderRadius: 8, marginTop: 10, width: win.width - 60, justifyContent: 'center'}}>
        <DoubleTap onDoubleTap={this.handleFadeAnimation} voted={this.state.voted}>
          <View style={{alignItems: 'center'}}>
            <Animated.View style={{position: 'absolute', opacity: this.fadeValue, borderRadius: 8,
              top: 0, left: 0, zIndex: 2, height: (win.width - 60) * (4.0 / 3), width: win.width - 60, alignItems: 'center', justifyContent: 'center'}}>
              <Image source={votedIcon} style={{width: 200, height: 200}} />
            </Animated.View>
            <ImageBackground
              resizeMode={'contain'}
              source={{uri: this.props.imageUrl}}
              style={{width: win.width - 60, height: (win.width - 60) * (4.0 / 3), shadowOffset:{height: 10}, shadowColor: 'black', shadowOpacity: 0.75}}
              imageStyle={{borderRadius: 8}}
            >
            </ImageBackground>
          </View>
        </DoubleTap>
        <View style={{flex: 0, flexDirection: 'column', paddingTop: 20, paddingBottom: 10, paddingHorizontal: 10}}>
          <View style={{flexDirection: 'row', marginBottom: 5}}>
            <TouchableOpacity style={{flex: 1}} onPress={() => this.props.navigation.navigate('UserProfile', {userId: this.props.userId})}>
              <Text style={{fontWeight: '600', fontSize: 18}}>{this.props.profileName}</Text>
            </TouchableOpacity>
            <Text style={{fontWeight: '600', fontSize: 18, color: this.state.wins / this.state.matches >= 0.5 ? '#9FDD9A' : 'red'}}>
              {this.state.matches ? Math.round(this.state.wins * 1.0 / this.state.matches * 100) + '%' : 0 + '%'}
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={{color: '#66757f', flex: 1}}>{this.props.location}</Text>
            <TouchableOpacity onPress={this.handleFadeAnimation} disabled={this.state.voted}>
              <Text style={{color: '#739aff'}}>Vote</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
}
