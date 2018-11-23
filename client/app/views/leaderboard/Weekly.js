import React from 'react';
import {FlatList, View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import Leaderboard from './Leaderboard'
import LeaderboardUser from './LeaderboardUser'

export default class Weekly extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    return (
      <Leaderboard API_URL='/api/leaderboard/weekly' dataLength={20} item={LeaderboardUser} {...this.props} />
    )
  }
}
