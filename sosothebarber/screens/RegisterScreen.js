import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { SIGNUP_MUTATION } from '../graphql/Mutation';
import { StyleSheet, View, Alert, Text, ScrollView } from 'react-native';
import {Button, Input, Image, Avatar} from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import MenuButton from '../component/MenuButton';
import Spinner from 'react-native-loading-spinner-overlay';
import PhoneInput from 'react-native-phone-input';
import Config from 'react-native-config';

export default class RegisterScreen extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      errors: {
        errorCell: '',
        errorConfirmPassword: '',
        errorEmail: '',
        errorImage: '',
        errorName: '',
        errorPassword: '',
      },
      cell: '',
      confirmPassword: '',
      email: '',
      image: '',
      name: '',
      password: '',
      streetAddress: '',
      profileImageSaveLoading: false,
      showPassword: false,
      showConfirmPassword: false
    };
  }

  handleChoosePhoto = () => {
    const options = {
      noData: true,
      title: 'Where to select?',
      storageOptions: {
        skipBackup: true,
        path: 'SosoTheBarber',
      },
    };

    ImagePicker.showImagePicker(options, async (response) => {
      if (response.error) {
        this.setState({
          errors: {
            ...this.state.errors,
            errorImage: 'Image picker error'
          }
        })
      }
      if (response.uri) {
        this.setState({ profileImageSaveLoading: true });

        const data = new FormData();
        data.append('file', {
          uri: response.uri,
          type: response.type,
          name: response.fileName
        });
        data.append(
          'upload_preset',
          'soso-the-barber');

        const res = await fetch(Config.CLOUDINARY_API_SOSO_URL, {
            method: 'POST',
            body: data
        });

        const file = await res.json();
        
        this.setState({
          image: file.secure_url,
          profileImageSaveLoading: false
        })
      }
    });
  };

  validateInput = (input) => {
    let errors = {};

    if (!input.cell) {
      errors.errorCell = "Contact number is required"
    }

    if (input.cell && !this.phone.isValidNumber()) {
      errors.errorCell = "Contact number not valid"
    }

    if (!input.confirmPassword) {
      errors.errorConfirmPassword = "Confirm password is required"
    }

    if (!input.email) {
      errors.errorEmail = "Email address is required"
    }

    if (input.email && !(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim()))) {
      errors.errorEmail = "Email address is invalid"
    }

    if (!input.password) {
      errors.errorPassword = "Password is required"
    }

    if (input.password && input.password.length < 5) {
      errors.errorPassword = "Password must contain at least 5 characters"
    }

    if (input.password && input.confirmPassword && input.password !== input.confirmPassword) {
      errors.errorConfirmPassword = "Passwords do not match"
    }

    if (!input.name) {
      errors.errorName = "Name is required"
    }

    return errors
  };

  handleSignup = async (signUp) => {
    // Validate the user input fields
    const errors = this.validateInput(this.state);
    this.setState({ errors });

    // Check if there is an error, if there is abort signing up.
    if (Object.keys(errors).length > 0) {
      return;
    }

    try{
      await signUp(
        {
          variables: {
            cell: this.state.cell,
            email: this.state.email.trim(),
            image: this.state.image,
            name: this.state.name,
            password: this.state.password,
            streetAddress: this.state.streetAddress
          }
        }
      );

      Alert.alert("Message","You may now login using your credentials.");

      this.setState({
        errors: {
          errorCell: '',
          errorConfirmPassword: '',
          errorEmail: '',
          errorImage: '',
          errorName: '',
          errorPassword: '',
        },
        cell: '',
        confirmPassword: '',
        email: '',
        image: '',
        name: '',
        password: '',
        streetAddress: ''
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
            mutation={ SIGNUP_MUTATION }
          >
            {(signup, { loading }) => {
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
                    value={ this.state.name }
                    disabled={ loading }
                    onChangeText={ (name) => this.setState({ name }) }
                    placeholder={'Name'}
                    inputStyle={styles.input}
                    leftIcon={
                      <Icon
                        name={ 'user' }
                        size={ 30 }
                        color={ '#263238' }
                      />
                    }
                  />
                  {errors.errorName ? <Text style={ styles.errorMessage }>{errors.errorName}</Text> : null}
                  <Input
                    value={ this.state.email }
                    disabled={ loading }
                    onChangeText={ (email) => { this.setState({ email }) }}
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
                  <PhoneInput
                    ref={(ref) => { this.phone = ref; }}
                    allowZeroAfterCountryCode={true}
                    initialCountry={'za'}
                    disabled={ loading }
                    value={ this.state.cell }
                    style={{ ...styles.input, borderBottomColor: 'gray', borderBottomWidth: 1, marginLeft: 10, width: '95%' }}
                    onChangePhoneNumber={(cell) => this.setState({ cell })}
                  />
                  {errors.errorCell ? <Text style={ styles.errorMessage }>{errors.errorCell}</Text> : null}
                  <Input
                    value={ this.state.streetAddress }
                    disabled={ loading }
                    onChangeText={ (streetAddress) => this.setState({ streetAddress }) }
                    placeholder={'Street address for mobile barber service'}
                    inputStyle={styles.input}
                    leftIcon={
                      <Icon
                        name={ 'address-card' }
                        size={ 16 }
                        color={ '#263238' }
                      />
                    }
                  />
                  <Input
                    value={ this.state.password }
                    disabled={ loading }
                    onChangeText={ (password) => this.setState({ password }) }
                    placeholder={ 'Password' }
                    secureTextEntry={ !this.state.showPassword }
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
                        onPress={ () => this.setState({ showPassword: !this.state.showPassword }) }
                      />
                    }
                  />
                  {errors.errorPassword ? <Text style={ styles.errorMessage }>{errors.errorPassword}</Text> : null}
                  <Input
                    value={ this.state.confirmPassword }
                    disabled={ loading }
                    onChangeText={ (confirmPassword) => this.setState({ confirmPassword }) }
                    placeholder={ 'Password' }
                    secureTextEntry={ !this.state.showConfirmPassword }
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
                        onPress={ () => this.setState({ showConfirmPassword: !this.state.showConfirmPassword }) }
                      />
                    }
                  />
                  {errors.errorConfirmPassword ? <Text style={ styles.errorMessage }>{errors.errorConfirmPassword}</Text> : null}
                  {this.state.image ?
                    <Image
                      source={{ uri: this.state.image }}
                      style={styles.img}
                    /> : !this.state.profileImageSaveLoading ?
                    <Avatar
                      containerStyle={{ marginLeft: '40%' }}
                      size={'large'}
                      rounded
                      icon={{ name: 'camera', size: 50, type: 'font-awesome', color: '#263238' }}
                      onPress={ this.handleChoosePhoto }
                    /> : <Text style={{ textAlign: 'center' }}>Please wait while we set your profile picture...</Text>
                  }
                  {errors.errorImage ? <Text style={ styles.errorMessage }>{errors.errorImage}</Text> : null}
                  <Button
                    buttonStyle={ styles.register }
                    onPress={() => this.handleSignup(signup) }
                    title={loading ? "Registering..." : "Register"}
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
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#CFD8DC',
  },
  text: {
    fontSize: 30,
  },
  profile: {
    width: '90%',
    height: 40,
    padding: 5,
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 20,
    backgroundColor: 'lightgray'
  },
  register: {
    width: '90%',
    height: 30,
    padding: 5,
    marginTop: 2,
    marginBottom: 2,
    marginLeft: 20,
    backgroundColor: 'hsl(141, 71%, 48%)',
    borderRadius: 30
  },
  input: {
    width: '80%',
    height: 30,
    padding: 5,
    marginTop: 2,
    marginBottom: 2,
    marginLeft: 20
  },
  img: {
    marginLeft: '45%',
    width: 50,
    height: 50,
    borderRadius: 50
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
