import React from 'react';
import {Dimensions, Image, ScrollView, View, StyleSheet, Text, TouchableHighlight, TouchableOpacity} from 'react-native';

export default class SelectedPhoto extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      image: this.props.navigation.state.params.selectedPhoto,
      progress: 0
    };

    this.crop = this.crop.bind(this)
    this.upload = this.upload.bind(this)
    this.uploadHelper = this.uploadHelper.bind(this)
  }

  crop() {

  }

  upload() {
    const selectedPhoto = this.props.navigation.state.params.selectedPhoto
    var formData = new FormData();
    formData.append('image', {uri: selectedPhoto.uri, name: "file"})
    this.uploadHelper(formData)
  }

  uploadHelper(formData) {
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.onreadystatechange = () => {
     if(xhr.readyState === 4 && xhr.status === 200){
         console.log(xhr.responseText);
         this.props.navigation.navigate('Profile')
      }
    }

    xhr.upload.onprogress = (e) => {
      console.log("loaded", e.loaded);
      console.log("total", e.total);
      this.setState({progress: e.loaded * 1.0 / e.total * 100})
    }

    xhr.open('POST', global.API_URL + '/api/upload');
    xhr.send(formData)
  }

  render() {
    const selectedPhoto = this.props.navigation.state.params
    const win = Dimensions.get('window');
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const currDate = new Date().toLocaleDateString('en-US', options)

    return (
      <ScrollView contentContainerStyle={{alignItems: 'center'}}>
        <Text style={{marginVertical: 30}}>{currDate}</Text>
        <Image
          resizeMode={'contain'}
          source={{uri: selectedPhoto.uri}}
          style={{width: win.width - 40, height: (win.width - 40) * 4.0 / 3, borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.4)', borderRadius: 8, marginBottom: 30}}/>
        <TouchableOpacity onPress={this.upload}>
          <Text style={{color: '#548EC6'}}>Upload</Text>
        </TouchableOpacity>
        <View style={{width: this.state.progress + '%', height: 20, backgroundColor: 'green'}}>

        </View>
      </ScrollView>
    )

  }
}
