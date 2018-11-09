import React from 'react';
import {Dimensions, Image, View, FlatList, StyleSheet, Text, TouchableOpacity} from 'react-native';
import SelectedPhoto from './SelectedPhoto';

export default class ViewPhotos extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };

    this.renderItem = this.renderItem.bind(this)
  }

  renderItem(item) {
    const image = item.item.node.image;
    const win = Dimensions.get('window');
    const ratio = (win.width / 2.0) * (4.0 / 3)
    return (
      <TouchableOpacity onPress={() => this.props.navigation.navigate('SelectedPhoto', {selectedPhoto: {uri: image.uri, width: image.width, height: image.height}})}>
        <Image
          resizeMode={'contain'}
          source={{ uri: image.uri }}
          style={{width: win.width / 2.0, height: (win.width / 2.0) * (4.0 / 3)}} />
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <FlatList
        data={this.props.photos}
        numColumns={2}
        renderItem={this.renderItem}
        keyExtractor={(item, index) => index}
        onEndReached={this.props.getGalleryScroll.bind(this)}
        onEndReachedThreshold={0.5}
      />
    )
  }
}
