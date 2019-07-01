import { baseAxiosClient } from "./";

/**
 * An API for the Data Archive.
 *
 *  login
 *    A function responsible for authenticating the user.
 *
 *  logout
 *    A function responsible for logging out the currently logged in user.
 */
export default {
  login: async (credentials) => {
    return await baseAxiosClient().post("/auth/login", {
      password: credentials.password,
      email: credentials.email,
    });
  },
  logout: async () => {
    return await baseAxiosClient().post("/auth/logout");
  }
};