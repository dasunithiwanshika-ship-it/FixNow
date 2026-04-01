import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/AuthContext';

const HomeScreen = ({ navigation }) => {
    const { user, logout } = useContext(AuthContext);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome back, {user?.name}!</Text>
            <Text style={styles.role}>Role: {user?.role}</Text>
            
            <View style={styles.buttonContainer}>
                {user?.role === 'Customer' && (
                    <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('CreateJob')}>
                        <Text style={styles.primaryButtonText}>Post a New Job</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('JobList')}>
                    <Text style={styles.secondaryButtonText}>
                        {user?.role === 'Worker' ? 'Find Available Jobs' : 'My Posted Jobs'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Dashboard')}>
                    <Text style={styles.actionButtonText}>Analytics Dashboard</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Profile')}>
                    <Text style={styles.actionButtonText}>My Profile</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f9f9f9', justifyContent: 'center' },
    title: { fontSize: 26, fontWeight: 'bold', marginBottom: 5, color: '#333', textAlign: 'center' },
    role: { fontSize: 16, color: '#888', marginBottom: 40, textAlign: 'center' },
    buttonContainer: { marginBottom: 40 },
    primaryButton: { backgroundColor: '#0066cc', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 15 },
    primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    secondaryButton: { backgroundColor: '#e6f2ff', padding: 15, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#0066cc', marginBottom: 15 },
    secondaryButtonText: { color: '#0066cc', fontSize: 16, fontWeight: 'bold' },
    actionButton: { backgroundColor: '#fff', padding: 15, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#ddd', marginBottom: 15 },
    actionButtonText: { color: '#333', fontSize: 16, fontWeight: 'bold' },
    logoutButton: { backgroundColor: '#cc0000', padding: 15, borderRadius: 10, alignItems: 'center' },
    logoutButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});

export default HomeScreen;
