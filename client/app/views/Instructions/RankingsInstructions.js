import React from 'react';
import { SafeAreaView, ScrollView, ListView, View, Image, CameraRoll, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default class RankingsInstructions extends React.Component {
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
        <Text>Battles</Text>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('Final')}>
          <View>
            <Text>Next</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}
