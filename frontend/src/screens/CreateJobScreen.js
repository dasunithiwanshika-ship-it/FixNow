import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView, Image, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { 
    Hammer, 
    MapPin, 
    FileText, 
    DollarSign, 
    Camera, 
    PlusCircle, 
    AlertCircle,
    X,
    ArrowRight,
    Sparkles
} from 'lucide-react-native';
import { Picker } from '@react-native-picker/picker';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { SRI_LANKA_DISTRICTS } from '../utils/constants';
import { theme } from '../utils/theme';
import Header from '../components/Header';
import AnimatedCard from '../components/AnimatedCard';

const { width } = Dimensions.get('window');

const CreateJobScreen = ({ navigation }) => {
    const { user } = useContext(AuthContext);
    const [serviceType, setServiceType] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [budget, setBudget] = useState('');
    const [imageUri, setImageUri] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [aiDetails, setAiDetails] = useState(null);

    const fetchBudgetSuggestion = async () => {
        if (!serviceType || !location) {
            Alert.alert('Incomplete Info', 'Please select a service type and location first.');
            return;
        }

        setIsSuggesting(true);
        setAiDetails(null);
        try {
            const res = await API.get(`/services/suggest-budget?serviceType=${serviceType}&location=${location}&description=${encodeURIComponent(description)}`);
            setBudget(res.data.suggestedBudget.toString());
            setAiDetails({
                reasoning: res.data.reasoning,
                breakdown: res.data.breakdown,
                isAI: res.data.isAI
            });
            
            if (!res.data.isAI) {
                // We'll let the UI handle the display instead of an alert
                console.log('AI Suggestion', `Based on ${serviceType} in ${location}, we suggest a budget of $${res.data.suggestedBudget}.`);
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Could not get budget suggestion. Using fallback.');
            setBudget('50'); // Safe fallback
        } finally {
            setIsSuggesting(false);
        }
    };

    if (user?.role !== 'Customer') {
        return (
            <View style={styles.errorContainer}>
                <AlertCircle size={48} color={theme.colors.error} />
                <Text style={styles.errorText}>Only customers can create jobs.</Text>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.backButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    const removeImage = () => setImageUri(null);

    const handleSubmit = async () => {
        if (!serviceType || !location || !description || !budget) {
            Alert.alert('Error', 'Please fill in all basic fields');
            return;
        }

        setIsLoading(true);
        let uploadedImagePath = null;

        if (imageUri) {
            try {
                const formData = new FormData();
                const filename = imageUri.split('/').pop() || 'upload.jpg';
                const match = /\.(\w+)$/.exec(filename);
                const type = match ? `image/${match[1]}` : `image/jpeg`;

                if (Platform.OS === 'web') {
                    const response = await fetch(imageUri);
                    const blob = await response.blob();
                    formData.append('image', blob, filename);
                } else {
                    formData.append('image', { uri: imageUri, name: filename, type });
                }

                const uploadRes = await API.post('/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                uploadedImagePath = uploadRes.data.filePath;
            } catch (err) {
                console.error(err);
                Alert.alert('Upload Failed', 'Could not upload the image. Job not posted.');
                setIsLoading(false);
                return;
            }
        }

        try {
            await API.post('/services', {
                serviceType,
                location,
                description,
                budget: Number(budget),
                images: uploadedImagePath ? [uploadedImagePath] : []
            });
            Alert.alert('Success', 'Job posted successfully!');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Posting Failed', error.response?.data?.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Header title="Post a New Job" />
            
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView 
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <AnimatedCard index={0} style={styles.formCard}>
                        {/* Service Type */}
                        <View style={styles.inputGroup}>
                            <View style={styles.labelRow}>
                                <Hammer size={16} color={theme.colors.textSecondary} />
                                <Text style={styles.label}>Service Type</Text>
                            </View>
                            <TextInput 
                                style={styles.input} 
                                placeholder="e.g. Plumbing, Electrical" 
                                value={serviceType} 
                                onChangeText={setServiceType} 
                                placeholderTextColor={theme.colors.textSecondary}
                            />
                        </View>
                        
                        {/* Location */}
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
                                    <Picker.Item label="Select District..." value="" color="#94A3B8" />
                                    {SRI_LANKA_DISTRICTS.map((district, index) => (
                                        <Picker.Item key={index} label={district} value={district} />
                                    ))}
                                </Picker>
                            </View>
                        </View>

                        {/* Description */}
                        <View style={styles.inputGroup}>
                            <View style={styles.labelRow}>
                                <FileText size={16} color={theme.colors.textSecondary} />
                                <Text style={styles.label}>Description</Text>
                            </View>
                            <TextInput 
                                style={[styles.input, styles.textArea]} 
                                placeholder="Describe exactly what needs fixing..." 
                                value={description} 
                                onChangeText={setDescription} 
                                multiline 
                                placeholderTextColor={theme.colors.textSecondary}
                            />
                        </View>

                        {/* Budget */}
                        <View style={styles.inputGroup}>
                            <View style={styles.labelRow}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                    <DollarSign size={16} color={theme.colors.textSecondary} />
                                    <Text style={styles.label}>Estimate Budget (USD)</Text>
                                </View>
                                <TouchableOpacity 
                                    style={styles.suggestionBtn} 
                                    onPress={fetchBudgetSuggestion} 
                                    disabled={isSuggesting}
                                >
                                    {isSuggesting ? (
                                        <ActivityIndicator size="small" color={theme.colors.primary} />
                                    ) : (
                                        <>
                                            <Sparkles size={14} color={theme.colors.primary} />
                                            <Text style={styles.suggestionBtnText}>AI Suggest</Text>
                                        </>
                                    )}
                                </TouchableOpacity>
                            </View>
                            <TextInput 
                                style={styles.input} 
                                placeholder="Your maximum budget" 
                                value={budget} 
                                onChangeText={setBudget} 
                                keyboardType="numeric" 
                                placeholderTextColor={theme.colors.textSecondary}
                            />

                            {aiDetails && (
                                <View style={styles.aiDetailsCard}>
                                    <View style={styles.aiHeader}>
                                        <Sparkles size={14} color={theme.colors.primary} />
                                        <Text style={styles.aiHeaderText}>
                                            {aiDetails.isAI ? 'AI BUDGET ANALYSIS' : 'MARKET ESTIMATE'}
                                        </Text>
                                    </View>
                                    <Text style={styles.aiReasoning}>{aiDetails.reasoning}</Text>
                                    {aiDetails.breakdown && (
                                        <Text style={styles.aiBreakdown}>{aiDetails.breakdown}</Text>
                                    )}
                                </View>
                            )}
                        </View>

                        {/* Image Upload */}
                        <View style={styles.inputGroup}>
                            <View style={styles.labelRow}>
                                <Camera size={16} color={theme.colors.textSecondary} />
                                <Text style={styles.label}>Photos (Optional)</Text>
                            </View>
                            
                            {imageUri ? (
                                <View style={styles.imagePreviewContainer}>
                                    <Image source={{ uri: imageUri }} style={styles.previewImage} />
                                    <TouchableOpacity style={styles.removeImageBtn} onPress={removeImage}>
                                        <X size={18} color="#fff" />
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
                                    <PlusCircle size={32} color={theme.colors.secondary} />
                                    <Text style={styles.uploadText}>Attach Photos</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        <TouchableOpacity 
                            style={[styles.submitButton, isLoading && styles.buttonDisabled]} 
                            onPress={handleSubmit} 
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <View style={styles.btnInner}>
                                    <Text style={styles.submitButtonText}>Publish Job Request</Text>
                                    <ArrowRight size={20} color="#fff" style={{ marginLeft: 8 }} />
                                </View>
                            )}
                        </TouchableOpacity>
                    </AnimatedCard>
                </ScrollView>
            </KeyboardAvoidingView>
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
    formCard: {
        padding: theme.spacing.lg,
    },
    inputGroup: {
        marginBottom: theme.spacing.lg,
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    suggestionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: theme.colors.primary + '15',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: theme.colors.primary + '30',
    },
    suggestionBtnText: {
        fontSize: 11,
        fontWeight: 'bold',
        color: theme.colors.primary,
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
    textArea: {
        height: 120,
        textAlignVertical: 'top',
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
    uploadBox: { 
        padding: 30, 
        borderRadius: theme.borderRadius.md, 
        borderWidth: 1.5, 
        borderColor: theme.colors.secondary, 
        borderStyle: 'dashed', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: theme.colors.secondary + '08',
    },
    uploadText: { 
        color: theme.colors.secondary, 
        fontWeight: '700',
        marginTop: 10,
    },
    imagePreviewContainer: {
        position: 'relative',
        borderRadius: theme.borderRadius.md,
        overflow: 'hidden',
    },
    previewImage: { 
        width: '100%', 
        height: 200, 
        borderRadius: theme.borderRadius.md,
    },
    removeImageBtn: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 8,
        borderRadius: theme.borderRadius.full,
    },
    submitButton: { 
        backgroundColor: theme.colors.primary, 
        padding: 18, 
        borderRadius: theme.borderRadius.md, 
        alignItems: 'center', 
        marginTop: 10,
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
    buttonDisabled: {
        opacity: 0.7,
    },
    errorContainer: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: 40,
        backgroundColor: theme.colors.background,
    },
    errorText: { 
        textAlign: 'center', 
        fontSize: 18, 
        color: theme.colors.error, 
        fontWeight: '700',
        marginTop: 20,
        marginBottom: 30,
    },
    backButton: {
        paddingHorizontal: 30,
        paddingVertical: 15,
        backgroundColor: theme.colors.primary,
        borderRadius: theme.borderRadius.md,
    },
    backButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    aiDetailsCard: {
        marginTop: 10,
        padding: 12,
        backgroundColor: theme.colors.primary + '08',
        borderRadius: theme.borderRadius.md,
        borderLeftWidth: 3,
        borderLeftColor: theme.colors.primary,
    },
    aiHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 4,
    },
    aiHeaderText: {
        fontSize: 10,
        fontWeight: '900',
        color: theme.colors.primary,
        letterSpacing: 1,
    },
    aiReasoning: {
        fontSize: 13,
        color: theme.colors.text,
        lineHeight: 18,
    },
    aiBreakdown: {
        fontSize: 12,
        color: theme.colors.textSecondary,
        fontStyle: 'italic',
        marginTop: 4,
    }
});

export default CreateJobScreen;
