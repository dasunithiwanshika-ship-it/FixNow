import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// When running on Android emulator, 10.0.2.2 maps to your computer's localhost.
// For physical devices, you must replace this with your computer's local IP address
const API = axios.create({
    baseURL: 'http://192.168.8.144:5000/api', 
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
