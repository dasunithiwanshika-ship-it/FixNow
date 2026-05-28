import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Bell, Search } from 'lucide-react-native';
import { theme } from '../utils/theme';
import { useNavigation } from '@react-navigation/native';

const Header = ({ title, showGreeting = false, userName = '', onLogout, showSearch = false }) => {
    const navigation = useNavigation();
    return (
        <View style={styles.headerContainer}>
            <View style={styles.topRow}>
                <View style={styles.leftCol}>
                    {showGreeting ? (
                        <>
                            <Text style={styles.greeting}>Hello,</Text>
                            <Text style={styles.userName}>{userName || 'Guest'}</Text>
                        </>
                    ) : (
                        <Text style={styles.title}>{title}</Text>
                    )}
                </View>
                
                <View style={styles.rightCol}>
                    {showSearch && (
                        <TouchableOpacity style={styles.iconContainer}>
                            <Search size={20} color={theme.colors.textSecondary} />
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity style={styles.iconContainer}>
                        <Bell size={20} color={theme.colors.textSecondary} />
                        <View style={styles.notificationDot} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.avatarContainer}>
                        <View style={styles.avatarPlaceholder}>
                            <Text style={styles.avatarText}>{(userName || 'G')[0].toUpperCase()}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        paddingTop: 50,
        paddingBottom: 15,
        paddingHorizontal: theme.spacing.lg,
        backgroundColor: theme.colors.background,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    leftCol: {
        flex: 1,
    },
    rightCol: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    greeting: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        fontWeight: '500',
    },
    userName: {
        fontSize: 22,
        fontWeight: '800',
        color: theme.colors.primary,
        letterSpacing: -0.5,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: theme.colors.primary,
        letterSpacing: -0.5,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: theme.colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        ...theme.shadows.sm,
    },
    notificationDot: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: theme.colors.error,
        borderWidth: 2,
        borderColor: theme.colors.surface,
    },
    avatarContainer: {
        marginLeft: 4,
    },
    avatarPlaceholder: {
        width: 44,
        height: 44,
        borderRadius: 15,
        backgroundColor: theme.colors.vibrantBlue,
        justifyContent: 'center',
        alignItems: 'center',
        ...theme.shadows.md,
    },
    avatarText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default Header;
