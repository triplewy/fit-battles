import React from 'react';
import { Dimensions, View, Text, StyleSheet, Image, ImageBackground, TouchableOpacity, Animated, Easing } from 'react-native';
import DoubleTap from '../DoubleTap'
import { follow, unfollow } from '../Follow'
import { formatDate } from '../Date'

export default class Card extends React.Component {
  constructor(props) {
    super(props);
    this.fadeValue = new Animated.Value(0)
    this.state = {
      following: this.props.following,
      voted: false
    }

    this.cardFollow = this.cardFollow.bind(this)
    this.cardUnfollow = this.cardUnfollow.bind(this)
    this.handleFadeAnimation = this.handleFadeAnimation.bind(this)
    this.handleVote = this.handleVote.bind(this)
  }

  cardFollow(userId) {
    follow(userId)
    .then(message => {
      if (message === 'success') {
        this.setState({following: true})
      } else {
        console.log(message);
      }
    })
    .catch(e => {
      console.log(e);
    })
  }

  cardUnfollow(userId) {
    unfollow(userId)
    .then(message => {
      if (message === 'success') {
        this.setState({following: false})
      } else {
        console.log(message);
      }
    })
    .catch(e => {
      console.log(e);
    })
  }

  handleFadeAnimation() {
    this.fadeValue.setValue(0)
    Animated.timing(
      this.fadeValue,
      {
        toValue: 1,
        duration: 1000,
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
          duration: 1000,
          easing: Easing.ease
        }
      ).start(() => this.props.handleVote(this.props.index))
    }, 500)
  }

  render() {
    const win = Dimensions.get('window');
    return (
      <View style={{backgroundColor: 'white', borderRadius: 8, margin: 10, width: win.width - 60, justifyContent: 'center'}}>
        <DoubleTap onDoubleTap={this.handleFadeAnimation}>
          <View style={{alignItems: 'center'}}>
            <Animated.View style={{position: 'absolute', opacity: this.fadeValue, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 8,
              top: 0, left: 0, zIndex: 2, height: (win.width - 60) * (4.0 / 3), width: win.width - 60, alignItems: 'center', justifyContent: 'center'}}>
              <Text style={{fontSize: 32, fontWeight: 'bold', color: '#7DD497'}}>Voted</Text>
            </Animated.View>
            <ImageBackground
              resizeMode={'contain'}
              source={{uri: this.props.imageUrl}}
              style={{width: win.width - 60, height: (win.width - 60) * (4.0 / 3), shadowOffset:{height: 10}, shadowColor: 'black', shadowOpacity: 0.8}}
              imageStyle={{borderRadius: 8}}
            >
            </ImageBackground>
          </View>
        </DoubleTap>
        <View style={{flex: 0, flexDirection: 'column', padding: 10}}>
          <View style={{flexDirection: 'row', marginBottom: 5}}>
            <TouchableOpacity style={{flex: 1}} onPress={() => this.props.navigation.navigate('UserProfile', {userId: this.props.userId})}>
              <Text style={{fontWeight: '600', fontSize: 18}}>{this.props.profileName}</Text>
            </TouchableOpacity>
            <Text style={{fontWeight: '600', fontSize: 18, color: this.props.wins / this.props.matches >= 0.5 ? '#9FDD9A' : 'red'}}>{this.props.matches ? Math.round(this.props.wins * 1.0 / this.props.matches * 100) + '%' : 0 + '%'}</Text>
            {/* <Text>{formatDate(this.props.dateTime)}</Text> */}
          </View>
          <Text style={{color: '#66757f'}}>{this.props.location}</Text>
          {/* {this.props.isPoster ?
            <TouchableOpacity onPress={this.showAlert}>
              <Text>More</Text>
            </TouchableOpacity>
            :
            <TouchableOpacity onPress={this.state.following ? this.cardUnfollow.bind(this, this.props.userId) : this.cardFollow.bind(this, this.props.userId)}>
              <Text>{this.state.following ? 'Unfollow' : this.props.followsYou ? 'Follow Back' : 'Follow'}</Text>
            </TouchableOpacity>
          } */}
        </View>
      </View>
    )
  }
}
