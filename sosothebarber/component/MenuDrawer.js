import React, { Component } from 'react';
import { 
  StyleSheet,
  View,
  Text, 
  TouchableOpacity, 
  ScrollView } from 'react-native';
import {Avatar, Button, Icon} from 'react-native-elements';
import Mutation from "react-apollo/Mutation";
import {LOGOUT_USER_MUTATION} from "../graphql/Mutation";
import {USER_QUERY} from "../graphql/Query";
import {Query} from "react-apollo";
import FastImage from 'react-native-fast-image';

export default class MenuDrawer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: {
        responseError: '',
      }
    }
  }

  navLink(nav, text) {
    return(
      <TouchableOpacity style={{ height: 50 }} onPress={() => this.props.navigation.navigate(nav)}>
        <Text style={ styles.link}>{ text }</Text>
      </TouchableOpacity>
    )
  }
  onLogout = async (logout) => {
    try{
      await logout();
      this.props.navigation.navigate('Login')
    }catch (error) {
      this.setState({
        errors: {
          responseError: error.message
          .replace("Network error: ", "")
          .replace("GraphQL error: ", "")
        }
      })
    }
  };

  render() {
    const { errors } = this.state
    return(
      <View style={ styles.container }>
        <View style={ styles.topLinks }>
          <View style={ styles.profile }>
            <View style={ styles.imgView }>
              <Query query={USER_QUERY}>
                {({data}) => {
                  const user = data && data.user ? data.user : null
                  return (
                    <>
                      {user && user.imageURL ?
                        <FastImage style={ styles.img } source={{ uri: user.imageURL }} /> :
                        <Avatar
                          size={'medium'}
                          rounded
                          icon={{ name: 'person', size: 50 }}
                        />
                      }

                      <Text style={ styles.name }>
                        { user ? `Hi ${user.name}`: 'No one here, Lonely.' }
                      </Text>
                      {user &&
                        <TouchableOpacity
                          style={{height: 20}}
                          onPress={() => this.props.navigation.navigate("UpdateUser")}
                        >
                          <View style={{ flex: 1, flexDirection: 'row'}}>
                            <Text style={ styles.name }>Edit</Text>
                            <Icon
                              name={ 'edit' }
                              size={ 16 }
                              color={ 'white' }
                            />
                          </View>
                        </TouchableOpacity>
                      }
                    </>
                  )
                }}
              </Query>
            </View>
          </View>
        </View>
        <ScrollView>
          <View style={ styles.bottomLinks }>
            {this.navLink('Bookings', 'Bookings')}
            {this.navLink('Slots', 'Slots')}
            {this.navLink('Gallery', 'Gallery')}
            {this.navLink('Login', 'Login')}
            {this.navLink('Register', 'Register')}
            <Mutation
              mutation={LOGOUT_USER_MUTATION}
              refetchQueries={() => {
                return [{
                  query: USER_QUERY
                }];
              }}
            >
              {(logout) => {
                return (
                  <Button
                    title={ 'Logout' }
                    onPress={() => this.onLogout(logout)}
                    type="outline"
                  />
                )
              }}
            </Mutation>
            {errors.responseError ?  <Text style={ styles.errorMessage }>{errors.responseError}</Text> : null}
          </View>
        </ScrollView>
        <View style={ styles.footer }>
          <Text style={ styles.description }>@Copyright Soso-The-Barber .inc</Text>
        
          <Text style={ styles.version }>v1.6.0</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgray'
  },
  profile: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#777777'
  },
  name: {
    fontSize: 15,
    color: 'white',
    textAlign: 'left',
    marginBottom: 3,
  },
  imgView: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20
  },
  img: {
    height: 50,
    width: 50,
    borderRadius: 50
  },
  topLinks: {
    height: '20%',
    backgroundColor: '#212121'
  },
  bottomLinks: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 10,
    paddingBottom: 450
  },
  link: {
    flex: 1,
    fontSize: 20,
    padding: 5,
    paddingLeft: 14,
    margin: 5,
    textAlign: 'left'
  },
  footer: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderBottomColor: 'hsl(0, 0%, 86%)'
  },
  version: {
    flex: 1,
    fontSize: 10,
    textAlign: 'right',
    marginRight: 5,
    bottom: 3,
    color: 'gray'
  },
  description: {
    flex: 2,
    marginLeft: 5,
    fontSize: 10,
    bottom: 3
  },
  errorMessage: {
    marginLeft: 20,
    color: "hsl(348, 100%, 61%)",
  }
});