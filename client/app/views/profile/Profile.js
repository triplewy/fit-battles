import React from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, TouchableHighlight, TouchableOpacity, RefreshControl } from 'react-native';
import Rankings from './Rankings'
import ProfileFeed from './ProfileFeed'
import ProfileVotes from './ProfileVotes'
import {follow, unfollow} from '../Follow'

export default class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      profileInfo: {},
      following: false,
      refreshing: false,
      loggedIn: true,
      feedToggle: 0
    };

    this.fetchProfileInfo = this.fetchProfileInfo.bind(this)
    this.refreshProfile = this.refreshProfile.bind(this)
    this.profileFollow = this.profileFollow.bind(this)
    this.profileUnfollow = this.profileUnfollow.bind(this)
  }

  componentDidMount() {
    this.fetchProfileInfo()
  }

  componentDidUpdate(prevProps) {
    if (this.props.userId !== prevProps.userId) {
      this.fetchProfileInfo()
    }
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
        this.setState({loggedIn: false, refreshing: false})
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
          this.setState({loggedIn: false, refreshing: false})
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

  render() {
    const profileInfo = this.state.profileInfo
    const navigationParams = this.props.navigation.state.params
    if (!this.state.loggedIn) {
      return (
        <SafeAreaView style={{alignItems: 'center'}}>
          <TouchableOpacity style={{marginTop: 300}} onPress={() => this.props.navigation.navigate('Auth')}>
            <Text>Login or signup!</Text>
          </TouchableOpacity>
        </SafeAreaView>
      )
    } else {
      return (
        <ScrollView
          style={this.props.selfProfile ? styles.scrollView : null}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.refreshProfile}
            />
          }
          >
          <View style={{alignItems: 'center', padding: 10}}>
            <Text style={styles.profileName}>{profileInfo.profileName}</Text>
            {navigationParams ?
              // <TouchableOpacity onPress={this.state.following ? this.profileUnfollow.bind(this, navigationParams.userId) : this.profileFollow.bind(this, navigationParams.userId)}>
              //   <Text>{this.state.following ? 'Unfollow' : profileInfo.followsYou ? 'Follow Back' : 'Follow'}</Text>
              // </TouchableOpacity>
              null
              :
              <View style={{flex: 1, flexDirection: 'row'}}>
                <TouchableOpacity style={styles.profileButtons} onPress={() => this.props.navigation.navigate('Settings')}>
                  <Text>Settings</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity style={styles.profileButtons} onPress={() => this.props.navigation.navigate('Notifications')}>
                  <Text>Notifications</Text>
                </TouchableOpacity> */}
                <TouchableOpacity style={styles.profileButtons} onPress={() => this.props.navigation.navigate('Edit',
                  {profileName: profileInfo.profileName, location: profileInfo.location, about: profileInfo.about, refresh: this.fetchProfileInfo})}>
                  <Text>Edit</Text>
                </TouchableOpacity>
              </View>
            }
            <View style={{marginVertical: 10, alignItems: 'center'}}>
              <Text style={{fontSize: 16, fontWeight: '400', marginBottom: 5}}>{profileInfo.location}</Text>
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
            <TouchableOpacity style={styles.feedToggleButton} onPress={() => this.setState({feedToggle: 0})}>
              <Text style={{padding: 5, color: this.state.feedToggle ? null : 'purple'}}>Posts</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.feedToggleButton} onPress={() => this.setState({feedToggle: 1})}>
              <Text style={{padding: 5, color: this.state.feedToggle ? 'purple' : null}}>Votes</Text>
            </TouchableOpacity>
          </View>
          {
            this.state.feedToggle ?
            <ProfileVotes navigationParams={navigationParams} navigation={this.props.navigation} refreshing={this.state.refreshing} />
            :
            <ProfileFeed navigationParams={navigationParams} navigation={this.props.navigation} refreshing={this.state.refreshing} />
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
    paddingVertical: 10,
    fontSize: 50,
    fontWeight: 'bold'
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
    borderBottomWidth: 1,
    marginHorizontal: 20,
    borderColor: '#ccc'
  },
  feedToggleButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10
  }
});
