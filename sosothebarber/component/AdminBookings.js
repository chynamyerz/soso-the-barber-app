import React, { Component } from 'react';
import {FlatList, StyleSheet, Text, View, Alert, ScrollView} from 'react-native';
import {Card} from 'react-native-elements';
import {Mutation, Query} from "react-apollo";
import {BOOKINGS_QUERY, SLOTS_QUERY} from "../graphql/Query";
import {Button} from "react-native-elements";
import Spinner from 'react-native-loading-spinner-overlay';
import {CANCEL_BOOKING_MUTATION, SEND_EMAIL_MUTATION} from "../graphql/Mutation";
import AppLink from 'react-native-app-link';
export default class AdminBookings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      emailSent: false
    }
  }
  cancelBooking = async (item, cancelBooking, user) => {
    if (!user) {
      Alert.alert('Message', 'You must be logged in to book!');
      return
    }

    Alert.alert(
      'Cancel Booking',
      `
      Are you sure you want 
      to cancel this booking?
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
      { cancelable: false },
    );
  };

  launchUber = async () => {
    try {
      await AppLink.maybeOpenURL('uber://',{ appName: 'Uber', playStoreId: 'com.ubercab'})
    } catch (e) {
      Alert.alert('Error', JSON.stringify(e.message))
    }
  };

  sendEmail = async (item, send) => {
    const content = `
    Dear ${item.user.name} <br /><br />
    This is a reminder about your hair cut slot set as follows<br /><br />
    Slot info:<br />|${item.slot.day}: ${item.slot.time}hrz|<br /><br />
    Thank you<br />
    Your one and only Soso the fucking barber`

    await send({ variables: { content } })
    Alert.alert('Message', 'A reminder email has been sent')
  };

  render() {
    const { goToSlot, user } =  this.props;
    let bookings = [];
    return (
      <Query query={ BOOKINGS_QUERY }>
        {({data, loading, error}) => {
          if (loading) {
            return (
              <Spinner
                visible={loading}
                textContent={"Loading... 😀"}
                textStyle={styles.spinnerTextStyle}
              />
            )
          }

          if (error) {
            return (
              <Text style={ styles.errorMessage }>
                {error.message.replace("Network error: ", "").replace("GraphQL error: ", "")}.
              </Text>
            )
          }
          bookings = data && data.bookings ? data.bookings : [];
          
          bookings = bookings.filter(booking => booking.status === "BOOKED")

          return (
            <Mutation
              mutation={CANCEL_BOOKING_MUTATION}
              refetchQueries={() => {
                return [
                  {query: BOOKINGS_QUERY},
                  {query: SLOTS_QUERY},
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
                      {error.message.replace("Network error: ", "").replace("GraphQL error: ", "")}.
                    </Text>
                  )
                }
                
                return (
                  <>
                    {!bookings.length ?
                      <Card
                        title={ 'There are currently no bookings' }>
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
                                  <Text style={{marginBottom: 10, fontWeight: 'bold'}}>
                                    Booked by: {item.user.name}
                                  </Text>
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
                                  <Text style={{marginBottom: 10}}>
                                    Street address: {item.user.streetAddress}
                                  </Text>
                                  <Text style={{marginBottom: 10}}>
                                    Launch Uber and type the street address above.
                                  </Text>
                                </View>
                                <Button
                                  onPress={ () => this.launchUber()}
                                  title={ 'Launch Uber' }
                                  buttonStyle={ styles.launchUberButton }
                                />
                                <Mutation
                                  mutation={SEND_EMAIL_MUTATION}
                                >
                                  {(send, {loading, error}) => {
                                    if (loading) {
                                      return (
                                        <Spinner
                                          visible={loading}
                                          textContent={"Sending an email..."}
                                          textStyle={styles.spinnerTextStyle}
                                        />
                                      )
                                    }

                                    if (error) {
                                      return (
                                        <Text style={ styles.errorMessage }>
                                          {error.message.replace("Network error: ", "").replace("GraphQL error: ", "")}.
                                        </Text>
                                      )
                                    }

                                    return (
                                      <Button
                                        buttonStyle={ styles.reminder }
                                        onPress={ () => this.sendEmail(item, send)}
                                        title={ 'Send a reminder' }
                                      />
                                    )
                                  }}
                                </Mutation>
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
          )
        }}
      </Query>
    )
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
    height: 30,
    backgroundColor: 'hsl(348, 100%, 61%)'
  },
  launchUberButton: {
    padding: 5,
    marginTop: 2,
    marginBottom: 2,
    height: 30,
    backgroundColor: 'hsl(204, 86%, 53%)'
  },
  reminder: {
    padding: 5,
    marginTop: 2,
    marginBottom: 2,
    height: 30,
    backgroundColor: 'hsl(48, 100%, 67%)'
  },
  spinnerTextStyle: {
    textAlign: 'center',
    padding: 10,
    color: '#FFF'
  },
});