import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Platform } from 'react-native';

// Use a network-reachable host so Expo Go and the browser can reach the backend.
// Android emulator uses 10.0.2.2; other devices should use the machine's LAN IP.
const getBaseUrl = () => {
    if (Platform.OS === 'android') {
        return 'http://10.0.2.2:5000/api';
    }

    return 'http://192.168.8.144:5000/api';
};

const API = axios.create({
    baseURL: getBaseUrl(), 
});

// Automatically attach the JWT token to every request if it exists
API.interceptors.request.use(async (req) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export default API;
