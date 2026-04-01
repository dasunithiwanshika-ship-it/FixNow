import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [splashLoading, setSplashLoading] = useState(true);

    const login = async (email, password) => {
        setIsLoading(true);
        try {
            const res = await API.post('/auth/login', { email, password });
            await AsyncStorage.setItem('userToken', res.data.token);
            setUser(res.data.user);
        } catch (error) {
            console.error('Login error', error.response?.data || error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (userData) => {
        setIsLoading(true);
        try {
            const res = await API.post('/auth/register', userData);
            await AsyncStorage.setItem('userToken', res.data.token);
            setUser(res.data.user);
        } catch (error) {
            console.error('Registration error', error.response?.data || error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            await AsyncStorage.removeItem('userToken');
            setUser(null);
        } catch (error) {
            console.error('Logout error', error);
        } finally {
            setIsLoading(false);
        }
    };

    const checkLoggedUser = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (token) {
                // Optionally call /auth/me to verify token and get fresh user data
                const res = await API.get('/auth/me');
                setUser(res.data);
            }
        } catch (error) {
            console.error('Check user error', error);
            // Token might be expired
            await AsyncStorage.removeItem('userToken');
            setUser(null);
        } finally {
            setSplashLoading(false);
        }
    };

    useEffect(() => {
        checkLoggedUser();
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            splashLoading,
            login,
            register,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};
