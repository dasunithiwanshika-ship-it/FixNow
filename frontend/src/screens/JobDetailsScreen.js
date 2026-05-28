import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Alert, Image, Dimensions } from 'react-native';
// NOTE: Stripe requires a custom dev build (not Expo Go).
// import { useStripe } from '@stripe/stripe-react-native';
import * as ImagePicker from 'expo-image-picker';
import { 
    MapPin, 
    DollarSign, 
    Info, 
    User, 
    Hammer, 
    Image as ImageIcon, 
    Camera, 
    CheckCircle2, 
    PlayCircle, 
    CreditCard, 
    Star,
    Sparkles,
    PartyPopper
} from 'lucide-react-native';

import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { theme } from '../utils/theme';
import Header from '../components/Header';
import AnimatedCard from '../components/AnimatedCard';

// Helper to build image URL without hardcoding IP
const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/')) {
        const baseUrl = API.defaults.baseURL.replace('/api', '');
        return `${baseUrl}${imagePath}`;
    }
    return imagePath;
};

const { width } = Dimensions.get('window');

const JobDetailsScreen = ({ route, navigation }) => {
    const { jobId } = route.params;
    const { user } = useContext(AuthContext);
    
    const [job, setJob] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    // Stripe hooks disabled for Expo Go compatibility
    // const { initPaymentSheet, presentPaymentSheet } = useStripe();

    const handlePayment = async () => {
        // Prompt user to choose payment method
        Alert.alert(
            'Select Payment Method',
            'Choose how you would like to pay',
            [
                { text: 'Cancel', style: 'cancel', onPress: () => {} },
                {
                    text: 'Cash',
                    onPress: async () => {
                        await processPayment('Cash');
                    },
                },
                {
                    text: 'Card',
                    onPress: async () => {
                        await processPayment('Card');
                    },
                },
            ]
        );
    };

    const processPayment = async (method) => {
        setIsUpdating(true);
        try {
            await updateStatus('Paid', method);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Payment failed to initiate');
        } finally {
            setIsUpdating(false);
        }
    };

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

    const updateStatus = async (newStatus, method) => {
        setIsUpdating(true);
        try {
            const payload = { status: newStatus };
            if (newStatus === 'Paid' && method) {
                payload.paymentMethod = method;
            }
            const res = await API.put(`/services/${jobId}/status`, payload);
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

            const uploadRes = await API.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const uploadedImagePath = uploadRes.data.filePath;

            const res = await API.put(`/services/${jobId}/progress-image`, {
                imageUrl: uploadedImagePath
            });

            setJob(res.data);
            Alert.alert('Success', 'Progress photo uploaded!');
        } catch (error) {
            Alert.alert('Upload Failed', error.response?.data?.message || 'Something went wrong');
        } finally {
            setIsUpdating(false);
        }
    };

    if (isLoading || !job) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={theme.colors.secondary} />
            </View>
        );
    }

    const { status, serviceType, location, budget, description, customer, worker } = job;

    return (
        <View style={styles.container}>
            <Header title="Job Details" />
            
            <ScrollView 
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <AnimatedCard index={0} style={styles.mainCard}>
                    <View style={styles.titleRow}>
                        <Text style={styles.title}>{serviceType}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: theme.colors.secondary + '15' }]}>
                            <Text style={styles.statusText}>{status}</Text>
                        </View>
                    </View>

                    <View style={styles.infoGrid}>
                        <View style={styles.infoItem}>
                            <MapPin size={18} color={theme.colors.textSecondary} />
                            <Text style={styles.infoValue}>{location}</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <DollarSign size={18} color={theme.colors.accent} />
                            <Text style={[styles.infoValue, { color: theme.colors.accent, fontWeight: '700' }]}>${budget}</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.descriptionSection}>
                        <View style={styles.sectionHeader}>
                            <Info size={16} color={theme.colors.primary} />
                            <Text style={styles.sectionTitle}>Description</Text>
                        </View>
                        <Text style={styles.description}>{description}</Text>
                    </View>
                </AnimatedCard>

                <AnimatedCard index={1} style={styles.secondaryCard}>
                    <View style={styles.sectionHeader}>
                        <User size={18} color={theme.colors.primary} />
                        <Text style={styles.sectionTitle}>Customer Details</Text>
                    </View>
                    <Text style={styles.detailValue}>{customer?.name}</Text>
                </AnimatedCard>

                {worker && (
                    <AnimatedCard index={2} style={styles.secondaryCard} onPress={() => navigation.navigate('WorkerProfile', { workerId: typeof worker === 'object' ? worker._id : worker })}>
                        <View style={styles.sectionHeader}>
                            <Hammer size={18} color={theme.colors.primary} />
                            <Text style={styles.sectionTitle}>Assigned Worker</Text>
                        </View>
                        <View style={styles.workerRow}>
                            <Text style={styles.detailValue}>{worker.name}</Text>
                            <Text style={styles.linkText}>View Profile</Text>
                        </View>
                    </AnimatedCard>
                )}

                {((job.progressImages?.length > 0) || (user?.role === 'Worker' && job.worker?._id === user._id && status === 'In Progress')) && (
                    <AnimatedCard index={3} style={styles.secondaryCard}>
                        <View style={styles.sectionHeader}>
                            <ImageIcon size={18} color={theme.colors.primary} />
                            <Text style={styles.sectionTitle}>Work Progress Gallery</Text>
                        </View>
                        
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
                            <Text style={styles.emptyText}>No progress photos yet.</Text>
                        )}

                        {user?.role === 'Worker' && job.worker?._id === user._id && status === 'In Progress' && (
                            <TouchableOpacity style={styles.uploadButton} onPress={uploadProgressImage} disabled={isUpdating}>
                                <Camera size={18} color={theme.colors.secondary} />
                                <Text style={styles.uploadButtonText}>Add Progress Photo</Text>
                            </TouchableOpacity>
                        )}
                    </AnimatedCard>
                )}

                <View style={styles.actionContainer}>
                    {user?.role === 'Worker' && status === 'Posted' && (
                        <TouchableOpacity style={[styles.mainButton, styles.primaryBtn]} onPress={() => updateStatus('Accepted')} disabled={isUpdating}>
                            <CheckCircle2 size={20} color="#fff" />
                            <Text style={styles.buttonText}>Accept Job</Text>
                        </TouchableOpacity>
                    )}

                    {user?.role === 'Worker' && job.worker?._id === user._id && status === 'Accepted' && (
                        <TouchableOpacity style={[styles.mainButton, styles.secondaryBtn]} onPress={() => updateStatus('In Progress')} disabled={isUpdating}>
                            <PlayCircle size={20} color={theme.colors.secondary} />
                            <Text style={styles.buttonTextSecondary}>Start Work</Text>
                        </TouchableOpacity>
                    )}

                    {user?.role === 'Worker' && job.worker?._id === user._id && status === 'In Progress' && (
                        <TouchableOpacity style={[styles.mainButton, styles.successBtn]} onPress={() => updateStatus('Completed')} disabled={isUpdating}>
                            <CheckCircle2 size={20} color="#fff" />
                            <Text style={styles.buttonText}>Mark as Completed</Text>
                        </TouchableOpacity>
                    )}

                    {user?.role === 'Customer' && job.customer?._id === user._id && status === 'Completed' && (
                        <TouchableOpacity style={[styles.mainButton, styles.successBtn]} onPress={handlePayment} disabled={isUpdating}>
                            <CreditCard size={20} color="#fff" />
                            <Text style={styles.buttonText}>Confirm & Pay</Text>
                        </TouchableOpacity>
                    )}

                    {user?.role === 'Customer' && job.customer?._id === user._id && status === 'Paid' && (
                        <TouchableOpacity style={[styles.mainButton, styles.reviewBtn]} onPress={() => navigation.navigate('ReviewScreen', { jobId: job._id })}>
                            <Star size={20} color="#fff" />
                            <Text style={styles.buttonText}>Leave a Review</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>

            {showSuccess && (
                <View style={styles.successOverlay}>
                    <View style={styles.successContent}>
                        <View style={styles.successIconWrapper}>
                            <PartyPopper size={60} color="#fff" />
                        </View>
                        <Text style={styles.successTitle}>Payment Successful!</Text>
                        <Text style={styles.successSubtitle}>Thank you for choosing FixNow.</Text>
                        
                        <View style={styles.sparkleContainer}>
                            <Sparkles size={24} color="#F59E0B" />
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    scrollContent: { padding: theme.spacing.lg, paddingBottom: 60 },
    mainCard: { marginBottom: theme.spacing.lg },
    titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 },
    title: { fontSize: 24, fontWeight: '800', color: theme.colors.primary, flex: 1, marginRight: 10 },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    statusText: { fontSize: 10, fontWeight: '800', color: theme.colors.secondary, textTransform: 'uppercase' },
    infoGrid: { flexDirection: 'row', gap: 20, marginBottom: 15 },
    infoItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    infoValue: { fontSize: 14, color: theme.colors.textSecondary, fontWeight: '500' },
    divider: { height: 1, backgroundColor: theme.colors.border, marginVertical: 15 },
    descriptionSection: {},
    sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
    sectionTitle: { fontSize: 14, fontWeight: '700', color: theme.colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
    description: { fontSize: 15, color: theme.colors.text, lineHeight: 24 },
    secondaryCard: { marginBottom: theme.spacing.md, padding: theme.spacing.md },
    detailValue: { fontSize: 16, fontWeight: '600', color: theme.colors.primary },
    workerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    linkText: { fontSize: 13, color: theme.colors.secondary, fontWeight: '700' },
    imageGallery: { marginTop: 10 },
    progressImage: { width: 140, height: 140, borderRadius: 12, marginRight: 12, borderWidth: 1, borderColor: theme.colors.border },
    emptyText: { fontSize: 14, color: theme.colors.textSecondary, fontStyle: 'italic' },
    uploadButton: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 15, padding: 12, borderRadius: 10, borderWidth: 1, borderColor: theme.colors.secondary, borderStyle: 'dotted', justifyContent: 'center' },
    uploadButtonText: { fontSize: 14, color: theme.colors.secondary, fontWeight: '700' },
    actionContainer: { marginTop: 10 },
    mainButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 18, borderRadius: theme.borderRadius.md, ...theme.shadows.md, marginBottom: 15 },
    primaryBtn: { backgroundColor: theme.colors.primary },
    secondaryBtn: { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.secondary },
    successBtn: { backgroundColor: theme.colors.accent },
    reviewBtn: { backgroundColor: '#F59E0B' },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    buttonTextSecondary: { color: theme.colors.secondary, fontSize: 16, fontWeight: '700' },
    successOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    successContent: {
        backgroundColor: theme.colors.surface,
        padding: 40,
        borderRadius: 30,
        alignItems: 'center',
        width: width * 0.85,
        ...theme.shadows.lg,
    },
    successIconWrapper: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: theme.colors.accent,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    successTitle: {
        fontSize: 24,
        fontWeight: '900',
        color: theme.colors.primary,
        marginBottom: 10,
        textAlign: 'center',
    },
    successSubtitle: {
        fontSize: 16,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
    },
    sparkleContainer: {
        marginTop: 20,
    }
});

export default JobDetailsScreen;
