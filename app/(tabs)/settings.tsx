import { Header } from '@/components/Header';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthManager } from '@/utils/AuthManager';
import { SettingsManager } from '@/utils/SettingsManager';
import { BlurView } from 'expo-blur';
import * as Linking from 'expo-linking';
import * as MailComposer from 'expo-mail-composer';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Platform, ScrollView, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';

type SettingItemProps = {
  icon: string;
  title: string;
  description?: string;
  onPress?: () => void;
  value?: boolean;
  onValueChange?: (value: boolean) => void;
  isLoading?: boolean;
};

function SettingItem({ icon, title, description, onPress, value, onValueChange, isLoading }: SettingItemProps) {
  const colorScheme = useColorScheme();
  const theme = colorScheme ?? 'light';

  return (
    <TouchableOpacity 
      style={styles.settingItem}
      onPress={onPress}
      disabled={!onPress && !onValueChange || isLoading}
    >
      <BlurView intensity={20} style={StyleSheet.absoluteFill} />
      <View style={styles.settingContent}>
        <View style={styles.settingHeader}>
          <View style={styles.settingIconContainer}>
            <IconSymbol name={icon} size={20} color={Colors[theme].text} />
          </View>
          <View style={styles.settingTextContainer}>
            <ThemedText style={styles.settingTitle}>{title}</ThemedText>
            {description && (
              <ThemedText style={styles.settingDescription}>{description}</ThemedText>
            )}
          </View>
          {isLoading ? (
            <ActivityIndicator size="small" />
          ) : onValueChange ? (
            <Switch
              value={value}
              onValueChange={onValueChange}
              trackColor={{ false: '#767577', true: Colors[theme].tint }}
              thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : value ? Colors[theme].tint : '#f4f3f4'}
            />
          ) : onPress ? (
            <IconSymbol 
              name="chevron.right" 
              size={20} 
              color={Colors[theme].text} 
              style={{ opacity: 0.5 }} 
            />
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme ?? 'light';
  const [autoSave, setAutoSave] = useState(true);
  const [highAccuracy, setHighAccuracy] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Load settings on component mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const settings = await SettingsManager.getSettings();
    setAutoSave(settings.autoSave);
    setHighAccuracy(settings.highAccuracy);
    setOfflineMode(settings.offlineMode);
  };

  const handleAutoSaveChange = async (value: boolean) => {
    await SettingsManager.setAutoSave(value);
    setAutoSave(value);
  };

  const handleHighAccuracyChange = async (value: boolean) => {
    await SettingsManager.setHighAccuracy(value);
    setHighAccuracy(value);
  };

  const handleOfflineModeChange = async (value: boolean) => {
    await SettingsManager.setOfflineMode(value);
    setOfflineMode(value);
  };

  const handleRateApp = () => {
    const storeUrl = Platform.select({
      ios: 'https://apps.apple.com/app/your-app-id',
      android: 'https://play.google.com/store/apps/details?id=your.app.id',
    });
    if (storeUrl) {
      Linking.openURL(storeUrl);
    }
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear App Data',
      'Are you sure you want to clear all app data? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await SettingsManager.resetSettings();
            await loadSettings();
          },
        },
      ],
    );
  };

  const handleContactSupport = async () => {
    const isAvailable = await MailComposer.isAvailableAsync();

    if (isAvailable) {
      const { status } = await MailComposer.composeAsync({
        recipients: ['support@nepalify.com'],
        subject: 'Support Request - NepSign App',
        body: 'Hello, I need help with...',
      });

      if (status === MailComposer.MailComposerStatus.SENT) {
        Alert.alert('Email Sent', 'Your support request has been sent.');
      }
    } else {
      Alert.alert(
        'Email Not Available',
        'We could not open the email client on your device. Please send an email to support@nepalify.com.',
        [
          { text: 'OK' }
        ]
      );
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            setIsLoggingOut(true);
            try {
              await AuthManager.logout();
              router.replace('/auth/login');
            } catch (error) {
              console.error('Logout failed:', error);
              Alert.alert('Error', 'Logout failed. Please try again.');
            } finally {
              setIsLoggingOut(false);
            }
          },
        },
      ],
    );
  };

  return (
    <ThemedView style={styles.container}>
      <Header title="Settings" />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Recognition Settings</ThemedText>
          <SettingItem
            icon="arrow.triangle.2.circlepath"
            title="Auto Save"
            description="Automatically save translations to history"
            value={autoSave}
            onValueChange={handleAutoSaveChange}
          />
          <SettingItem
            icon="key.fill"
            title="High Accuracy Mode"
            description="Improve accuracy at the cost of speed"
            value={highAccuracy}
            onValueChange={handleHighAccuracyChange}
          />
          <SettingItem
            icon="wifi.slash"
            title="Offline Mode"
            description="Use offline recognition when available"
            value={offlineMode}
            onValueChange={handleOfflineModeChange}
          />
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>App</ThemedText>
          <SettingItem
            icon="star.fill"
            title="Rate App"
            description="Let us know how we're doing"
            onPress={handleRateApp}
          />
          <SettingItem
            icon="envelope.fill"
            title="Contact Support"
            description="Get help or send feedback"
            onPress={handleContactSupport}
          />
          <SettingItem
            icon="person.fill"
            title="Privacy Policy"
            onPress={() => Linking.openURL('https://your-app.com/privacy')}
          />
          <SettingItem
            icon="text.bubble.fill"
            title="Terms of Service"
            onPress={() => Linking.openURL('https://your-app.com/terms')}
          />
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Data</ThemedText>
          <SettingItem
            icon="trash.fill"
            title="Clear App Data"
            description="Remove all saved data and reset settings"
            onPress={handleClearData}
          />
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Account</ThemedText>
          <SettingItem
            icon="rectangle.portrait.and.arrow.right"
            title="Logout"
            description="Sign out from your account"
            onPress={handleLogout}
            isLoading={isLoggingOut}
          />
        </View>

        <View style={styles.footer}>
          <ThemedText style={styles.version}>Version 1.0.0</ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    opacity: 0.7,
    marginLeft: 12,
  },
  settingItem: {
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginBottom: 8,
  },
  settingContent: {
    padding: 16,
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingDescription: {
    fontSize: 13,
    opacity: 0.6,
    marginTop: 2,
  },
  footer: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: Platform.select({ ios: 20, default: 0 }),
  },
  version: {
    fontSize: 13,
    opacity: 0.5,
  },
}); 