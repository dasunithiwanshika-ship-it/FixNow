import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, isLoading } = useContext(AuthContext);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter email and password');
            return;
        }
        
        try {
            await login(email, password);
            // Navigation to Home happens automatically in App.js via AuthContext state changes
        } catch (error) {
            Alert.alert('Login Failed', error.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to FixNow</Text>
            
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            
            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
                {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Log In</Text>}
            </TouchableOpacity>

            <TouchableOpacity style={styles.registerLink} onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerText}>Don't have an account? Register here.</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f9f9f9' },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, textAlign: 'center', color: '#333' },
    input: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#ddd' },
    button: { backgroundColor: '#0066cc', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    registerLink: { marginTop: 20, alignItems: 'center' },
    registerText: { color: '#0066cc', fontSize: 14 }
});

export default LoginScreen;
