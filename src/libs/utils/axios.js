import axios from 'axios';
import {baseURL} from '../config';
import EncryptedStorage from 'react-native-encrypted-storage';

const axiosAuth = axios.create({
  baseURL,
});

axiosAuth.interceptors.request.use(
  async config => {
    let token = JSON.parse(
      await EncryptedStorage.getItem('user_session'),
    ).token;
    config.headers.Authorization = `${token}`;
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

axiosAuth.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    try {
      if (
        error.response.data.error === 'Unauthorized' &&
        error.response.status === 401
      ) {
        await EncryptedStorage.removeItem('user_session');
      }
    } catch (e) {
      return Promise.reject(e);
    }

    return Promise.reject(error);
  },
);

const axiosInstance = axios.create({
  baseURL,
});

export {axiosAuth, axiosInstance};
