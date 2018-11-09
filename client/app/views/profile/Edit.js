import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'

export default class Edit extends React.Component {
  constructor(props) {
    super(props);

    const params = this.props.navigation.state.params

    this.state = {
      profileName: params.profileName,
      profileNameAvailable: false,
      location: params.location,
      about: params.about
    };

    this.checkProfileName = this.checkProfileName.bind(this)
    this.save = this.save.bind(this)
  }

  componentDidMount() {
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
    fetch(global.API_URL + '/api/profile/edit', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        profileName: this.state.profileName,
        location: this.state.location,
        about: this.state.about
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.message === "success") {
        this.props.navigation.state.params.refresh()
        this.props.navigation.goBack()
      } else {
        console.log(data.message);
      }
    })
    .catch(function(err) {
      console.log(err);
    })
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <TouchableOpacity style={{paddingHorizontal: 30, paddingVertical: 10}} onPress={() => this.props.navigation.goBack()}>
          <Text>Back</Text>
        </TouchableOpacity>
        <View style={styles.titleView}>
          <Text style={{fontSize: 24, fontWeight: 'bold', marginVertical: 10}}>Edit Profile</Text>
        </View>
        <View style={styles.inputView}>
          <Text style={styles.inputLabel}>Profile name</Text>
          <TextInput autoCapitalize='none' autoCorrect={false} style={styles.textInput} value={this.state.profileName} onChangeText={(text) => this.setState({profileName: text})}/>
          <Text style={styles.inputLabel}>Location</Text>
          <TextInput autoCapitalize='none' autoCorrect={false} style={styles.textInput} value={this.state.location} onChangeText={(text) => this.setState({location: text})}/>
          {/* <Text style={styles.inputLabel}>About</Text>
          <TextInput autoCapitalize='none' autoCorrect={false} style={styles.textInput} value={this.state.about} onChangeText={(text) => this.setState({about: text})}/> */}
          <TouchableOpacity style={styles.loginButton} onPress={this.save.bind(this)}>
            <Text style={styles.loginButtonText}>Save</Text>
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
    marginTop: 30,
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
