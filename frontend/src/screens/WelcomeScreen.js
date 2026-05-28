import React from 'react';
import { View, Text, StyleSheet, Dimensions, StatusBar } from 'react-native';
import { theme } from '../utils/theme';
import GradientButton from '../components/GradientButton';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <LinearGradient
                colors={['#0F172A', '#1E293B', '#334155']}
                style={styles.gradient}
            >
                {/* Logo */}
                <View style={styles.logoContainer}>
                    <View style={styles.logoCircle}>
                        <Text style={styles.logoText}>FN</Text>
                    </View>
                </View>

                {/* Content */}
                <View style={styles.content}>
                    <Text style={styles.title}>FixNow</Text>
                    <Text style={styles.subtitle}>Professional services at your doorstep. Reliable, fast, and secure.</Text>

                    <View style={styles.buttonContainer}>
                        <GradientButton
                            title="Get Started"
                            style={styles.button}
                            onPress={() => navigation.navigate('Login')}
                        />
                        <View style={styles.secondaryButtonRow}>
                            <Text style={styles.footerText}>New here? </Text>
                            <Text
                                style={styles.linkText}
                                onPress={() => navigation.navigate('Register')}
                            >
                                Create an account
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Decorative Elements */}
                <View
                    style={[styles.blob, { top: -50, right: -50, backgroundColor: theme.colors.vibrantBlue, opacity: 0.1 }]}
                />
                <View
                    style={[styles.blob, { bottom: -100, left: -100, backgroundColor: theme.colors.vibrantPurple, opacity: 0.1 }]}
                />
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.xl,
    },
    logoContainer: {
        marginBottom: 40,
    },
    logoCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: theme.colors.vibrantBlue,
        justifyContent: 'center',
        alignItems: 'center',
        ...theme.shadows.premium,
    },
    logoText: {
        color: '#FFF',
        fontSize: 40,
        fontWeight: '900',
    },
    content: {
        alignItems: 'center',
        width: '100%',
    },
    title: {
        fontSize: 48,
        fontWeight: '900',
        color: '#FFFFFF',
        marginBottom: 16,
        letterSpacing: -1,
    },
    subtitle: {
        fontSize: 18,
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'center',
        lineHeight: 28,
        marginBottom: 60,
    },
    buttonContainer: {
        width: '100%',
    },
    button: {
        width: '100%',
        height: 60,
    },
    secondaryButtonRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    footerText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 14,
    },
    linkText: {
        color: theme.colors.vibrantBlue,
        fontSize: 14,
        fontWeight: 'bold',
    },
    blob: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
        zIndex: -1,
    },
});

export default WelcomeScreen;
