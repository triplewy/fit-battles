import React from 'react';
import {Dimensions, ImageBackground, Image, View, ScrollView, FlatList, StyleSheet, Text, TouchableHighlight, TouchableOpacity} from 'react-native';

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
    fetch(global.API_URL + '/api/leaderboard/daily', {
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
    const post = item.item;
    const win = Dimensions.get('window');
    const ratio = (win.width/2)/post.width
    return (
      <TouchableOpacity onPress={() => this.props.navigation.navigate('UserProfile', {userId: post.userId})}>
        <ImageBackground
          resizeMode={'contain'}
          source={{ uri: post.imageUrl }}
          style={{width: win.width/2, height: win.width / 2.0 * 4.0 / 3}}
        >
          <View style={{position: 'absolute', right: 10, top: 10, backgroundColor: 'rgba(0,0,0,0.6)'}}>
            <Text style={{color: 'white', padding: 5}}>{post.dailyRank + 1}</Text>
          </View>
          <View style={{position: 'absolute', left: 10, bottom: 10, backgroundColor: 'rgba(0,0,0,0.6)', flexDirection: 'row'}}>
            <Text style={{color: 'white', paddingVertical: 5, paddingLeft: 3}}>{post.matches ? Math.round(post.wins * 1.0 / post.matches * 100) : 0}</Text>
            <Text style={{color: 'white', paddingVertical: 5, paddingHorizontal: 3}}>%</Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
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
