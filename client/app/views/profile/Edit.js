import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient'

export default class Edit extends React.Component {
  constructor(props) {
    super(props);

    const params = this.props.navigation.state.params

    this.state = {
      profileName: '',
      profileMessage: '',
      location: '',
    };

    this.fetchProfileInfo = this.fetchProfileInfo.bind(this)
    this.checkProfileName = this.checkProfileName.bind(this)
    this.save = this.save.bind(this)
  }

  componentDidMount() {
    this.fetchProfileInfo()
  }

  fetchProfileInfo() {
    fetch(global.API_URL + '/api/profile/info', {
      credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
      if (data.message === 'not logged in') {
      } else {
        this.setState({profileName: data.profileName, location: data.location})
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  checkProfileName(e) {
    const profileName = e.target.value
    this.setState({profileName: profileName})
    fetch(global.API_URL + '/api/profile/checkProfileName/' + profileName, {
      credentials: 'include',
    })
    .then(res => res.json())
    .then(data => {
      if (data.message === "unique") {
        this.setState({profileNameAvailable: true})
      } else {
        this.setState({profileNameAvailable: false})
      }
    })
    .catch(function(err) {
      console.log(err);
    })
  }

  save() {
    this.setState({profileMessage: ''})
    fetch(global.API_URL + '/api/profile/edit', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        profileName: this.state.profileName,
        location: this.state.location
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.message === "success") {
        Alert.alert(
          'Edited successfully',
          'Refresh profile to see changes',
          [
            {text: 'OK', onPress: () => this.props.navigation.goBack()}
          ]
        )
      } else {
        this.setState({profileMessage: 'Name taken'})
      }
    })
    .catch(function(err) {
      console.log(err);
    })
  }

  render() {
    return (
      <View style={styles.inputView}>
        <View style={{flexDirection: 'row', marginTop: 20, marginBottom: 10}}>
          <Text style={styles.inputLabel}>Profile name</Text>
          <Text style={{fontSize: 16, color: 'red'}}>{this.state.profileMessage}</Text>
        </View>
        <TextInput autoCapitalize='none' autoCorrect={false} style={styles.textInput} value={this.state.profileName} onChangeText={(text) => this.setState({profileName: text})}/>
        <View style={{flexDirection: 'row', marginTop: 20, marginBottom: 10}}>
          <Text style={styles.inputLabel}>Location</Text>
        </View>
        <TextInput autoCapitalize='none' autoCorrect={false} style={styles.textInput} value={this.state.location} onChangeText={(text) => this.setState({location: text})}/>
        <TouchableOpacity onPress={this.save.bind(this)}>
          <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#54d7ff', '#739aff']} style={{marginTop: 30, alignItems: 'center', borderRadius: 4}}>
            <Text style={styles.loginButtonText}>Save</Text>
          </LinearGradient>
        </TouchableOpacity>
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
    flex: 1,
    fontSize: 16,
    fontWeight: '500'
  },
  textInput: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#739aff',
    padding: 12,
    fontSize: 16,
    borderRadius: 4,
    backgroundColor: 'white'
  },
  loginButtonText: {
    padding: 15,
    fontSize: 18,
    color: 'white'
  }
})
