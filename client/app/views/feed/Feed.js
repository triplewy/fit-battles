import React from 'react';
import {ScrollView, View, SafeAreaView, RefreshControl, FlatList, StyleSheet, Text, TouchableHighlight, TouchableOpacity} from 'react-native';
import FeedCard from './FeedCard'

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
    fetch(global.API_URL + '/api/feed', {
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
    return (
      <FeedCard {...post} navigation={this.props.navigation} />
    )
  }

  render() {
    if (this.state.feed.length > 0) {
      return (
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.fetchFeed.bind(this)}
            />
          }
        >
          <View style={{marginTop: 40, borderBottomWidth: 1, borderColor: '#ccc', marginHorizontal: 40}}>
            <Text style={{textAlign: 'center', fontSize: 32, fontWeight: 'bold', padding: 10}}>Feed</Text>
          </View>
          <FlatList
            data={this.state.feed}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </ScrollView>
      )
    } else {
      return (
        <SafeAreaView style={{alignItems: 'center'}}>
          <TouchableOpacity style={{marginTop: 300}} onPress={() => this.props.navigation.navigate('Auth')}>
            <Text>Login or signup!</Text>
          </TouchableOpacity>
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
