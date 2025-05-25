import axios from 'axios';
import Constants from 'expo-constants';
import {getToken} from "../store/storages";

const API_URL = Constants.expoConfig?.extra?.REACT_APP_API_URL;

const Request = () => {
    const timeout = 1000 * 60 * 5;
    const request = axios.create({
        baseURL: API_URL,
        timeout: timeout,
        withCredentials: true,
        headers: {
            'content-type': 'application/json',
        },
    });

    request.interceptors.request.use(async (config) => {
        const token = await getToken();
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    return request;
};

const request = Request();
export default request;