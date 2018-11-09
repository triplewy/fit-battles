import React from 'react';
import { Dimensions, View, Text, StyleSheet, Image, ImageBackground, TouchableOpacity, Alert } from 'react-native';
import DoubleTap from '../DoubleTap'
import { formatDate } from '../Date'

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
    this.showAlert = this.showAlert.bind(this)
    this.showDeleteAlert = this.showDeleteAlert.bind(this)
    this.deleteCard = this.deleteCard.bind(this)
  }

  componentDidUpdate(prevProps) {
    const post = this.props
    if (post.wins !== prevProps.wins || post.matches !== prevProps.matches || post.voted !== prevProps.voted) {
      this.setState({wins: post.wins, matches: post.matches, voted: post.voted})
    }
  }

  cardVote() {
    fetch(global.API_URL + '/api/card/vote', {
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
    fetch(global.API_URL + '/api/card/unvote', {
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

  showAlert() {
    Alert.alert(
      'Options',
      '',
      [
        {text: 'Share', onPress: () => console.log('Share')},
        {text: 'Delete', onPress: this.showDeleteAlert, style: 'destructive'},
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
      ]
    )
  }

  showDeleteAlert() {
    Alert.alert(
      'Delete post',
      'Are you sure?',
      [
        {text: 'Delete', onPress: this.deleteCard, style: 'destructive'},
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
      ]
    )
  }

  deleteCard() {
    fetch(global.API_URL + '/api/card/delete', {
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
        console.log("success");
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
    return (
      <View style={{backgroundColor: 'white', borderRadius: 8, marginBottom: 40, marginTop: 10, padding: 10}}>
        <DoubleTap onDoubleTap={this.state.voted ? this.cardUnvote : this.cardVote}>
          <ImageBackground
            source={{uri: this.props.imageUrl}}
            resizeMode={'contain'}
            style={{width: win.width - 20, height: (win.width - 20) * (4.0 / 3), borderRadius: 8}}
            imageStyle={{borderRadius: 8, borderWidth: 1, borderColor: '#ccc'}}
          >
            <Text style={{position: 'absolute', right: 10, bottom: 10}}>{this.state.voted ? 'Voted' : null}</Text>
          </ImageBackground>
        </DoubleTap>
        <View style={{flex: 0, flexDirection: 'column', padding: 10}}>
          <View style={{flex: 0, flexDirection: 'row'}}>
            <View style={{flex: 1, flexDirection: 'column'}}>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('UserProfile', {userId: this.props.userId})}>
                <Text style={{fontWeight: '600', fontSize: 18, marginBottom: 5}}>{this.props.profileName}</Text>
              </TouchableOpacity>
              <Text>{formatDate(this.props.dateTime)}</Text>
            </View>
            <View>
              <View style={{flex: 1, flexDirection: 'row'}}>
                <Text style={{fontWeight: '600', fontSize: 18}}>Rank: #</Text>
                <Text style={{fontWeight: '600', fontSize: 18}}>{this.props.dailyRank + 1}</Text>
              </View>
              <Text style={{textAlign: 'right'}}>{this.state.matches ? Math.round(this.state.wins * 1.0 / this.state.matches * 100) + '%' : 0 + '%'}</Text>
            </View>
          </View>
          {this.props.isPoster ?
            <TouchableOpacity onPress={this.showAlert}>
              <Text>More</Text>
            </TouchableOpacity>
            :
            null
          }

        </View>
      </View>
    )
  }
}
