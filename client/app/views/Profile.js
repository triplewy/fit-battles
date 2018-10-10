import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const url = 'http://localhost:8081'

export default class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };

    this.logout = this.logout.bind(this)
  }

  logout(e) {
    fetch(url + '/api/auth/logout', {
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
      <View>
        <Text style={styles.textFirst}> Profile </Text>
        <TouchableOpacity onPress={this.logout}>
          <Text>Logout</Text>
        </TouchableOpacity>
      </View>
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
