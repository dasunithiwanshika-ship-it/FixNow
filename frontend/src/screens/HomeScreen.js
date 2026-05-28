import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { theme } from '../utils/theme';
import Header from '../components/Header';
import CategoryChip from '../components/CategoryChip';
import GradientButton from '../components/GradientButton';
import {
    Search,
    Droplets,
    Zap,
    Paintbrush,
    Wrench,
    Hammer,
    Star,
    ChevronRight,
    MapPin
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const CATEGORIES = [
    { id: '1', title: 'Plumbing', icon: Droplets, color: '#3B82F6' },
    { id: '2', title: 'Electrical', icon: Zap, color: '#F59E0B' },
    { id: '3', title: 'Painting', icon: Paintbrush, color: '#EC4899' },
    { id: '4', title: 'Repair', icon: Wrench, color: '#10B981' },
    { id: '5', title: 'Carpentry', icon: Hammer, color: '#8B5CF6' },
];

const TOP_WORKERS = [
    { id: '1', name: 'John Doe', rating: 4.9, specialty: 'Expert Plumber', image: null },
    { id: '2', name: 'Alex Smith', rating: 4.8, specialty: 'Master Electrician', image: null },
    { id: '3', name: 'Sarah Wilson', rating: 4.9, specialty: 'Interior Designer', image: null },
];

const HomeScreen = ({ navigation }) => {
    const { user, logout } = useContext(AuthContext);
    const [selectedCategory, setSelectedCategory] = useState('1');

    const renderWorkerCard = ({ item }) => (
        <TouchableOpacity style={styles.workerCard}>
            <View style={styles.workerAvatar}>
                <Text style={styles.workerAvatarText}>{item.name[0]}</Text>
            </View>
            <View style={styles.workerInfo}>
                <Text style={styles.workerName}>{item.name}</Text>
                <Text style={styles.workerSpecialty}>{item.specialty}</Text>
                <View style={styles.ratingRow}>
                    <Star size={14} color={theme.colors.gold} fill={theme.colors.gold} />
                    <Text style={styles.ratingText}>{item.rating}</Text>
                </View>
            </View>
        </TouchableOpacity>
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
                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Search size={20} color={theme.colors.textSecondary} style={styles.searchIcon} />
                    <TextInput
                        placeholder="What do you need fixed?"
                        placeholderTextColor={theme.colors.textSecondary}
                        style={styles.searchInput}
                    />
                </View>

                {/* Categories */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Categories</Text>
                    <TouchableOpacity>
                        <Text style={styles.seeAll}>See All</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoriesList}
                >
                    {CATEGORIES.map((cat) => (
                        <CategoryChip
                            key={cat.id}
                            title={cat.title}
                            icon={cat.icon}
                            color={cat.color}
                            isSelected={selectedCategory === cat.id}
                            onPress={() => setSelectedCategory(cat.id)}
                        />
                    ))}
                </ScrollView>

                {/* Hero Card */}
                <View style={styles.heroContainer}>
                    <View style={styles.heroContent}>
                        <Text style={styles.heroTag}>Limited Offer</Text>
                        <Text style={styles.heroTitle}>Fix anything, anytime</Text>
                        <Text style={styles.heroSubtitle}>Get 20% off on your first plumbing request</Text>
                        <GradientButton
                            title="Book Now"
                            style={styles.heroButton}
                            textStyle={{ fontSize: 14 }}
                            onPress={() => navigation.navigate('CreateJob')}
                        />
                    </View>
                </View>

                {/* Top Rated Workers */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Top Rated Workers</Text>
                    <TouchableOpacity>
                        <Text style={styles.seeAll}>See All</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={TOP_WORKERS}
                    renderItem={renderWorkerCard}
                    keyExtractor={item => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.workerList}
                />

                {/* Quick Actions */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                </View>
                <View style={styles.quickActionsGrid}>
                    <TouchableOpacity
                        style={[styles.actionCard, { backgroundColor: '#EEF2FF' }]}
                        onPress={() => navigation.navigate('JobList')}
                    >
                        <View style={[styles.actionIcon, { backgroundColor: '#3B82F6' }]}>
                            <MapPin size={20} color="#FFF" />
                        </View>
                        <Text style={styles.actionTitle}>Track Job</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.actionCard, { backgroundColor: '#F0FDF4' }]}
                        onPress={() => navigation.navigate('Dashboard')}
                    >
                        <View style={[styles.actionIcon, { backgroundColor: '#10B981' }]}>
                            <ChevronRight size={20} color="#FFF" />
                        </View>
                        <Text style={styles.actionTitle}>History</Text>
                    </TouchableOpacity>
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
        paddingBottom: 40
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        marginHorizontal: theme.spacing.lg,
        paddingHorizontal: theme.spacing.md,
        height: 55,
        borderRadius: theme.borderRadius.lg,
        marginTop: theme.spacing.sm,
        marginBottom: theme.spacing.xl,
        ...theme.shadows.md,
    },
    searchIcon: {
        marginRight: theme.spacing.sm,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: theme.colors.text,
        fontWeight: '500',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
        marginBottom: theme.spacing.md,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: theme.colors.primary,
        letterSpacing: -0.5,
    },
    seeAll: {
        color: theme.colors.vibrantBlue,
        fontWeight: '600',
        fontSize: 14,
    },
    categoriesList: {
        paddingLeft: theme.spacing.lg,
        paddingBottom: theme.spacing.xl,
    },
    heroContainer: {
        marginHorizontal: theme.spacing.lg,
        backgroundColor: theme.colors.vibrantBlue,
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.xl,
        overflow: 'hidden',
        ...theme.shadows.premium,
    },
    heroContent: {
        zIndex: 1,
    },
    heroTag: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: theme.borderRadius.sm,
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    heroTitle: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: '800',
        marginBottom: 4,
    },
    heroSubtitle: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        marginBottom: 16,
    },
    heroButton: {
        alignSelf: 'flex-start',
        backgroundColor: '#FFF',
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    workerList: {
        paddingLeft: theme.spacing.lg,
        paddingBottom: theme.spacing.xl,
    },
    workerCard: {
        width: 160,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.md,
        marginRight: theme.spacing.md,
        ...theme.shadows.sm,
    },
    workerAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    workerAvatarText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.vibrantBlue,
    },
    workerName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
    workerSpecialty: {
        fontSize: 12,
        color: theme.colors.textSecondary,
        marginBottom: 8,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginLeft: 4,
    },
    quickActionsGrid: {
        flexDirection: 'row',
        paddingHorizontal: theme.spacing.lg,
        justifyContent: 'space-between',
    },
    actionCard: {
        width: (width - (theme.spacing.lg * 2) - 15) / 2,
        padding: 20,
        borderRadius: theme.borderRadius.lg,
        alignItems: 'center',
    },
    actionIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    actionTitle: {
        fontWeight: 'bold',
        color: theme.colors.primary,
    }
});

export default HomeScreen;
