import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import API from '../api/axios';

const WorkerProfileScreen = ({ route }) => {
    const { workerId } = route.params;
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await API.get(`/reviews/worker/${workerId}`);
                setReviews(res.data);
            } catch (error) {
                console.error('Failed to fetch worker reviews', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchReviews();
    }, [workerId]);

    const renderReview = ({ item }) => (
        <View style={styles.reviewCard}>
            <Text style={styles.reviewerName}>{item.reviewer?.name} ⭐ {item.rating}/5</Text>
            <Text style={styles.jobType}>Job: {item.job?.serviceType}</Text>
            <Text style={styles.comment}>"{item.comment}"</Text>
        </View>
    );

    if (isLoading) {
        return <ActivityIndicator size="large" color="#0066cc" style={{ marginTop: 50 }} />;
    }

    // Calculating dynamic average rating from the array just in case
    const avgRating = reviews.length > 0 
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : 'New';

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Worker Profile</Text>
                <Text style={styles.statText}>Average Rating: ⭐ {avgRating}</Text>
                <Text style={styles.statText}>Total Reviews: {reviews.length}</Text>
            </View>

            <Text style={styles.sectionTitle}>Reviews from Past Jobs</Text>

            {reviews.length === 0 ? (
                <Text style={styles.noReviews}>This worker has no reviews yet.</Text>
            ) : (
                <FlatList
                    data={reviews}
                    keyExtractor={(item) => item._id}
                    renderItem={renderReview}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f9f9f9' },
    header: { backgroundColor: '#0066cc', padding: 20, alignItems: 'center', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
    title: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 10 },
    statText: { fontSize: 16, color: '#f0f0f0', marginBottom: 5 },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', margin: 20 },
    noReviews: { textAlign: 'center', fontSize: 16, color: '#888', marginTop: 10 },
    reviewCard: { backgroundColor: '#fff', padding: 15, marginHorizontal: 20, marginBottom: 15, borderRadius: 10, borderWidth: 1, borderColor: '#eee', elevation: 1 },
    reviewerName: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 5 },
    jobType: { fontSize: 14, color: '#0066cc', marginBottom: 8 },
    comment: { fontSize: 15, color: '#555', fontStyle: 'italic' }
});

export default WorkerProfileScreen;
