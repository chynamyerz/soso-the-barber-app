import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { USER_UPDATE_MUTATION} from '../graphql/Mutation';
import { StyleSheet, View, Alert, Text, ScrollView } from 'react-native';
import {Button, Input, Image, Avatar} from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import MenuButton from '../component/MenuButton';
import Spinner from 'react-native-loading-spinner-overlay';
import {USER_QUERY} from "../graphql/Query";
import PhoneInput from 'react-native-phone-input';
import Config from 'react-native-config';


export default class UpdateUserScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: {
        errorCell: '',
        errorConfirmNewPassword: '',
        errorEmail: '',
        errorImageURL: '',
        errorName: '',
        errorNewPassword: '',
        errorPassword: '',
      },
      cell: '',
      confirmNewPassword: '',
      email: '',
      imageURL: '',
      name: '',
      newPassword: '',
      password: '',
      streetAddress: '',
      profileImageSaveLoading: false,
      showNewPassword: false,
      showPassword: false,
      showConfirmNewPassword: false
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
        this.setState({ profileImageSaveLoading: true })
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
          imageURL: file.secure_url,
          profileImageSaveLoading: false
        })
      }
    });
  };

  validateInput = (input) => {
    let errors = {};

    if (input.email && !(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim()))) {
      errors.errorEmail = "Email address is invalid"
    }

    if (input.cell && !this.phone.isValidNumber()) {
      errors.errorCell = "Contact number not valid"
    }

    if (!input.password) {
      errors.errorPassword = "Password is required"
    }

    if (input.newPassword && input.newPassword.length < 5) {
      errors.errorNewPassword = "New password must contain at least 5 characters"
    }

    if (input.newPassword && input.confirmNewPassword && input.newPassword !== input.confirmNewPassword) {
      errors.errorConfirmNewPassword = "New passwords do not match"
    }

    return errors
  };

  handleUpdateUser = async (updateUser) => {
    // Validate the user input fields
    const errors = this.validateInput(this.state);
    this.setState({ errors });

    // Check if there is an error, if there is abort signing up.
    if (Object.keys(errors).length > 0) {
      return;
    }

    try{
      await updateUser(
        {
          variables: {
            cell: this.state.cell,
            email: this.state.email.trim(),
            imageURL: this.state.imageURL,
            name: this.state.name,
            newPassword: this.state.newPassword,
            password: this.state.password,
            streetAddress: this.state.streetAddress
          }
        }
      );

      Alert.alert("Message","User information Updated successfully.");

      this.setState({
        errors: {
          errorCell: '',
          errorConfirmNewPassword: '',
          errorEmail: '',
          errorImageURL: '',
          errorName: '',
          errorNewPassword: '',
          errorPassword: '',
        },
        cell: '',
        confirmNewPassword: '',
        email: '',
        imageURL: '',
        name: '',
        newPassword:'',
        password: '',
        streetAddress: ''
      });

      this.props.navigation.navigate('UpdateUser')
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
            mutation={ USER_UPDATE_MUTATION }
            refetchQueries={() => {
              return [{
                query: USER_QUERY
              }];
            }}
          >
            {(updateUser, { loading }) => {
              const { errors } = this.state;

              if (loading) {
                return (
                  <Spinner
                    visible={loading}
                    textContent={'Just a moment please.'}
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
                    placeholder={'New name'}
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
                    onChangeText={ (email) => this.setState({ email })}
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
                    placeholder={'New street address for mobile barber service'}
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
                    value={ this.state.newPassword }
                    disabled={ loading }
                    onChangeText={ (newPassword) => this.setState({ newPassword }) }
                    placeholder={ 'New password' }
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
                        onPress={ () => this.setState({ showNewPassword: !this.state.showNewPassword }) }
                      />
                    }
                  />
                  {errors.errorNewPassword ? <Text style={ styles.errorMessage }>{errors.errorNewPassword}</Text> : null}
                  <Input
                    value={ this.state.confirmNewPassword }
                    disabled={ loading }
                    onChangeText={ (confirmNewPassword) => this.setState({ confirmNewPassword }) }
                    placeholder={ 'Confirm new password' }
                    secureTextEntry={ !this.state.showConfirmNewPassword }
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
                        onPress={ () => this.setState({ showConfirmNewPassword: !this.state.showConfirmNewPassword }) }
                      />
                    }
                  />
                  {errors.errorConfirmNewPassword ? <Text style={ styles.errorMessage }>{errors.errorConfirmNewPassword}</Text> : null}
                  {this.state.imageURL ?
                    <Image
                      source={{ uri: this.state.imageURL }}
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
                  {errors.errorImageURL ? <Text style={ styles.errorMessage }>{errors.errorImageURL}</Text> : null}
                  <Button
                    buttonStyle={ styles.updateUser }
                    onPress={() => this.handleUpdateUser(updateUser) }
                    title={loading ? "Updating..." : "Update"}
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
  updateUser: {
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
    height: 40,
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
