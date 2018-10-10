import React from 'react';
import { SafeAreaView, View, Text, TextInput, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'

const url = "http://localhost:8081"

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: ''
    };

    this.login = this.login.bind(this)
  }

  login(e) {
    fetch(url + '/api/auth/signin', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        username: this.state.email,
        password: this.state.password
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.message === 'not logged in') {
        this.setState({userId: null});
      } else {
        this.props.setUserId(data.userId)
      }
    })
    .catch(function(err) {
        console.log(err);
    });
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('Signup')}
        >
          <Text>Signup</Text>
        </TouchableOpacity>
        <Text style={styles.textFirst}> LOGIN </Text>
        <FormLabel>Email</FormLabel>
        <TextInput autoCapitalize='none' onChangeText={(text) => this.setState({email: text})}/>
        <FormLabel>Password</FormLabel>
        <TextInput secureTextEntry autoCapitalize='none' onChangeText={(text) => this.setState({password: text})}/>
        <TouchableOpacity onPress={this.login}>
          <Text>Login</Text>
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
