import React from 'react';
import { Text, StyleSheet, Pressable, View } from 'react-native';
import { theme } from '../utils/theme';

const CategoryChip = ({ title, icon: Icon, color, isSelected, onPress }) => {
    return (
        <Pressable onPress={onPress}>
            <View
                style={[
                    styles.chip,
                    { backgroundColor: isSelected ? color : theme.colors.surface },
                    !isSelected && styles.border,
                    isSelected && theme.shadows.md,
                ]}
            >
                {Icon && (
                    <View style={[styles.iconContainer, { backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : color + '15' }]}>
                        <Icon size={18} color={isSelected ? '#FFF' : color} strokeWidth={2.5} />
                    </View>
                )}
                <Text style={[styles.title, { color: isSelected ? '#FFF' : theme.colors.text }]}>
                    {title}
                </Text>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: theme.borderRadius.full,
        marginRight: theme.spacing.sm,
    },
    border: {
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
    },
});

export default CategoryChip;
