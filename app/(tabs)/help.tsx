import { Header } from '@/components/Header';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { LanguageManager } from '@/utils/LanguageManager';
import { SettingsManager } from '@/utils/SettingsManager';
import { BlurView } from 'expo-blur';
import React, { useEffect, useState } from 'react';
import { Linking, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

type HelpSectionProps = {
  icon: string;
  title: string;
  children: React.ReactNode;
};

function HelpSection({ icon, title, children }: HelpSectionProps) {
  return (
    <View style={styles.helpSection}>
      <BlurView intensity={20} style={StyleSheet.absoluteFill} />
      <View style={styles.helpContent}>
        <View style={styles.helpHeader}>
          <IconSymbol name={icon} size={24} color={Colors.light.text} />
          <ThemedText style={styles.helpTitle}>{title}</ThemedText>
        </View>
        {children}
      </View>
    </View>
  );
}

export default function HelpScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme ?? 'light';
  const [translations, setTranslations] = useState({
    title: 'Help & About',
    aboutTitle: 'About NepSign',
    aboutContent: 'NepSign is a mobile application that translates Nepali speech into sign language using a 3D avatar. Our mission is to bridge communication gaps between the hearing and deaf communities in Nepal.',
    howToUseTitle: 'How to Use',
    step1: 'Tap the microphone button in the Translate tab to start recording',
    step2: 'Speak clearly in Nepali - the app will transcribe your speech',
    step3: 'Watch the avatar perform the corresponding sign language gestures',
    featuresTitle: 'Features',
    feature1: 'Real-time Nepali speech recognition',
    feature2: '3D avatar with natural sign language gestures',
    feature3: 'Translation history with playback',
    feature4: 'Offline mode for basic translations',
    creditsTitle: 'Credits',
    creditsContent: 'NepSign uses Ready Player Me for the 3D avatar system and Google Cloud Speech-to-Text API for voice recognition. Special thanks to our Nepali Sign Language experts for their guidance and support.',
    contactTitle: 'Contact',
    contactSupport: 'Contact Support'
  });

  // Load translations
  useEffect(() => {
    const loadTranslations = async () => {
      await LanguageManager.initialize();
      updateTranslations();
    };
    
    loadTranslations();
    
    // Set up listener for language changes
    const languageChangeListener = SettingsManager.addLanguageChangeListener(() => {
      updateTranslations();
    });

    return () => {
      SettingsManager.removeLanguageChangeListener(languageChangeListener);
    };
  }, []);

  const updateTranslations = () => {
    setTranslations({
      title: LanguageManager.t('helpTitle'),
      aboutTitle: LanguageManager.t('aboutTitle'),
      aboutContent: LanguageManager.t('aboutContent'),
      howToUseTitle: LanguageManager.t('howToUse'),
      step1: LanguageManager.t('tapToSpeak'),
      step2: LanguageManager.t('speakClearly'),
      step3: LanguageManager.t('watchAvatar'),
      featuresTitle: LanguageManager.t('featuresTitle'),
      feature1: LanguageManager.t('feature1'),
      feature2: LanguageManager.t('feature2'),
      feature3: LanguageManager.t('feature3'),
      feature4: LanguageManager.t('feature4'),
      creditsTitle: LanguageManager.t('creditsTitle'),
      creditsContent: LanguageManager.t('creditsContent'),
      contactTitle: LanguageManager.t('contactTitle'),
      contactSupport: LanguageManager.t('contactSupport')
    });
  };

  const handleEmailSupport = () => {
    Linking.openURL('mailto:support@nepsign.app');
  };

  return (
    <View style={styles.container}>
      <Header title={translations.title} />
      <ScrollView contentContainerStyle={styles.content}>
        <HelpSection icon="info.circle.fill" title={translations.aboutTitle}>
          <ThemedText style={styles.paragraph}>
            {translations.aboutContent}
          </ThemedText>
        </HelpSection>

        <HelpSection icon="questionmark.circle.fill" title={translations.howToUseTitle}>
          <View style={styles.steps}>
            <View style={styles.step}>
              <ThemedText style={styles.stepNumber}>1</ThemedText>
              <ThemedText style={styles.stepText}>
                {translations.step1}
              </ThemedText>
            </View>
            <View style={styles.step}>
              <ThemedText style={styles.stepNumber}>2</ThemedText>
              <ThemedText style={styles.stepText}>
                {translations.step2}
              </ThemedText>
            </View>
            <View style={styles.step}>
              <ThemedText style={styles.stepNumber}>3</ThemedText>
              <ThemedText style={styles.stepText}>
                {translations.step3}
              </ThemedText>
            </View>
          </View>
        </HelpSection>

        <HelpSection icon="star.fill" title={translations.featuresTitle}>
          <View style={styles.features}>
            <View style={styles.feature}>
              <IconSymbol name="ear.fill" size={20} color={Colors[theme].text} />
              <ThemedText style={styles.featureText}>
                {translations.feature1}
              </ThemedText>
            </View>
            <View style={styles.feature}>
              <IconSymbol name="person.fill" size={20} color={Colors[theme].text} />
              <ThemedText style={styles.featureText}>
                {translations.feature2}
              </ThemedText>
            </View>
            <View style={styles.feature}>
              <IconSymbol name="clock.fill" size={20} color={Colors[theme].text} />
              <ThemedText style={styles.featureText}>
                {translations.feature3}
              </ThemedText>
            </View>
            <View style={styles.feature}>
              <IconSymbol name="wifi.slash" size={20} color={Colors[theme].text} />
              <ThemedText style={styles.featureText}>
                {translations.feature4}
              </ThemedText>
            </View>
          </View>
        </HelpSection>

        <HelpSection icon="person.2.fill" title={translations.creditsTitle}>
          <ThemedText style={styles.paragraph}>
            {translations.creditsContent}
          </ThemedText>
        </HelpSection>

        <HelpSection icon="envelope.fill" title={translations.contactTitle}>
          <TouchableOpacity onPress={handleEmailSupport} style={styles.contactButton}>
            <IconSymbol name="envelope.fill" size={20} color={Colors[theme].text} />
            <ThemedText style={styles.contactButtonText}>
              {translations.contactSupport}
            </ThemedText>
          </TouchableOpacity>
        </HelpSection>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  helpSection: {
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  helpContent: {
    padding: 16,
    gap: 12,
  },
  helpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  helpTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.8,
  },
  steps: {
    gap: 12,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: '600',
    backgroundColor: 'rgba(0,0,0,0.1)',
    width: 24,
    height: 24,
    borderRadius: 12,
    textAlign: 'center',
    lineHeight: 24,
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
  },
  features: {
    gap: 12,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    flex: 1,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
    padding: 12,
    borderRadius: 8,
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
}); 