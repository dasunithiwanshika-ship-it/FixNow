import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const DashboardScreen = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await API.get('/users/dashboard');
                setStats(res.data);
            } catch (error) {
                console.error('Failed to load dashboard:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (user) fetchStats();
    }, [user]);

    if (isLoading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#0066cc" />
            </View>
        );
    }

    if (!stats) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text>Could not load analytics at this time.</Text>
            </View>
        );
    }

    const StatCard = ({ icon, color, value, label }) => (
        <View style={[styles.card, { borderLeftColor: color }]}>
            <View style={[styles.iconBox, { backgroundColor: color + '20' }]}>
                <Ionicons name={icon} size={28} color={color} />
            </View>
            <View style={styles.cardContent}>
                <Text style={styles.cardValue}>{value}</Text>
                <Text style={styles.cardLabel}>{label}</Text>
            </View>
        </View>
    );

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Text style={styles.greeting}>Hello, {user?.name} 👋</Text>
                <Text style={styles.subtitle}>Here is your activity overview</Text>
            </View>

            <View style={styles.statsGrid}>
                {user?.role === 'Customer' ? (
                    <>
                        <StatCard icon="document-text" color="#0066cc" value={stats.postsCreated || 0} label="Jobs Posted" />
                        <StatCard icon="checkmark-circle" color="#28a745" value={stats.jobsCompleted || 0} label="Completed Jobs" />
                        <StatCard icon="star" color="#ffc107" value={stats.reviewsGiven || 0} label="Reviews Given" />
                        <StatCard icon="cash" color="#dc3545" value={`$${stats.totalPayments || 0}`} label="Total Paid" />
                    </>
                ) : (
                    <>
                        <StatCard icon="hammer" color="#17a2b8" value={stats.jobsCompleted || 0} label="Jobs Completed" />
                        <StatCard icon="star" color="#ffc107" value={stats.reviewsReceived || 0} label="Reviews Received" />
                        <StatCard icon="wallet" color="#28a745" value={`$${stats.totalEarnings || 0}`} label="Total Earnings" />
                    </>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flexGrow: 1, backgroundColor: '#f4f6f9', padding: 20 },
    header: { marginBottom: 30, marginTop: 20 },
    greeting: { fontSize: 28, fontWeight: 'bold', color: '#333' },
    subtitle: { fontSize: 16, color: '#777', marginTop: 5 },
    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    card: { 
        width: '48%', 
        backgroundColor: '#fff', 
        padding: 15, 
        borderRadius: 15, 
        marginBottom: 15, 
        borderLeftWidth: 5,
        elevation: 3, 
        shadowColor: '#000', 
        shadowOpacity: 0.1, 
        shadowRadius: 5, 
        shadowOffset: { width: 0, height: 2 }
    },
    iconBox: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
    cardContent: { paddingLeft: 5 },
    cardValue: { fontSize: 24, fontWeight: 'bold', color: '#222' },
    cardLabel: { fontSize: 13, color: '#666', marginTop: 3, fontWeight: '500' }
});

export default DashboardScreen;
