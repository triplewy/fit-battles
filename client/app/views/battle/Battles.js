import React from 'react';
import { Dimensions, SafeAreaView, ScrollView, RefreshControl, View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { lastVisit, getLatestDate, storeLatestDate } from '../../Storage'
import Card from './Card'
import FeedCard from '../feed/FeedCard'
import Carousel, { Pagination } from 'react-native-snap-carousel'
import LinearGradient from 'react-native-linear-gradient'
import WinnersModal from './WinnersModal'

export default class Battles extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      battleData: [],
      currentBattle: 0,
      activeSlide: 0,
      endOfBattles: false,
      refreshing: false,
      showModal: false
    };

    this.refreshBattles = this.refreshBattles.bind(this)
    this.fetchBattles = this.fetchBattles.bind(this)
    this.fetchBattlesHelper = this.fetchBattlesHelper.bind(this)
    this.renderItem = this.renderItem.bind(this)
    this.handleVote = this.handleVote.bind(this)
  }

  componentDidMount() {
    this.fetchBattles()
  }

  refreshBattles() {
    this.setState({refreshing: true}, () => {
      if (this.props.state.auth) {
        console.log(global.API_URL);
        fetch(global.API_URL + '/api/battles', {
          credentials: 'include'
        })
        .then(res => res.json())
        .then(data => {
          console.log(data);
          if (data.length > 0) {
            this.setState({battleData: data, currentBattle: 0, endOfBattles: false, refreshing: false})
          } else {
            this.setState({endOfBattles: true, refreshing: false})
          }
        })
        .catch((error) => {
          console.error(error);
        })
      } else {
        getLatestDate().then(dateTime => {
          var datetimeQuery = ''
          if (dateTime) {
            datetimeQuery += '/' + dateTime
          }
          fetch(global.API_URL + '/api/battles' + datetimeQuery, {
            credentials: 'include'
          })
          .then(res => res.json())
          .then(data => {
            console.log(data);
            if (data.length > 0) {
              this.setState({battleData: data, currentBattle: 0, endOfBattles: false, activeSlide: 0, refreshing: false})
            } else {
              this.setState({endOfBattles: true, refreshing: false})
            }
          })
          .catch((error) => {
            console.error(error);
          })
        })
        .catch(err => {
          console.log(err);
        })
      }
    })
  }

  fetchBattles() {
    if (this.props.state.auth) {
      this.fetchBattlesHelper('')
    } else {
      getLatestDate().then(dateTime => {
        var datetimeQuery = ''
        if (dateTime) {
          datetimeQuery += '/' + dateTime
        }
        this.fetchBattlesHelper(datetimeQuery)
      })
      .catch(err => {
        console.log(err);
      })
    }
  }

  fetchBattlesHelper(datetimeQuery) {
    console.log(global.API_URL);
    fetch(global.API_URL + '/api/battles' + datetimeQuery, {
      credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      if (data.length > 0) {
        this.setState({battleData: data, currentBattle: 0, endOfBattles: false, activeSlide: 0})
      } else {
        this.setState({endOfBattles: true})
      }
    })
    .catch((error) => {
      console.error(error);
    })
  }

  renderItem ({item, index}) {
    return (
      <View style={{alignItems: 'center'}}>
        <Card {...item} index={index} handleVote={this.handleVote} navigation={this.props.navigation} key={item.mediaId} />
      </View>
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
      storeLatestDate(currentBattle[1].dateTime)
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

  get pagination () {
   const { battleData, currentBattle, activeSlide } = this.state;
   return (
       <Pagination
         dotsLength={battleData[currentBattle].length}
         activeDotIndex={activeSlide}
         containerStyle={{ backgroundColor: 'transparent'}}
         dotStyle={{
             width: 8,
             height: 8,
             borderRadius: 5,
             marginHorizontal: 2,
             marginVertical: 5,
             backgroundColor: '#739aff'
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
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.refreshBattles.bind(this)}
            />
          }
          >
            <View style={{marginTop: 200, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{marginBottom: 10, fontSize: 16, color: '#739aff'}}>You have no more battles left.</Text>
              <Text style={{fontSize: 16, color: '#739aff'}}>Swipe down to see if you have more!</Text>
            </View>
        </ScrollView>
      )
    } else {
      if (this.state.battleData.length > 0) {
        return (
          <ScrollView
            style={{paddingTop: 10}}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.fetchBattles.bind(this)}
              />
            }
          >
              <WinnersModal {...this.props} />
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
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <ActivityIndicator size='large' color='#739aff' animating />
          </View>
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
