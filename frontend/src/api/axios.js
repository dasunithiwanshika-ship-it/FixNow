import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Platform } from 'react-native';

// When running on Android emulator, 10.0.2.2 maps to your computer's localhost.
// For physical devices, you must replace this with your computer's local IP address
const getBaseUrl = () => {
    if (Platform.OS === 'web') {
        return 'http://localhost:5000/api';
    } else if (Platform.OS === 'android') {
        // You may need your local IP if testing on a physical device
        return 'http://10.0.2.2:5000/api'; 
    } else {
        // Fallback for iOS simulator or physical devices. Update IP if needed.
        return 'http://192.168.8.144:5000/api';
    }
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
