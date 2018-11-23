import React from 'react';
import { Dimensions, View, Text, StyleSheet, Image, ImageBackground, TouchableOpacity, Alert } from 'react-native';
import DoubleTap from '../DoubleTap'
import { formatDate } from '../Date'

export default class FeedCard extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      // wins: this.props.wins,
      // matches: this.props.matches,
      // voted: this.props.voted,
    }

    // this.cardVote = this.cardVote.bind(this)
    // this.cardUnvote = this.cardUnvote.bind(this)
    this.showAlert = this.showAlert.bind(this)
    this.showDeleteAlert = this.showDeleteAlert.bind(this)
    this.deleteCard = this.deleteCard.bind(this)
  }

  // componentDidUpdate(prevProps) {
  //   const post = this.props
  //   if (post.wins !== prevProps.wins || post.matches !== prevProps.matches || post.voted !== prevProps.voted) {
  //     this.setState({wins: post.wins, matches: post.matches, voted: post.voted})
  //   }
  // }

  // cardVote() {
  //   fetch(global.API_URL + '/api/card/vote', {
  //     method: 'POST',
  //     headers: {
  //       'Accept': 'application/json',
  //       'Content-Type': 'application/json',
  //     },
  //     credentials: 'include',
  //     body: JSON.stringify({
  //       mediaId: this.props.mediaId,
  //       mediaUserId: this.props.userId
  //     })
  //   })
  //   .then(res => res.json())
  //   .then(data => {
  //     if (data.message === "success") {
  //       this.setState({voted: true, wins: this.state.wins + 1, matches: this.state.matches + 1})
  //     } else {
  //       console.log("failure")
  //     }
  //   })
  //   .catch(function(err) {
  //       console.log(err);
  //   });
  // }
  //
  // cardUnvote() {
  //   fetch(global.API_URL + '/api/card/unvote', {
  //     method: 'POST',
  //     headers: {
  //       'Accept': 'application/json',
  //       'Content-Type': 'application/json',
  //     },
  //     credentials: 'include',
  //     body: JSON.stringify({
  //       mediaId: this.props.mediaId
  //     })
  //   })
  //   .then(res => res.json())
  //   .then(data => {
  //     if (data.message === "success") {
  //       this.setState({voted: false, wins: this.state.wins - 1, matches: this.state.matches - 1})
  //     } else {
  //       console.log("failure")
  //     }
  //   })
  //   .catch(function(err) {
  //       console.log(err);
  //   });
  // }

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
      <View style={{backgroundColor: 'white', borderRadius: 8, marginBottom: 30, marginTop: 20, width: win.width - 60}}>
        {/* <DoubleTap onDoubleTap={this.state.voted ? this.cardUnvote : this.cardVote}> */}
          <ImageBackground
            source={{uri: this.props.imageUrl}}
            resizeMode={'contain'}
            style={{width: win.width - 60, height: (win.width - 60) * (4.0 / 3), borderRadius: 8, shadowOffset:{height: 10}, shadowColor: 'black', shadowOpacity: 0.75}}
            imageStyle={{borderRadius: 8}}
          >
            {/* <Text style={{position: 'absolute', right: 10, bottom: 10}}>{this.state.voted ? 'Voted' : null}</Text> */}
          </ImageBackground>
        {/* </DoubleTap> */}
        <View style={{flex: 0, flexDirection: 'column', paddingTop: 20, paddingBottom: 10, paddingHorizontal: 10}}>
          <View style={{marginBottom: 5, flexDirection: 'row'}}>
            <TouchableOpacity style={{flex: 1}} onPress={() => this.props.navigation.navigate('UserProfile', {userId: this.props.userId})}>
              <Text style={{fontWeight: '600', fontSize: 18}}>{this.props.profileName}</Text>
            </TouchableOpacity>
            <Text style={{fontSize: 18, fontWeight: '600'}}>{'#' + (this.props.dailyRank + 1)}</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={{color: '#66757f', flex: 1}}>{formatDate(this.props.dateTime)}</Text>
            <Text style={{color: this.props.wins / this.props.matches >= 0.5 ? '#9FDD9A' : 'red'}}>{this.props.matches ? Math.round(this.props.wins * 1.0 / this.props.matches * 100) + '%' : 0 + '%'}</Text>
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
