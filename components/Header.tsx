import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { LanguageManager } from '@/utils/LanguageManager';
import { BlurView } from 'expo-blur';
import Constants from 'expo-constants';
import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { IconSymbol } from './ui/IconSymbol';

interface HeaderProps {
  title?: string;
  rightIcon?: string;
  onRightPress?: () => void;
}

export function Header({ title = 'NepSign', rightIcon, onRightPress }: HeaderProps) {
  const colorScheme = useColorScheme();
  const theme = colorScheme ?? 'light';
  const [showHelp, setShowHelp] = useState(false);
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [language, setLanguage] = useState<'en' | 'ne'>('en');

  // Load translations when the component mounts or language changes
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const currentLanguage = await LanguageManager.getCurrentLanguage();
        setLanguage(currentLanguage);
        
        // Load translations for help modal
        const helpTranslations: Record<string, string> = {
          howToUse: LanguageManager.t('howToUse') || 'How to Use',
          dragToRotate: LanguageManager.t('dragToRotate') || 'Drag left or right to rotate the avatar',
          tapToSpeak: LanguageManager.t('tapToSpeak') || 'Tap the ear icon to start speaking in Nepali',
          watchAvatar: LanguageManager.t('watchAvatar') || 'Watch the avatar translate your speech to sign language',
        };
        
        setTranslations(helpTranslations);
      } catch (error) {
        console.error('Failed to load translations:', error);
      }
    };
    
    loadTranslations();
  }, []);

  return (
    <>
      <View style={styles.header}>
        <ThemedText style={styles.title}>{title}</ThemedText>
        <TouchableOpacity
          style={styles.helpButton}
          onPress={rightIcon ? onRightPress : () => setShowHelp(!showHelp)}
        >
          <IconSymbol
            name={rightIcon || "questionmark.circle.fill"}
            size={24}
            color={Colors[theme].text}
          />
        </TouchableOpacity>
      </View>

      {/* Help Modal */}
      {showHelp && (
        <TouchableOpacity
          activeOpacity={1}
          style={styles.helpModal}
          onPress={() => setShowHelp(false)}
        >
          <BlurView intensity={90} style={StyleSheet.absoluteFill} />
          <TouchableOpacity
            activeOpacity={1}
            style={styles.helpContent}
            onPress={(e) => e.stopPropagation()}
          >
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowHelp(false)}
            >
              <IconSymbol
                name="chevron.right"
                size={24}
                color={Colors[theme].text}
              />
            </TouchableOpacity>
            <ThemedText style={styles.helpTitle}>{translations.howToUse}</ThemedText>
            <View style={styles.helpItem}>
              <IconSymbol
                name="house.fill"
                size={24}
                color={Colors[theme].text}
              />
              <ThemedText style={styles.helpText}>
                {translations.dragToRotate}
              </ThemedText>
            </View>
            <View style={styles.helpItem}>
              <IconSymbol
                name="ear.fill"
                size={24}
                color={Colors[theme].text}
              />
              <ThemedText style={styles.helpText}>
                {translations.tapToSpeak}
              </ThemedText>
            </View>
            <View style={styles.helpItem}>
              <IconSymbol
                name="paperplane.fill"
                size={24}
                color={Colors[theme].text}
              />
              <ThemedText style={styles.helpText}>
                {translations.watchAvatar}
              </ThemedText>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    marginTop: Constants.statusBarHeight,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  helpButton: {
    padding: 8,
  },
  helpModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpContent: {
    backgroundColor: Platform.select({
      ios: 'rgba(255,255,255,0.8)',
      android: 'rgba(255,255,255,0.95)',
      default: 'rgba(255,255,255,0.95)',
    }),
    borderRadius: 20,
    padding: 20,
    width: '80%',
    maxWidth: 400,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
      default: {
        boxShadow: '0px 2px 4px rgba(0,0,0,0.25)',
      },
    }),
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 8,
  },
  helpTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  helpItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 10,
  },
  helpText: {
    marginLeft: 12,
    fontSize: 16,
    flex: 1,
  },
}); 