import React from 'react';
import { SafeAreaView, View, Text, TextInput, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'

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
    clearCookies().then(data => {
      if (data.message === 'success') {
        fetch(global.API_URL + '/api/auth/signup', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: this.state.email,
            password: this.state.password,
            confirmPassword: this.state.confirmPassword
          })
        })
        .then(res => {
          console.log(res);
          if (res.headers.get("set-cookie")) {
            console.log("set cookie is", res.headers.get("set-cookie"));
            return setCookie(res.headers.get("set-cookie")).then(data => {
              if (data.message === 'success') {
                return res.json()
              } else {
                console.log(data);
              }
            })
            .catch(err => {
              console.log(err);
            })
          } else {
            if (res.status === 401) {
              return {message: 'not logged in'}
            } else {
              return res.json()
            }
          }
        })
        .then(data => {
          if (data.message === 'not logged in') {
            this.setState({userId: null});
          } else {
            this.props.navigation.dispatch(loggedIn(true))
            this.props.navigation.navigate('Tabs')
          }
        })
        .catch(function(err) {
            console.log(err);
        })
      } else {
        console.log(data);
      }
    })
    .catch(err => {
      console.log(err);
    })
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <TouchableOpacity style={{paddingHorizontal: 30}} onPress={() => this.props.navigation.goBack()}>
          <Text>Back</Text>
        </TouchableOpacity>
        <View style={styles.titleView}>
          <Text style={{fontSize: 24, fontWeight: 'bold', marginVertical: 10}}>Sign up</Text>
        </View>
        <View style={styles.inputView}>
          <Text style={styles.inputLabel}>Your Email</Text>
          <TextInput autoCapitalize='none' autoCorrect={false} style={styles.textInput} onChangeText={(text) => this.setState({email: text})}/>
          <Text style={styles.inputLabel}>Password</Text>
          <TextInput secureTextEntry autoCapitalize='none' autoCorrect={false} style={styles.textInput} onChangeText={(text) => this.setState({password: text})}/>
          <Text style={styles.inputLabel}>Confirm Password</Text>
          <TextInput secureTextEntry autoCapitalize='none' autoCorrect={false} style={styles.textInput} onChangeText={(text) => this.setState({confirmPassword: text})}/>
          <TouchableOpacity style={styles.loginButton} onPress={this.signup}>
            <Text style={styles.loginButtonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  titleView: {
    paddingHorizontal: 30,
    marginVertical: 30
  },
  inputView: {
    flex: 1,
    padding: 30
  },
  inputLabel: {
    marginVertical: 15,
    fontSize: 14,
    fontWeight: 'bold'
  },
  textInput: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    fontSize: 14,
    borderRadius: 4,
  },
  loginButton: {
    alignItems: 'center',
    backgroundColor: 'blue',
    borderRadius: 4,
    marginVertical: 30
  },
  loginButtonText: {
    padding: 15,
    fontSize: 18,
    color: 'white'
  }
})
