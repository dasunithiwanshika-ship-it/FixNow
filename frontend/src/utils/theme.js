export const theme = {
    colors: {
        primary: '#0F172A', // Deep Slate
        secondary: '#3B82F6', // Modern Blue
        accent: '#10B981', // Emerald
        background: '#FAFBFD',
        surface: '#FFFFFF',
        text: '#1E293B',
        textSecondary: '#64748B',
        error: '#EF4444',
        border: '#E2E8F0',
        glass: 'rgba(255, 255, 255, 0.7)',
        // New Premium Colors
        vibrantBlue: '#2563EB',
        vibrantPurple: '#8B5CF6',
        vibrantPink: '#EC4899',
        gradientStart: '#3B82F6',
        gradientEnd: '#1D4ED8',
        cardGradient: ['#3B82F6', '#1E40AF'],
        gold: '#FBBF24',
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 40,
    },
    borderRadius: {
        xs: 4,
        sm: 8,
        md: 12,
        lg: 20,
        xl: 30,
        xxl: 40,
        full: 9999,
    },
    shadows: {
        sm: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 2,
        },
        md: {
            shadowColor: '#64748B',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 5,
        },
        lg: {
            shadowColor: '#0F172A',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.1,
            shadowRadius: 20,
            elevation: 10,
        },
        premium: {
            shadowColor: '#3B82F6',
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.15,
            shadowRadius: 24,
            elevation: 12,
        }
    }
};

