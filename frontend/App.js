import React, { useContext } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
// NOTE: StripeProvider requires a custom dev build (not Expo Go).
// Re-enable when using `npx expo run:ios` or `npx expo run:android`.
// import { StripeProvider } from '@stripe/stripe-react-native';
// import { STRIPE_PUBLISHABLE_KEY } from './src/utils/constants';

// Context
import { AuthProvider, AuthContext } from './src/context/AuthContext';
import { LogBox, Platform } from 'react-native';

LogBox.ignoreLogs([
  '"shadow*" style props are deprecated. Use "boxShadow".',
  'props.pointerEvents is deprecated. Use style.pointerEvents'
]);

if (Platform.OS === 'web') {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (args[0] && typeof args[0] === 'string' && (args[0].includes('shadow*') || args[0].includes('pointerEvents'))) return;
    originalWarn(...args);
  };
}

// Screens
import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import CreateJobScreen from './src/screens/CreateJobScreen';
import JobListScreen from './src/screens/JobListScreen';
import JobDetailsScreen from './src/screens/JobDetailsScreen';
import WorkerProfileScreen from './src/screens/WorkerProfileScreen';
import ReviewScreen from './src/screens/ReviewScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Stack = createNativeStackNavigator();

const AppNav = () => {
  const { user, splashLoading } = useContext(AuthContext);

  if (splashLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator>
        {user ? (
          // Main Stack for Logged-In Users
          <>
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="CreateJob" component={CreateJobScreen} options={{ title: 'Post a Job' }} />
            <Stack.Screen name="JobList" component={JobListScreen} options={{ title: 'Jobs' }} />
            <Stack.Screen name="JobDetails" component={JobDetailsScreen} options={{ title: 'Job Details' }} />
            <Stack.Screen name="WorkerProfile" component={WorkerProfileScreen} options={{ title: 'Worker Profile' }} />
            <Stack.Screen name="ReviewScreen" component={ReviewScreen} options={{ title: 'Submit Review' }} />
            <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Analytics Dashboard' }} />
            <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'My Profile' }} />
          </>
        ) : (
          // Auth Stack for Guests
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    // NOTE: StripeProvider commented out for Expo Go compatibility.
    // Wrap with <StripeProvider> when using a custom dev build.
    <AuthProvider>
      <AppNav />
    </AuthProvider>
  );
}
