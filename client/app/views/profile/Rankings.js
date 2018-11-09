import React from 'react';
import {SafeAreaView, View, FlatList, StyleSheet, Text, TouchableHighlight, TouchableOpacity} from 'react-native';

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

  componentDidUpdate(prevProps) {
    if (this.props.refreshing && this.props.refreshing !== prevProps.refreshing) {
      this.fetchLeaderboardHeader()
    }
  }

  fetchLeaderboardHeader() {
    const params = this.props.navigationParams
    var userProfile = ''
    if (params) {
      userProfile = '/' + params.userId
    }

    fetch(global.API_URL + '/api/leaderboard' + userProfile + '/header', {
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
    if (this.state.ranks) {
      const ranks = this.state.ranks
      return (
        <View style={{flex: 1, flexDirection: 'row', marginTop: 10}}>
          <Text style={styles.rankLabel}>Daily: #</Text>
          <Text style={styles.rankNumber}>{ranks.dailyRank + 1}</Text>
          <Text style={styles.rankLabel}>Weekly: #</Text>
          <Text style={styles.rankNumber}>{ranks.weeklyRank + 1}</Text>
          <Text style={styles.rankLabel}>All Time: #</Text>
          <Text style={styles.rankNumber}>{ranks.allTimeRank + 1}</Text>
        </View>
      )
    } else {
      return (
        <View>
          <Text>Loading</Text>
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  rankLabel: {
    marginLeft: 20
  },
  rankNumber: {
    fontWeight: 'bold'
  }
});
