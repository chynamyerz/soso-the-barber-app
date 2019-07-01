import React from 'react';
import { Dimensions } from 'react-native';
import { createDrawerNavigator, createAppContainer } from 'react-navigation';
import BookingsScreen from '../screens/BookingsScreen';
import SlotsScreen from '../screens/SlotsScreen';
import GalleryScreen from '../screens/GalleryScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import MenuDrawer from '../component/MenuDrawer';
import RequestReset from "../screens/RequestReset";
import ResetPassword from "../screens/ResetPassword";
import UpdateUserScreen from "../screens/UpdateUserScreen";

const WIDTH = Dimensions.get('window').width;

const DrawerConfig = {
  drawerWidth: WIDTH*0.70,
  contentComponent: ({ navigation }) => {
    return(
      <MenuDrawer navigation={navigation}/>
    )
  }
};

const DrawerNavigator = createDrawerNavigator(
  {
    Login: {
      screen: LoginScreen
    },
    Bookings: {
      screen: BookingsScreen
    },
    Slots: {
      screen: SlotsScreen
    },
    Gallery: {
      screen: GalleryScreen
    },
    Register: {
      screen: RegisterScreen
    },
    RequestReset: {
      screen: RequestReset
    },
    ResetPassword: {
      screen: ResetPassword
    },
    UpdateUser: {
      screen: UpdateUserScreen
    }
  }, 
  DrawerConfig
);

export default createAppContainer(DrawerNavigator);