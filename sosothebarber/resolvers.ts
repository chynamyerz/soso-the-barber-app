import gql from "graphql-tag";
import api from "./api/api";

export const typeDefs = gql`
  extend type Query {
    user: User
  }

  extend type Mutation {
    """
    Logging in the user provided correct credentials.
    """
    login(
      email: String 
      password: String
    ): Boolean
  }

  """
  User.
  """
  type User {
    """
    Email address
    """
    email: String!
    """
    Image url
    """
    image: String!
  }
`;

export const resolvers = {
  Mutation: {
    login: async (_: any, variables: any, { cache }: any) => {
      try {
        const login = await api.login({
          password: variables.password,
          email: variables.email
        });

        // true if successful, error otherwise.
        return login.data.success;
      } catch (e) {
        throw Error(e.message)
      }
    },

    logout: async (_: any, variables: any, { cache }: any) => {
      try {
        const logout = await api.logout();

        // true if successful, error otherwise.
        return logout.data.success;
      } catch (e) {
        throw Error(e.message)
      }
    }
  }
};