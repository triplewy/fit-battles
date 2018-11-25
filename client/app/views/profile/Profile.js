import React from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, TouchableHighlight, TouchableOpacity, RefreshControl } from 'react-native';
import { follow, unfollow } from '../Follow'
import Rankings from './Rankings'
import ProfileFeed from './ProfileFeed'
import ProfileVotes from './ProfileVotes'
import LinearGradient from 'react-native-linear-gradient'

export default class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      profileInfo: {},
      following: false,
      refreshing: false,
      feedToggle: 0,
      loggedIn: true,
      page: 0,
      finished: false
    };

    this.fetchProfileInfo = this.fetchProfileInfo.bind(this)
    this.refreshProfile = this.refreshProfile.bind(this)
    this.profileFollow = this.profileFollow.bind(this)
    this.profileUnfollow = this.profileUnfollow.bind(this)
    this.updatePage = this.updatePage.bind(this)
  }

  componentDidMount() {
    this.fetchProfileInfo()
  }

  fetchProfileInfo() {
    const navigationParams = this.props.navigation.state.params
    var userProfile = ''
    if (navigationParams) {
      userProfile = '/' + navigationParams.userId
    }
    fetch(global.API_URL + '/api/profile' + userProfile + '/info', {
      credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
      if (data.message === 'not logged in') {
        this.setState({refreshing: false, loggedIn: false})
      } else {
        this.setState({profileInfo: data, following: data.following, refreshing: false})
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  refreshProfile() {
    const navigationParams = this.props.navigation.state.params
    var userProfile = ''
    if (navigationParams) {
      userProfile = '/' + navigationParams.userId
    }
    this.setState({refreshing: true})
    const requestSentAt = Date.now()
    fetch(global.API_URL + '/api/profile' + userProfile + '/info', {
      credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
      const requestFinishedAt = Date.now()
      const requestTime = requestFinishedAt - requestSentAt
      const timeout = 350 - requestTime

      setTimeout(() => {
        if (data.message === 'not logged in') {
          this.setState({refreshing: false, loggedIn: false})
        } else {
          this.setState({profileInfo: data, following: data.following, refreshing: false})
        }
      }, timeout > 0 ? timeout: 0)

    })
    .catch((error) => {
      console.error(error);
    });
  }

  profileFollow(userId) {
    follow(userId)
    .then(message => {
      if (message === 'success') {
        this.setState({following: true})
      } else {
        console.log(message);
      }
    })
    .catch(e => {
      console.log(e);
    })
  }

  profileUnfollow(userId) {
    unfollow(userId)
    .then(message => {
      if (message === 'success') {
        this.setState({following: false})
      } else {
        console.log(message);
      }
    })
    .catch(e => {
      console.log(e);
    })
  }

  updatePage() {
    this.setState({page: this.state.page + 1})
  }

  render() {
    const profileInfo = this.state.profileInfo
    const navigationParams = this.props.navigation.state.params
    const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
      const paddingToBottom = 20;
      return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
    }

    if (!this.state.loggedIn) {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('Auth')}>
            <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#54d7ff', '#739aff']} style={{paddingVertical: 20, paddingHorizontal: 30, borderRadius: 8}}>
              <Text style={{color: 'white', fontSize: 18}}>Login or signup!</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )
    } else {
      return (
        <ScrollView
          style={this.props.selfProfile ? styles.scrollView : null}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.refreshProfile}
              style={{backgroundColor: 'white'}}
            />
          }
          onScroll={({nativeEvent}) => {
            if (isCloseToBottom(nativeEvent) && !this.state.finished) {
              console.log("herererere");
              this.updatePage();
            }
          }}
          scrollEventThrottle={400}
        >
          <View style={{backgroundColor: 'white', borderRadius: 12, marginBottom: 10}}>
            <View style={{alignItems: 'center', padding: 10}}>
              <Text style={styles.profileName}>{profileInfo.profileName}</Text>
              {navigationParams ?
                // <TouchableOpacity onPress={this.state.following ? this.profileUnfollow.bind(this, navigationParams.userId) : this.profileFollow.bind(this, navigationParams.userId)}>
                //   <Text>{this.state.following ? 'Unfollow' : profileInfo.followsYou ? 'Follow Back' : 'Follow'}</Text>
                // </TouchableOpacity>
                null
                :
                // <View style={{flex: 1, flexDirection: 'row'}}>
                //   <TouchableOpacity style={styles.profileButtons} onPress={() => this.props.navigation.navigate('Settings')}>
                //     <Text>Settings</Text>
                //   </TouchableOpacity>
                //   {/* <TouchableOpacity style={styles.profileButtons} onPress={() => this.props.navigation.navigate('Notifications')}>
                //     <Text>Notifications</Text>
                //   </TouchableOpacity> */}
                //   <TouchableOpacity style={styles.profileButtons} onPress={() => this.props.navigation.navigate('Edit',
                //     {profileName: profileInfo.profileName, location: profileInfo.location, about: profileInfo.about, refresh: this.fetchProfileInfo})}>
                //     <Text>Edit</Text>
                //   </TouchableOpacity>
                // </View>
                null
              }
              <View style={{alignItems: 'center'}}>
                <Text style={{fontSize: 16, fontWeight: '400', marginBottom: 5, color: '#66757f'}}>{profileInfo.location}</Text>
                {/* <Text style={{color: '#888888'}}>{profileInfo.about}</Text> */}
              </View>
              {/* <View style={{flex: 1, flexDirection: 'row'}}>
                <Text style={styles.followersLabel}>{'Followers:'}</Text>
                <Text style={styles.followersNumber}>{profileInfo.followers}</Text>
                <Text style={styles.followersLabel}>{'Following:'}</Text>
                <Text style={styles.followersNumber}>{profileInfo.following}</Text>
              </View> */}
              <Rankings navigationParams={navigationParams} refreshing={this.state.refreshing} />
            </View>
            <View style={styles.feedToggle}>
              <TouchableOpacity style={[styles.feedToggleButton, {borderBottomWidth: 2, borderColor: this.state.feedToggle ? 'white' : '#739aff'}]} onPress={() => this.setState({feedToggle: 0, page: 0, finished: false})}>
                <Text style={{padding: 5, fontWeight: '400', fontSize: 16, color: this.state.feedToggle ? '#66757f' : '#739aff'}}>Posts</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.feedToggleButton, {borderBottomWidth: 2, borderColor: this.state.feedToggle ? '#739aff' : 'white'}]} onPress={() => this.setState({feedToggle: 1, page: 0, finished: false})}>
                <Text style={{padding: 5, fontWeight: '400', fontSize: 16, color: this.state.feedToggle ? '#739aff' : '#66757f'}}>Votes</Text>
              </TouchableOpacity>
            </View>
          </View>
          {
            this.state.feedToggle ?
            <ProfileVotes
              navigationParams={navigationParams}
              navigation={this.props.navigation}
              refreshing={this.state.refreshing}
              page={this.state.page}
              setFinished={() => {this.setState({finished: true})}}
            />
            :
            <ProfileFeed
              navigationParams={navigationParams}
              navigation={this.props.navigation}
              refreshing={this.state.refreshing}
              page={this.state.page}
              setFinished={() => {this.setState({finished: true})}}
            />
          }
        </ScrollView>
      )
    }
  }
}
const styles = StyleSheet.create({
  scrollView: {
    // paddingTop: 50
  },
  profileName: {
    paddingVertical: 5,
    fontSize: 48,
    fontWeight: 'bold',
  },
  profileButtons: {
    marginHorizontal: 5
  },
  followersLabel: {
    fontSize: 14,
    marginHorizontal: 5
  },
  followersNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 5
  },
  feedToggle: {
    flex: 0,
    flexDirection: 'row',
    // borderBottomWidth: 1,
    marginHorizontal: 60,
    // borderColor: '#ccc'
  },
  feedToggleButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 8
  }
});
