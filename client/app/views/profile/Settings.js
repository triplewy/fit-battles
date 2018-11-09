import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default class Settings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };

    this.logout = this.logout.bind(this)
  }

  componentDidMount() {
  }

  logout(e) {
    fetch(global.API_URL + '/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
      if (data.message === 'success') {
        this.props.setUserId(null)
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
      <SafeAreaView style={{margin: 20}}>
        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
          <Text>Back</Text>
        </TouchableOpacity>
        <Text style={{textAlign: 'center', fontSize: 24, fontWeight: 'bold', marginVertical: 30}}>Settings</Text>
        <TouchableOpacity onPress={this.logout}>
          <Text>Logout</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  textFirst: {
  fontSize: 50,
  fontWeight: 'bold',
  textAlign: 'center',
  marginTop: 300,
  },
});
