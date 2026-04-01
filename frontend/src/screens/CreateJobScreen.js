import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Picker } from '@react-native-picker/picker';
import { SRI_LANKA_DISTRICTS } from '../utils/constants';
const CreateJobScreen = ({ navigation }) => {
    const { user } = useContext(AuthContext);
    const [serviceType, setServiceType] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [budget, setBudget] = useState('');
    const [imageUri, setImageUri] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    if (user?.role !== 'Customer') {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Only customers can create jobs.</Text>
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

    const handleSubmit = async () => {
        if (!serviceType || !location || !description || !budget) {
            Alert.alert('Error', 'Please fill in all basic fields');
            return;
        }

        setIsLoading(true);
        let uploadedImagePath = null;

        // 1. Upload the image if one was selected
        if (imageUri) {
            try {
                const formData = new FormData();
                const filename = imageUri.split('/').pop();
                const match = /\.(\w+)$/.exec(filename);
                const type = match ? `image/${match[1]}` : `image`;

                formData.append('image', { uri: imageUri, name: filename, type });

                // We must use multipart/form-data for multer
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

        // 2. Submit the job
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
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Post a New Job</Text>

            <TextInput style={styles.input} placeholder="Service Type (e.g. Plumbing)" value={serviceType} onChangeText={setServiceType} />
            
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={location}
                    onValueChange={(itemValue) => setLocation(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Select Location..." value="" color="#999" />
                    {SRI_LANKA_DISTRICTS.map((district, index) => (
                        <Picker.Item key={index} label={district} value={district} />
                    ))}
                </Picker>
            </View>
            <TextInput 
                style={[styles.input, { height: 80 }]} 
                placeholder="Describe the issue..." 
                value={description} 
                onChangeText={setDescription} 
                multiline 
            />
            <TextInput style={styles.input} placeholder="Budget ($)" value={budget} onChangeText={setBudget} keyboardType="numeric" />

            <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
                <Text style={styles.imagePickerText}>{imageUri ? 'Change Image' : '📸 Attach an Image (Optional)'}</Text>
            </TouchableOpacity>

            {imageUri && <Image source={{ uri: imageUri }} style={styles.previewImage} />}

            <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={isLoading}>
                {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Post Job</Text>}
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flexGrow: 1, padding: 20, backgroundColor: '#f9f9f9', justifyContent: 'center' },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#333' },
    input: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#ddd' },
    pickerContainer: { backgroundColor: '#fff', borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#ddd', overflow: 'hidden' },
    picker: { height: 50, width: '100%' },
    button: { backgroundColor: '#0066cc', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    errorText: { textAlign: 'center', fontSize: 18, color: 'red' },
    imagePickerButton: { padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#0066cc', borderStyle: 'dashed', alignItems: 'center', marginBottom: 15 },
    imagePickerText: { color: '#0066cc', fontWeight: 'bold' },
    previewImage: { width: '100%', height: 200, borderRadius: 10, marginBottom: 15 }
});

export default CreateJobScreen;
