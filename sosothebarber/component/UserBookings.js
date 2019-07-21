import React, { Component } from 'react';
import {FlatList, StyleSheet, Text, View, Alert, ScrollView} from 'react-native';
import {Card} from 'react-native-elements';
import {Mutation} from "react-apollo";
import {USER_QUERY, SLOTS_QUERY} from "../graphql/Query";
import {Button} from "react-native-elements";
import Spinner from 'react-native-loading-spinner-overlay';
import {CANCEL_BOOKING_MUTATION} from "../graphql/Mutation";

export default class UserBookings extends Component {
  cancelBooking = async (item, cancelBooking, user) => {
    if (!user) {
      Alert.alert('Message', 'You must be logged in to book!');
      return
    }

    Alert.alert(
      'Cancel Booking',
      `
      Are you sure want to cancel this booking?
      50% will be deducted.
      `,
      [
        {
          text: 'OK',
          onPress: async () => {
            try {
              await cancelBooking({ variables: { bookingId: item.id} });
              Alert.alert('Message', 'Booking canceled')
            } catch (error) {
              Alert.alert('Message','Something went wrong')
            }
          }
        },
        {
          text: 'Cancel',
          onPress: () => { },
          style: 'cancel'
        },
      ],
      { cancelable: false }
    );
  };

  render() {
    const { goToSlot, user } =  this.props;
    let { bookings } = user;
    
    bookings = bookings.filter(booking => booking.status === "BOOKED")

    return (
      <Mutation
        mutation={CANCEL_BOOKING_MUTATION}
        refetchQueries={() => {
          return [
            {query: USER_QUERY},
            {query: SLOTS_QUERY}
          ];
        }}
      >
        {(cancelBooking, {loading, error}) => {
          if (loading) {
            return (
              <Spinner
                visible={loading}
                textContent={"Removing booking"}
                textStyle={styles.spinnerTextStyle}
              />
            )
          }

          if (error) {
            return (
              <Text style={ styles.errorMessage }>
                {error.message.replace("GraphQL error: ", "")}
              </Text>
            )
          }
          return (
            <>
              {!bookings.length ?
                <Card
                  title={ 'You don\'t have any booking' }>
                  <Button
                    onPress={ () => goToSlot() }
                    title={ 'Click here for available slots' }
                  />
                </Card> :
                <FlatList
                  data = {bookings.map(booking => { return {...booking, key: booking.id }})}
                  renderItem={({item}) => {
                    return (
                      <ScrollView>
                        <Card
                          title='Booked slot'>
                          <View>
                            <Text style={{marginBottom: 10}}>
                              The day and time displayed, reflects that of the current and the following week.
                            </Text>
                            <Text style={{marginBottom: 10}}>
                              Day: {item.slot.day}
                            </Text>
                            <Text style={{marginBottom: 10}}>
                              Time: {item.slot.time} hrz
                            </Text>
                            <Text style={{marginBottom: 10}}>
                              Style: {item.cut.title}
                            </Text>
                            <Text style={{marginBottom: 10}}>
                              Price: R {item.cut.price}
                            </Text>
                          </View>
                          <Button
                            buttonStyle={ styles.cancelButton }
                            onPress={ () => this.cancelBooking(item, cancelBooking, user)}
                            title={ 'Cancel' }
                          />
                        </Card>
                      </ScrollView>
                    )
                  }}
                />
              }
            </>
          )
        }}
      </Mutation>
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
    color: "hsl(348, 100%, 61%)",
  },
  cancelButton: {
    padding: 5,
    marginTop: 2,
    marginBottom: 2,
    backgroundColor: 'hsl(348, 100%, 61%)'
  },
  spinnerTextStyle: {
    textAlign: 'center',
    padding: 10,
    color: '#FFF'
  },
});
