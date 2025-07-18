import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { AuthManager, AuthState } from '../utils/AuthManager';
import { LanguageManager } from '../utils/LanguageManager';
import { SettingsManager } from '../utils/SettingsManager';

export default function Index() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
  });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function initialize() {
      try {
        await SettingsManager.initialize();
        await LanguageManager.initialize();
        await AuthManager.initialize();

        const state = AuthManager.getAuthState();
        setAuthState(state);

        const handleAuthChange = (newState: AuthState) => {
          setAuthState(newState);
        };
        AuthManager.addAuthStateListener(handleAuthChange);

      } catch (error) {
        console.error('Initialization failed:', error);
      } finally {
        setIsReady(true);
      }
    }

    initialize();
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (authState.isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  } else {
    return <Redirect href="/auth/login" />;
  }
} 