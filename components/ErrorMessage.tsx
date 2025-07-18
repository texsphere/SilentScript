import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React from 'react';
import { StyleSheet, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import Colors from '../constants/Colors';
import { useColorScheme } from '../hooks/useColorScheme';
import { ThemedText } from './ThemedText';

interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
  type?: 'error' | 'warning' | 'info';
}

interface Styles {
  container: ViewStyle;
  content: ViewStyle;
  iconContainer: ViewStyle;
  textContainer: ViewStyle;
  nepaliText: TextStyle;
  englishText: TextStyle;
  dismissButton: ViewStyle;
}

export function ErrorMessage({ message, onDismiss, type = 'error' }: ErrorMessageProps) {
  const colorScheme = useColorScheme();
  const theme = colorScheme ?? 'light';

  const getIconProps = () => {
    switch (type) {
      case 'warning':
        return {
          name: 'warning' as const,
          color: Colors[theme].warning,
        };
      case 'info':
        return {
          name: 'info' as const,
          color: Colors[theme].info,
        };
      default:
        return {
          name: 'error-outline' as const,
          color: Colors[theme].error,
        };
    }
  };

  // Split message if it contains English translation in parentheses
  const [nepali, english] = message.split(/[()]/);
  const hasTranslation = english && english.trim().length > 0;

  return (
    <View style={styles.container}>
      <BlurView intensity={80} style={StyleSheet.absoluteFill} />
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <MaterialIcons {...getIconProps()} size={24} />
        </View>
        <View style={styles.textContainer}>
          <ThemedText style={[styles.nepaliText, hasTranslation && { marginBottom: 4 }]}>
            {nepali.trim()}
          </ThemedText>
          {hasTranslation && (
            <ThemedText style={styles.englishText}>
              {english.trim()}
            </ThemedText>
          )}
        </View>
        {onDismiss && (
          <TouchableOpacity 
            style={styles.dismissButton}
            onPress={onDismiss}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialIcons 
              name="close" 
              size={20} 
              color={Colors[theme].text}
              style={{ opacity: 0.6 }}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create<Styles>({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  nepaliText: {
    fontSize: 16,
  },
  englishText: {
    fontSize: 14,
    opacity: 0.7,
  },
  dismissButton: {
    marginLeft: 12,
    padding: 4,
  },
}); 