import React from 'react';
import { SafeAreaView, ScrollView, ListView, View, Image, CameraRoll, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default class Final extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };


  }

  componentDidMount() {
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <Text>Get Started!</Text>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('Battles')}>
          <View>
            <Text>Done</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}
