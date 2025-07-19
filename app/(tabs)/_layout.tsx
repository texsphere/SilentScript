import { Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { LanguageManager } from '@/utils/LanguageManager';
import { Language } from '@/utils/SettingsManager';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [translations, setTranslations] = useState({
    translate: 'Translate',
    history: 'History',
    settings: 'Settings',
    lessons: 'Lessons'
  });

  useEffect(() => {
    const loadTranslations = async () => {
      // Make sure LanguageManager is initialized
      await LanguageManager.initialize();
      
      // Get current language
      const language = await LanguageManager.getCurrentLanguage();
      setCurrentLanguage(language);
      
      // Get translations for tab titles
      updateTranslations();
    };

    loadTranslations();

    // Set up listener for language changes
    const languageChangeListener = LanguageManager.addLanguageChangeListener(() => {
      console.log('[TabLayout] Language changed, updating translations');
      updateTranslations();
    });

    return () => {
      // Clean up listener when component unmounts
      LanguageManager.removeLanguageChangeListener(languageChangeListener);
    };
  }, []);

  const updateTranslations = () => {
    setTranslations({
      translate: LanguageManager.t('translateTitle'),
      history: LanguageManager.t('historyTitle'),
      settings: LanguageManager.t('settingsTitle'),
      lessons: LanguageManager.t('lessonsTitle')
    });
  };

  return (
    <Tabs
      key={`tabs-${currentLanguage}`} // Force re-render when language changes
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        // Optimize animations
        animation: 'fade',
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            height: 88,
            paddingBottom: 20,
          },
          default: {
            height: 64,
            paddingBottom: 8,
          },
        }),
        tabBarIconStyle: {
          marginTop: 8,
        },
        tabBarLabelStyle: {
          marginTop: 4,
          marginBottom: Platform.select({
            ios: 0,
            default: 8,
          }),
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: translations.translate,
          tabBarIcon: ({ color }: { color: string }) => <IconSymbol size={28} name="ear.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: translations.history,
          tabBarIcon: ({ color }: { color: string }) => <IconSymbol size={28} name="clock.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: translations.settings,
          tabBarIcon: ({ color }: { color: string }) => <IconSymbol size={28} name="gear" color={color} />,
        }}
      />
      <Tabs.Screen
        name="lessons"
        options={{
          title: translations.lessons,
          tabBarIcon: ({ color }: { color: string }) => <IconSymbol size={28} name="book.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
