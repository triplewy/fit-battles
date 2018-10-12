import React from 'react';
import {Dimensions, Image, View, SafeAreaView, FlatList, StyleSheet, Text, TouchableHighlight, TouchableOpacity} from 'react-native';
import FeedCard from '../feed/FeedCard'

const url = 'http://localhost:8081'

export default class ProfileFeed extends React.Component {
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
    const params = this.props.navigationParams
    var userProfile = ''
    if (params) {
      userProfile = '/' + params.userId
    }

    this.setState({refreshing: true})
    fetch(url + '/api/profile' + userProfile + '/feed', {
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
    const win = Dimensions.get('window');
    const ratio = win.width/post.width
    return (
      <FeedCard {...post} />
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
