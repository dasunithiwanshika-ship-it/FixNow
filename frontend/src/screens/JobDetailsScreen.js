import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const JobDetailsScreen = ({ route, navigation }) => {
    const { jobId } = route.params;
    const { user } = useContext(AuthContext);
    
    const [job, setJob] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    const fetchJobDetails = async () => {
        setIsLoading(true);
        try {
            const res = await API.get(`/services/${jobId}`);
            setJob(res.data);
        } catch (error) {
            Alert.alert('Error', 'Failed to load job details');
            navigation.goBack();
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
             fetchJobDetails();
        });
        return unsubscribe;
    }, [jobId, navigation]);

    const updateStatus = async (newStatus) => {
        setIsUpdating(true);
        try {
            const res = await API.put(`/services/${jobId}/status`, { status: newStatus });
            setJob(res.data);
            Alert.alert('Success', `Job status updated to ${newStatus}`);
        } catch (error) {
            Alert.alert('Update Failed', error.response?.data?.message || 'Something went wrong');
        } finally {
            setIsUpdating(false);
        }
    };

    const uploadProgressImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 0.5,
        });

        if (result.canceled) return;

        setIsUpdating(true);
        try {
            const formData = new FormData();
            const uri = result.assets[0].uri;
            const filename = uri.split('/').pop();
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : `image`;

            formData.append('image', { uri, name: filename, type });

            // 1. Upload the image file to our server via /upload
            const uploadRes = await API.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const uploadedImagePath = uploadRes.data.filePath;

            // 2. Attach the URL to the Job's progress array
            const res = await API.put(`/services/${jobId}/progress-image`, {
                imageUrl: uploadedImagePath
            });

            setJob(res.data);
            Alert.alert('Success', 'Progress image uploaded successfully!');
        } catch (error) {
            Alert.alert('Upload Failed', error.response?.data?.message || 'Something went wrong');
        } finally {
            setIsUpdating(false);
        }
    };

    if (isLoading || !job) {
        return <ActivityIndicator size="large" color="#0066cc" style={{ marginTop: 50 }} />;
    }

    const { status, serviceType, location, budget, description, customer, worker } = job;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>{serviceType}</Text>
            
            <View style={styles.card}>
                <Text style={styles.label}>Status: <Text style={styles.statusText}>{status}</Text></Text>
                <Text style={styles.label}>Location: <Text style={styles.value}>{location}</Text></Text>
                <Text style={styles.label}>Budget: <Text style={styles.value}>${budget}</Text></Text>
                <Text style={styles.label}>Description:</Text>
                <Text style={styles.description}>{description}</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Customer Details</Text>
                <Text style={styles.value}>Name: {customer?.name}</Text>
            </View>

            {worker && (
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Worker Details</Text>
                    <Text style={styles.value}>Name: {worker.name}</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('WorkerProfile', { workerId: worker._id })}>
                        <Text style={styles.linkText}>View Worker Profile</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Work Progress Section */}
            {(job.progressImages?.length > 0 || (user?.role === 'Worker' && job.worker?._id === user._id && status === 'In Progress')) && (
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Work Progress Gallery</Text>
                    
                    {job.progressImages?.length > 0 ? (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageGallery}>
                            {job.progressImages.map((img, idx) => (
                                <Image 
                                    key={idx} 
                                    source={{ uri: img.startsWith('/') ? `http://192.168.8.144:5000${img}` : img }} 
                                    style={styles.progressImage} 
                                />
                            ))}
                        </ScrollView>
                    ) : (
                        <Text style={styles.value}>No progress photos uploaded yet.</Text>
                    )}

                    {user?.role === 'Worker' && job.worker?._id === user._id && status === 'In Progress' && (
                        <TouchableOpacity style={styles.buttonSecondary} onPress={uploadProgressImage} disabled={isUpdating}>
                            <Text style={styles.buttonTextSecondary}>📸 Upload Progress Photo</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}

            <View style={styles.actionContainer}>
                {user?.role === 'Worker' && status === 'Posted' && (
                    <TouchableOpacity style={styles.button} onPress={() => updateStatus('Accepted')} disabled={isUpdating}>
                        <Text style={styles.buttonText}>Accept Job</Text>
                    </TouchableOpacity>
                )}

                {user?.role === 'Worker' && job.worker?._id === user._id && status === 'Accepted' && (
                    <TouchableOpacity style={styles.buttonSecondary} onPress={() => updateStatus('In Progress')} disabled={isUpdating}>
                        <Text style={styles.buttonTextSecondary}>Start Work (In Progress)</Text>
                    </TouchableOpacity>
                )}

                {user?.role === 'Worker' && job.worker?._id === user._id && status === 'In Progress' && (
                    <TouchableOpacity style={styles.buttonSuccess} onPress={() => updateStatus('Completed')} disabled={isUpdating}>
                        <Text style={styles.buttonText}>Mark as Completed</Text>
                    </TouchableOpacity>
                )}

                {user?.role === 'Customer' && job.customer?._id === user._id && status === 'Completed' && (
                    <TouchableOpacity style={styles.buttonSuccess} onPress={() => updateStatus('Paid')} disabled={isUpdating}>
                        <Text style={styles.buttonText}>Confirm & Pay</Text>
                    </TouchableOpacity>
                )}

                {user?.role === 'Customer' && job.customer?._id === user._id && status === 'Paid' && (
                    <TouchableOpacity style={styles.buttonReview} onPress={() => navigation.navigate('ReviewScreen', { jobId: job._id })}>
                        <Text style={styles.buttonText}>Leave a Review</Text>
                    </TouchableOpacity>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flexGrow: 1, padding: 20, backgroundColor: '#f9f9f9' },
    title: { fontSize: 26, fontWeight: 'bold', marginBottom: 15, color: '#333' },
    card: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#eee' },
    label: { fontSize: 16, fontWeight: 'bold', color: '#555', marginBottom: 5 },
    value: { fontWeight: 'normal', color: '#333' },
    statusText: { color: '#0066cc', fontStyle: 'italic' },
    description: { fontSize: 15, color: '#444', marginTop: 5, lineHeight: 22 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10 },
    linkText: { color: '#0066cc', marginTop: 10, fontWeight: 'bold' },
    actionContainer: { marginTop: 10 },
    button: { backgroundColor: '#0066cc', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 10 },
    buttonSecondary: { backgroundColor: '#e6f2ff', padding: 15, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#0066cc', marginBottom: 10 },
    buttonSuccess: { backgroundColor: '#28a745', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 10 },
    buttonReview: { backgroundColor: '#ffc107', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 10 },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    buttonTextSecondary: { color: '#0066cc', fontSize: 16, fontWeight: 'bold' },
    imageGallery: { flexDirection: 'row', marginTop: 10, marginBottom: 15 },
    progressImage: { width: 120, height: 120, borderRadius: 10, marginRight: 10, borderWidth: 1, borderColor: '#ddd' }
});

export default JobDetailsScreen;
