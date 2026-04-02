import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { theme } from '../utils/theme';
import Header from '../components/Header';
import AnimatedCard from '../components/AnimatedCard';
import { 
    PlusCircle, 
    Briefcase, 
    BarChart3, 
    UserCircle 
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
    const { user, logout } = useContext(AuthContext);

    const MenuCard = ({ title, icon: Icon, color, onPress, description, index }) => (
        <AnimatedCard 
            index={index}
            onPress={onPress}
            style={styles.cardWrapper}
        >
            <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
                <Icon size={24} color={color} strokeWidth={2} />
            </View>
            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={styles.cardDescription}>{description}</Text>
        </AnimatedCard>
    );

    return (
        <View style={styles.container}>
            <Header 
                showGreeting 
                userName={user?.name} 
                onLogout={logout} 
            />
            
            <ScrollView 
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>What would you like to do?</Text>
                    <Text style={styles.roleBadge}>{user?.role}</Text>
                </View>

                <View style={styles.grid}>
                    {user?.role === 'Customer' && (
                        <MenuCard 
                            index={0}
                            title="Post a Job"
                            description="Found something that needs fixing? Tell us!"
                            icon={PlusCircle}
                            color="#3B82F6"
                            onPress={() => navigation.navigate('CreateJob')}
                        />
                    )}

                    <MenuCard 
                        index={1}
                        title={user?.role === 'Worker' ? 'Find Work' : 'My Jobs'}
                        description={user?.role === 'Worker' ? 'Browse available service requests' : 'Manage your current requests'}
                        icon={Briefcase}
                        color="#10B981"
                        onPress={() => navigation.navigate('JobList')}
                    />

                    <MenuCard 
                        index={2}
                        title="Analytics"
                        description="View stats and performance history"
                        icon={BarChart3}
                        color="#8B5CF6"
                        onPress={() => navigation.navigate('Dashboard')}
                    />

                    <MenuCard 
                        index={3}
                        title="Profile"
                        description="Edit your account details"
                        icon={UserCircle}
                        color="#F59E0B"
                        onPress={() => navigation.navigate('Profile')}
                    />
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: theme.colors.background 
    },
    scrollContent: { 
        padding: theme.spacing.lg,
        paddingBottom: 40 
    },
    sectionHeader: {
        marginBottom: theme.spacing.xl,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.colors.primary,
    },
    roleBadge: {
        backgroundColor: theme.colors.primary,
        color: '#fff',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: theme.borderRadius.full,
        fontSize: 12,
        fontWeight: 'bold',
        overflow: 'hidden',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    cardWrapper: {
        width: (width - (theme.spacing.lg * 2) - theme.spacing.md) / 2,
        marginBottom: theme.spacing.md,
        height: 180,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.primary,
        marginBottom: 8,
    },
    cardDescription: {
        fontSize: 12,
        color: theme.colors.textSecondary,
        lineHeight: 18,
    }
});

export default HomeScreen;
