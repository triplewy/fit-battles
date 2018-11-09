import React from 'react';
import {Dimensions, FlatList, View, StyleSheet, Text, TouchableHighlight, TouchableOpacity} from 'react-native';
import LeaderboardUser from './LeaderboardUser'

export default class Weekly extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      leaderboard: [],
      refreshing: false
    };

    this.fetchWeeklyLeaderboard = this.fetchWeeklyLeaderboard.bind(this)
    this.renderItem = this.renderItem.bind(this)
  }

  componentDidMount() {
    this.fetchWeeklyLeaderboard()
  }

  fetchWeeklyLeaderboard() {
    this.setState({refreshing: true})
    fetch(global.API_URL + '/api/leaderboard/weekly', {
      credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      this.setState({leaderboard: data, refreshing: false})
    })
    .catch((error) => {
      console.error(error);
    });
  }

  renderItem(item) {
    return (
      <LeaderboardUser user={item.item} index={item.index} navigation={this.props.navigation} />
    )
  }

  render() {
    return (
      <FlatList
        data={this.state.leaderboard}
        renderItem={this.renderItem}
        keyExtractor={(item, index) => index.toString()}
        onRefresh={this.fetchWeeklyLeaderboard}
        refreshing={this.state.refreshing}
      />
    )
  }
}
