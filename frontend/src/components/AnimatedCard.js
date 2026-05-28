import React from 'react';
import { StyleSheet, Pressable, View } from 'react-native';
import { theme } from '../utils/theme';

const AnimatedCard = ({ children, style, onPress }) => {
    const content = (
        <View style={styles.pressable}>
            {children}
        </View>
    );

    return (
        <View style={[styles.card, style]}>
            {onPress ? (
                <Pressable 
                    onPress={onPress}
                    style={({ pressed }) => [
                        pressed && styles.pressed
                    ]}
                >
                    {content}
                </Pressable>
            ) : (
                content
            )}
        </View>
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
