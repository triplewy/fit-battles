import React from 'react';
import { Dimensions, View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import DoubleTap from '../DoubleTap'

const url = 'http://localhost:8081'

export default class FeedCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      wins: this.props.wins,
      matches: this.props.matches,
      voted: this.props.voted,
    }

    this.cardVote = this.cardVote.bind(this)
    this.cardUnvote = this.cardUnvote.bind(this)
  }

  componentDidUpdate(prevProps) {
    const post = this.props
    if (post.wins !== prevProps.wins || post.matches !== prevProps.matches || post.voted !== prevProps.voted) {
      this.setState({wins: post.wins, matches: post.matches, voted: post.voted})
    }
  }

  cardVote() {
    fetch(url + '/api/card/vote', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        mediaId: this.props.mediaId,
        mediaUserId: this.props.userId
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.message === "success") {
        this.setState({voted: true, wins: this.state.wins + 1, matches: this.state.matches + 1})
      } else {
        console.log("failure")
      }
    })
    .catch(function(err) {
        console.log(err);
    });
  }

  cardUnvote() {
    fetch(url + '/api/card/unvote', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        mediaId: this.props.mediaId
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.message === "success") {
        this.setState({voted: false, wins: this.state.wins - 1, matches: this.state.matches - 1})
      } else {
        console.log("failure")
      }
    })
    .catch(function(err) {
        console.log(err);
    });
  }


  render() {
    const win = Dimensions.get('window');
    const ratio = (win.width - 20)/this.props.width
    return (
      <View style={{backgroundColor: 'white', borderRadius: 8, alignItems: 'center'}}>
        <DoubleTap onDoubleTap={this.state.voted ? this.cardUnvote : this.cardVote}>
          <Image
            source={{uri: this.props.imageUrl}}
            style={{width: win.width - 20, height: ratio * this.props.height, borderRadius: 8}}
          />
        </DoubleTap>
        <View>
          <Text style={{marginTop: 10, marginBottom: 10, marginLeft: 10, fontWeight: '300', fontSize: 18}}>{this.props.profileName}</Text>
          <Text>{this.props.followers + 'followers'}</Text>
          <Text>{this.state.wins + 'wins'}</Text>
          <Text>{this.state.matches + 'matches'}</Text>
          <Text>{this.state.voted ? 'Voted' : 'Vote'}</Text>
        </View>
      </View>
    )
  }
}
