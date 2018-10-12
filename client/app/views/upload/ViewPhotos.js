import React from 'react';
import {Dimensions, Image, View, FlatList, StyleSheet, Text, TouchableHighlight} from 'react-native';
import SelectedPhoto from './SelectedPhoto';

export default class ViewPhotos extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedPhoto: null
    };

    this.renderItem = this.renderItem.bind(this)
    this.setSelectedPhoto = this.setSelectedPhoto.bind(this)
  }

  renderItem(item) {
    const image = item.item.node.image;
    console.log(image);
    const win = Dimensions.get('window');
    const ratio = (win.width/2)/image.width
    return (
      <TouchableHighlight onPress={this.setSelectedPhoto.bind(this, image)}>
        <Image
          source={{ uri: image.uri }}
          style={{width: win.width/2, height: image.height * ratio}} />
      </TouchableHighlight>
    )
  }

  setSelectedPhoto(image) {
    this.setState({selectedPhoto: {uri: image.uri, width: image.width, height: image.height}})
  }

  render() {
    if (this.state.selectedPhoto) {
      return (
        <SelectedPhoto selectedPhoto={this.state.selectedPhoto} navigation={this.props.navigation}/>
      )
    } else {
      return (
        <FlatList
          data={this.props.photos}
          numColumns={2}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index}
        />
      )
    }
  }
}

const styles = StyleSheet.create({
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  }
})
