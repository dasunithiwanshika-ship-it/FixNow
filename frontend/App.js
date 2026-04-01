import React, { useContext } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

// Context
import { AuthProvider, AuthContext } from './src/context/AuthContext';

// Screens
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
            <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'FixNow Dashboard' }} />
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
    <AuthProvider>
      <AppNav />
    </AuthProvider>
  );
}
