import React from 'react';
import { SafeAreaView, Text, TextInput, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'

const url = "http://localhost:8081"

export default class Signup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      confirmPassword: ''
    };

    this.signup = this.signup.bind(this)
  }

  signup(e) {
    fetch(url + '/api/auth/signup', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        username: this.state.email,
        password: this.state.password,
        confirmPassword: this.state.confirmPassword
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
      <SafeAreaView>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('Login')}
        >
          <Text>Login</Text>
        </TouchableOpacity>
        <Text style={styles.textFirst}> SIGNUP </Text>
        <FormLabel>Email</FormLabel>
        <TextInput autoCapitalize='none' onChangeText={(text) => this.setState({email: text})}/>
        <FormLabel>Password</FormLabel>
        <TextInput secureTextEntry autoCapitalize='none' onChangeText={(text) => this.setState({password: text})}/>
        <FormLabel>Confirm Password</FormLabel>
        <TextInput secureTextEntry autoCapitalize='none' onChangeText={(text) => this.setState({confirmPassword: text})}/>
        <TouchableOpacity onPress={this.signup}>
          <Text>Signup</Text>
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
