import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { MapPin, DollarSign, ChevronRight, Inbox } from 'lucide-react-native';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { theme } from '../utils/theme';
import Header from '../components/Header';
import AnimatedCard from '../components/AnimatedCard';
import StaggerContainer from '../components/StaggerContainer';

const JobListScreen = ({ navigation }) => {
    const { user } = useContext(AuthContext);
    const [jobs, setJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchJobs = async () => {
        setIsLoading(true);
        try {
            let res;
            if (user?.role === 'Worker') {
                res = await API.get('/services');
            } else {
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

    const renderJob = ({ item, index }) => (
        <AnimatedCard 
            index={index}
            style={styles.card} 
            onPress={() => navigation.navigate('JobDetails', { jobId: item._id })}
        >
            <View style={styles.cardHeader}>
                <Text style={styles.jobTitle}>{item.serviceType}</Text>
                <View style={[styles.statusBadge, { backgroundColor: item.status === 'pending' ? '#FEF3C7' : '#DCFCE7' }]}>
                    <Text style={[styles.statusText, { color: item.status === 'pending' ? '#B45309' : '#166534' }]}>
                        {item.status}
                    </Text>
                </View>
            </View>
            
            <View style={styles.detailsRow}>
                <View style={styles.detailItem}>
                    <MapPin size={14} color={theme.colors.textSecondary} />
                    <Text style={styles.detailText}>{item.location}</Text>
                </View>
                <View style={styles.detailItem}>
                    <DollarSign size={14} color={theme.colors.accent} />
                    <Text style={[styles.detailText, { color: theme.colors.accent, fontWeight: '700' }]}>
                        {item.budget}
                    </Text>
                </View>
            </View>
            
            <View style={styles.footer}>
                <Text style={styles.footerText}>Tap for details</Text>
                <ChevronRight size={16} color={theme.colors.border} />
            </View>
        </AnimatedCard>
    );

    return (
        <View style={styles.container}>
            <Header title={user?.role === 'Worker' ? 'Available Jobs' : 'My Posted Jobs'} />
            
            {isLoading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color={theme.colors.secondary} />
                </View>
            ) : jobs.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Inbox size={48} color={theme.colors.border} />
                    <Text style={styles.noJobsText}>No jobs found at the moment.</Text>
                </View>
            ) : (
                <FlatList
                    data={jobs}
                    keyExtractor={(item) => item._id}
                    renderItem={renderJob}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
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
        padding: theme.spacing.lg,
        paddingBottom: 40 
    },
    card: { 
        marginBottom: theme.spacing.md,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: theme.spacing.sm,
    },
    jobTitle: { 
        fontSize: 18, 
        fontWeight: '700', 
        color: theme.colors.primary, 
        flex: 1,
        marginRight: 10,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '800',
        textTransform: 'uppercase',
    },
    detailsRow: { 
        flexDirection: 'row', 
        gap: 15,
        marginBottom: theme.spacing.md,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    detailText: { 
        fontSize: 13, 
        color: theme.colors.textSecondary, 
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        paddingTop: theme.spacing.sm,
    },
    footerText: {
        fontSize: 12,
        color: theme.colors.border,
        fontWeight: '500',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    noJobsText: { 
        textAlign: 'center', 
        fontSize: 16, 
        color: theme.colors.textSecondary, 
        marginTop: 15 
    }
});

export default JobListScreen;
