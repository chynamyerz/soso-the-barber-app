import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import {RESET_PASSWORD_MUTATION } from '../graphql/Mutation';
import { StyleSheet, View, Alert, Text, ScrollView } from 'react-native';
import {Button, Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import MenuButton from '../component/MenuButton';
import Spinner from 'react-native-loading-spinner-overlay';

export default class ResetPasswordScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: {
        errorConfirmPassword: '',
        errorPassword: '',
        errorOneTimePin: '',
      },
      confirmPassword: '',
      password: '',
      oneTimePin: '',
      showNewPassword: false,
      showNewConfirmPassword: false
    };
  }

  validateInput = (input) => {
    let errors = {};

    if (!input.password) {
      errors.errorPassword = "Password is required"
    }

    if (!input.confirmPassword) {
      errors.errorConfirmPassword = "Confirm password is required"
    }

    if (input.password && input.password.length < 5) {
      errors.errorPassword = "Password must contain at least 5 characters"
    }

    if (input.password && input.confirmPassword && input.password !== input.confirmPassword) {
      errors.errorPassword = "Password do not match"
    }


    if (!input.oneTimePin) {
      errors.errorOneTimePin = "Reset OTP is required"
    }

    return errors
  };

  handleResetPassword = async (resetPassword) => {
    // Validate the user input fields
    const errors = this.validateInput(this.state);
    this.setState({ errors });

    // Check if there is an error, if there is abort signing up.
    if (Object.keys(errors).length > 0) {
      return;
    }

    try{
      await resetPassword(
        {
          variables: {
            password: this.state.password,
            oneTimePin: this.state.oneTimePin
          }
        }
      );

      Alert.alert("Message","Password changed successfully.\n\nPlease try logging in using the new password.");

      this.setState({
        errors: {
          errorConfirmPassword: '',
          errorPassword: '',
          errorOneTimePin: ''
        },
        confirmPassword: '',
        password: '',
        oneTimePin: ''
      });

      this.props.navigation.navigate('Login')
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
          <Mutation
            mutation={ RESET_PASSWORD_MUTATION }
          >
            {(resetPassword, { loading }) => {
              const { errors } = this.state;

              if (loading) {
                return (
                  <Spinner
                    visible={loading}
                    textContent={"Just a moment please."}
                    textStyle={styles.spinnerTextStyle}
                  />
                )
              }

              return (
                <ScrollView contentContainerStyle={{flexGrow : 1, justifyContent : 'center'}}>
                  <Input
                    value={ this.state.oneTimePin }
                    disabled={ loading }
                    onChangeText={ (oneTimePin) => this.setState({ oneTimePin }) }
                    placeholder={ 'Reset OTP' }
                    inputStyle={ styles.input }
                    leftIcon={
                      <Icon
                        name={ 'key' }
                        size={ 24 }
                        color={ '#263238' }
                      />
                    }
                  />
                  {errors.errorOneTimePin ? <Text style={ styles.errorMessage }>{errors.errorOneTimePin}</Text> : null}
                  <Input
                    value={ this.state.password }
                    disabled={ loading }
                    onChangeText={ (password) => this.setState({ password }) }
                    placeholder={ 'Password' }
                    secureTextEntry={ !this.state.showNewPassword }
                    inputStyle={ styles.input }
                    leftIcon={
                      <Icon
                        name={ 'lock' }
                        size={ 30 }
                        color={ '#263238' }
                      />
                    }
                    rightIcon={
                      <Icon
                        name={ 'eye' }
                        size={ 30 }
                        color={ '#263238' }
                        onPress={ (showNewPassword) => this.setState({ showNewPassword: !this.state.showNewPassword }) }
                      />
                    }
                  />
                  {errors.errorPassword ? <Text style={ styles.errorMessage }>{errors.errorPassword}</Text> : null}
                  <Input
                    value={ this.state.confirmPassword }
                    disabled={ loading }
                    onChangeText={ (confirmPassword) => this.setState({ confirmPassword }) }
                    placeholder={ 'Confirm password' }
                    secureTextEntry={ !this.state.showNewConfirmPassword }
                    inputStyle={ styles.input }
                    leftIcon={
                      <Icon
                        name={ 'lock' }
                        size={ 30 }
                        color={ '#263238' }
                      />
                    }
                    rightIcon={
                      <Icon
                        name={ 'eye' }
                        size={ 30 }
                        color={ '#263238' }
                        onPress={ (showNewConfirmPassword) => this.setState({ showNewConfirmPassword: !this.state.showNewConfirmPassword }) }
                      />
                    }
                  />
                  {errors.errorConfirmPassword ? <Text style={ styles.errorMessage }>{errors.errorConfirmPassword}</Text> : null}

                  <Button
                    buttonStyle={ styles.resetPassword }
                    onPress={() => this.handleResetPassword(resetPassword) }
                    title={loading ? "Resetting password..." : "Reset password"}
                    disabled={loading}
                  />
                </ScrollView>
              )
            }}
          </Mutation>
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
  text: {
    fontSize: 30,
  },
  resetPassword: {
    width: '90%',
    height: 40,
    padding: 5,
    marginTop: 2,
    marginBottom: 2,
    marginLeft: 20,
    backgroundColor: '#50C900',
    borderRadius: 25
  },
  input: {
    width: '80%',
    height: 40,
    padding: 5,
    marginTop: 2,
    marginBottom: 2,
    marginLeft: 20
  },
  spinnerTextStyle: {
    textAlign: 'center',
    padding: 10,
    color: '#FFF'
  },
  errorMessage: {
    marginLeft: 20,
    color: "#B00020",
  }
});
