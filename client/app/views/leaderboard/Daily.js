import React from 'react';
import {View, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator} from 'react-native';
import Leaderboard from './Leaderboard'
import FeedCard from '../feed/FeedCard'

export default class Daily extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    return (
      <Leaderboard API_URL='/api/leaderboard/daily' dataLength={10} item={FeedCard} {...this.props} style={{alignItems: 'center'}} />
    )
  }
}
