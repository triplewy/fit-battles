import React from 'react';
import {Dimensions, Image, View, StyleSheet, Text, TouchableHighlight, TouchableOpacity} from 'react-native';

const url = 'http://localhost:8081'

export default class SelectedPhoto extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      uploadClicked: false,
      uploaded: false,
      progress: 0
    };

    this.upload = this.upload.bind(this)
    this.uploadHelper = this.uploadHelper.bind(this)
  }

  upload() {
    const selectedPhoto = this.props.selectedPhoto
    var formData = new FormData();
    formData.append('image', {uri: this.props.selectedPhoto.uri, name: "file"})
    formData.append('width', selectedPhoto.width);
    formData.append('height', selectedPhoto.height);
    this.setState({uploadClicked: true})
    this.uploadHelper(formData)
  }

  uploadHelper(formData) {
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.onreadystatechange = () => {
     if(xhr.readyState === 4 && xhr.status === 200){
         console.log(xhr.responseText);
         this.setState({uploaded: true})
         const navigation = this.props.navigation
         navigation.navigate('Profile')
      }
    }

    xhr.upload.onprogress = (e) => {
      console.log("loaded", e.loaded);
      console.log("total", e.total);
      this.setState({progress: e.loaded/e.total * 100})
    }

    xhr.open('POST', url + '/api/upload');
    xhr.send(formData)
  }

  render() {
    const selectedPhoto = this.props.selectedPhoto
    const win = Dimensions.get('window');
    const ratio = win.width/selectedPhoto.width

    return (
      <View>
        <Image
          resizeMode={'contain'}
          source={{uri: selectedPhoto.uri}}
          style={{width: win.width, height: selectedPhoto.height * ratio}}/>
        <TouchableOpacity onPress={this.upload}>
          <Text>Upload</Text>
        </TouchableOpacity>
        <View style={{width: this.state.progress + '%', height: 20, backgroundColor: 'green'}}>

        </View>
      </View>
    )

  }
}
