import React from 'react';
import {Dimensions, View, StyleSheet, Text, TouchableHighlight, TouchableOpacity} from 'react-native';

const url = 'http://localhost:8081'

export default class LeaderboardUser extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };

  }

  render() {
    const win = Dimensions.get('window');
    const user = this.props.user

    return (
      <TouchableHighlight onPress={() => this.props.navigation.navigate('UserProfile', {userId: user.userId})}>
        <View style={{width: win.width, height: 50}}>
          <Text>{user.profileName}</Text>
          <Text>{user.followers + 'followers'}</Text>
          <Text>{user.wins + 'wins'}</Text>
          <Text>{this.props.index + 1}</Text>
        </View>
      </TouchableHighlight>
    )
  }
}
