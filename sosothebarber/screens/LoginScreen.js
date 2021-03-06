import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Image } from 'react-native';
import {Button, Input, Text} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import MenuButton from '../component/MenuButton';
import { Mutation, Query } from 'react-apollo';
import { GET_USER_MUTATION } from '../graphql/Mutation';
import { USER_QUERY, SLOTS_QUERY, GALLERY_QUERY } from '../graphql/Query';
import Spinner from 'react-native-loading-spinner-overlay';

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      errors: {
        responseError: '',
        errorEmail: '',
        errorPassword: ''
      },
      email: '',
      password: '',
      showPassword: false
    };
  }

  validateInput = (input) => {
    let errors = {};
    input.email = input.email.trim();

    if (!input.email) {
      errors.errorEmail = "Email address is required"
    }

    if (input.email && !(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email))) {
      errors.errorEmail = "Email address is invalid"
    }

    if (!input.password) {
      errors.errorPassword = "Password is required"
    }

    if (input.password && input.password.length < 5) {
      errors.errorPassword = "Password must contain at least 5 characters"
    }

    return errors
  };

  onLogin = async (getUser) => {
    // Validate the user input fields
    const errors = this.validateInput(this.state);
    this.setState({ errors });

    // Check if there is an error, if there is abort logging in.
    if (Object.keys(errors).length > 0) {
      return;
    }

    try{
      const loggedInUser = await getUser({
        variables: {
          ...this.state
        }
      });

      if (!loggedInUser.data.login) {
        return
      }

      this.setState({
        email: '',
        errors: {
          responseError: '',
          errorEmail: '',
          errorPassword: ''
        },
        password: ''
      });
      this.props.navigation.navigate('Slots')
    }catch (error) {
      this.setState({
        errors: {
          ...this.state.errors,
          responseError: error.message
          .replace("GraphQL error: ", "")
        }
      })
    }
  };

  render() {
    return (
      <View style={ styles.container }>
        <MenuButton navigation={this.props.navigation} />
        <View style={ styles.container }>
          <Query
            query={ GALLERY_QUERY }
          >
            {() => (
              <Mutation
                mutation={GET_USER_MUTATION}
                refetchQueries={() => {
                  return [{
                    query: USER_QUERY
                }];
                }}
              >
                {(getUser,{loading}) => {
                  const { errors } = this.state;
    
                  if (loading) {
                    return (
                      <Spinner
                        visible={loading}
                        textContent={"We are obtaining your data."}
                        textStyle={styles.spinnerTextStyle}
                      />
                    )
                  }
    
                  return (
                    <ScrollView contentContainerStyle={{flexGrow : 1, justifyContent : 'center'}}>
                      {errors.responseError ?  <Text style={ styles.errorMessage }>{errors.responseError}</Text> : null}
                      <View style={{ marginBottom: '10%' }}>
                        <Text style={ styles.text }>Tired of barber queeing?</Text>
                        <Image
                          style={{width: '100%', height: 100, resizeMode : 'contain', borderRadius: 100, marginBottom: 10 }}
                          source={{uri :'asset:/images/soso.png'}}
                        />
                        <Text style={ styles.text }>You're at the right place!</Text>
                      </View>
                      <Input
                        value={this.state.username}
                        disabled={ loading }
                        onChangeText={(email) => { email = email.trim().toLowerCase(); return this.setState({ email })}}
                        placeholder={'Email address'}
                        inputStyle={styles.input}
                        leftIcon={
                          <Icon
                            name={ 'envelope' }
                            size={ 20 }
                            color={ '#263238' }
                          />
                        }
                      />
                      {errors.errorEmail ? <Text style={ styles.errorMessage }>{errors.errorEmail}</Text> : null}
                      <Input
                        value={this.state.password}
                        disabled={ loading }
                        onChangeText={(password) => this.setState({ password })}
                        placeholder={'Password'}
                        secureTextEntry={!this.state.showPassword}
                        inputStyle={styles.input}
                        leftIcon={
                          <Icon
                            name={ 'lock' }
                            size={30}
                            color={ '#263238' }
                          />
                        }
                        rightIcon={
                          <Icon
                            name={ 'eye' }
                            size={ 30 }
                            color={ '#263238' }
                            onPress={ (showPassword) => this.setState({ showPassword: !this.state.showPassword }) }
                          />
                        }
                      />
                      {errors.errorPassword ? <Text style={ styles.errorMessage }>{errors.errorPassword}</Text> : null}
                      <Button
                        title={ loading ? 'Loging in...' : 'Login' }
                        disabled={ loading }
                        onPress={ () => this.onLogin(getUser) }
                        buttonStyle={ styles.login }
                      />
    
                      <Button
                        title={ 'Forgot password?' }
                        disabled={ loading }
                        onPress={ () => this.props.navigation.navigate('RequestReset') }
                        buttonStyle={ styles.forgotButton }
                      />
                      <Button
                        title={ 'Register here!' }
                        disabled={ loading }
                        onPress={ () => this.props.navigation.navigate('Register') }
                        buttonStyle={ styles.registerButton }
                      />
                    </ScrollView>
                  )
                }}
              </Mutation>
            )}
          </Query>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#CFD8DC',
  },
  forgotButton: {
    width: '90%',
    height: 30,
    padding: 10,
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 20,
    backgroundColor: 'hsl(0, 0%, 71%)',
    borderRadius: 30
  },
  registerButton: {
    width: '90%',
    height: 30,
    padding: 10,
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 20,
    backgroundColor: 'hsl(0, 0%, 71%)',
    borderRadius: 30
  },
  text: {
    fontSize: 20,
    textAlign: 'center'
  },
  input: {
    width: '80%',
    height: 30,
    padding: 10,
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 20
  },
  login: {
    width: '90%',
    height: 30,
    padding: 10,
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 20,
    backgroundColor: 'hsl(141, 71%, 48%)',
    borderRadius: 30
  },
  spinnerTextStyle: {
    textAlign: 'center',
    padding: 10,
    color: '#FFF'
  },
  errorMessage: {
    marginLeft: 20,
    color: "hsl(348, 100%, 61%)",
  }
});
