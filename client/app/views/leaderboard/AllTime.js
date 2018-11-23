import React from 'react';
import {Dimensions, FlatList, View, StyleSheet, Text, TouchableHighlight, TouchableOpacity} from 'react-native';
import Leaderboard from './Leaderboard'
import LeaderboardUser from './LeaderboardUser'

export default class AllTime extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    return (
      <Leaderboard API_URL='/api/leaderboard/allTime' dataLength={20} item={LeaderboardUser} {...this.props} />
    )
  }
}
