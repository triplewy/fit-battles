import React from 'react';
import { Dimensions, SafeAreaView, View, Text, StyleSheet, Image, TouchableOpacity, TouchableHighlight } from 'react-native';
import Card from './Card'
import Carousel, { Pagination } from 'react-native-snap-carousel'

const url = 'http://localhost:8081'

export default class Battles extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      battleData: [],
      currentBattle: 0,
      activeSlide: 0,
      endOfBattles: false
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
      <Card {...item} handleVote={this.handleVote}/>
    )
  }

  handleVote (index) {
    if (this.state.currentBattle === this.state.battleData.length - 1) {
      this.setState({endOfBattles: true})
    } else {
      this.setState({currentBattle: this.state.currentBattle + 1, activeSlide: 0})
    }
    this.carousel.snapToItem(0)
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

    fetch(url + '/api/battles/vote', {
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
      if (data.message === "success") {
        console.log("success");
      } else {
        console.log("failure")
      }
    })
    .catch(function(err) {
        console.log(err);
    });
  }

  fetchBattles() {
    fetch(url + '/api/battles', {
      credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      this.setState({battleData: data})
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
         containerStyle={{ backgroundColor: 'transparent' }}
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
        <SafeAreaView>
          <Text>End of battles</Text>
        </SafeAreaView>
      )
    } else {
      if (this.state.battleData.length > 0) {
        return (
          <SafeAreaView>
            <Text>Battle</Text>
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
          </SafeAreaView>
        )
      } else {
        return (
          <SafeAreaView>
            <Text>Loading</Text>
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
