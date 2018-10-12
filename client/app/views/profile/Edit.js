import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'

const url = 'http://localhost:8081'

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
    fetch(url + '/api/profile/checkProfileName/' + profileName, {
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
    fetch(url + '/api/profile/edit', {
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
      <SafeAreaView>
        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
          <Text>Back</Text>
        </TouchableOpacity>
        <View>
          <FormLabel>Profile Name</FormLabel>
          <TextInput autoCapitalize='none' value={this.state.profileName} onChangeText={(text) => this.setState({profileName: text})}/>
          <FormLabel>Location</FormLabel>
          <TextInput autoCapitalize='none' value={this.state.location} onChangeText={(text) => this.setState({location: text})}/>
          <FormLabel>About</FormLabel>
          <TextInput autoCapitalize='none' value={this.state.about} onChangeText={(text) => this.setState({about: text})}/>
          <TouchableOpacity onPress={this.save.bind(this)}>
            <Text>Save</Text>
          </TouchableOpacity>
        </View>
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
