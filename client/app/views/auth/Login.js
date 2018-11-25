import React from 'react';
import { KeyboardAvoidingView, View, ScrollView, Text, TextInput, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import { loggedIn } from '../../redux/actions/index.actions.js'
import { clearCookies, setCookie } from '../../Storage'
import LinearGradient from 'react-native-linear-gradient'
import backIcon from '../../icons/back-icon.png'

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.transformValue = new Animated.Value(0)
    this.state = {
      email: '',
      password: '',
      submitted: false
    };

    this.handleAnimation = this.handleAnimation.bind(this)
    this.login = this.login.bind(this)
  }

  handleAnimation(index) {
    console.log(index);
    if (index < 8) {
      Animated.timing(
        this.transformValue,
        {
          toValue: index % 2 == 0 ? -10 : 10,
          duration: 100
        }
      ).start(() => this.handleAnimation(index + 1))
    } else {
      Animated.timing(
        this.transformValue,
        {
          toValue: 0,
          duration: 60
        }
      ).start()
    }
  }

  login(e) {
    this.setState({submitted: true})
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
          if (res.status === 400 || res.status === 401) {
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
            this.setState({submitted: false})
            this.handleAnimation(0)
            // this.props.dispatch(loggedIn(false))
          } else {
            this.setState({submitted: false})
            this.props.dispatch(loggedIn(true))
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
      <LinearGradient colors={['#54d7ff', '#739aff']} style={{flex: 1}}>
        <ScrollView>
          <KeyboardAvoidingView behavior="position">
            <TouchableOpacity style={{paddingHorizontal: 30, marginTop: 40}} onPress={() => this.props.navigation.navigate('Tabs')}>
              <Image source={backIcon} style={{width: 30, height: 30}} />
            </TouchableOpacity>
            <View style={styles.titleView}>
              <Text style={{fontSize: 24, fontWeight: 'bold', color: 'white'}}>Welcome to Fit Battles</Text>
            </View>
            <View style={styles.inputView}>
                <Text style={styles.inputLabel}>Email</Text>
              <Animated.View style={{transform: [{translateX: this.transformValue}]}}>
                <TextInput autoCapitalize='none' autoCorrect={false} style={styles.textInput} onChangeText={(text) => this.setState({email: text})}/>
              </Animated.View>
              <Text style={styles.inputLabel}>Password</Text>
              <Animated.View style={{transform: [{translateX: this.transformValue}]}}>
                <TextInput secureTextEntry autoCapitalize='none' autoCorrect={false} style={styles.textInput} onChangeText={(text) => this.setState({password: text})}/>
              </Animated.View>
              {/* <TouchableOpacity>
                <Text style={{color: 'white', textAlign: 'right', marginVertical: 20}}>Forgot password?</Text>
              </TouchableOpacity> */}
              <TouchableOpacity onPress={this.login} disabled={this.state.submitted}>
                <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#80e1ff', '#6770e3']}
                  style={{alignItems: 'center', borderRadius: 4, marginVertical: 30}}>
                  <Text style={styles.loginButtonText}>Sign in</Text>
                </LinearGradient>
              </TouchableOpacity>
              <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                <Text style={{color: 'white', marginRight: 5}}>Don't have an account?</Text>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Signup')}>
                  <View style={{borderBottomWidth: 1, borderColor: 'white'}}>
                    <Text style={{color: 'white'}}>Sign up here!</Text>
                  </View>
                </TouchableOpacity>
              </View>
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
    marginTop: 30,
    marginBottom: 10,
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
