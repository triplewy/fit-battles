import React from 'react';
import { Dimensions, SafeAreaView, ScrollView, RefreshControl, View, Text, StyleSheet, Image, TouchableOpacity, TouchableHighlight } from 'react-native';
import Card from './Card'
import FeedCard from '../feed/FeedCard'
import Carousel, { Pagination } from 'react-native-snap-carousel'
import BattlesModal from './BattlesModal'

export default class Battles extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      battleData: [],
      currentBattle: 0,
      activeSlide: 0,
      endOfBattles: false,
      refreshing: false
    };

    this.fetchBattles = this.fetchBattles.bind(this)
    this.renderItem = this.renderItem.bind(this)
    this.handleVote = this.handleVote.bind(this)
  }

  componentDidMount() {
    this.fetchBattles()
  }

  renderItem ({item, index}) {
    return (
      <Card {...item} index={index} handleVote={this.handleVote} navigation={this.props.navigation}/>
    )
  }

  handleVote (index) {
    const currentBattle = this.state.battleData[this.state.currentBattle]

    var winMediaId = 0
    var winUserId = 0
    var lossMediaId = 0
    var lossUserId = 0

    if (index === 0) {
      winMediaId = currentBattle[0].mediaId
      winUserId = currentBattle[0].userId
      lossMediaId = currentBattle[1].mediaId
      lossUserId = currentBattle[1].userId
    } else {
      winMediaId = currentBattle[1].mediaId
      winUserId = currentBattle[1].userId
      lossMediaId = currentBattle[0].mediaId
      lossUserId = currentBattle[0].userId
    }

    fetch(global.API_URL + '/api/battles/vote', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        winMediaId: winMediaId,
        winUserId: winUserId,
        lossMediaId: lossMediaId,
        lossUserId: lossUserId
      })
    })
    .then(res => res.json())
    .then(data => {
      if (this.state.currentBattle === this.state.battleData.length - 1) {
        this.fetchBattles()
      } else {
        this.setState({currentBattle: this.state.currentBattle + 1, activeSlide: 0})
      }
      this.carousel.snapToItem(0)
    })
    .catch(function(err) {
        console.log(err);
    });
  }

  fetchBattles() {
    this.setState({refreshing: true})
    fetch(global.API_URL + '/api/battles', {
      credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      if (data.length > 0) {
        this.setState({battleData: data, currentBattle: 0, refreshing: false})
      } else {
        this.setState({endOfBattles: true, refreshing: false})
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  get pagination () {
   const { battleData, currentBattle, activeSlide } = this.state;
   return (
       <Pagination
         dotsLength={battleData[currentBattle].length}
         activeDotIndex={activeSlide}
         containerStyle={{ backgroundColor: 'transparent', paddingVertical: 0}}
         dotStyle={{
             width: 8,
             height: 8,
             borderRadius: 5,
             marginHorizontal: 2,
             backgroundColor: 'rgba(0, 0, 0, 0.8)'
         }}
         inactiveDotStyle={{
             // Define styles for inactive dots here
         }}
         inactiveDotOpacity={0.4}
         inactiveDotScale={0.6}
       />
   );
   }

  render() {
    const battleData = this.state.battleData
    const win = Dimensions.get('window');

    if (this.state.endOfBattles) {
      return (
        <ScrollView
          style={{paddingTop: 30, marginBottom: 30}}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.fetchBattles.bind(this)}
            />
          }
          >
          <Text style={{textAlign: 'center', marginTop: 300}}>You have no more battles left</Text>
        </ScrollView>
      )
    } else {
      if (this.state.battleData.length > 0) {
        return (
          <ScrollView
            style={{paddingTop: 30, paddingBottom: 30}}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.fetchBattles.bind(this)}
              />
            }
          >
            <BattlesModal {...this.props} />
            <View style={{borderBottomWidth: 1, borderColor: '#ccc', marginHorizontal: 40}}>
              <Text style={{textAlign: 'center', fontSize: 24, fontWeight: 'bold', paddingVertical: 10}}>Battle</Text>
            </View>
            <Carousel
              ref={(c) => { this.carousel = c }}
              data={this.state.battleData[this.state.currentBattle]}
              renderItem={this.renderItem}
              sliderWidth={win.width}
              itemWidth={win.width}
              onSnapToItem={(index) => this.setState({activeSlide: index})}
              layout={'default'}
            />
            {this.pagination}
          </ScrollView>
        )
      } else {
        return (
          <SafeAreaView>
            <BattlesModal {...this.props} />
            <Text style={{textAlign: 'center', marginTop: 300}}>Loading</Text>
          </SafeAreaView>
        )
      }
    }
  }
}
const styles = StyleSheet.create({
  textFirst: {
    fontSize: 50,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 300,
  }
});
