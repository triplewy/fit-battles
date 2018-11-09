import React from 'react';
import { Dimensions, View, Text, StyleSheet, Image, ImageBackground, TouchableOpacity, Animated, Easing } from 'react-native';
import DoubleTap from '../DoubleTap'
import {follow, unfollow} from '../Follow'
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
    const ratio = (win.width - 20)/this.props.width
    return (
      <View style={{backgroundColor: 'white', borderRadius: 8, margin: 10}}>
        <DoubleTap onDoubleTap={this.handleFadeAnimation}>
          <View>
            <Animated.View style={{position: 'absolute', opacity: this.fadeValue, backgroundColor: 'rgba(0,0,0,0.4)',
              top: 0, left: 0, zIndex: 2, height: (win.width - 20) * (4.0 / 3), width: win.width - 20, alignItems: 'center', justifyContent: 'center'}}>
              <Text style={{fontSize: 32, fontWeight: 'bold', color: '#7DD497'}}>Voted</Text>
            </Animated.View>
            <ImageBackground
              resizeMode={'contain'}
              source={{uri: this.props.imageUrl}}
              style={{width: win.width - 20, height: (win.width - 20) * (4.0 / 3)}}
              imageStyle={{borderRadius: 8, borderWidth: 1, borderColor: '#ccc'}}
            >


              {/* <Text style={{position: 'absolute', right: 10, top: 10}}>{(this.props.index + 1) + '/2'}</Text>
              {this.state.voted &&
                <Text style={{textAlign: 'center', fontSize: 32, fontWeight: 'bold', color: 'green', marginTop: 100}}>Voted</Text>
              } */}
            </ImageBackground>
          </View>



        </DoubleTap>
        <View style={{flex: 0, flexDirection: 'column', padding: 10}}>
          <View style={{flex: 0, flexDirection: 'row'}}>
            <View style={{flex: 1, flexDirection: 'column'}}>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('UserProfile', {userId: this.props.userId})}>
                <Text style={{fontWeight: '600', fontSize: 18, marginBottom: 5}}>{this.props.profileName}</Text>
              </TouchableOpacity>
              <Text>{formatDate(this.props.dateTime)}</Text>
            </View>
            <View style={{flex: 1, flexDirection: 'column'}}>
              <Text style={{textAlign: 'right'}}>{this.props.matches ? Math.round(this.props.wins * 1.0 / this.props.matches * 100) + '%' : 0 + '%'}</Text>
            </View>
          </View>
          <Text style={{marginVertical: 5}}>{this.props.location}</Text>
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
