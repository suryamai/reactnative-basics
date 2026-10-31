import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Slot, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider, useAuth } from '@/context/auth-context';
import { Palette } from '@/constants/colors';

// Prevent splash screen from auto-hiding until ready
SplashScreen.preventAutoHideAsync().catch(() => {});

function InitialLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    // Hide splash screen once auth state is checked
    SplashScreen.hideAsync().catch(() => {});

    const firstSegment = segments[0] as string | undefined;
    const isAuthGroup =
      firstSegment === 'welcome' ||
      firstSegment === 'login' ||
      firstSegment === 'signup';

    if (!isAuthenticated && !isAuthGroup) {
      // Redirect to welcome screen if not authenticated
      router.replace('/welcome');
    } else if (isAuthenticated && isAuthGroup) {
      // Redirect to chef preparing loader when logging in
      router.replace('/preparing');
    }
  }, [isAuthenticated, isLoading, segments]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Palette.white} />
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <InitialLayout />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Palette.brandOrange, // #E95322 Brand Kitchen Orange
  },
});
