import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Dimensions } from 'react-native';
import { Star, MessageSquare, Send } from 'lucide-react-native';
import API from '../api/axios';
import { theme } from '../utils/theme';
import Header from '../components/Header';
import AnimatedCard from '../components/AnimatedCard';

const { width } = Dimensions.get('window');

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
            navigation.navigate('Home'); 
        } catch (error) {
            Alert.alert('Review Failed', error.response?.data?.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Header title="Rate Experience" />
            
            <View style={styles.content}>
                <AnimatedCard index={0} style={styles.reviewCard}>
                    <Text style={styles.title}>How did it go?</Text>
                    <Text style={styles.subtitle}>Your feedback helps our community stay reliable.</Text>

                    <View style={styles.starsContainer}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <TouchableOpacity 
                                key={star} 
                                onPress={() => setRating(star)}
                                activeOpacity={0.7}
                            >
                                <View style={{ opacity: star <= rating ? 1 : 0.4, transform: [{ scale: star <= rating ? 1.2 : 1 }] }}>
                                    <Star 
                                        size={48} 
                                        color={star <= rating ? "#F59E0B" : theme.colors.border} 
                                        fill={star <= rating ? "#F59E0B" : "transparent"}
                                        style={styles.starIcon} 
                                    />
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.ratingTextContainer}>
                        <Text style={styles.ratingLabel}>
                            {rating === 0 ? 'Select a rating' : 
                             rating === 1 ? 'Poor' : 
                             rating === 2 ? 'Fair' : 
                             rating === 3 ? 'Good' : 
                             rating === 4 ? 'Very Good' : 'Excellent'}
                        </Text>
                    </View>

                    <View style={styles.inputGroup}>
                        <View style={styles.labelRow}>
                            <MessageSquare size={16} color={theme.colors.textSecondary} />
                            <Text style={styles.label}>Your Comment</Text>
                        </View>
                        <TextInput 
                            style={styles.input} 
                            placeholder="Tell us what you liked or what could be better..." 
                            value={comment} 
                            onChangeText={setComment} 
                            multiline 
                            placeholderTextColor={theme.colors.textSecondary}
                        />
                    </View>

                    <TouchableOpacity 
                        style={[styles.submitButton, (isLoading || rating === 0) && styles.disabledButton]} 
                        onPress={handleSubmit} 
                        disabled={isLoading || rating === 0}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <View style={styles.btnInner}>
                                <Text style={styles.submitButtonText}>Submit Feedback</Text>
                                <Send size={18} color="#fff" style={{ marginLeft: 10 }} />
                            </View>
                        )}
                    </TouchableOpacity>
                </AnimatedCard>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: theme.colors.background 
    },
    content: {
        flex: 1,
        padding: theme.spacing.lg,
        justifyContent: 'center',
    },
    reviewCard: {
        padding: 30,
        alignItems: 'center',
    },
    title: { 
        fontSize: 26, 
        fontWeight: '800', 
        color: theme.colors.primary, 
        marginBottom: 10,
        textAlign: 'center' 
    },
    subtitle: { 
        fontSize: 15, 
        color: theme.colors.textSecondary, 
        marginBottom: 35, 
        textAlign: 'center',
        lineHeight: 22,
    },
    starsContainer: { 
        flexDirection: 'row', 
        justifyContent: 'center', 
        gap: 12,
        marginBottom: 15 
    },
    starIcon: { 
        marginHorizontal: 2 
    },
    ratingTextContainer: {
        marginBottom: 35,
    },
    ratingLabel: {
        fontSize: 18,
        fontWeight: '700',
        color: "#F59E0B",
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    inputGroup: {
        width: '100%',
        marginBottom: 30,
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 10,
    },
    label: {
        fontSize: 14,
        fontWeight: '700',
        color: theme.colors.textSecondary,
        textTransform: 'uppercase',
    },
    input: { 
        backgroundColor: theme.colors.background, 
        padding: 15, 
        borderRadius: theme.borderRadius.md, 
        borderWidth: 1, 
        borderColor: theme.colors.border,
        color: theme.colors.text,
        fontSize: 16,
        height: 120,
        textAlignVertical: 'top',
    },
    submitButton: { 
        backgroundColor: theme.colors.primary, 
        paddingVertical: 18, 
        borderRadius: theme.borderRadius.md, 
        alignItems: 'center', 
        width: '100%',
        ...theme.shadows.md,
    },
    btnInner: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    submitButtonText: { 
        color: '#fff', 
        fontSize: 16, 
        fontWeight: '800' 
    },
    disabledButton: {
        opacity: 0.5,
        backgroundColor: theme.colors.border,
    }
});

export default ReviewScreen;
