import React from 'react';
import { Text, StyleSheet, Pressable, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../utils/theme';

const GradientButton = ({ title, onPress, style, colors, textStyle }) => {
    return (
        <Pressable onPress={onPress}>
            {({ pressed }) => (
                <View style={{ transform: [{ scale: pressed ? 0.98 : 1 }] }}>
                    <LinearGradient
                        colors={colors || theme.colors.cardGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[styles.button, theme.shadows.premium, style]}
                    >
                        <Text style={[styles.text, textStyle]}>{title}</Text>
                    </LinearGradient>
                </View>
            )}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.xl,
        borderRadius: theme.borderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
});

export default GradientButton;
