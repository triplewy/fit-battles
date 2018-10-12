import React from 'react';
import {Dimensions, Image, View, SafeAreaView, FlatList, StyleSheet, Text, TouchableHighlight, TouchableOpacity} from 'react-native';
import FeedCard from './FeedCard'

const url = 'http://localhost:8081'

export default class Feed extends React.Component {
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

  fetchFeed() {
    this.setState({refreshing: true})
    fetch(url + '/api/feed', {
      credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
      this.setState({feed: data, refreshing: false})
    })
    .catch((error) => {
      console.error(error);
    });
  }

  renderItem(item) {
    const post = item.item;
    const win = Dimensions.get('window');
    const ratio = win.width/post.width
    return (
      <FeedCard {...post} />
    )
  }

  render() {
    if (this.props.userId) {
      return (
        <SafeAreaView>
          <FlatList
            data={this.state.feed}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => index.toString()}
            refreshing={this.state.refreshing}
            onRefresh={this.fetchFeed.bind(this)}
          />
        </SafeAreaView>
      )
    } else {
      return (
        <SafeAreaView>
          <Text>Login to follow users you like!</Text>
        </SafeAreaView>
      )
    }

  }
}

const styles = StyleSheet.create({
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
})
