import gql from 'graphql-tag';

/**
 * Register new user
 * 
 * parameters
 * cell: 
 *      User's contact number
 * email: 
 *      User's email address
 * image: 
 *      User's url for the profile image
 * name: 
 *      User's name
 * password: 
 *      User's password
 * streetAddress: 
 *      User's streetAddress
 */
const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION(
    $cell: String!
    $email: String!
    $image: String
    $name: String!
    $password: String!
    $streetAddress: String
  ){
    signup(
      cell: $cell
      email: $email
      image: $image
      name: $name
      password: $password
      streetAddress: $streetAddress
    ) {
      message
    }
  }
`;

/**
 * Update user information
 * 
 * parameters
 * cell: 
 *      User's contact number
 * email: 
 *      User's email address
 * image: 
 *      User's url for the profile image
 * name: 
 *      User's name
 * password: 
 *      User's current password
 * newPassword: 
 *      User's new password
 * streetAddress: 
 *      User's streetAddress
 */
const USER_UPDATE_MUTATION = gql`
  mutation USER_UPDATE_MUTATION(
    $cell: String
    $email: String
    $image: String
    $name: String
    $newPassword: String
    $password: String!
    $streetAddress: String
  ){
    updateUser(
      cell: $cell
      email: $email
      image: $image
      name: $name
      newPassword: $newPassword
      password: $password
      streetAddress: $streetAddress
    ){
      message
    }
  }
`;

/**
 * Make a booking
 * 
 * parameters
 * tokenId:
 *      A token for bank charges
 * slotId:
 *      A unique ID for the slot to book
 * UserId:
 *      A unique ID for the user who is booking the slot
 */
const BOOK_MUTATION = gql`
  mutation BOOK_MUTATION(
    $cutId: ID!
    $slotId: ID!
    $userId: ID!
  ){
    book(
      cutId: $cutId
      slotId: $slotId
      userId: $userId
    ){
      message
    }
  }
`;

/**
 * Cancel the booking
 * 
 * parameters
 * email:
 *      A registered email to change password for
 */
const CANCEL_BOOKING_MUTATION = gql`
  mutation CANCEL_BOOKING_MUTATION(
    $bookingId: ID!
  ){
    cancelBooking(
      bookingId: $bookingId
    ){
      message
    }
  }
`;

/**
 * Get currently logged in user.
 *
 * The following arguments must be supplied.
 * email:
 *     The correct user email address.
 * password:
 *     The correct user password.
 */
const GET_USER_MUTATION = gql`
  mutation GET_USER_MUTATION(
    $email: String!
    $password: String!
  ) {
    login(
      email: $email
      password: $password
    ) @client
  }
`;

/**
 * Logout the currently logged in user.
 */
const LOGOUT_USER_MUTATION = gql`
  mutation LOGOUT_USER_MUTATION {
    logout @client
  }
`;

/**
 * Request reset the password
 * 
 * parameters
 * email:
 *      User's email address
 */
const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION(
    $email: String!
  ) {
    requestReset(
      email: $email
    ) {
      message
    }
  }
`;

/**
 * Reset password
 * 
 * parameters
 * oneTimePin:
 *      One time pin to enable password reset
 * password:
 *      User's new password
 */
const RESET_PASSWORD_MUTATION = gql`
  mutation RESET_PASSWORD_MUTATION(
    $oneTimePin: String!
    $password: String!
  ) {
    resetPassword(
      oneTimePin: $oneTimePin
      password: $password
    ) {
      message
    }
  }
`;

/**
 * Send an email
 *
 * parameters
 * content:
 *      An email content
 */
const SEND_EMAIL_MUTATION = gql`
    mutation SEND_EMAIL_MUTATION(
        $content: String!
    ){
        sendEmail(
            content: $content
        ){
            message
        }
    }
`;

export { 
  USER_UPDATE_MUTATION, 
  RESET_PASSWORD_MUTATION, 
  REQUEST_RESET_MUTATION, 
  CANCEL_BOOKING_MUTATION, 
  SIGNUP_MUTATION, 
  BOOK_MUTATION, 
  GET_USER_MUTATION, 
  LOGOUT_USER_MUTATION,
  SEND_EMAIL_MUTATION
}