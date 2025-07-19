import { Header } from '@/components/Header';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { LanguageManager } from '@/utils/LanguageManager';
import { SettingsManager } from '@/utils/SettingsManager';
import { BlurView } from 'expo-blur';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  ImageBackground,
  Share,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { HistoryManager, TranslationHistoryItem } from '../../utils/HistoryManager';

export default function HistoryScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme ?? 'light';
  const [history, setHistory] = useState<TranslationHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [translations, setTranslations] = useState({
    title: 'History',
    deleteTranslation: 'Delete Translation',
    deleteConfirm: 'Are you sure you want to delete this translation?',
    cancel: 'Cancel',
    delete: 'Delete',
    clearAll: 'Clear All',
    noTranslations: 'No translations yet.',
    noTranslationsSub: 'Your translated phrases will appear here.',
    clearHistoryConfirm: 'Are you sure you want to clear all translation history?',
    clear: 'Clear',
  });

  // Load translations and history
  useEffect(() => {
    const loadData = async () => {
      await LanguageManager.initialize();
      updateTranslations();
      loadHistory();
    };
    loadData();

    const languageChangeListener = SettingsManager.addLanguageChangeListener(() => {
      updateTranslations();
    });

    return () => {
      SettingsManager.removeLanguageChangeListener(languageChangeListener);
    };
  }, []);

  const updateTranslations = () => {
    setTranslations({
      // ... (translation key assignments)
      title: LanguageManager.t('historyTitle'),
      deleteTranslation: LanguageManager.t('deleteTranslation'),
      deleteConfirm: LanguageManager.t('deleteConfirm'),
      cancel: LanguageManager.t('cancel'),
      delete: LanguageManager.t('delete'),
      clearAll: LanguageManager.t('clearAll'),
      noTranslations: LanguageManager.t('noTranslations'),
      noTranslationsSub: LanguageManager.t('noTranslationsSub'),
      clearHistoryConfirm: LanguageManager.t('clearHistoryConfirm'),
      clear: LanguageManager.t('clear'),
    });
  };

  const loadHistory = async () => {
    try {
      setIsLoading(true);
      const items = await HistoryManager.getHistory();
      setHistory(items);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async (text: string) => {
    try {
      await Share.share({ message: text });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      translations.deleteTranslation,
      translations.deleteConfirm,
      [
        { text: translations.cancel, style: 'cancel' },
        {
          text: translations.delete,
          style: 'destructive',
          onPress: async () => {
            await HistoryManager.deleteHistoryItem(id);
            loadHistory();
          },
        },
      ]
    );
  };

  const handleClearHistory = () => {
    if (history.length === 0) return;
    Alert.alert(
      translations.clearAll,
      translations.clearHistoryConfirm,
      [
        { text: translations.cancel, style: 'cancel' },
        {
          text: translations.clear,
          style: 'destructive',
          onPress: async () => {
            await HistoryManager.clearHistory();
            loadHistory();
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: TranslationHistoryItem }) => {
    const date = new Date(item.timestamp);
    const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

    return (
      <View style={styles.historyItem}>
        <BlurView intensity={30} style={StyleSheet.absoluteFill} tint={theme} />
        <View style={styles.historyContent}>
          <ThemedText style={styles.historyText}>{item.text}</ThemedText>
          <ThemedText style={styles.historyDate}>{formattedDate}</ThemedText>
        </View>
        <View style={styles.historyActions}>
          <TouchableOpacity style={styles.actionButton} onPress={() => handleShare(item.text)}>
            <IconSymbol name="square.and.arrow.up" size={20} color={Colors[theme].text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => handleDelete(item.id)}>
            <IconSymbol name="trash" size={20} color={Colors[theme].error} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ImageBackground
        source={{ uri: 'https://www.transparenttextures.com/patterns/clean-gray-paper.png' }}
        style={StyleSheet.absoluteFill}
        imageStyle={{ opacity: colorScheme === 'dark' ? 0.1 : 0.2 }}
      />
      <Header
        title={translations.title}
        rightIcon="trash"
        onRightPress={handleClearHistory}
      />
      <FlatList
        data={history}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <IconSymbol name="clock.arrow.circlepath" size={60} color={Colors[theme].text} style={{ opacity: 0.3 }} />
            <ThemedText style={styles.emptyText}>{translations.noTranslations}</ThemedText>
            <ThemedText style={styles.emptySubText}>{translations.noTranslationsSub}</ThemedText>
          </View>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  historyItem: {
    borderRadius: 15,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  historyContent: {
    flex: 1,
    gap: 4,
  },
  historyText: {
    fontSize: 18,
    fontWeight: '600',
  },
  historyDate: {
    fontSize: 14,
    opacity: 0.6,
  },
  historyActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '50%',
    gap: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    opacity: 0.7,
  },
  emptySubText: {
    fontSize: 16,
    opacity: 0.5,
    textAlign: 'center',
  },
}); 