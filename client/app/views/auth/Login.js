import React from 'react';
import { Dimensions, SafeAreaView, View, Text, TextInput, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { loggedIn } from '../../redux/actions/index.actions.js'
import { clearCookies, setCookie } from '../../Storage'
import LinearGradient from 'react-native-linear-gradient'

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
        <LinearGradient colors={['#54d7ff', '#739aff']} style={{flex: 1}}>
          <TouchableOpacity style={{paddingHorizontal: 30, marginTop: 30}} onPress={() => this.props.navigation.navigate('Tabs')}>
            <Text style={{color: 'white'}}>Back</Text>
          </TouchableOpacity>
          <View style={styles.titleView}>
            <Text style={{fontSize: 24, fontWeight: 'bold', marginVertical: 10, color: 'white'}}>Welcome Back</Text>
          </View>
          <View style={styles.inputView}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput autoCapitalize='none' autoCorrect={false} style={styles.textInput} onChangeText={(text) => this.setState({email: text})}/>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput secureTextEntry autoCapitalize='none' autoCorrect={false} style={styles.textInput} onChangeText={(text) => this.setState({password: text})}/>
            <TouchableOpacity>
              <Text style={{color: 'white', textAlign: 'right', marginVertical: 20}}>Forgot password?</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.login}>
              <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#54d7ff', '#739aff']} style={{alignItems: 'center', borderRadius: 4}}>
                <Text style={styles.loginButtonText}>Sign in</Text>
              </LinearGradient>
            </TouchableOpacity>
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', marginTop: 20}}>
              <Text style={{color: 'white', marginRight: 5}}>Don't have an account?</Text>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('Signup')}>
                <View style={{borderBottomWidth: 1, borderColor: 'white'}}>
                  <Text style={{color: 'white'}}>Sign up here!</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
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
    fontWeight: 'bold',
    color: 'white'
  },
  textInput: {
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
    color: 'white',
    padding: 12,
    fontSize: 14,
    fontWeight: 'bold',
    borderRadius: 4,
  },
  loginButtonText: {
    padding: 15,
    fontSize: 18,
    color: 'white'
  }
})
