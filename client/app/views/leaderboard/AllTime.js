import React from 'react';
import {Dimensions, FlatList, View, StyleSheet, Text, TouchableHighlight, TouchableOpacity} from 'react-native';
import LeaderboardUser from './LeaderboardUser'

const url = 'http://localhost:8081'

export default class AllTime extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      leaderboard: [],
      refreshing: false
    };

    this.fetchAllTimeLeaderboard = this.fetchAllTimeLeaderboard.bind(this)
    this.renderItem = this.renderItem.bind(this)
  }

  componentDidMount() {
    this.fetchAllTimeLeaderboard()
  }

  fetchAllTimeLeaderboard() {
    this.setState({refreshing: true})
    fetch(url + '/api/leaderboard/allTime', {
      credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
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
        onRefresh={this.fetchAllTimeLeaderboard}
        refreshing={this.state.refreshing}
      />
    )
  }
}
