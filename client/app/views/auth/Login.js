import React from 'react';
import { Dimensions, SafeAreaView, View, Text, TextInput, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { loggedIn } from '../../redux/actions/index.actions.js'
import { clearCookies, setCookie } from '../../Storage'

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
    clearCookies().then(data => {
      if (data.message === 'success') {
        fetch(global.API_URL + '/api/auth/signin', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: this.state.email,
            password: this.state.password
          })
        })
        .then(res => {
          console.log(res);
          if (res.status === 401) {
            return {message: 'not logged in'}
          } else if (res.headers.get("set-cookie")) {
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
            return res.json()
          }
        })
        .then(data => {
          if (data.message === 'not logged in') {
            this.props.navigation.dispatch(loggedIn(false))
          } else {
            this.props.navigation.dispatch(loggedIn(true))
            this.props.navigation.navigate('Tabs')
          }
        })
        .catch(function(err) {
            console.log(err);
        });
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
      <View style={{flex: 1}}>
        <View style={styles.titleView}>
          <Text style={{fontSize: 24, fontWeight: 'bold', marginVertical: 10}}>Welcome Back</Text>
          <Text style={{color: '#888888'}}>Sign in to continue</Text>
        </View>
        <View style={styles.inputView}>
          <Text style={styles.inputLabel}>Your Email</Text>
          <TextInput autoCapitalize='none' autoCorrect={false} style={styles.textInput} onChangeText={(text) => this.setState({email: text})}/>
          <Text style={styles.inputLabel}>Password</Text>
          <TextInput secureTextEntry autoCapitalize='none' autoCorrect={false} style={styles.textInput} onChangeText={(text) => this.setState({password: text})}/>
          <TouchableOpacity>
            <Text style={{color: '#888888', textAlign: 'right', marginVertical: 20}}>Forgot password?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.loginButton} onPress={this.login}>
            <Text style={styles.loginButtonText}>Sign in</Text>
          </TouchableOpacity>
          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', marginTop: 20}}>
            <Text style={{color: '#888888', marginRight: 5}}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Signup')}>
              <Text style={{color: 'purple'}}>Sign up here!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
    borderRadius: 4
  },
  loginButtonText: {
    padding: 15,
    fontSize: 18,
    color: 'white'
  }
})
