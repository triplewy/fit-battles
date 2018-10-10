import React from 'react';
import { SafeAreaView, ScrollView, ListView, View, Image, CameraRoll, Text, StyleSheet } from 'react-native';
import ViewPhotos from './ViewPhotos.js'

export default class Upload extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      photos: []
    };

    this.getGallery = this.getGallery.bind(this)
  }

  componentDidMount() {
    this.getGallery()
  }

  getGallery(e) {
    CameraRoll.getPhotos({
       first: 20,
       assetType: 'Photos',
     })
     .then(r => {
       this.setState({ photos: r.edges });
     })
     .catch((err) => {
       console.log(err);
        //Error Loading Images
     })
  }

  render() {
    const navigation = this.props.navigation
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <Text style={styles.textFirst}> UPLOAD </Text>
          {this.state.photos &&
            <ViewPhotos photos={this.state.photos} navigation={navigation}/>
          }
      </SafeAreaView>
    )
  }
}
const styles = StyleSheet.create({
  textFirst: {
    fontSize: 24,
    fontWeight: '300',
    textAlign: 'center',
  },
});
