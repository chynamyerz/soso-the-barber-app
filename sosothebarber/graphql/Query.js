import gql from 'graphql-tag';

/**
 * The user query
 */
const USER_QUERY = gql`
  query USER_QUERY {
    user {
      id
      email
      imageURL
      name
      role
      streetAddress
      bookings{
        id
        status
        cut{
          id
          title
          price
          description
          imageURL
        }
        slot {
          id
          day
          time
          status
        }
      }
    }
  }
`;

/**
 * The users query
 */
const USERS_QUERY = gql`
  query USERS_QUERY {
    users {
      id
      email
      imageURL
      name
      role
      streetAddress
      bookings{
        id
        status
        cut{
          id
          title
          price
          description
          imageURL
        }
        slot {
          id
          day
          time
          status
        }
      }
    }
  }
`;

/**
 * The bookings query
 */
const BOOKINGS_QUERY = gql`
  query BOOKINGS_QUERY {
    bookings{
      id
      status
      cut{
        id
        title
        price
        description
        imageURL
      }
      slot {
        id
        day
        time
        status
      }
      user{
        id
        name
        streetAddress
      }
    }
  }
`;

/**
 * The slots query
 */
const SLOTS_QUERY = gql`
  query SLOT_QUERY {
    slots {
      id
      day
      time
      status
    }
  }
`;

/**
 * The cuts query
 */
const CUTS_QUERY = gql`
  query CUTS_QUERY {
    cuts {
      id
      price
      title
      description
    }
  }
`;

/**
 * The gallery query
 */
const GALLERY_QUERY = gql`
  query GALLERY_QUERY {
    gallery {
      id
      imageURI
    }
  }
`;

export { 
  BOOKINGS_QUERY,
  CUTS_QUERY,
  USER_QUERY, 
  SLOTS_QUERY, 
  GALLERY_QUERY 
};