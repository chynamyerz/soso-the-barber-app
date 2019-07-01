import React, { Component } from 'react';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from "apollo-cache-inmemory";
import { createHttpLink } from 'apollo-link-http';
import { ApolloProvider } from 'react-apollo';
import DrawerNavigator from './navigation/DrawerNavigator';
import { resolvers, typeDefs } from "./resolvers";
import Config from 'react-native-config';

const client = new ApolloClient({
  link: createHttpLink({
    credentials: "include",
    uri: Config.BACKEND_SOSO_URL_PROD
  }),
  cache: new InMemoryCache(),
  resolvers,
  typeDefs
});

export default class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <DrawerNavigator />
      </ApolloProvider>
    );
  }
}