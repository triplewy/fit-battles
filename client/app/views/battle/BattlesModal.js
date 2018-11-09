import React from 'react';
import { Dimensions, View, Text, StyleSheet, Image, ImageBackground, TouchableOpacity, Animated, Easing, AsyncStorage } from 'react-native';
import Modal from 'react-native-modal'

export default class BattlesModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    }

    this.fetchLastVisit = this.fetchLastVisit.bind(this)
    this.storeVisit = this.storeVisit.bind(this)
  }

  componentDidMount() {
    this.fetchLastVisit()
  }

  fetchLastVisit() {
    AsyncStorage.getItem('lastVisit')
    .then(value => {
      console.log(value);
      this.setState({showModal: true})
      this.storeVisit()
      if (value !== null) {
        const lastVisit = new Date(parseInt(value, 10))
        const now = new Date()
      } else {
        this.props.navigation.navigate('Instructions')
      }
    })
    .catch(e => {
      console.log(e);
    })
  }

  storeVisit() {
    AsyncStorage.setItem('lastVisit', JSON.stringify(Date.now()))
    .then(() => {
      console.log("success");
    })
    .catch(e => {
      console.log(e);
    })
  }

  render() {
    const win = Dimensions.get('window');
    const ratio = (win.width - 20)/this.props.width
    return (
      <Modal
        isVisible={this.state.showModal}
        onBackdropPress={() => this.setState({ showModal: false })}
      >
        <View style={{backgroundColor: 'white', alignItems: 'center', padding: 20, borderRadius: 8}}>
          <Text style={{marginBottom: 20, fontSize: 24}}>Yesterday's Winner</Text>
          <TouchableOpacity onPress={() => this.setState({showModal: false})}>
            <View style={{backgroundColor: 'blue', borderRadius: 16}}>
              <Text style={{padding: 10, color: 'white'}}>Close</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    )
  }
}
