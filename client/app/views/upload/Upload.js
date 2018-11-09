import React from 'react';
import { SafeAreaView, ScrollView, ListView, View, Image, CameraRoll, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ViewPhotos from './ViewPhotos.js'

export default class Upload extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      photos: [],
      userId: null,
      page_info: null
    };

    this.getGallery = this.getGallery.bind(this)
    this.getGalleryScroll = this.getGalleryScroll.bind(this)
    this.sessionLogin = this.sessionLogin.bind(this)
  }

  componentDidMount() {
    this.sessionLogin()
  }

  sessionLogin() {
    fetch(global.API_URL + '/api/sessionLogin', {
      credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
      if (data.message !== 'not logged in') {
        this.setState({userId: data})
        this.getGallery()
      } else {
        this.setState({userId: null})
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  getGallery(e) {
    CameraRoll.getPhotos({
       first: 20,
       assetType: 'Photos',
     })
     .then(r => {
       this.setState({ photos: r.edges, page_info: r.page_info });
     })
     .catch((err) => {
       console.log(err);
        //Error Loading Images
     })
  }

  getGalleryScroll(e) {
    CameraRoll.getPhotos({
       after: this.state.page_info,
       assetType: 'Photos',
     })
     .then(r => {
       this.setState({ photos: this.state.photos.concat(r.edges), page_info: r.page_info });
     })
     .catch((err) => {
       console.log(err);
        //Error Loading Images
     })
  }

  render() {
    const navigation = this.props.navigation
    if (this.state.userId) {
      return (
        <View style={{flex: 1, backgroundColor: 'white'}}>
            {this.state.photos &&
              <ViewPhotos photos={this.state.photos} navigation={navigation} getGalleryScroll={this.getGalleryScroll}/>
            }
        </View>
      )
    } else {
      return (
        <View>
          <TouchableOpacity onPress={() => navigation.navigate('Auth')}>
            <Text style={{textAlign: 'center', marginTop: 300}}>To upload please login or signup</Text>
          </TouchableOpacity>
        </View>
      )
    }

  }
}
