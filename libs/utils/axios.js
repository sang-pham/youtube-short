import axios from 'axios';
import {baseURL} from '../config';

const axiosAuth = axios.create({
  baseURL,
});

const axiosInstance = axios.create({
  baseURL,
});

export {axiosAuth, axiosInstance};
