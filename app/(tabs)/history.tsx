import { Header } from '@/components/Header';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { BlurView } from 'expo-blur';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Share, StyleSheet, TouchableOpacity, View } from 'react-native';
import { HistoryManager, TranslationHistoryItem } from '../../utils/HistoryManager';
import { LanguageManager } from '../../utils/LanguageManager';
import { SettingsManager } from '../../utils/SettingsManager';

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
    translation: 'Translation',
    translations: 'Translations',
    noTranslations: 'No translations yet',
    loading: 'Loading...',
    clearHistoryConfirm: 'Are you sure you want to clear all translation history?',
    clear: 'Clear'
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
      title: LanguageManager.t('historyTitle'),
      deleteTranslation: LanguageManager.t('deleteTranslation'),
      deleteConfirm: LanguageManager.t('deleteConfirm'),
      cancel: LanguageManager.t('cancel'),
      delete: LanguageManager.t('delete'),
      clearAll: LanguageManager.t('clearAll'),
      translation: LanguageManager.t('translation'),
      translations: LanguageManager.t('translations'),
      noTranslations: LanguageManager.t('noTranslations'),
      loading: LanguageManager.t('loading'),
      clearHistoryConfirm: LanguageManager.t('clearHistoryConfirm'),
      clear: LanguageManager.t('clear')
    });
  };

  // Load history when screen mounts
  useEffect(() => {
    loadHistory();
  }, []);

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
      await Share.share({
        message: text,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleDelete = async (id: string) => {
    Alert.alert(
      translations.deleteTranslation,
      translations.deleteConfirm,
      [
        {
          text: translations.cancel,
          style: 'cancel',
        },
        {
          text: translations.delete,
          style: 'destructive',
          onPress: async () => {
            await HistoryManager.deleteHistoryItem(id);
            loadHistory(); // Reload history after deletion
          },
        },
      ],
    );
  };

  const handleClearHistory = () => {
    Alert.alert(
      translations.clearAll,
      translations.clearHistoryConfirm,
      [
        {
          text: translations.cancel,
          style: 'cancel',
        },
        {
          text: translations.clear,
          style: 'destructive',
          onPress: async () => {
            await HistoryManager.clearHistory();
            loadHistory(); // Reload history after clearing
          },
        },
      ],
    );
  };

  const renderItem = ({ item }: { item: TranslationHistoryItem }) => {
    const date = new Date(item.timestamp);
    const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

    return (
      <View style={styles.historyItem}>
        <BlurView intensity={80} style={StyleSheet.absoluteFill} tint={theme} />
        <View style={styles.historyContent}>
          <ThemedText style={styles.historyText}>{item.text}</ThemedText>
          <ThemedText style={styles.historyDate}>{formattedDate}</ThemedText>
        </View>
        <View style={styles.historyActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleShare(item.text)}
          >
            <IconSymbol name="square.and.arrow.up" size={20} color={Colors[theme].text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDelete(item.id)}
          >
            <IconSymbol name="trash" size={20} color={Colors[theme].error} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderHeader = () => (
    <View style={styles.listHeader}>
      <ThemedText style={styles.listHeaderText}>
        {history.length} {history.length === 1 ? translations.translation : translations.translations}
      </ThemedText>
      {history.length > 0 && (
        <TouchableOpacity
          style={styles.clearHistoryButton}
          onPress={handleClearHistory}
        >
          <IconSymbol 
            name="close" 
            size={16} 
            color={Colors[theme].error} 
          />
          <ThemedText style={[styles.clearHistoryText, { color: Colors[theme].error }]}>
            {translations.clearAll}
          </ThemedText>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title={translations.title} />
      {history.length > 0 ? (
        <FlatList
          data={history}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          onRefresh={loadHistory}
          refreshing={isLoading}
          ListHeaderComponent={renderHeader}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <IconSymbol
            name="clock.fill"
            size={48}
            color={Colors[theme].text}
            style={{ opacity: 0.5 }}
          />
          <ThemedText style={styles.emptyText}>
            {isLoading ? translations.loading : translations.noTranslations}
          </ThemedText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 8,
  },
  listHeaderText: {
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.7,
  },
  clearHistoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  clearHistoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  historyItem: {
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginBottom: 12,
  },
  historyContent: {
    padding: 16,
  },
  historyText: {
    fontSize: 16,
    marginBottom: 12,
    lineHeight: 22,
  },
  historyDate: {
    fontSize: 13,
    opacity: 0.5,
  },
  historyActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  actionButton: {
    padding: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.7,
  },
}); 