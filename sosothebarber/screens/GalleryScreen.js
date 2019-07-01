import React, { Component } from 'react';
import { StyleSheet, View, Text,TouchableOpacity, Image, Modal, ScrollView, RefreshControl } from 'react-native';
import { Icon, Card } from 'react-native-elements'
import { FlatGrid } from 'react-native-super-grid';
import MenuButton from '../component/MenuButton';
import { Query } from 'react-apollo';
import { GALLERY_QUERY } from '../graphql/Query';
import Spinner from 'react-native-loading-spinner-overlay';

export default class GalleryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageuri: '',
      ModalVisibleStatus: false,
    };
  }

  ShowModalFunction(visible, imageURL) {
    //handler to handle the click on image of Grid
    //and close button on modal
    this.setState({
      ModalVisibleStatus: visible,
      imageuri: imageURL,
    });
  }
 
  render() {
    if (this.state.ModalVisibleStatus) {
      //Modal to show full image with close button 
      return (
        <Modal
          transparent={false}
          animationType={'fade'}
          visible={this.state.ModalVisibleStatus}
          onRequestClose={() => this.ShowModalFunction(!this.state.ModalVisibleStatus, '')}
        >
          <View style={styles.modelStyle}>
            <Image
              style={styles.fullImageStyle}
              source={{ uri: this.state.imageuri }}
            />
            <TouchableOpacity
              style={styles.closeButtonStyle}
              onPress={() => this.ShowModalFunction(!this.state.ModalVisibleStatus, '')}
            >
              <Icon
                name={ 'close' }
                size={ 20 }
                containerStyle={ { marginTop:16 } }
              />
            </TouchableOpacity>
          </View>
        </Modal>
      );
    } else {
      //Photo Grid of images
      return (
        <View style={styles.container}>
          <MenuButton navigation={this.props.navigation} />
          <Text style={ styles.text }>Gallery</Text>
          <View style={styles.container}>
            <Query query={GALLERY_QUERY}>
              {({data, loading, error, refetch, networkStatus}) => {
                if (loading) {
                  return (
                    <Spinner
                      visible={loading}
                      textContent={"Loading... 😀"}
                      textStyle={styles.spinnerTextStyle}
                    />
                  )
                }

                if (error) {
                  return (
                    <Text style={ styles.errorMessage }>
                      {error.message.replace("Network error: ", "").replace("GraphQL error: ", "")}.
                    </Text>
                  )
                }

                const items = data && data.gallery ? data.gallery : [];

                if (!items.length) {
                  return (
                    <ScrollView
                    refreshControl={
                      <RefreshControl
                        refreshing={networkStatus === 4}
                        onRefresh={refetch}
                      />
                    }
                    >
                      <Card
                        title={ `Hey there buddy` }>
                        <Text style={{ color: "#B00020", textAlign: 'left'}}>
                            Just give us some time.
                        </Text>
                        <Text style={{ color: "#B00020", textAlign: 'left'}}>
                            We will be uploading soon.
                        </Text>
                      </Card>
                    </ScrollView>
                  )
                }

                return (
                  <ScrollView
                  refreshControl={
                    <RefreshControl
                      refreshing={networkStatus === 4}
                      onRefresh={refetch}
                    />
                  }
                  >
                    <FlatGrid
                      itemDimension={150}
                      items={items}
                      style={styles.container}
                      spacing={10}
                      renderItem={({ item }) => (
                        <View style={[styles.itemContainer]}>
                          <TouchableOpacity
                            key={item.id}
                            style={{
                              width: "100%",
                              height: "100%",
                            }}
                            onPress={() => this.ShowModalFunction(true, item.imageUrl)}
                          >
                            <Image
                              resizeMode="cover"
                              style={{ flex: 1 }}
                              source={{ uri: item.imageUrl }}
                            />
                          </TouchableOpacity>
                        </View>
                      )}
                    />
                  </ScrollView>
                )
              }}
            </Query>
          </View>
        </View>
      );
    }
  }

}

const styles = StyleSheet.create({
  gridView: {
    marginTop: 20,
    flex: 1,
  },
  itemContainer: {
    justifyContent: 'flex-end',
    borderRadius: 5,
    padding: 10,
    height: 150,
  },
  container: {
    flex: 1,
    backgroundColor: '#CFD8DC',
  },
  fullImageStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '98%',
    resizeMode: 'contain',
  },
  modelStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  closeButtonStyle: {
    width: 25,
    height: 25,
    top: 9,
    right: 9,
    position: 'absolute',
  },
  text: {
    fontSize: 30,
    textAlign: 'center'
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinnerTextStyle: {
    textAlign: 'center',
    padding: 10,
    color: '#FFF'
  },
  errorMessage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    color: "#B00020",
  },
});