import React from 'react';
import {Dimensions, View, StyleSheet, Text, TouchableHighlight, TouchableOpacity} from 'react-native';

export default class LeaderboardUser extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };

  }

  render() {
    const win = Dimensions.get('window');
    const user = this.props.user

    return (
      <TouchableOpacity onPress={() => this.props.navigation.navigate('UserProfile', {userId: user.userId})}>
        <View style={{flex: 1, flexDirection: 'row', height: 60, padding: 10, backgroundColor: 'white', marginTop: 2}}>
          <View style={{marginRight: 20, justifyContent: 'center'}}>
            <Text style={{fontWeight: 'bold', color: '#739aff'}}>{this.props.index + 1}</Text>
          </View>
          <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center'}}>
            <Text>{user.profileName}</Text>
            {/* <View style={{flex: 0, flexDirection: 'row'}}>
              <Text style={{marginRight: 5}}>{user.followers}</Text>
              <Text>followers</Text>
            </View> */}
          </View>
          <View style={{justifyContent: 'center'}}>
            <View style={{flex: 0, flexDirection: 'row', justifyContent: 'center'}}>
              <Text style={{textAlign: 'right', marginRight: 5}}>{user.wins}</Text>
              <Text>wins</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}
