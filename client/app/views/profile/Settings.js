import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { loggedIn } from '../../redux/actions/index.actions'

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
        this.props.navigation.dispatch(loggedIn(false))
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
      <View>
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
