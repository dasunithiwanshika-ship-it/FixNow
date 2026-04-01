import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const JobListScreen = ({ navigation }) => {
    const { user } = useContext(AuthContext);
    const [jobs, setJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchJobs = async () => {
        setIsLoading(true);
        try {
            let res;
            if (user?.role === 'Worker') {
                // Workers see all available jobs
                res = await API.get('/services');
            } else {
                // Customers see their own posted jobs
                res = await API.get('/services/my-requests');
            }
            setJobs(res.data);
        } catch (error) {
            console.error('Failed to fetch jobs', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
             fetchJobs();
        });
        return unsubscribe;
    }, [navigation, user]);

    const renderJob = ({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('JobDetails', { jobId: item._id })}>
            <Text style={styles.jobTitle}>{item.serviceType}</Text>
            <Text style={styles.jobLocation}>📍 {item.location}</Text>
            <Text style={styles.jobBudget}>💰 ${item.budget}</Text>
            <Text style={styles.jobStatus}>Status: {item.status}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{user?.role === 'Worker' ? 'Available Jobs' : 'My Posted Jobs'}</Text>
            
            {isLoading ? (
                <ActivityIndicator size="large" color="#0066cc" style={{ marginTop: 20 }} />
            ) : jobs.length === 0 ? (
                <Text style={styles.noJobsText}>No jobs found.</Text>
            ) : (
                <FlatList
                    data={jobs}
                    keyExtractor={(item) => item._id}
                    renderItem={renderJob}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f9f9f9' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 15, color: '#333' },
    card: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#eee', elevation: 2 },
    jobTitle: { fontSize: 18, fontWeight: 'bold', color: '#0066cc', marginBottom: 5 },
    jobLocation: { fontSize: 14, color: '#555', marginBottom: 5 },
    jobBudget: { fontSize: 14, fontWeight: 'bold', color: '#28a745', marginBottom: 5 },
    jobStatus: { fontSize: 14, fontStyle: 'italic', color: '#777' },
    noJobsText: { textAlign: 'center', fontSize: 16, color: '#888', marginTop: 20 }
});

export default JobListScreen;
