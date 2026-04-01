import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { AuthContext } from '../context/AuthContext';

const RegisterScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Customer'); // Customer or Worker
    
    // Worker-only optional fields for initial registration
    const [serviceType, setServiceType] = useState('');
    const [location, setLocation] = useState('');

    const { register, isLoading } = useContext(AuthContext);

    const handleRegister = async () => {
        if (!name || !email || !password) {
            Alert.alert('Error', 'Name, email, and password are required');
            return;
        }

        const userData = {
            name, email, password, role,
            ...(role === 'Worker' && { serviceType, location })
        };

        try {
            await register(userData);
            // Will navigate automatically via App.js conditional rendering
        } catch (error) {
            Alert.alert('Registration Failed', error.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Create Account</Text>

            <View style={styles.roleContainer}>
                <TouchableOpacity 
                    style={[styles.roleButton, role === 'Customer' && styles.roleButtonActive]} 
                    onPress={() => setRole('Customer')}
                >
                    <Text style={[styles.roleText, role === 'Customer' && styles.roleTextActive]}>Customer</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.roleButton, role === 'Worker' && styles.roleButtonActive]} 
                    onPress={() => setRole('Worker')}
                >
                    <Text style={[styles.roleText, role === 'Worker' && styles.roleTextActive]}>Worker</Text>
                </TouchableOpacity>
            </View>

            <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={setName} />
            <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />

            {role === 'Worker' && (
                <>
                    <TextInput style={styles.input} placeholder="Service Type (e.g., Plumber)" value={serviceType} onChangeText={setServiceType} />
                    <TextInput style={styles.input} placeholder="Location (City or Area)" value={location} onChangeText={setLocation} />
                </>
            )}

            <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={isLoading}>
                {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Register</Text>}
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginText}>Already have an account? Log in.</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flexGrow: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f9f9f9' },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#333' },
    roleContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20, gap: 10 },
    roleButton: { paddingVertical: 10, paddingHorizontal: 20, borderWidth: 1, borderColor: '#0066cc', borderRadius: 20 },
    roleButtonActive: { backgroundColor: '#0066cc' },
    roleText: { color: '#0066cc', fontWeight: 'bold' },
    roleTextActive: { color: '#fff' },
    input: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#ddd' },
    button: { backgroundColor: '#0066cc', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    loginLink: { marginTop: 20, alignItems: 'center' },
    loginText: { color: '#0066cc', fontSize: 14 }
});

export default RegisterScreen;
