import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Image, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { SRI_LANKA_DISTRICTS } from '../utils/constants';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = ({ navigation }) => {
    const { user, setUser } = useContext(AuthContext); // Assuming setUser is available, else we reload
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setLocation(user.location || '');
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

        // If the profileImage is a local URI (from ImagePicker), upload it first
        if (profileImage && !profileImage.startsWith('http') && !profileImage.startsWith('/uploads')) {
            try {
                const formData = new FormData();
                const filename = profileImage.split('/').pop();
                const match = /\.(\w+)$/.exec(filename);
                const type = match ? `image/${match[1]}` : `image`;
                formData.append('image', { uri: profileImage, name: filename, type });

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
            const res = await API.put('/users/profile', {
                name,
                location,
                profileImage: uploadedImagePath
            });
            Alert.alert('Success', 'Profile updated successfully!');
            // Update local context if setUser exists, or just let them pull from GET /auth/me on reload
            if (setUser) setUser(res.data);
        } catch (error) {
            Alert.alert('Update Failed', error.response?.data?.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
                    {profileImage ? (
                        <Image source={{ uri: profileImage.startsWith('/') ? `http://192.168.8.144:5000${profileImage}` : profileImage }} style={styles.avatar} />
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <Ionicons name="person" size={50} color="#fff" />
                        </View>
                    )}
                    <View style={styles.editBadge}>
                        <Ionicons name="camera" size={14} color="#fff" />
                    </View>
                </TouchableOpacity>
                <Text style={styles.roleText}>{user?.role}</Text>
            </View>

            <View style={styles.form}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput 
                    style={styles.input} 
                    value={name} 
                    onChangeText={setName} 
                    placeholder="Your Name"
                />

                <Text style={styles.label}>Location</Text>
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

                <TouchableOpacity style={styles.button} onPress={handleUpdate} disabled={isLoading}>
                    {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Save Changes</Text>}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flexGrow: 1, backgroundColor: '#f9f9f9', paddingBottom: 30 },
    header: { alignItems: 'center', backgroundColor: '#0066cc', paddingVertical: 40, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, marginBottom: 20 },
    imageContainer: { position: 'relative' },
    avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: '#fff' },
    avatarPlaceholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#fff' },
    editBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#ffc107', borderRadius: 15, width: 30, height: 30, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff' },
    roleText: { color: '#fff', fontSize: 16, marginTop: 10, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 },
    form: { paddingHorizontal: 20 },
    label: { fontSize: 16, fontWeight: 'bold', color: '#555', marginBottom: 5 },
    input: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#ddd', fontSize: 16 },
    pickerContainer: { backgroundColor: '#fff', borderRadius: 10, marginBottom: 20, borderWidth: 1, borderColor: '#ddd', overflow: 'hidden' },
    picker: { height: 50, width: '100%' },
    button: { backgroundColor: '#28a745', padding: 15, borderRadius: 10, alignItems: 'center', elevation: 2 },
    buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});

export default ProfileScreen;
