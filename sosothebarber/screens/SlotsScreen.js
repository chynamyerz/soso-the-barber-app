import React, { Component } from 'react';
import MenuButton from '../component/MenuButton';
import { StyleSheet, View, Text, FlatList, Alert, ScrollView, RefreshControl, Modal } from 'react-native';
import { Card } from 'react-native-elements';
import { Query, Mutation } from 'react-apollo';
import { BOOKINGS_QUERY, SLOTS_QUERY, USER_QUERY, CUTS_QUERY } from '../graphql/Query';
import { BOOK_MUTATION } from '../graphql/Mutation';
import Spinner from 'react-native-loading-spinner-overlay';
import RadioForm from 'react-native-simple-radio-button';
import { WebView } from 'react-native-webview';
import Config from 'react-native-config';

const SUCCESS_URL = Config.SUCCESS_URL
const CANCEL_URL = Config.CANCEL_URL
const PAYFAST_MERCHANT_ID = Config.MERCHANT_ID_PROD ? Config.MERCHANT_ID_PROD : Config.MERCHANT_ID_SANDBOX
const PAYFAST_URL = Config.PAYFAST_PROD ? Config.PAYFAST_PROD : Config.PAYFAST_SANDBOX

export default class SlotsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      status: '',
      dummyUpdate: null,
      dummyUpdate1: null,
      cut: null,
      item: null,
      book: null,
      user: null
    }
  }

  handlePaymentResponse = async (data) => {
    const { title } = data
    const { item, cut, user, book } = this.state

    if (item && cut && user && book) {
      if (title === 'payment cancelled'){
        this.setState({
          showModal: false, 
          status: 'Cancelled',
          cut: null, 
          item: null,
          book: null,
          user: null,
          dummyUpdate: null,
          dummyUpdate1: null
        })
      }

      else if (title === 'payment completed'){
        this.setState({showModal: false})
        try {
          await book({ variables: { cutId: cut.id, slotId: item.id, userId: user.id } });
          Alert.alert('Message', 'Booked successfully. On my way to you.')
        } catch (error) {
          Alert.alert('Message', 'Something went wrong')
        }
      }
    } else{
      Alert.alert('Message','Nothing is selected.')
    }
  }

  canBook = async (cut, item, book, user) => {
    if (!user) {
        Alert.alert('Message', 'You must be logged in to book!');
        return
    }

    this.setState({
      showModal: true, 
      cut, 
      item,
      book,
      user,
      dummyUpdate: 'dummy update',
      dummyUpdate1: 'dummy update1'
    })
  };

  render() {
    const itemName = this.state.cut ? this.state.cut.title : ''
    const itemDescription = this.state.cut ? this.state.cut.description : ''
    const itemPrice = this.state.cut ? this.state.cut.price : 0
    const { dummyUpdate, dummyUpdate1 } = this.state

    return (
      <View style={ styles.container }>
        <MenuButton navigation={this.props.navigation} />
        <Text style={styles.slotHead}>Secure your hair cut slot.</Text>
        {
          this.state.status === 'Cancelled' && !dummyUpdate ?
          <Text style={styles.cancelMessage}>{dummyUpdate}Booking was cancelled.</Text> :
          null
        }
        {
          this.state.status === 'Aborted' && !dummyUpdate1 ?
          <Text style={styles.cancelMessage}>{dummyUpdate1}</Text> :
          null
        }
        
        <Modal
          visible={this.state.showModal}
          onRequestClose={() => {
            this.setState({
              showModal: false,
              status: 'Aborted',
              cut: null,
              item: null,
              book: null,
              user: null,
              dummyUpdate: null,
              dummyUpdate1: null
            })
          }}
        >
          <WebView
            originWhitelist={['*']}
            source={{html: `
            <!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device, initial-scale=1.0" />
                <meta http-equiv="X-UA-Compatible" content="ie=edge" />
                <title>success</title>
              </head>
              <body>
                <div style="margin-top: 50%; display: flex; align-items: center; justify-content: center; flex-direction: column; height: 100%; width: 100%;">
                  <h3>Make payments.</h3>
                  
                  <br>
                  <br>
                  <br>
                
                  <a href="${PAYFAST_URL}&amp;receiver=${PAYFAST_MERCHANT_ID}&amp;item_name=${itemName}&amp;item_description=${itemDescription}&amp;amount=${itemPrice}&amp;return_url=${SUCCESS_URL}&amp;cancel_url=${CANCEL_URL}">
                    <img 
                      src="https://www.payfast.co.za/images/buttons/light-small-paynow.png" 
                      width="165" 
                      height="36" 
                      alt="Pay" 
                      title="Pay Now with PayFast" 
                    />
                  </a>

                </div>
              </a>
              </body>
            </html>
            `}}
            onNavigationStateChange={(data) => this.handlePaymentResponse(data)}
          />
        </Modal>
        <Query query={USER_QUERY}>
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
                <Card
                  title={ `Hey there` }>
                  <Text style={{ color: "#B00020", textAlign: 'left'}}>
                    We are experiencing Something strange.
                  </Text>
                  <Text style={{ color: "#B00020", textAlign: 'left'}}>
                    Please close the app and check out later.
                  </Text>
                </Card>
              )
            }

            const user = data && data.user ? data.user : null;

            return (
              <Mutation
                mutation={BOOK_MUTATION}
                refetchQueries={() => {
                  return [
                    {query: USER_QUERY}, 
                    {query: SLOTS_QUERY}, 
                    {query: BOOKINGS_QUERY}
                  ];
                }}
              >{(book, { loading, error }) => {
                if (loading) {
                  return (
                    <Spinner
                      visible={loading}
                      textContent={"Just a moment please."}
                      textStyle={styles.spinnerTextStyle}
                    />
                  )
                }
                if (error) {
                  return (
                    <Card
                      title={ `Hey there buddy` }>
                      <Text style={{ color: "#B00020", textAlign: 'left'}}>
                          We are experiencing Something strange.
                      </Text>
                      <Text style={{ color: "#B00020", textAlign: 'left'}}>
                          Please close the app and check out later.
                      </Text>
                    </Card>
                  )
                }
                return (
                  <Query query={SLOTS_QUERY}>
                    {({ data, loading, error, refetch, networkStatus }) => {
                      if (loading) {
                        return (
                          <Spinner
                            visible={loading}
                            textContent={"Fetching available slots..."}
                            textStyle={styles.spinnerTextStyle}
                          />
                        )
                      }

                      if (error) {
                        return (
                          <ScrollView
                            refreshControl={
                              <RefreshControl
                                refreshing={networkStatus === 4}
                                onRefresh={refetch}
                              />
                            }
                          >
                            <Card
                              title={ `Hey there buddy` }>
                              <Text style={{ color: "#B00020", textAlign: 'left'}}>
                                We are experiencing Something strange.
                              </Text>
                              <Text style={{ color: "#B00020", textAlign: 'left'}}>
                                Please close the app and check out later.
                              </Text>
                            </Card>
                          </ScrollView>
                        )
                      }

                      const slots = data && data.slots ? data.slots : [];

                      if (!slots.length) return (
                        <ScrollView
                          refreshControl={
                            <RefreshControl
                              refreshing={networkStatus === 4}
                              onRefresh={refetch}
                            />
                          }
                        >
                          <Card
                            title={ `Hey there buddy` }>
                            <Text style={{ color: "#B00020", textAlign: 'left'}}>
                              Your barber is very occupied.
                            </Text>
                            <Text style={{ color: "#B00020", textAlign: 'left'}}>
                              Please come back and check out later.
                            </Text>
                          </Card>
                        </ScrollView>
                      )

                      return (
                        <View style={styles.container}>
                          <ScrollView 
                            contentContainerStyle={{flexGrow : 1, justifyContent : 'center'}}
                            refreshControl={
                              <RefreshControl
                                refreshing={networkStatus === 4}
                                onRefresh={refetch}
                              />
                            }
                          >
                            <Query query={ CUTS_QUERY }>
                              {({data}) => {
                                const cuts = data && data.cuts ? data.cuts : [];
                                const radio_props = cuts.map(c => ({
                                  label: `${c.title} \nR${c.price}`,
                                  value: c.id
                                }))
                                return (
                                  <View>
                                    
                                    <FlatList
                                      data={slots.map(slot => { return { ...slot, key: slot.id } })}
                                      renderItem={({ item }) => {
                                        return (
                                            <Card title='Book this slot'>
                                              <View>
                                                <Text style={{marginBottom: 10}}>
                                                  The day and time displayed, reflects that of the current and the following week.
                                                </Text>
                                                <Text style={{marginBottom: 10}}>
                                                  Day: {item.day}
                                                </Text>
                                                <Text style={{marginBottom: 10}}>
                                                  Time: {item.time} hrz
                                                </Text>
                                                <View style={styles.raiodForm}>
                                                  <RadioForm
                                                    buttonColor={'#50C900'}
                                                    selectedButtonColor={'#50C900'}
                                                    radioStyle={{ paddingRight: '10%'}}
                                                    radio_props={radio_props}
                                                    formHorizontal={true}
                                                    labelHorizontal={false}
                                                    onPress={(value) => this.canBook(cuts.filter(c => c.id === value)[0], item, book, user)}
                                                  />
                                                </View>
                                              </View>
                                            </Card>
                                        )
                                      }}
                                    />
                                  </View>
                                )
                              }}
                            </Query>
                            </ScrollView>
                          </View>
                        );
                      }}
                    </Query>
                  )
                }}
              </Mutation>
            )
          }}
        </Query>
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
  slotHead: {
    fontSize: 25,
    textAlign: 'center'
  },
  bookButton: {
    padding: 5,
    backgroundColor: '#558B2F'
  },
  raiodForm: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinnerTextStyle: {
    textAlign: 'center',
    padding: 10,
    color: '#FFF'
  },
  errorMessage: {
    marginLeft: '30%',
    color: "#B00020",
  },
  cancelMessage: {
    color: "#B00020",
  }
});
