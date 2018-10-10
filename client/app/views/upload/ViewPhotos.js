import React from 'react';
import {Dimensions, Image, ScrollView, View, ListView, StyleSheet, Text, TouchableHighlight} from 'react-native';
import SelectedPhoto from './SelectedPhoto';

export default class ViewPhotos extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      selectedPhoto: null
    };

    this.renderRow = this.renderRow.bind(this)
    this.setSelectedPhoto = this.setSelectedPhoto.bind(this)
  }

  renderRow(rowData) {
    const { uri } = rowData.node.image;
    return (
      <TouchableHighlight onPress={this.setSelectedPhoto.bind(this, uri)}>
        <Image
          source={{ uri: rowData.node.image.uri }}
          style={styles.image} />
      </TouchableHighlight>
    )
  }

  setSelectedPhoto(uri) {
    Image.getSize(uri, (width, height) => {this.setState({selectedPhoto: {uri: uri, width: width, height: height}})});
  }

  render() {
    if (this.state.selectedPhoto) {
      return (
        <SelectedPhoto selectedPhoto={this.state.selectedPhoto} navigation={this.props.navigation}/>
      )
    } else {
      return (
        <ScrollView>
          <View style={{ flex: 1 }}>
              <ListView
                contentContainerStyle={styles.list}
                dataSource={this.state.ds.cloneWithRows(this.props.photos)}
                renderRow={(rowData) => this.renderRow(rowData)}
                enableEmptySections={true} />
          </View>
        </ScrollView>
      )
    }
  }
}

const styles = StyleSheet.create({
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },

  image: {
    width: 200,
    height: 200,
  }
})
