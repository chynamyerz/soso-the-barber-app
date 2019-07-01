import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { REQUEST_RESET_MUTATION } from '../graphql/Mutation';
import { StyleSheet, View, Alert, Text, ScrollView } from 'react-native';
import { Button, Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import MenuButton from '../component/MenuButton';
import Spinner from 'react-native-loading-spinner-overlay';

export default class RequestResetScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: {
        errorEmail: ''
      },
      email: '',
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

    return errors
  };

  handleRequestReset = async (requestReset) => {
    // Validate the user input fields
    const errors = this.validateInput(this.state);
    this.setState({ errors });

    // Check if there is an error, if there is abort request reset.
    if (Object.keys(errors).length > 0) {
      return;
    }

    try{
      await requestReset(
        {
          variables: {
            email: this.state.email
          }
        }
      );

      Alert.alert("Message","Check your emails for the reset password One Time Pin.\n\nIf not find, please check your spam folder.");

      this.setState({
        errors: {
          errorEmail: ''
        },
        email: '',
      });

      this.props.navigation.navigate('ResetPassword')
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
            mutation={ REQUEST_RESET_MUTATION }
          >
            {(requestReset, { loading }) => {
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
                  {errors.responseError ?  <Text style={ styles.errorMessage }>{errors.responseError}</Text> : null}
                  <Input
                    value={ this.state.email }
                    disabled={ loading }
                    onChangeText={ (email) => { email = email.trim(); this.setState({ email }) }}
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
                  <Button
                    buttonStyle={ styles.requestReset }
                    onPress={() => this.handleRequestReset(requestReset) }
                    title={loading ? "Requesting change password..." : "Request change password"}
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
  requestReset: {
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
