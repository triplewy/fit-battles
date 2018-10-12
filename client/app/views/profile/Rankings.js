import React from 'react';
import {SafeAreaView, View, FlatList, StyleSheet, Text, TouchableHighlight, TouchableOpacity} from 'react-native';

const url = 'http://localhost:8081'

export default class Rankings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ranks: null
    };

    this.fetchLeaderboardHeader = this.fetchLeaderboardHeader.bind(this)
  }

  componentDidMount() {
    this.fetchLeaderboardHeader()
  }

  fetchLeaderboardHeader() {
    fetch(url + '/api/leaderboard/header', {
      credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
      this.setState({ranks: data})
    })
    .catch((error) => {
      console.error(error);
    });
  }

  render() {
    if (this.props.userId) {
      if (this.state.ranks) {
        const ranks = this.state.ranks
        return (
          <SafeAreaView>
            <View>
              <Text>Daily Rank</Text>
              <Text>{ranks.dailyRank}</Text>
              <Text>Weekly Rank</Text>
              <Text>{ranks.weeklyRank}</Text>
              <Text>All Time Rank</Text>
              <Text>{ranks.allTimeRank}</Text>
            </View>
          </SafeAreaView>
        )
      } else {
        return (
          <SafeAreaView>
            <Text>Loading</Text>
          </SafeAreaView>
        )
      }
    }
     else {
      return (
        <SafeAreaView>
          <Text>Please log in to see ranks</Text>
        </SafeAreaView>
      )
    }
  }
}
