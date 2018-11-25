import React from 'react';
import { SafeAreaView, ScrollView, ActivityIndicator, View, Image, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import ViewPhotos from './ViewPhotos.js'
import ImagePicker from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient'
import ImageResizer from 'react-native-image-resizer';

export default class Upload extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      photo: null,
      animating: false
    };

    this.addImage = this.addImage.bind(this)
  }

  addImage() {
    this.setState({animating: true})
    ImagePicker.showImagePicker(null, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
        this.setState({animating: false})
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
        const win = Dimensions.get('window');
        console.log("here1");
        // this.props.navigation.navigate('SelectedPhoto', {uri: response.uri})

        ImageResizer.createResizedImage(response.uri, 1080, 1080 * 4 / 3, 'JPEG', 75).then((response) => {
          // response.uri is the URI of the new image that can now be displayed, uploaded...
          // response.path is the path of the new image
          // response.name is the name of the new image with the extension
          // response.size is the size of the new image
          console.log("here2");
          this.setState({animating: false})
          this.props.navigation.navigate('SelectedPhoto', {uri: response.uri})
        }).catch((err) => {
          // Oops, something went wrong. Check that the filename is correct and
          // inspect err to get more details.
          console.log(err);
        });
      }
    })
  }

  render() {
    const navigation = this.props.navigation
    console.log(this.props);
    if (this.props.state.auth) {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <TouchableOpacity onPress={this.addImage.bind(this)} disabled={this.state.animating}>
            <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={this.state.animating ? ['#D3D3D3', '#D3D3D3'] : ['#54d7ff', '#739aff']} style={{borderRadius: 8, marginBottom: 20}}>
              <Text style={{fontSize: 18, color: 'white', paddingVertical: 20, paddingHorizontal: 30}}>Select Photo</Text>
            </LinearGradient>
          </TouchableOpacity>
          <ActivityIndicator size="large" color="#54d7ff" animating={this.state.animating}/>
        </View>
      )
    } else {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('Auth')}>
            <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#54d7ff', '#739aff']} style={{paddingVertical: 20, paddingHorizontal: 30, borderRadius: 8}}>
              <Text style={{color: 'white', fontSize: 18}}>Login or signup!</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )
    }

  }
}
