import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { MotiView } from 'moti';
import { theme } from '../utils/theme';

const AnimatedCard = ({ children, delay = 0, style, onPress, index = 0 }) => {
    return (
        <MotiView
            from={{ opacity: 0, translateY: 20, scale: 0.95 }}
            animate={{ opacity: 1, translateY: 0, scale: 1 }}
            transition={{
                type: 'timing',
                duration: 500,
                delay: delay + (index * 100),
            }}
            style={[styles.card, style]}
        >
            <Pressable 
                onPress={onPress}
                style={({ pressed }) => [
                    styles.pressable,
                    pressed && styles.pressed
                ]}
            >
                {children}
            </Pressable>
        </MotiView>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        ...theme.shadows.md,
        overflow: 'hidden',
    },
    pressable: {
        padding: theme.spacing.md,
        width: '100%',
    },
    pressed: {
        opacity: 0.8,
        transform: [{ scale: 0.98 }],
    }
});

export default AnimatedCard;
