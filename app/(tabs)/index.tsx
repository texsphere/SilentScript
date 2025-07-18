import { BlurView } from 'expo-blur';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AvatarWebView } from '../../components/AvatarWebView';
import { ErrorMessage } from '../../components/ErrorMessage';
import { Header } from '../../components/Header';
import { LoadingDots } from '../../components/LoadingDots';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { VoiceRecorder } from '../../components/VoiceRecorder';
import { useThemeColor } from '../../hooks/useThemeColor';
import { LanguageManager } from '../../utils/LanguageManager';
import { SettingsManager } from '../../utils/SettingsManager';
import { transcribeAudio } from '../../utils/TranscriptionManager';

export default function LiveTranslateScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const avatarRef = useRef(null);
  const backgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#000000' }, 'background');
  const [translations, setTranslations] = useState({
    title: 'Live Translate',
    transcribing: 'Transcribing',
    tapMicPrompt: 'Tap the microphone to start speaking in Nepali',
    noSpeechDetected: 'No speech was detected. Please try speaking again.'
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
      title: LanguageManager.t('translateTitle'),
      transcribing: LanguageManager.t('transcribing'),
      tapMicPrompt: LanguageManager.t('tapMicPrompt'),
      noSpeechDetected: LanguageManager.t('noSpeechDetected')
    });
  };

  const handleTranscriptionComplete = useCallback(async (uri: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Transcribe the audio
      const nepaliText = await transcribeAudio(uri);
      if (!nepaliText) {
        throw new Error(translations.noSpeechDetected);
      }
      
      setTranscription(nepaliText);
      
    } catch (err) {
      console.error('Transcription error:', err);
      setError(err instanceof Error ? err.message : 'Failed to process speech. Please try again.');
      setTranscription('');
    } finally {
      setIsLoading(false);
      setIsRecording(false);
    }
  }, [translations.noSpeechDetected]);

  const handleRecordingError = useCallback((err: string) => {
    setError(err);
    setIsLoading(false);
    setIsRecording(false);
    setTranscription('');
  }, []);

  return (
    <ThemedView style={styles.container}>
      <Header title={translations.title} />
      
      {/* Avatar Display */}
      <View style={styles.avatarContainer}>
        <AvatarWebView
          ref={avatarRef}
        />
      </View>

      {/* Transcription Display */}
      <View style={styles.transcriptionContainer}>
        <BlurView intensity={80} style={StyleSheet.absoluteFill} />
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ThemedText>{translations.transcribing}</ThemedText>
            <LoadingDots />
          </View>
        ) : error ? (
          <ErrorMessage 
            message={error}
            onDismiss={() => setError(null)}
            type={error.includes('कृपया') ? 'warning' : 'error'}
          />
        ) : transcription ? (
          <View style={styles.transcriptionContent}>
            <ThemedText style={styles.transcriptionText}>{transcription}</ThemedText>
          </View>
        ) : (
          <View style={styles.placeholderContainer}>
            <ThemedText style={styles.placeholderText}>
              नेपाली भाषामा बोल्न माइक्रोफोन थिच्नुहोस्
            </ThemedText>
            <ThemedText style={[styles.placeholderText, styles.placeholderTranslation]}>
              ({translations.tapMicPrompt})
            </ThemedText>
          </View>
        )}
      </View>

      {/* Voice Input */}
      <View style={styles.controlsContainer}>
        <VoiceRecorder
          isRecording={isRecording}
          onRecordingStart={() => {
            setIsRecording(true);
            setError(null);
          }}
          onRecordingStop={handleTranscriptionComplete}
          onError={handleRecordingError}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  avatarContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: 'transparent',
  },
  transcriptionContainer: {
    width: '90%',
    minHeight: 100,
    marginVertical: 20,
    borderRadius: 15,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  transcriptionContent: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transcriptionText: {
    fontSize: 18,
    textAlign: 'center',
  },
  loadingContainer: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  placeholderContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    textAlign: 'center',
    opacity: 0.8,
    fontSize: 16,
  },
  placeholderTranslation: {
    fontSize: 14,
    marginTop: 4,
    opacity: 0.6,
  },
  controlsContainer: {
    paddingBottom: 20,
    alignItems: 'center',
  },
});

