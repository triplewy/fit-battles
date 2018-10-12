import React from 'react';
import {Dimensions, Image, View, ScrollView, FlatList, StyleSheet, Text, TouchableHighlight, TouchableOpacity} from 'react-native';

const url = 'http://localhost:8081'

export default class Daily extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      leaderboard: [],
      refreshing: false
    };

    this.fetchDailyLeaderboard = this.fetchDailyLeaderboard.bind(this)
    this.renderItem = this.renderItem.bind(this)
  }

  componentDidMount() {
    this.fetchDailyLeaderboard()
  }

  fetchDailyLeaderboard() {
    this.setState({refreshing: true})
    fetch(url + '/api/leaderboard/daily', {
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
    console.log(item);
    const post = item.item;
    const win = Dimensions.get('window');
    const ratio = (win.width/2)/post.width
    return (
      <TouchableHighlight>
        <Image
          source={{ uri: post.imageUrl }}
          style={{width: win.width/2, height: post.height * ratio}} />
      </TouchableHighlight>
    )
  }

  render() {
    return (
      <FlatList
        data={this.state.leaderboard}
        numColumns={2}
        renderItem={this.renderItem}
        keyExtractor={(item, index) => index}
        onRefresh={this.fetchDailyLeaderboard}
        refreshing={this.state.refreshing}
      />
    )
  }
}

const styles = StyleSheet.create({
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
})
