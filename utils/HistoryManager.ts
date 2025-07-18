import AsyncStorage from '@react-native-async-storage/async-storage';

const HISTORY_STORAGE_KEY = '@nepsign_history';

export interface TranslationHistoryItem {
  id: string;
  text: string;
  timestamp: string;
}

export const HistoryManager = {
  async saveTranslation(text: string): Promise<void> {
    try {
      // Get existing history
      const history = await this.getHistory();
      
      // Create new history item
      const newItem: TranslationHistoryItem = {
        id: Date.now().toString(),
        text,
        timestamp: new Date().toISOString(),
      };
      
      // Add to beginning of history
      const updatedHistory = [newItem, ...history];
      
      // Save updated history
      await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
      
      console.log('Translation saved to history:', newItem);
    } catch (error) {
      console.error('Error saving translation to history:', error);
    }
  },

  async getHistory(): Promise<TranslationHistoryItem[]> {
    try {
      const historyJson = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
      return historyJson ? JSON.parse(historyJson) : [];
    } catch (error) {
      console.error('Error getting translation history:', error);
      return [];
    }
  },

  async deleteHistoryItem(id: string): Promise<void> {
    try {
      const history = await this.getHistory();
      const updatedHistory = history.filter(item => item.id !== id);
      await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
      console.log('History item deleted:', id);
    } catch (error) {
      console.error('Error deleting history item:', error);
    }
  },

  async clearHistory(): Promise<void> {
    try {
      await AsyncStorage.removeItem(HISTORY_STORAGE_KEY);
      console.log('History cleared');
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  }
}; 