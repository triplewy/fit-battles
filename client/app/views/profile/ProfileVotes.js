import React from 'react';
import {FlatList, StyleSheet, Text, TouchableHighlight, TouchableOpacity} from 'react-native';
import FeedCard from '../feed/FeedCard'

export default class ProfileVotes extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      feed: [],
      refreshing: false
    };

    this.fetchFeed = this.fetchFeed.bind(this)
    this.renderItem = this.renderItem.bind(this)
  }

  componentDidMount() {
    this.fetchFeed()
  }

  componentDidUpdate(prevProps) {
    if (this.props.refreshing && this.props.refreshing !== prevProps.refreshing) {
      this.fetchFeed()
    }
  }

  fetchFeed() {
    const params = this.props.navigationParams
    var userProfile = ''
    if (params) {
      userProfile = '/' + params.userId
    }

    this.setState({refreshing: true})
    fetch(global.API_URL + '/api/profile' + userProfile + '/votes', {
      credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      this.setState({feed: data, refreshing: false})
    })
    .catch((error) => {
      console.error(error);
    });
  }

  renderItem(item) {
    const post = item.item;
    return (
      <FeedCard {...post} navigation={this.props.navigation} />
    )
  }

  render() {
    return (
      <FlatList
        data={this.state.feed}
        renderItem={this.renderItem}
        keyExtractor={(item, index) => index.toString()}
        refreshing={this.state.refreshing}
        onRefresh={this.fetchFeed.bind(this)}
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
