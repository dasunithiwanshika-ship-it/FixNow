import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, ScrollView, Dimensions } from 'react-native';
import { Star, User, Briefcase, MessageSquare, Award } from 'lucide-react-native';
import API from '../api/axios';
import { theme } from '../utils/theme';
import Header from '../components/Header';
import AnimatedCard from '../components/AnimatedCard';

const { width } = Dimensions.get('window');

const WorkerProfileScreen = ({ route }) => {
    const { workerId } = route.params;
    const [reviews, setReviews] = useState([]);
    const [earnings, setEarnings] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchEarnings = async () => {
            try {
                const res = await API.get('/users/dashboard');
                if (res.data.totalEarnings !== undefined) {
                    setEarnings(res.data.totalEarnings);
                }
            } catch (error) {
                console.error('Failed to fetch earnings', error);
            }
        };
        fetchEarnings();
    }, []);



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

    const avgRating = reviews.length > 0 
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : '0.0';

    const renderReview = ({ item, index }) => (
        <AnimatedCard index={index} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
                <View style={styles.reviewerInfo}>
                    <Text style={styles.reviewerName}>{item.reviewer?.name}</Text>
                    <View style={styles.ratingBadge}>
                        <Star size={12} color="#F59E0B" fill="#F59E0B" />
                        <Text style={styles.ratingText}>{item.rating}</Text>
                    </View>
                </View>
                <Text style={styles.reviewDate}>
                    {new Date(item.createdAt).toLocaleDateString()}
                </Text>
            </View>
            <View style={styles.jobBadge}>
                <Briefcase size={12} color={theme.colors.secondary} />
                <Text style={styles.jobTypeText}>{item.job?.serviceType}</Text>
            </View>
            <Text style={styles.comment}>"{item.comment}"</Text>
        </AnimatedCard>
    );

    if (isLoading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={theme.colors.secondary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Header title="Worker Profile" />
            
            <FlatList
                ListHeaderComponent={() => (
                    <View style={styles.headerContent}>
                        <View style={styles.statsCard}>
                            <View style={styles.avatarPlaceholder}>
                                <User size={48} color={theme.colors.border} />
                            </View>
                            
                            <View style={styles.statsRow}>
                                <View style={styles.statBox}>
                                    <View style={styles.avgCircle}>
                                        <Text style={styles.avgText}>{avgRating}</Text>
                                        <Star size={14} color="#F59E0B" fill="#F59E0B" />
                                    </View>
                                    <Text style={styles.statLabel}>Avg Rating</Text>
                                </View>
                                
                                <View style={styles.statDivider} />
                                
                                <View style={styles.statBox}>
                                    <Text style={styles.statValue}>{reviews.length}</Text>
                                    <Text style={styles.statLabel}>Reviews</Text>
                                </View>
                                
                                <View style={styles.statDivider} />
                                <View style={styles.statBox}>
                                    <Text style={styles.statValue}>{earnings}</Text>
                                    <Text style={styles.statLabel}>Earnings</Text>
                                </View>
                                <View style={styles.statDivider} />
                                <View style={styles.statBox}>
                                    <Award size={24} color={theme.colors.secondary} />
                                    <Text style={styles.statLabel}>Verified</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.sectionHeader}>
                            <MessageSquare size={18} color={theme.colors.primary} />
                            <Text style={styles.sectionTitle}>Customer Feedback</Text>
                        </View>
                    </View>
                )}
                data={reviews}
                keyExtractor={(item) => item._id}
                renderItem={renderReview}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.noReviews}>This worker has no reviews yet.</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: theme.colors.background 
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: { 
        paddingBottom: 40 
    },
    headerContent: {
        padding: theme.spacing.lg,
    },
    statsCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: 24,
        padding: 25,
        alignItems: 'center',
        ...theme.shadows.sm,
    },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 10,
    },
    statBox: {
        flex: 1,
        alignItems: 'center',
    },
    statDivider: {
        width: 1,
        height: 30,
        backgroundColor: theme.colors.border,
    },
    avgCircle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 4,
    },
    avgText: {
        fontSize: 20,
        fontWeight: '800',
        color: theme.colors.primary,
    },
    statValue: {
        fontSize: 20,
        fontWeight: '800',
        color: theme.colors.primary,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: theme.colors.textSecondary,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginTop: 30,
    },
    sectionTitle: { 
        fontSize: 18, 
        fontWeight: '800', 
        color: theme.colors.primary 
    },
    reviewCard: { 
        marginHorizontal: theme.spacing.lg,
        marginBottom: theme.spacing.md,
        padding: 18,
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    reviewerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    reviewerName: { 
        fontSize: 15, 
        fontWeight: '700', 
        color: theme.colors.primary 
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    ratingText: {
        fontSize: 12,
        fontWeight: '800',
        color: '#B45309',
    },
    reviewDate: {
        fontSize: 11,
        color: theme.colors.textSecondary,
    },
    jobBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: theme.colors.secondary + '10',
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        marginBottom: 12,
    },
    jobTypeText: { 
        fontSize: 12, 
        color: theme.colors.secondary,
        fontWeight: '600'
    },
    comment: { 
        fontSize: 14, 
        color: theme.colors.text, 
        fontStyle: 'italic',
        lineHeight: 20,
    },
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
    },
    noReviews: { 
        textAlign: 'center', 
        fontSize: 15, 
        color: theme.colors.textSecondary 
    }
});

export default WorkerProfileScreen;
