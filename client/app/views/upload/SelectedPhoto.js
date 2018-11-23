import React from 'react';
import {Dimensions, Image, ScrollView, View, StyleSheet, Text, TouchableHighlight, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient'

export default class SelectedPhoto extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      submitted: false,
      progress: 0
    };

    this.upload = this.upload.bind(this)
    this.uploadHelper = this.uploadHelper.bind(this)
  }

  upload() {
    this.setState({submitted: true}, () => {
      const selectedPhoto = this.props.navigation.state.params
      var formData = new FormData();
      formData.append('image', {uri: selectedPhoto.uri, name: "file"})
      this.uploadHelper(formData)
    })
  }

  uploadHelper(formData) {
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.onreadystatechange = () => {
     if(xhr.readyState === 4 && xhr.status === 200){
         console.log(xhr.responseText);
         this.props.navigation.navigate('Battle')
      }
    }

    xhr.upload.onprogress = (e) => {
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
          style={{width: win.width - 60, height: (win.width - 60) * 4.0 / 3, borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.4)', borderRadius: 8, marginBottom: 30}}
        />
        <TouchableOpacity onPress={this.upload} disabled={this.state.submitted}>
          <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#54d7ff', '#739aff']} style={{borderRadius: 8, paddingVertical: 15, paddingHorizontal: 40, marginBottom: 20}}>
            <Text style={{color: 'white', fontSize: 18}}>Upload</Text>
          </LinearGradient>
        </TouchableOpacity>
        <View style={{width: this.state.progress + '%', height: 20, backgroundColor: 'green'}}>

        </View>
      </ScrollView>
    )

  }
}
