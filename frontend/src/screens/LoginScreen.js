import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { Mail, Lock, LogIn } from 'lucide-react-native';
import { AuthContext } from '../context/AuthContext';
import { theme } from '../utils/theme';

const { width } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, isLoading } = useContext(AuthContext);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter email and password');
            return;
        }
        
        try {
            await login(email, password);
        } catch (error) {
            Alert.alert('Login Failed', error.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.inner}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.logoText}>FixNow</Text>
                        <Text style={styles.subtitle}>Professional Services at Your Fingertips</Text>
                    </View>
                </View>

                <View style={styles.form}>
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

                    <TouchableOpacity 
                        style={[styles.button, isLoading && styles.buttonDisabled]} 
                        onPress={handleLogin} 
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <View style={styles.buttonInner}>
                                <Text style={styles.buttonText}>Log In</Text>
                                <LogIn size={20} color="#fff" style={{ marginLeft: 8 }} />
                            </View>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.registerLink} 
                        onPress={() => navigation.navigate('Register')}
                    >
                        <Text style={styles.registerText}>
                            Don't have an account? <Text style={styles.registerTextBold}>Sign Up</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: theme.colors.background 
    },
    inner: {
        flex: 1,
        justifyContent: 'center',
        padding: theme.spacing.xl,
    },
    header: {
        alignItems: 'center',
        marginBottom: 50,
    },
    logoText: {
        fontSize: 42,
        fontWeight: '900',
        color: theme.colors.primary,
        letterSpacing: -1,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        marginTop: 8,
        textAlign: 'center',
        fontWeight: '500',
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
        paddingVertical: 15,
        fontSize: 15,
    },
    button: {
        backgroundColor: theme.colors.primary,
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
    registerLink: {
        marginTop: 25,
        alignItems: 'center',
    },
    registerText: {
        color: theme.colors.textSecondary,
        fontSize: 14,
    },
    registerTextBold: {
        color: theme.colors.secondary,
        fontWeight: '700',
    }
});

export default LoginScreen;
