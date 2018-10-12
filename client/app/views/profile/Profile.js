import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableHighlight, TouchableOpacity } from 'react-native';

const url = 'http://localhost:8081'

export default class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      profileInfo: {}
    };

    this.fetchProfileInfo = this.fetchProfileInfo.bind(this)
  }

  componentDidMount() {
    this.fetchProfileInfo()
  }

  componentDidUpdate(prevProps) {
    if (this.props.userId !== prevProps.userId) {
      this.fetchProfileInfo()
    }
  }

  fetchProfileInfo() {
    fetch(url + '/api/profile/info', {
      credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
      this.setState({profileInfo: data})
    })
    .catch((error) => {
      console.error(error);
    });
  }

  render() {
    const profileInfo = this.state.profileInfo
    return (
      <SafeAreaView>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('Settings')}>
          <Text>Settings</Text>
        </TouchableOpacity>
        <View style={{alignItems: 'center'}}>
          <Text style={styles.textFirst}>{profileInfo.profileName}</Text>
          <Text>{profileInfo.location}</Text>
          <Text>{profileInfo.about}</Text>
          <Text>{'followers'}</Text>
          <Text>{profileInfo.followers}</Text>
          <Text>{'following'}</Text>
          <Text>{profileInfo.following}</Text>
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
  },
});
