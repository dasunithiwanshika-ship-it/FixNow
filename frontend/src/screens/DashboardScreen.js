import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { 
    LayoutDashboard, 
    CheckCircle2, 
    Star, 
    DollarSign, 
    Hammer, 
    Wallet, 
    ChevronRight,
    Briefcase
} from 'lucide-react-native';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { theme } from '../utils/theme';
import Header from '../components/Header';
import AnimatedCard from '../components/AnimatedCard';
import StaggerContainer from '../components/StaggerContainer';

const { width } = Dimensions.get('window');

const DashboardScreen = ({ navigation }) => {
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
                <ActivityIndicator size="large" color={theme.colors.secondary} />
            </View>
        );
    }

    const StatCard = ({ icon: Icon, color, value, label, index }) => (
        <AnimatedCard 
            index={index}
            style={styles.card}
        >
            <View style={[styles.iconBox, { backgroundColor: color + '15' }]}>
                <Icon size={24} color={color} />
            </View>
            <View style={styles.cardContent}>
                <Text style={styles.cardValue}>{value}</Text>
                <Text style={styles.cardLabel}>{label}</Text>
            </View>
        </AnimatedCard>
    );

    return (
        <View style={styles.container}>
            <Header title="Analytics" />
            
            <ScrollView 
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <StaggerContainer staggerBase={80}>
                    <View style={styles.statsGrid}>
                        {user?.role === 'Customer' ? (
                            <>
                                <StatCard index={0} icon={LayoutDashboard} color="#3B82F6" value={stats?.postsCreated || 0} label="Jobs Posted" />
                                <StatCard index={1} icon={CheckCircle2} color="#10B981" value={stats?.jobsCompleted || 0} label="Completed" />
                                <StatCard index={2} icon={Star} color="#F59E0B" value={stats?.reviewsGiven || 0} label="Reviews" />
                                <StatCard index={3} icon={DollarSign} color="#EF4444" value={`$${stats?.totalPayments || 0}`} label="Total Paid" />
                            </>
                        ) : (
                            <>
                                <StatCard index={0} icon={Hammer} color="#06B6D4" value={stats?.jobsCompleted || 0} label="Jobs Done" />
                                <StatCard index={1} icon={Star} color="#F59E0B" value={stats?.reviewsReceived || 0} label="Rating" />
                                <StatCard index={2} icon={Wallet} color="#10B981" value={`$${stats?.totalEarnings || 0}`} label="Earnings" />
                            </>
                        )}
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                            {user?.role === 'Worker' ? 'Your Active Jobs' : 'Current Job Requests'}
                        </Text>
                        
                        {stats?.activeJobs && stats.activeJobs.length > 0 ? (
                            stats.activeJobs.map((job, idx) => (
                                <AnimatedCard 
                                    key={job._id} 
                                    index={idx + 4}
                                    style={styles.jobCard} 
                                    onPress={() => navigation.navigate('JobDetails', { jobId: job._id })}
                                >
                                    <View style={styles.jobRow}>
                                        <View style={styles.jobInfo}>
                                            <Text style={styles.jobType}>{job.serviceType}</Text>
                                            <Text style={styles.jobLocation}>📍 {job.location}</Text>
                                            <View style={styles.statusBadge}>
                                                <Text style={styles.statusText}>{job.status}</Text>
                                            </View>
                                        </View>
                                        <ChevronRight size={20} color={theme.colors.textSecondary} />
                                    </View>
                                </AnimatedCard>
                            ))
                        ) : (
                            <View style={styles.emptyContainer}>
                                <Briefcase size={40} color={theme.colors.border} />
                                <Text style={styles.emptyText}>No active jobs found.</Text>
                                {user?.role === 'Worker' && (
                                    <TouchableOpacity 
                                        style={styles.findButton} 
                                        onPress={() => navigation.navigate('JobList')}
                                    >
                                        <Text style={styles.findButtonText}>Find Work</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}
                    </View>
                </StaggerContainer>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    scrollContent: { padding: theme.spacing.lg, paddingBottom: 40 },
    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    card: { 
        width: (width - theme.spacing.lg * 2 - theme.spacing.md) / 2, 
        marginBottom: theme.spacing.md,
        padding: theme.spacing.md,
    },
    iconBox: { 
        width: 44, 
        height: 44, 
        borderRadius: 12, 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginBottom: theme.spacing.sm 
    },
    cardContent: {},
    cardValue: { fontSize: 22, fontWeight: '800', color: theme.colors.primary },
    cardLabel: { fontSize: 12, color: theme.colors.textSecondary, marginTop: 2, fontWeight: '600' },
    section: { marginTop: theme.spacing.xl },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: theme.colors.primary, marginBottom: theme.spacing.lg },
    jobCard: { marginBottom: theme.spacing.sm },
    jobRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    jobInfo: { flex: 1 },
    jobType: { fontSize: 16, fontWeight: '700', color: theme.colors.primary },
    jobLocation: { fontSize: 13, color: theme.colors.textSecondary, marginTop: 4 },
    statusBadge: { 
        alignSelf: 'flex-start', 
        backgroundColor: theme.colors.secondary + '15', 
        paddingHorizontal: 8, 
        paddingVertical: 2, 
        borderRadius: 6, 
        marginTop: 8 
    },
    statusText: { fontSize: 10, color: theme.colors.secondary, fontWeight: '800', textTransform: 'uppercase' },
    emptyContainer: { 
        alignItems: 'center', 
        padding: theme.spacing.xl, 
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderStyle: 'dashed'
    },
    emptyText: { marginTop: theme.spacing.md, color: theme.colors.textSecondary, fontSize: 14 },
    findButton: { 
        marginTop: theme.spacing.lg, 
        backgroundColor: theme.colors.secondary, 
        paddingHorizontal: 20, 
        paddingVertical: 10, 
        borderRadius: theme.borderRadius.md 
    },
    findButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 }
});

export default DashboardScreen;
