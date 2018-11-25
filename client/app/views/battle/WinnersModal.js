import React from 'react';
import {Dimensions, Image, View, ScrollView, StyleSheet, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import { lastVisit } from '../../Storage'
import LinearGradient from 'react-native-linear-gradient'
import FeedCard from '../feed/FeedCard'
import Modal from 'react-native-modal'

export default class WinnerModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      winner: null
    };

    this.fetchLastVisit = this.fetchLastVisit.bind(this)
    this.fetchWinners = this.fetchWinners.bind(this)
  }

  componentDidMount() {
    this.fetchLastVisit()
  }

  fetchLastVisit() {
    lastVisit().then(data => {
      if (data.lastVisit === 'never') {
        this.props.navigation.navigate('Instructions')
      } else if (data.lastVisit === 'not today') {
        this.fetchWinners()
        this.setState({showModal: true})
      }
    })
  }

  fetchWinners() {
    fetch(global.API_URL + '/api/winner', {
      credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      if (data[0]) {
        this.setState({winner: data[0]})
      } else {
        console.log(data);
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  render() {
    const win = Dimensions.get('window')
    return (
      <Modal
        isVisible={this.state.showModal}
        onBackdropPress={() => this.setState({showModal: !this.state.showModal})}
      >
        <ScrollView
          contentContainerStyle={{alignItems: 'center', justifyContent: 'center', paddingVertical: 30}}
          style={{backgroundColor: 'white', borderRadius: 8, marginVertical: 60}}>
          <Text style={{marginBottom: 20, fontSize: 18, fontWeight: '300'}}>Yesterday's Winner</Text>
          {this.state.winner ?
            <FeedCard {...this.state.winner} navigation={this.props.navigation} />
            :
            <ActivityIndicator size='large' color='#739aff' animating style={{marginBottom: 20}}/>
          }
          <TouchableOpacity onPress={() => this.setState({showModal: false})}>
            <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#80e1ff', '#6770e3']}
              style={{alignItems: 'center', borderRadius: 24, paddingVertical: 15, paddingHorizontal: 30}}
            >
              <Text style={{color: 'white', fontSize: 16, fontWeight: '300'}}>Done</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </Modal>
    )
  }
}
