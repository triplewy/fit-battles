import React from 'react';
import { Dimensions, SafeAreaView, View, Text, StyleSheet, Image, TouchableOpacity, TouchableHighlight } from 'react-native';
import Swiper from 'react-native-deck-swiper'
import Carousel, { Pagination } from 'react-native-snap-carousel'
const url = 'http://localhost:8081'

class Card extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const win = Dimensions.get('window');
    const ratio = (win.width - 20)/this.props.width
    return (
      <View style={{backgroundColor: 'white', borderRadius: 8, alignItems: 'center'}}>
        <TouchableHighlight onPress={this.props.handleVote}>
          <Image
            source={{uri: this.props.imageUrl}}
            style={{width: win.width - 20, height: ratio * this.props.height, borderRadius: 8}}
          />
        </TouchableHighlight>
        <View>
          <Text style={{marginTop: 10, marginBottom: 10, marginLeft: 10, fontWeight: '300', fontSize: 18}}>{this.props.profileName}</Text>
          <TouchableOpacity>
            <Text>Follow</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

export default class Battles extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      battleData: [],
      currentBattle: 0,
      activeSlide: 0
    };

    this.fetchBattles = this.fetchBattles.bind(this)
    this.renderItem = this.renderItem.bind(this)
    this.handleVote = this.handleVote.bind(this)
    this.swiperRef = React.createRef();
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
    this.setState({currentBattle: this.state.currentBattle + 1, activeSlide: 0})
    this.carousel.snapToItem(0)
    const currentBattle = this.state.battleData[this.state.currentBattle]

    var winMediaId = 0
    var lossMediaId = 0

    if (index === 0) {
      winMediaId = currentBattle[0].mediaId
      lossMediaId = currentBattle[1].mediaId
    } else {
      winMediaId = currentBattle[1].mediaId
      lossMediaId = currentBattle[0].mediaId
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
        lossMediaId: lossMediaId
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
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80
    };

    const battleData = this.state.battleData

    const win = Dimensions.get('window');

    const data = [{imageUrl: 'https://s3.us-east-2.amazonaws.com/drip.io-images/026bb3d0-c8ec-11e8-9709-7d3cd8d2ea97.jpg'}, {imageUrl: 'https://s3.us-east-2.amazonaws.com/drip.io-images/f9a3b6e0-c976-11e8-880d-a9d952d8880f.jpg'}]

    if (this.state.battleData.length > 0) {
      return (
        <SafeAreaView>
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
const styles = StyleSheet.create({
  textFirst: {
    fontSize: 50,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 300,
  },
  wrapper: {
    height: 400
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
});
