import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Image, ScrollView, Dimensions, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { 
    User, 
    MapPin, 
    Camera, 
    ChevronRight, 
    ShieldCheck, 
    LogOut, 
    Save,
    UserCircle,
    Wrench,
    Briefcase,
    Star,
    Award
} from 'lucide-react-native';
import { Picker } from '@react-native-picker/picker';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { SRI_LANKA_DISTRICTS } from '../utils/constants';
import { theme } from '../utils/theme';
import Header from '../components/Header';
import AnimatedCard from '../components/AnimatedCard';

const { width } = Dimensions.get('window');

const SERVICE_CATEGORIES = [
    'Plumbing', 'Electrical', 'Cleaning', 'Repair', 
    'Painting', 'Carpentry', 'Gardening', 'AC Repair',
    'Masonry', 'Roofing', 'Tiling', 'Welding'
];

// Dynamic colors based on role
const getRoleTheme = (role) => {
    if (role === 'Worker') {
        return {
            headerBg: '#1E3A5F',          // Deep navy
            badgeBg: '#F59E0B' + '20',    // Amber tint
            badgeText: '#F59E0B',          // Amber
            badgeBorder: '#F59E0B' + '40',
            accentColor: '#F59E0B',        // Amber
            headerGradientStart: '#1E3A5F',
            headerGradientEnd: '#0F172A',
            iconColor: '#F59E0B',
        };
    }
    return {
        headerBg: '#0F172A',              // Slate
        badgeBg: theme.colors.secondary + '15',
        badgeText: theme.colors.secondary,
        badgeBorder: theme.colors.secondary + '40',
        accentColor: theme.colors.secondary,
        headerGradientStart: '#0F172A',
        headerGradientEnd: '#1E293B',
        iconColor: theme.colors.secondary,
    };
};

// Helper to build image URL without hardcoding IP
const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/')) {
        // Use the same base as our API
        const baseUrl = API.defaults.baseURL.replace('/api', '');
        return `${baseUrl}${imagePath}`;
    }
    return imagePath;
};

const ProfileScreen = ({ navigation }) => {
    const { user, setUser, logout } = useContext(AuthContext);
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [serviceType, setServiceType] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const isWorker = user?.role === 'Worker';
    const roleTheme = getRoleTheme(user?.role);

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setLocation(user.location || '');
            setServiceType(user.serviceType || '');
            setProfileImage(user.profileImage || '');
        }
    }, [user]);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
        }
    };

    const handleUpdate = async () => {
        setIsLoading(true);
        let uploadedImagePath = profileImage;

        if (profileImage && !profileImage.startsWith('http') && !profileImage.startsWith('/uploads')) {
            try {
                const formData = new FormData();
                const filename = profileImage.split('/').pop() || 'profile.jpg';
                const match = /\.(\w+)$/.exec(filename);
                const type = match ? `image/${match[1]}` : `image/jpeg`;

                if (Platform.OS === 'web') {
                    const response = await fetch(profileImage);
                    const blob = await response.blob();
                    formData.append('image', blob, filename);
                } else {
                    formData.append('image', { uri: profileImage, name: filename, type });
                }

                const uploadRes = await API.post('/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                uploadedImagePath = uploadRes.data.filePath;
            } catch (err) {
                console.error(err);
                Alert.alert('Upload Failed', 'Could not upload profile picture.');
                setIsLoading(false);
                return;
            }
        }

        try {
            const updateData = {
                name,
                location,
                profileImage: uploadedImagePath
            };
            if (isWorker) {
                updateData.serviceType = serviceType;
            }

            const res = await API.put('/users/profile', updateData);
            Alert.alert('Success', 'Profile updated successfully!');
            if (setUser) setUser(res.data);
        } catch (error) {
            Alert.alert('Update Failed', error.response?.data?.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Logout", onPress: () => logout(), style: 'destructive' }
            ]
        );
    };

    const imageUrl = getImageUrl(profileImage);

    return (
        <View style={styles.container}>
            <Header title={isWorker ? "Worker Profile" : "My Profile"} />
            
            <ScrollView 
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Header - Different look for Worker vs Customer */}
                <View style={[styles.profileHeader, { backgroundColor: roleTheme.headerBg }]}>
                    <TouchableOpacity onPress={pickImage} style={styles.avatarWrapper}>
                        <View style={[styles.avatarBorder, { borderColor: roleTheme.accentColor + '60' }]}>
                            {imageUrl ? (
                                <Image 
                                    source={{ uri: imageUrl }} 
                                    style={styles.avatar} 
                                />
                            ) : (
                                <View style={styles.avatarPlaceholder}>
                                    <UserCircle size={80} color={theme.colors.border} />
                                </View>
                            )}
                        </View>
                        <View style={[styles.cameraBadge, { backgroundColor: roleTheme.accentColor }]}>
                            <Camera size={14} color="#fff" />
                        </View>
                    </TouchableOpacity>
                    
                    <View style={[styles.roleBadge, { backgroundColor: roleTheme.badgeBg, borderWidth: 1, borderColor: roleTheme.badgeBorder }]}>
                        {isWorker ? (
                            <Wrench size={14} color={roleTheme.badgeText} />
                        ) : (
                            <ShieldCheck size={14} color={roleTheme.badgeText} />
                        )}
                        <Text style={[styles.roleText, { color: roleTheme.badgeText }]}>{user?.role}</Text>
                    </View>
                    <Text style={styles.userName}>{name || 'Unknown User'}</Text>
                    <Text style={styles.userEmail}>{user?.email}</Text>

                    {/* Worker-specific stats row */}
                    {isWorker && (
                        <View style={styles.statsRow}>
                            <View style={styles.statItem}>
                                <Star size={16} color="#F59E0B" />
                                <Text style={styles.statValue}>{user?.rating?.toFixed(1) || '0.0'}</Text>
                                <Text style={styles.statLabel}>Rating</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Award size={16} color="#F59E0B" />
                                <Text style={styles.statValue}>{user?.reviewsCount || 0}</Text>
                                <Text style={styles.statLabel}>Reviews</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Briefcase size={16} color="#F59E0B" />
                                <Text style={styles.statValue}>{user?.serviceType || '—'}</Text>
                                <Text style={styles.statLabel}>Specialty</Text>
                            </View>
                        </View>
                    )}
                </View>

                {/* Basic Info Card */}
                <AnimatedCard index={0} style={styles.formCard}>
                    <Text style={styles.sectionTitle}>
                        {isWorker ? '👷 Professional Details' : '👤 Personal Details'}
                    </Text>

                    <View style={styles.inputGroup}>
                        <View style={styles.labelRow}>
                            <User size={16} color={theme.colors.textSecondary} />
                            <Text style={styles.label}>Full Name</Text>
                        </View>
                        <TextInput 
                            style={styles.input} 
                            value={name} 
                            onChangeText={setName} 
                            placeholder="Your Name"
                            placeholderTextColor={theme.colors.textSecondary}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <View style={styles.labelRow}>
                            <MapPin size={16} color={theme.colors.textSecondary} />
                            <Text style={styles.label}>Location</Text>
                        </View>
                        <View style={styles.pickerWrapper}>
                            <Picker
                                selectedValue={location}
                                onValueChange={(itemValue) => setLocation(itemValue)}
                                style={[styles.picker, Platform.OS === 'web' && { outline: 'none', border: 'none', backgroundColor: 'transparent' }]}
                            >
                                <Picker.Item label="Select Location..." value="" color="#94A3B8" />
                                {SRI_LANKA_DISTRICTS.map((district, index) => (
                                    <Picker.Item key={index} label={district} value={district} />
                                ))}
                            </Picker>
                        </View>
                    </View>

                    {/* Worker-only: Service Category Picker */}
                    {isWorker && (
                        <View style={styles.inputGroup}>
                            <View style={styles.labelRow}>
                                <Wrench size={16} color={roleTheme.accentColor} />
                                <Text style={[styles.label, { color: roleTheme.accentColor }]}>Service Category</Text>
                            </View>
                            <View style={[styles.pickerWrapper, { borderColor: roleTheme.accentColor + '40' }]}>
                                <Picker
                                    selectedValue={serviceType}
                                    onValueChange={(itemValue) => setServiceType(itemValue)}
                                    style={[styles.picker, Platform.OS === 'web' && { outline: 'none', border: 'none', backgroundColor: 'transparent' }]}
                                >
                                    <Picker.Item label="Select Your Specialty..." value="" color="#94A3B8" />
                                    {SERVICE_CATEGORIES.map((cat, index) => (
                                        <Picker.Item key={index} label={cat} value={cat} />
                                    ))}
                                </Picker>
                            </View>
                        </View>
                    )}

                    <TouchableOpacity 
                        style={[styles.saveButton, isLoading && styles.buttonDisabled, isWorker && { backgroundColor: '#F59E0B' }]} 
                        onPress={handleUpdate} 
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <View style={styles.btnInner}>
                                <Save size={18} color="#fff" />
                                <Text style={styles.saveButtonText}>Save Changes</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </AnimatedCard>

                <AnimatedCard index={1} style={styles.logoutCard} onPress={handleLogout}>
                    <View style={styles.logoutContent}>
                        <View style={styles.logoutLeft}>
                            <View style={styles.logoutIconCircle}>
                                <LogOut size={18} color={theme.colors.error} />
                            </View>
                            <Text style={styles.logoutText}>Account Logout</Text>
                        </View>
                        <ChevronRight size={20} color={theme.colors.border} />
                    </View>
                </AnimatedCard>
                
                <Text style={styles.versionText}>FixNow v1.2.0 • Build 20240402</Text>
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
    profileHeader: {
        alignItems: 'center',
        marginBottom: 30,
        padding: 30,
        paddingTop: 35,
        paddingBottom: 30,
        borderRadius: 24,
        ...theme.shadows.lg,
    },
    avatarWrapper: {
        position: 'relative',
        marginBottom: 15,
    },
    avatarBorder: {
        padding: 4,
        borderRadius: 60,
        borderWidth: 2,
    },
    avatar: { 
        width: 110, 
        height: 110, 
        borderRadius: 55,
    },
    avatarPlaceholder: {
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraBadge: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    roleBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 14,
        paddingVertical: 5,
        borderRadius: 20,
        marginBottom: 10,
    },
    roleText: {
        fontSize: 12,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    userName: {
        fontSize: 22,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.6)',
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 20,
        width: '100%',
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
        gap: 4,
    },
    statValue: {
        fontSize: 15,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    statLabel: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.5)',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    statDivider: {
        width: 1,
        height: 30,
        backgroundColor: 'rgba(255,255,255,0.15)',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: theme.colors.primary,
        marginBottom: 20,
    },
    formCard: {
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.md,
    },
    inputGroup: {
        marginBottom: theme.spacing.lg,
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '700',
        color: theme.colors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    input: { 
        backgroundColor: theme.colors.background, 
        padding: 15, 
        borderRadius: theme.borderRadius.md, 
        borderWidth: 1, 
        borderColor: theme.colors.border,
        color: theme.colors.text,
        fontSize: 15,
    },
    pickerWrapper: { 
        backgroundColor: theme.colors.background, 
        borderRadius: theme.borderRadius.md, 
        borderWidth: 1, 
        borderColor: theme.colors.border, 
        overflow: 'hidden' 
    },
    picker: { 
        height: 50, 
        width: '100%',
        color: theme.colors.text,
    },
    saveButton: { 
        backgroundColor: theme.colors.accent, 
        padding: 16, 
        borderRadius: theme.borderRadius.md, 
        alignItems: 'center', 
        marginTop: 10,
        ...theme.shadows.sm,
    },
    btnInner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    saveButtonText: { 
        color: '#fff', 
        fontSize: 16, 
        fontWeight: '700' 
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    logoutCard: {
        padding: 15,
        backgroundColor: theme.colors.surface,
    },
    logoutContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logoutLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    logoutIconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme.colors.error + '10',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.error,
    },
    versionText: {
        textAlign: 'center',
        color: theme.colors.textSecondary,
        fontSize: 12,
        marginTop: 30,
        opacity: 0.5,
    }
});

export default ProfileScreen;
