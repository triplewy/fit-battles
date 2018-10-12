import React from 'react';
import { Dimensions, View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import DoubleTap from '../DoubleTap'
import {follow, unfollow} from '../Follow'

export default class Card extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      following: this.props.following
    }

    this.cardFollow = this.cardFollow.bind(this)
    this.cardUnfollow = this.cardUnfollow.bind(this)
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


  render() {
    const win = Dimensions.get('window');
    const ratio = (win.width - 20)/this.props.width
    return (
      <View style={{backgroundColor: 'white', borderRadius: 8, alignItems: 'center'}}>
        <DoubleTap onDoubleTap={this.props.handleVote}>
          <Image
            source={{uri: this.props.imageUrl}}
            style={{width: win.width - 20, height: ratio * this.props.height, borderRadius: 8}}
          />
        </DoubleTap>
        <View>
          <Text style={{marginTop: 10, marginBottom: 10, marginLeft: 10, fontWeight: '300', fontSize: 18}}>{this.props.profileName}</Text>
          {this.props.isPoster ?
            null
            :
            <TouchableOpacity onPress={this.state.following ? this.cardUnfollow.bind(this, this.props.userId) : this.cardFollow.bind(this, this.props.userId)}>
              <Text>{this.state.following ? 'Unfollow' : this.props.followsYou ? 'Follow Back' : 'Follow'}</Text>
            </TouchableOpacity>
          }
        </View>
      </View>
    )
  }
}
