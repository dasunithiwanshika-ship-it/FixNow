import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import API from '../api/axios';

const ReviewScreen = ({ route, navigation }) => {
    const { jobId } = route.params;
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (rating < 1 || rating > 5) {
            Alert.alert('Error', 'Please select a star rating between 1 and 5');
            return;
        }

        if (!comment.trim()) {
            Alert.alert('Error', 'Please write a short comment about your experience');
            return;
        }

        setIsLoading(true);
        try {
            await API.post('/reviews', {
                jobId,
                rating,
                comment
            });
            Alert.alert('Success', 'Thank you! Your review has been submitted.');
            navigation.navigate('Home'); // Navigate completely away to refresh 
        } catch (error) {
            Alert.alert('Review Failed', error.response?.data?.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Rate Your Worker</Text>
            <Text style={styles.subtitle}>Let others know about your experience!</Text>

            <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity key={star} onPress={() => setRating(star)}>
                        <Ionicons 
                            name={star <= rating ? "star" : "star-outline"} 
                            size={40} 
                            color="#ffc107" 
                            style={styles.starIcon} 
                        />
                    </TouchableOpacity>
                ))}
            </View>
            <TextInput 
                style={[styles.input, { height: 100 }]} 
                placeholder="Leave a comment..." 
                value={comment} 
                onChangeText={setComment} 
                multiline 
            />

            <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={isLoading}>
                {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Submit Review</Text>}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f9f9f9', justifyContent: 'center' },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 5, textAlign: 'center', color: '#333' },
    subtitle: { fontSize: 16, color: '#777', marginBottom: 30, textAlign: 'center' },
    starsContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20 },
    starIcon: { marginHorizontal: 5 },
    input: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#ddd' },
    button: { backgroundColor: '#ffc107', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
    buttonText: { color: '#333', fontSize: 16, fontWeight: 'bold' }
});

export default ReviewScreen;
