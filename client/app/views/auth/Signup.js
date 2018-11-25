import React from 'react';
import { KeyboardAvoidingView, View, ScrollView, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { loggedIn } from '../../redux/actions/index.actions.js'
import { clearCookies, setCookie } from '../../Storage'
import LinearGradient from 'react-native-linear-gradient'
import backIcon from '../../icons/back-icon.png'
import validator from 'validator'

export default class Signup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      emailMessage: '',
      password: '',
      passwordMessage: '',
      confirmPassword: '',
      confirmPasswordMessage: '',
      submitted: false
    };

    this.signup = this.signup.bind(this)
  }

  signup(e) {
    this.setState({submitted: true, emailMessage: '', passwordMessage: '', confirmPasswordMessage: ''})
    if (!validator.isEmail(this.state.email)) {
      this.setState({emailMessage: 'Invalid Email', submitted: false})
    } else if (this.state.password.length < 6) {
      this.setState({passwordMessage: 'Less than 6 characters', submitted: false})
    } else if (this.state.password !== this.state.confirmPassword) {
      this.setState({confirmPasswordMessage: 'Does not match password', submitted: false})
    } else {
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
            if (res.status === 200) {
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
                return res.json()
              }
            } else {
              return {message: 'not logged in'}
            }
          })
          .then(data => {
            if (data.message === 'not logged in') {
              this.setState({submitted: false, emailMessage: 'Email in use'})
            } else {
              this.setState({submitted: false})
              this.props.dispatch(loggedIn(true))
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
  }

  render() {
    return (
      <LinearGradient colors={['#54d7ff', '#739aff']} style={{flex: 1}}>
        <ScrollView>
          <KeyboardAvoidingView behavior="position">
            <TouchableOpacity style={{paddingHorizontal: 30, marginTop: 40}} onPress={() => this.props.navigation.goBack()}>
              <Image source={backIcon} style={{width: 30, height: 30}} />
            </TouchableOpacity>
            <View style={styles.titleView}>
              <Text style={{fontSize: 24, fontWeight: 'bold', color: 'white'}}>Create Account</Text>
            </View>
            <View style={styles.inputView}>
              <View style={{flexDirection: 'row', marginTop: 30, marginBottom: 10}}>
                <Text style={styles.inputLabel}>Your Email</Text>
                <Text style={{color: 'red', fontSize: 16, fontWeight: '500'}}>{this.state.emailMessage}</Text>
              </View>
              <TextInput autoCapitalize='none' autoCorrect={false} style={styles.textInput} onChangeText={(text) => this.setState({email: text})}/>
              <View style={{flexDirection: 'row', marginTop: 30, marginBottom: 10}}>
                <Text style={styles.inputLabel}>Password</Text>
                <Text style={{color: 'red', fontSize: 16, fontWeight: '500'}}>{this.state.passwordMessage}</Text>
              </View>
              <TextInput secureTextEntry autoCapitalize='none' autoCorrect={false} style={styles.textInput} onChangeText={(text) => this.setState({password: text})}/>
              <View style={{flexDirection: 'row', marginTop: 30, marginBottom: 10}}>
                <Text style={styles.inputLabel}>Confirm Password</Text>
                <Text style={{color: 'red', fontSize: 16, fontWeight: '500'}}>{this.state.confirmPasswordMessage}</Text>
              </View>
              <TextInput secureTextEntry autoCapitalize='none' autoCorrect={false} style={styles.textInput} onChangeText={(text) => this.setState({confirmPassword: text})}/>
              <TouchableOpacity onPress={this.signup} disabled={this.state.submitted}>
                <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#80e1ff', '#6770e3']} style={{alignItems: 'center', borderRadius: 4, marginTop: 30}}>
                  <Text style={styles.loginButtonText}>Sign Up</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  titleView: {
    paddingHorizontal: 30,
    marginTop: 30
  },
  inputView: {
    flex: 1,
    paddingHorizontal: 30
  },
  inputLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: 'white'
  },
  textInput: {
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
    color: 'white',
    padding: 12,
    fontSize: 16,
    fontWeight: 'bold',
    borderRadius: 4,
  },
  loginButtonText: {
    padding: 15,
    fontSize: 18,
    color: 'white'
  }
})
