import axios from "axios";
import Config from 'react-native-config';

/**
 * An axios base client responsible for the HTTP requests.
 */
export const baseAxiosClient = () => ({
  _client: axios.create({
    baseURL: Config.BACKEND_SOSO_URL_PROD,
    withCredentials: true
  }),

  _handleError(error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw error;
    }
  },

  get(url) {
    return this._client.get(url).catch(this._handleError);
  },

  post(url, data) {
    return this._client.post(url, data).catch(this._handleError);
  }
});