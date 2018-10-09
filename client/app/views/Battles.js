import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const url = 'http://localhost:8081'

export default class Battles extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      battleData: []
    };

    this.fetchBattles = this.fetchBattles.bind(this)
  }

  componentDidMount() {
    this.fetchBattles()
  }

  fetchBattles() {
    console.log("url is", url);
    fetch(url + '/api/battles', {
      credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
      this.setState({battleData: data})
    })
    .catch((error) => {
      console.error(error);
    });
  }

  render() {
    if (this.state.battleData.length > 0) {
      return (
        <View>
          <Text style={styles.textFirst}>{this.state.battleData}</Text>
        </View>
      )
    } else {
      return (
        <View>
          <Text style={styles.textFirst}>Loading</Text>
        </View>
      )
    }

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
