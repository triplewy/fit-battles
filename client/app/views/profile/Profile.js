import React from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, TouchableHighlight, TouchableOpacity, RefreshControl } from 'react-native';
import Rankings from './Rankings'
import ProfileFeed from './ProfileFeed'
import {follow, unfollow} from '../Follow'

const url = 'http://localhost:8081'

export default class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      profileInfo: {},
      following: false,
      refreshing: false,
      loggedIn: true
    };

    this.fetchProfileInfo = this.fetchProfileInfo.bind(this)
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
    this.setState({refreshing: true})
    fetch(url + '/api/profile' + userProfile + '/info', {
      credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
      if (data.message === 'not logged in') {
        this.setState({loggedIn: false})
      } else {
        this.setState({profileInfo: data, following: data.following, refreshing: false})
      }
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
        <SafeAreaView>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('Auth')}>
            <Text>Login or signup!</Text>
          </TouchableOpacity>
        </SafeAreaView>
      )
    } else {
      return (
        <SafeAreaView>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.fetchProfileInfo}
              />
            }
            >
            {navigationParams ?
              <View>
                <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                  <Text>Back</Text>
                </TouchableOpacity>
              </View>
              :
              <View>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Settings')}>
                  <Text>Settings</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Notifications')}>
                  <Text>Notifications</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Messages')}>
                  <Text>Messages</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Edit',
                  {profileName: profileInfo.profileName, location: profileInfo.location, about: profileInfo.about, refresh: this.fetchProfileInfo})}>
                  <Text>Edit</Text>
                </TouchableOpacity>
              </View>
            }
            <View style={{alignItems: 'center'}}>
              <Text style={styles.textFirst}>{profileInfo.profileName}</Text>
              {navigationParams ?
                <TouchableOpacity onPress={this.state.following ? this.profileUnfollow.bind(this, navigationParams.userId) : this.profileFollow.bind(this, navigationParams.userId)}>
                  <Text>{this.state.following ? 'Unfollow' : profileInfo.followsYou ? 'Follow Back' : 'Follow'}</Text>
                </TouchableOpacity>
                :
                null
              }
              <Text>{profileInfo.location}</Text>
              <Text>{profileInfo.about}</Text>
              <Text>{'followers'}</Text>
              <Text>{profileInfo.followers}</Text>
              <Text>{'following'}</Text>
              <Text>{profileInfo.following}</Text>
            </View>
            <Rankings navigationParams={navigationParams} />
            <ProfileFeed navigationParams={navigationParams} />
          </ScrollView>
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
  },
});
