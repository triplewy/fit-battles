import React from 'react';
import {FlatList, View, StyleSheet, TouchableHighlight, ActivityIndicator} from 'react-native';

export default class Leaderboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      leaderboard: [],
      page: 0,
      refreshing: false,
      updating: false,
      finished: false
    };

    this.refreshLeaderboard = this.refreshLeaderboard.bind(this)
    this.fetchLeaderboard = this.fetchLeaderboard.bind(this)
    this.updatePage = this.updatePage.bind(this)
    this.renderItem = this.renderItem.bind(this)
    this.renderFooter = this.renderFooter.bind(this)
  }

  componentDidMount() {
    this.refreshLeaderboard()
  }

  refreshLeaderboard() {
    this.setState({refreshing: true, page: 0})
    fetch(global.API_URL + this.props.API_URL + '/page=0', {
      credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      if (this.props.API_URL !== '/api/leaderboard/daily') {
        console.log('here');
        if (data.length > 0) {
          var wins = data[0].wins
          var rank = 1;
          for (var i = 0; i < data.length; i++) {
            var intWins = data[i].wins * 1
            if (intWins <  wins) {
              wins = intWins
              rank++
            }
            data[i].rank = rank
          }
        }
      }
      this.setState({leaderboard: data, refreshing: false, finished: data.length < this.props.dataLength})
    })
    .catch((error) => {
      console.error(error);
    });
  }

  fetchLeaderboard() {
    fetch(global.API_URL + this.props.API_URL + '/page=' + this.state.page, {
      credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      var newData = this.state.leaderboard.concat(data)
      if (this.props.API_URL !== '/api/leaderboard/daily') {
        if (newData.length > 0) {
          var wins = data[0].wins
          var rank = 1;
          for (var i = 0; i < newData.length; i++) {
            var intWins = newData[i].wins * 1
            if (intWins <  wins) {
              wins = intWins
              rank++
            }
            newData[i].rank = rank
          }
        }
      }
      this.setState({leaderboard: newData, updating: false, finished: data.length < this.props.dataLength})
    })
    .catch((error) => {
      console.error(error);
    });
  }

  updatePage() {
    if (!this.onEndReachedCalledDuringMomentum && !this.state.finished) {
      this.setState({page: this.state.page + 1, updating: true}, () => {
        this.fetchLeaderboard()
      })
    }
  }

  renderItem(item) {
    return (
      <this.props.item {...item.item} index={item.index} navigation={this.props.navigation} />
    )
  }

  renderFooter() {
    return (
      <View style={{marginBottom: 60, paddingVertical: 10}}>
        <ActivityIndicator size="large" animating={this.state.updating} color="#739aff" />
      </View>
    )
  }

  render() {
    return (
      <FlatList
        data={this.state.leaderboard}
        renderItem={this.renderItem}
        keyExtractor={(item, index) => index.toString()}
        onRefresh={this.refreshLeaderboard}
        refreshing={this.state.refreshing}
        contentContainerStyle={[this.props.style]}
        onEndReached={this.updatePage.bind(this)}
        onEndReachedThreshold={0.5}
        ListFooterComponent={this.renderFooter}
        onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
      />
    )
  }
}
