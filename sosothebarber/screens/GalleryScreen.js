import React, { Component } from 'react';
import { StyleSheet, View, Text,TouchableOpacity, Modal, ScrollView, RefreshControl } from 'react-native';
import { Icon, Card } from 'react-native-elements'
import { FlatGrid } from 'react-native-super-grid';
import MenuButton from '../component/MenuButton';
import { Query } from 'react-apollo';
import { GALLERY_QUERY } from '../graphql/Query';
import Spinner from 'react-native-loading-spinner-overlay';
import FastImage from 'react-native-fast-image';
import * as Progress from 'react-native-progress';
import { createImageProgress } from 'react-native-image-progress';
const FImage = createImageProgress(FastImage);

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
            <FastImage
              resizeMode={'center'}
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
                      itemDimension={250}
                      items={items}
                      style={styles.container}
                      spacing={3}
                      renderItem={({ item }) => (
                        <Card
                          containerStyle={{padding:0}}
                        >
                          <Text style={{ textAlign: 'center', backgroundColor: 'black', color: 'white'}}>
                            Cut by Soso-The-Barber
                          </Text>
                          <View style={[styles.itemContainer]}>
                            <TouchableOpacity
                              key={item.id}
                              style={{
                                width: "100%",
                                height: "100%",
                              }}
                              onPress={() => this.ShowModalFunction(true, item.imageUrl)}
                            >
                              <FImage
                                style={{ flex: 1 }}
                                source={{ 
                                  uri: item.imageUrl,
                                }}
                                resizeMode="cover"
                                indicator={Progress.Circle}
                                indicatorProps={{
                                  size: 50,
                                  borderWidth: 0,
                                  color: 'rgba(60,14,101, 1)',
                                  unfilledColor: 'rgba(60,14,101, 0.2)',
                                }}
                              />
                            </TouchableOpacity>
                          </View>

                          <Text style={{ textAlign: 'left'}}>
                            A fresh cut, a happy client...
                          </Text>
                        </Card>
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
    height: 200,
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