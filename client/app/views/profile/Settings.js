import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { loggedIn } from '../../redux/actions/index.actions'
import LinearGradient from 'react-native-linear-gradient'

export default class Settings extends React.Component {
  constructor(props) {
    super(props);
    console.log("settings props are", this.props);
    this.state = {

    };

    this.logout = this.logout.bind(this)
  }

  logout(e) {
    fetch(global.API_URL + '/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
      if (data.message === 'success') {
        this.props.dispatch(loggedIn(false))
        this.props.navigation.goBack()
      } else {
        console.log("logout failed");
      }
    })
    .catch(function(err) {
        console.log(err);
    });
  }

  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <TouchableOpacity onPress={this.logout}>
          <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#54d7ff', '#739aff']} style={{borderRadius: 8, marginBottom: 20}}>
            <Text style={{fontSize: 18, color: 'white', paddingVertical: 20, paddingHorizontal: 30}}>Logout</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }
}
