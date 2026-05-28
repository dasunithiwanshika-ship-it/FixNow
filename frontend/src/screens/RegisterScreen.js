import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { User, Mail, Lock, Briefcase, MapPin, ArrowRight } from 'lucide-react-native';
import { AuthContext } from '../context/AuthContext';
import { theme } from '../utils/theme';

const { width } = Dimensions.get('window');

const RegisterScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Customer'); // Customer or Worker
    
    // Worker-only optional fields for initial registration
    const [serviceType, setServiceType] = useState('');
    const [location, setLocation] = useState('');

    const { register, isLoading } = useContext(AuthContext);

    const handleRegister = async () => {
        if (!name || !email || !password) {
            Alert.alert('Error', 'Name, email, and password are required');
            return;
        }

        const userData = {
            name, email, password, role,
            ...(role === 'Worker' && { serviceType, location })
        };

        try {
            await register(userData);
        } catch (error) {
            Alert.alert('Registration Failed', error.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView 
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.inner}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Join FixNow and get started today</Text>
                    </View>

                    <View style={styles.roleContainer}>
                        <TouchableOpacity 
                            activeOpacity={0.8}
                            style={[styles.roleButton, role === 'Customer' && styles.roleButtonActive]} 
                            onPress={() => setRole('Customer')}
                        >
                            <User size={18} color={role === 'Customer' ? '#fff' : theme.colors.primary} />
                            <Text style={[styles.roleText, role === 'Customer' && styles.roleTextActive]}>Customer</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            activeOpacity={0.8}
                            style={[styles.roleButton, role === 'Worker' && styles.roleButtonActive]} 
                            onPress={() => setRole('Worker')}
                        >
                            <Briefcase size={18} color={role === 'Worker' ? '#fff' : theme.colors.primary} />
                            <Text style={[styles.roleText, role === 'Worker' && styles.roleTextActive]}>Worker</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.inputContainer}>
                            <User size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
                            <TextInput 
                                style={styles.input} 
                                placeholder="Full Name" 
                                value={name} 
                                onChangeText={setName} 
                                placeholderTextColor={theme.colors.textSecondary}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Mail size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
                            <TextInput 
                                style={styles.input} 
                                placeholder="Email Address" 
                                value={email} 
                                onChangeText={setEmail} 
                                keyboardType="email-address" 
                                autoCapitalize="none" 
                                placeholderTextColor={theme.colors.textSecondary}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Lock size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
                            <TextInput 
                                style={styles.input} 
                                placeholder="Password" 
                                value={password} 
                                onChangeText={setPassword} 
                                secureTextEntry 
                                placeholderTextColor={theme.colors.textSecondary}
                            />
                        </View>

                        {role === 'Worker' && (
                            <View>
                                <View style={styles.inputContainer}>
                                    <Briefcase size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
                                    <TextInput 
                                        style={styles.input} 
                                        placeholder="Service Type (e.g., Plumber)" 
                                        value={serviceType} 
                                        onChangeText={setServiceType} 
                                        placeholderTextColor={theme.colors.textSecondary}
                                    />
                                </View>
                                <View style={styles.inputContainer}>
                                    <MapPin size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
                                    <TextInput 
                                        style={styles.input} 
                                        placeholder="Location (City or Area)" 
                                        value={location} 
                                        onChangeText={setLocation} 
                                        placeholderTextColor={theme.colors.textSecondary}
                                    />
                                </View>
                            </View>
                        )}

                        <TouchableOpacity 
                            style={[styles.button, isLoading && styles.buttonDisabled]} 
                            onPress={handleRegister} 
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <View style={styles.buttonInner}>
                                    <Text style={styles.buttonText}>Register Now</Text>
                                    <ArrowRight size={20} color="#fff" style={{ marginLeft: 8 }} />
                                </View>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.loginLink} 
                            onPress={() => navigation.navigate('Login')}
                        >
                            <Text style={styles.loginText}>
                                Already have an account? <Text style={styles.loginTextBold}>Log In</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: theme.colors.background 
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 40,
    },
    inner: {
        flex: 1,
        padding: theme.spacing.xl,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: theme.colors.primary,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        marginTop: 8,
        fontWeight: '500',
    },
    roleContainer: { 
        flexDirection: 'row', 
        justifyContent: 'center', 
        marginBottom: 25, 
        gap: 12 
    },
    roleButton: { 
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12, 
        paddingHorizontal: 20, 
        borderWidth: 1.5, 
        borderColor: theme.colors.border, 
        borderRadius: theme.borderRadius.full,
        backgroundColor: theme.colors.surface,
    },
    roleButtonActive: { 
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    roleText: { 
        color: theme.colors.primary, 
        fontWeight: '700',
        marginLeft: 8,
    },
    roleTextActive: { 
        color: '#fff' 
    },
    form: {
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.lg,
        borderRadius: theme.borderRadius.xl,
        ...theme.shadows.lg,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.md,
        marginBottom: theme.spacing.md,
        paddingHorizontal: theme.spacing.md,
    },
    inputIcon: {
        marginRight: theme.spacing.sm,
    },
    input: {
        flex: 1,
        color: theme.colors.text,
        paddingVertical: 14,
        fontSize: 15,
    },
    button: {
        backgroundColor: theme.colors.secondary,
        padding: 18,
        borderRadius: theme.borderRadius.md,
        alignItems: 'center',
        marginTop: theme.spacing.sm,
        ...theme.shadows.md,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonInner: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    loginLink: {
        marginTop: 25,
        alignItems: 'center',
    },
    loginText: {
        color: theme.colors.textSecondary,
        fontSize: 14,
    },
    loginTextBold: {
        color: theme.colors.primary,
        fontWeight: '700',
    }
});

export default RegisterScreen;
