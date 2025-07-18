import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_KEYS = {
  AUTO_SAVE: '@settings/auto_save',
  HIGH_ACCURACY: '@settings/high_accuracy',
  OFFLINE_MODE: '@settings/offline_mode',
  LANGUAGE: '@settings/language',
} as const;

export type Language = 'en' | 'ne';

interface Settings {
  autoSave: boolean;
  highAccuracy: boolean;
  offlineMode: boolean;
  language: Language;
}

const DEFAULT_SETTINGS: Settings = {
  autoSave: true,
  highAccuracy: false,
  offlineMode: false,
  language: 'en',
};

type LanguageChangeListener = () => void;

export class SettingsManager {
  private static settings: Settings = { ...DEFAULT_SETTINGS };
  private static isInitialized = false;
  private static languageChangeListeners: Map<string, LanguageChangeListener> = new Map();
  private static nextListenerId = 0;

  static async initialize() {
    if (this.isInitialized) return;

    try {
      const [autoSave, highAccuracy, offlineMode, language] = await Promise.all([
        AsyncStorage.getItem(SETTINGS_KEYS.AUTO_SAVE),
        AsyncStorage.getItem(SETTINGS_KEYS.HIGH_ACCURACY),
        AsyncStorage.getItem(SETTINGS_KEYS.OFFLINE_MODE),
        AsyncStorage.getItem(SETTINGS_KEYS.LANGUAGE),
      ]);

      this.settings = {
        autoSave: autoSave !== null ? JSON.parse(autoSave) : DEFAULT_SETTINGS.autoSave,
        highAccuracy: highAccuracy !== null ? JSON.parse(highAccuracy) : DEFAULT_SETTINGS.highAccuracy,
        offlineMode: offlineMode !== null ? JSON.parse(offlineMode) : DEFAULT_SETTINGS.offlineMode,
        language: language !== null ? JSON.parse(language) : DEFAULT_SETTINGS.language,
      };

      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing settings:', error);
      this.settings = { ...DEFAULT_SETTINGS };
    }
  }

  static async getSettings(): Promise<Settings> {
    await this.initialize();
    return this.settings;
  }

  static async setAutoSave(value: boolean) {
    try {
      await AsyncStorage.setItem(SETTINGS_KEYS.AUTO_SAVE, JSON.stringify(value));
      this.settings.autoSave = value;
    } catch (error) {
      console.error('Error setting auto save:', error);
    }
  }

  static async setHighAccuracy(value: boolean) {
    try {
      await AsyncStorage.setItem(SETTINGS_KEYS.HIGH_ACCURACY, JSON.stringify(value));
      this.settings.highAccuracy = value;
    } catch (error) {
      console.error('Error setting high accuracy:', error);
    }
  }

  static async setOfflineMode(value: boolean) {
    try {
      await AsyncStorage.setItem(SETTINGS_KEYS.OFFLINE_MODE, JSON.stringify(value));
      this.settings.offlineMode = value;
    } catch (error) {
      console.error('Error setting offline mode:', error);
    }
  }

  static async setLanguage(value: Language) {
    try {
      await AsyncStorage.setItem(SETTINGS_KEYS.LANGUAGE, JSON.stringify(value));
      this.settings.language = value;
      
      // Notify all language change listeners
      this.notifyLanguageChangeListeners();
    } catch (error) {
      console.error('Error setting language:', error);
    }
  }

  static async resetSettings() {
    try {
      await Promise.all([
        AsyncStorage.removeItem(SETTINGS_KEYS.AUTO_SAVE),
        AsyncStorage.removeItem(SETTINGS_KEYS.HIGH_ACCURACY),
        AsyncStorage.removeItem(SETTINGS_KEYS.OFFLINE_MODE),
        AsyncStorage.removeItem(SETTINGS_KEYS.LANGUAGE),
      ]);
      this.settings = { ...DEFAULT_SETTINGS };
    } catch (error) {
      console.error('Error resetting settings:', error);
    }
  }

  // Language change listener methods
  static addLanguageChangeListener(listener: LanguageChangeListener): string {
    const id = `listener_${this.nextListenerId++}`;
    this.languageChangeListeners.set(id, listener);
    return id;
  }

  static removeLanguageChangeListener(listenerId: string): boolean {
    return this.languageChangeListeners.delete(listenerId);
  }

  private static notifyLanguageChangeListeners(): void {
    this.languageChangeListeners.forEach(listener => {
      try {
        listener();
      } catch (error) {
        console.error('Error in language change listener:', error);
      }
    });
  }
} 