import React from 'react';
import {Dimensions, Image, Modal, View, SafeAreaView, StyleSheet, Text, TouchableHighlight, TouchableOpacity} from 'react-native';

export default class WinnerModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      winner: null
    };

    this.fetchWinners = this.fetchWinners.bind(this)
  }

  componentDidMount() {
    this.fetchWinners()
  }

  fetchWinners() {
    fetch(global.API_URL + '/api/winner', {
      credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      if (data[0]) {
        this.setState({winner: data})
      } else {
        console.log(data);
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  render() {
    return (
      <SafeAreaView style={{height: '100%'}}>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('Main')}>
          <Text>Close</Text>
        </TouchableOpacity>
        <Text style={{textAlign: 'center'}}>Modal</Text>
      </SafeAreaView>
    )
  }
}
