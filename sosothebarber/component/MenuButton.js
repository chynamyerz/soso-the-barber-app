import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Header } from 'react-native-elements';

export default class MenuButton extends Component {
  render() {
    return (
      <Header
        containerStyle={{ paddingBottom: 30, marginBottom: 10, backgroundColor: '#263238' }}
        leftComponent={{ icon: 'menu', color: '#fff', onPress: () => this.props.navigation.toggleDrawer()}}
        centerComponent={{ text: 'Soso The Barber', style: { color: '#fff', fontSize: 20 } }}
      />
    )
  }
}

const styles = StyleSheet.create({
  menuIcon: {
    zIndex: 9,
    position: 'absolute',
    top: 40,
    left: 20
  }
})