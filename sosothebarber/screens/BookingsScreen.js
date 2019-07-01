import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, RefreshControl } from 'react-native';
import MenuButton from '../component/MenuButton';
import { Query } from "react-apollo";
import { USER_QUERY} from "../graphql/Query";
import Spinner from 'react-native-loading-spinner-overlay';
import UserBookings from "../component/UserBookings";
import AdminBookings from "../component/AdminBookings";
import { Card } from 'react-native-elements';

export default class BookingsScreen extends Component {
  render() {
    return (
      <View style={ styles.container }>
        <MenuButton navigation={this.props.navigation} />
          <Text style={ styles.bookingsHead }>Bookings</Text>
          <View style={styles.container}>
            <Query query={USER_QUERY}>
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

                if (!data || error) {
                  return (
                    <Text style={ styles.errorMessage }>
                      {error.message.replace("GraphQL error: ", "")}
                    </Text>
                  )
                }

                const user = data && data.user ? data.user : null;

                if (!user) {
                  return (
                    <Card
                      title={ `Hey there buddy` }>
                      <Text style={{ color: "#B00020", textAlign: 'left'}}>
                          It seems like you are not logged in.
                      </Text>
                      <Text style={{ color: "#B00020", textAlign: 'left'}}>
                          Please login first and then continue.
                      </Text>
                    </Card>
                  )
                }

                const isAdmin = user.role === 'ADMIN';

                if (isAdmin) {
                  return (
                    <ScrollView
                      refreshControl={
                        <RefreshControl
                          refreshing={networkStatus === 4}
                          onRefresh={refetch}
                        />
                      }
                    >
                      <AdminBookings goToSlot={() => this.props.navigation.navigate('Slots')} user={user} />
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
                    <UserBookings goToSlot={() => this.props.navigation.navigate('Slots')} user={user} />
                  </ScrollView>
                )
              }}
            </Query>
          </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: '#CFD8DC',
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorMessage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    color: "#B00020",
  },
  bookingsHead: {
    fontSize: 25,
    textAlign: 'center'
  },
  spinnerTextStyle: {
    textAlign: 'center',
    padding: 10,
    color: '#FFF'
  },
});
