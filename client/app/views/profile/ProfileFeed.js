import React from 'react';
import {Dimensions, Image, View, SafeAreaView, FlatList, StyleSheet, Text, TouchableHighlight, TouchableOpacity} from 'react-native';
import FeedCard from '../feed/FeedCard'

export default class ProfileFeed extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      feed: [],
      refreshing: false
    };

    this.refreshFeed = this.refreshFeed.bind(this)
    this.fetchFeed = this.fetchFeed.bind(this)
    this.renderItem = this.renderItem.bind(this)
  }

  componentDidMount() {
    this.refreshFeed()
  }

  componentDidUpdate(prevProps) {
    if (this.props.refreshing && this.props.refreshing !== prevProps.refreshing) {
      this.refreshFeed()
    } else if (this.props.page !== prevProps.page && this.props.page !== 0) {
      this.fetchFeed()
    }
  }

  refreshFeed() {
    const params = this.props.navigationParams
    var userProfile = ''
    if (params) {
      userProfile = '/' + params.userId
    }
    this.setState({refreshing: true})
    fetch(global.API_URL + '/api/profile' + userProfile + '/feed/page=0', {
      credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      if (data.length < 10) {
        this.props.setFinished()
      }
      this.setState({feed: data, refreshing: false})
    })
    .catch((error) => {
      console.error(error);
    });
  }

  fetchFeed() {
    const params = this.props.navigationParams
    var userProfile = ''
    if (params) {
      userProfile = '/' + params.userId
    }
    fetch(global.API_URL + '/api/profile' + userProfile + '/feed/page=' + this.props.page, {
      credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      if (data.length < 10) {
        this.props.setFinished()
      }
      this.setState({feed: this.state.fedd.concat(data)})
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
        onRefresh={this.refreshFeed.bind(this)}
        contentContainerStyle={{alignItems: 'center'}}
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
