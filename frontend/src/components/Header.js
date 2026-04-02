import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MotiView } from 'moti';
import { LucideHome, LucideLogOut, LucideUser } from 'lucide-react-native';
import { theme } from '../utils/theme';

const Header = ({ title, showGreeting = false, userName = '', onLogout }) => {
    return (
        <MotiView 
            from={{ translateY: -100, opacity: 0 }}
            animate={{ translateY: 0, opacity: 1 }}
            transition={{ type: 'timing', duration: 800 }}
            style={styles.headerContainer}
        >
            <View style={styles.topRow}>
                <View>
                    {showGreeting ? (
                        <>
                            <Text style={styles.greeting}>Welcome back,</Text>
                            <Text style={styles.userName}>{userName}!</Text>
                        </>
                    ) : (
                        <Text style={styles.title}>{title}</Text>
                    )}
                </View>
                <View style={styles.actions}>
                    {onLogout && (
                        <TouchableOpacity onPress={onLogout} style={styles.iconButton}>
                            <LucideLogOut size={22} color={theme.colors.error} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </MotiView>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: theme.spacing.lg,
        backgroundColor: theme.colors.surface,
        borderBottomLeftRadius: theme.borderRadius.xl,
        borderBottomRightRadius: theme.borderRadius.xl,
        ...theme.shadows.sm,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    greeting: {
        fontSize: 16,
        color: theme.colors.textSecondary,
        fontFamily: 'System',
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.primary,
        marginTop: 4,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        padding: 8,
        backgroundColor: '#FEE2E2',
        borderRadius: theme.borderRadius.md,
        marginLeft: 12,
    }
});

export default Header;
