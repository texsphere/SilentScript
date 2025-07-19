import { Language, SettingsManager } from './SettingsManager';

// Define translation keys and their values for each language
interface Translations {
  [key: string]: {
    en: string;
    ne: string;
  };
}

// Common translations used throughout the app
const translations: Translations = {
  // Settings screen
  settingsTitle: {
    en: 'Settings',
    ne: 'सेटिङहरू',
  },
  recognitionSettings: {
    en: 'Recognition Settings',
    ne: 'पहिचान सेटिङहरू',
  },
  autoSave: {
    en: 'Auto Save',
    ne: 'स्वतः सेभ',
  },
  autoSaveDescription: {
    en: 'Automatically save translations to history',
    ne: 'अनुवादहरू स्वतः इतिहासमा सेभ गर्नुहोस्',
  },
  highAccuracy: {
    en: 'High Accuracy Mode',
    ne: 'उच्च सटीकता मोड',
  },
  highAccuracyDescription: {
    en: 'Improve accuracy at the cost of speed',
    ne: 'गतिको मूल्यमा सटीकता सुधार गर्नुहोस्',
  },
  offlineMode: {
    en: 'Offline Mode',
    ne: 'अफलाइन मोड',
  },
  offlineModeDescription: {
    en: 'Use offline recognition when available',
    ne: 'उपलब्ध हुँदा अफलाइन पहिचान प्रयोग गर्नुहोस्',
  },
  languageSettings: {
    en: 'Language Settings',
    ne: 'भाषा सेटिङहरू',
  },
  appLanguage: {
    en: 'App Language',
    ne: 'एप भाषा',
  },
  english: {
    en: 'English',
    ne: 'अंग्रेजी',
  },
  nepali: {
    en: 'Nepali',
    ne: 'नेपाली',
  },
  app: {
    en: 'App',
    ne: 'एप',
  },
  rateApp: {
    en: 'Rate App',
    ne: 'एप रेट गर्नुहोस्',
  },
  rateAppDescription: {
    en: "Let us know how we're doing",
    ne: 'हामी कस्तो गरिरहेका छौं भन्ने कुरा हामीलाई थाहा दिनुहोस्',
  },
  contactSupport: {
    en: 'Contact Support',
    ne: 'सहायता सम्पर्क',
  },
  contactSupportDescription: {
    en: 'Get help or send feedback',
    ne: 'सहयोग प्राप्त गर्नुहोस् वा प्रतिक्रिया पठाउनुहोस्',
  },
  privacyPolicy: {
    en: 'Privacy Policy',
    ne: 'गोपनीयता नीति',
  },
  termsOfService: {
    en: 'Terms of Service',
    ne: 'सेवाका सर्तहरू',
  },
  data: {
    en: 'Data',
    ne: 'डाटा',
  },
  clearAppData: {
    en: 'Clear App Data',
    ne: 'एप डाटा खाली गर्नुहोस्',
  },
  clearAppDataDescription: {
    en: 'Remove all saved data and reset settings',
    ne: 'सबै सेभ गरिएको डाटा हटाउनुहोस् र सेटिङहरू रिसेट गर्नुहोस्',
  },
  version: {
    en: 'Version',
    ne: 'संस्करण',
  },
  // Header and Help Modal
  howToUse: {
    en: 'How to Use',
    ne: 'प्रयोग गर्ने तरिका',
  },
  dragToRotate: {
    en: 'Drag left or right to rotate the avatar',
    ne: 'अवतार घुमाउन बायाँ वा दायाँ तान्नुहोस्',
  },
  tapToSpeak: {
    en: 'Tap the microphone to start speaking in Nepali',
    ne: 'नेपालीमा बोल्न माइक्रोफोन थिच्नुहोस्',
  },
  watchAvatar: {
    en: 'Watch the avatar translate your speech to sign language',
    ne: 'अवतारले तपाईंको बोलीलाई साङ्केतिक भाषामा अनुवाद गरेको हेर्नुहोस्',
  },
  // Other screens
  translateTitle: {
    en: 'Live Translate',
    ne: 'लाइभ अनुवाद',
  },
  historyTitle: {
    en: 'History',
    ne: 'इतिहास',
  },
  helpTitle: {
    en: 'Help & About',
    ne: 'सहायता र परिचय',
  },
  recording: {
    en: 'Recording...',
    ne: 'रेकर्डिङ...',
  },
  transcribing: {
    en: 'Transcribing',
    ne: 'प्रतिलेखन गर्दै',
  },
  tapMicPrompt: {
    en: 'Tap the microphone to start speaking in Nepali',
    ne: 'नेपालीमा बोल्न माइक्रोफोन थिच्नुहोस्',
  },
  // History screen
  deleteTranslation: {
    en: 'Delete Translation',
    ne: 'अनुवाद मेटाउनुहोस्',
  },
  deleteConfirm: {
    en: 'Are you sure you want to delete this translation?',
    ne: 'के तपाईं यो अनुवाद मेटाउन निश्चित हुनुहुन्छ?',
  },
  cancel: {
    en: 'Cancel',
    ne: 'रद्द गर्नुहोस्',
  },
  delete: {
    en: 'Delete',
    ne: 'मेटाउनुहोस्',
  },
  clearAll: {
    en: 'Clear All',
    ne: 'सबै खाली गर्नुहोस्',
  },
  translation: {
    en: 'Translation',
    ne: 'अनुवाद',
  },
  translations: {
    en: 'Translations',
    ne: 'अनुवादहरू',
  },
  noTranslations: {
    en: 'No translations yet',
    ne: 'अहिलेसम्म कुनै अनुवाद छैन',
  },
  loading: {
    en: 'Loading...',
    ne: 'लोड हुँदैछ...',
  },
  // Help screen
  aboutTitle: {
    en: 'About NepSign',
    ne: 'नेपसाइन बारे',
  },
  aboutContent: {
    en: 'NepSign is a mobile application that translates Nepali speech into sign language using a 3D avatar. Our mission is to bridge communication gaps between the hearing and deaf communities in Nepal.',
    ne: 'नेपसाइन एक मोबाइल एप्लिकेशन हो जसले नेपाली बोलीलाई 3D अवतारको प्रयोग गरेर साङ्केतिक भाषामा अनुवाद गर्छ। हाम्रो मिशन नेपालमा सुन्ने र बहिरा समुदायहरू बीचको संचार अन्तरलाई पुल बनाउनु हो।',
  },
  featuresTitle: {
    en: 'Features',
    ne: 'विशेषताहरू',
  },
  feature1: {
    en: 'Real-time Nepali speech recognition',
    ne: 'रियल-टाइम नेपाली बोली पहिचान',
  },
  feature2: {
    en: '3D avatar with natural sign language gestures',
    ne: 'प्राकृतिक साङ्केतिक भाषा इशाराहरू सहित 3D अवतार',
  },
  feature3: {
    en: 'Translation history with playback',
    ne: 'प्लेब्याक सहित अनुवाद इतिहास',
  },
  feature4: {
    en: 'Offline mode for basic translations',
    ne: 'अफलाइन मोड आधारभूत अनुवादहरूको लागि'
  },
  lessonsTitle: {
    en: 'Lessons',
    ne: 'पाठहरू'
  },
  creditsTitle: {
    en: 'Credits',
    ne: 'क्रेडिट'
  },
  creditsContent: {
    en: 'NepSign uses Ready Player Me for the 3D avatar system and Google Cloud Speech-to-Text API for voice recognition. Special thanks to our Nepali Sign Language experts for their guidance and support.',
    ne: 'नेपसाइनले 3D अवतार प्रणालीको लागि रेडी प्लेयर मी र आवाज पहिचानको लागि गुगल क्लाउड स्पीच-टु-टेक्स्ट API प्रयोग गर्दछ। हाम्रा नेपाली साङ्केतिक भाषा विशेषज्ञहरूलाई उनीहरूको मार्गदर्शन र समर्थनका लागि विशेष धन्यवाद।',
  },
  contactTitle: {
    en: 'Contact',
    ne: 'सम्पर्क',
  },
  noSpeechDetected: {
    en: 'No speech was detected. Please try speaking again.',
    ne: 'कुनै पनि बोली पत्ता लागेन। कृपया फेरि बोल्ने प्रयास गर्नुहोस्।',
  },
  speakClearly: {
    en: 'Speak clearly in Nepali - the app will transcribe your speech',
    ne: 'नेपालीमा स्पष्ट रूपमा बोल्नुहोस् - एपले तपाईंको बोलीलाई प्रतिलेखन गर्नेछ',
  },
  // Common UI elements
  clear: {
    en: 'Clear',
    ne: 'खाली गर्नुहोस्',
  },
  clearHistoryConfirm: {
    en: 'Are you sure you want to clear all translation history?',
    ne: 'के तपाईं सबै अनुवाद इतिहास खाली गर्न निश्चित हुनुहुन्छ?',
  },
  clearDataConfirm: {
    en: 'Are you sure you want to clear all app data? This action cannot be undone.',
    ne: 'के तपाईं सबै एप डाटा खाली गर्न चाहनुहुन्छ? यो कार्य पूर्ववत् गर्न सकिँदैन।',
  },
  
  // Account settings
  account: {
    en: 'Account',
    ne: 'खाता',
  },
  logout: {
    en: 'Logout',
    ne: 'लगआउट',
  },
  logoutConfirm: {
    en: 'Are you sure you want to logout?',
    ne: 'के तपाईं लगआउट गर्न निश्चित हुनुहुन्छ?',
  },
  logoutDescription: {
    en: 'Sign out of your account',
    ne: 'तपाईंको खाताबाट साइन आउट गर्नुहोस्',
  },
};

// Type for language change listeners
type LanguageChangeListener = () => void;

export class LanguageManager {
  private static currentLanguage: Language = 'en';
  private static isInitialized = false;
  private static languageChangeListeners: Map<string, LanguageChangeListener> = new Map();
  private static nextListenerId = 0;

  static async initialize() {
    if (this.isInitialized) return;

    try {
      const settings = await SettingsManager.getSettings();
      this.currentLanguage = settings.language;
      this.isInitialized = true;
      console.log(`[LanguageManager] Initialized with language: ${this.currentLanguage}`);
    } catch (error) {
      console.error('Error initializing language manager:', error);
      this.currentLanguage = 'en';
    }
  }

  static async getCurrentLanguage(): Promise<Language> {
    await this.initialize();
    return this.currentLanguage;
  }

  static async setLanguage(language: Language) {
    console.log(`[LanguageManager] Setting language to: ${language}`);
    await SettingsManager.setLanguage(language);
    this.currentLanguage = language;
    this.notifyLanguageChangeListeners();
  }

  static async translate(key: string): Promise<string> {
    await this.initialize();
    
    if (!translations[key]) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    
    return translations[key][this.currentLanguage];
  }

  // Helper function to get translation synchronously (use only after initialization)
  static t(key: string): string {
    if (!this.isInitialized) {
      console.warn('LanguageManager not initialized, falling back to English');
      return translations[key]?.en || key;
    }
    
    if (!translations[key]) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    
    return translations[key][this.currentLanguage];
  }

  // Add a listener for language changes
  static addLanguageChangeListener(listener: LanguageChangeListener): string {
    const id = `listener_${this.nextListenerId++}`;
    this.languageChangeListeners.set(id, listener);
    return id;
  }

  // Remove a language change listener
  static removeLanguageChangeListener(listenerId: string): boolean {
    return this.languageChangeListeners.delete(listenerId);
  }

  // Notify all listeners of a language change
  private static notifyLanguageChangeListeners(): void {
    console.log(`[LanguageManager] Notifying ${this.languageChangeListeners.size} listeners of language change to ${this.currentLanguage}`);
    this.languageChangeListeners.forEach(listener => {
      try {
        listener();
      } catch (error) {
        console.error('Error in language change listener:', error);
      }
    });
  }
} 