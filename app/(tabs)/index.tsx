import { BlurView } from 'expo-blur';
import { Video, AVPlaybackStatus } from 'expo-av';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
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

import pleaseGesture from '../../assets/gestures/please.mp4';
import thankYouGesture from '../../assets/gestures/thank_you.mp4';
import goodMorningGesture from '../../assets/gestures/good_morning.mp4';
import iLikeYouGesture from '../../assets/gestures/i_like_you.mp4';
import hospitalGesture from '../../assets/gestures/hospital.mp4';
import kathmanduGesture from '../../assets/gestures/kathmandu.mp4';
import namasteGesture from '../../assets/gestures/namaste.mp4';

export default function LiveTranslateScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  // New state to reliably trigger the video effect
  const [triggeredTranscription, setTriggeredTranscription] = useState({ text: '', timestamp: 0 });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [gestureVideo, setGestureVideo] = useState<number | null>(null);
  const videoRef = useRef<Video>(null);
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
      setTriggeredTranscription({ text: nepaliText, timestamp: Date.now() });
      
    } catch (err) {
      console.error('Transcription error:', err);
      setError(err instanceof Error ? err.message : 'Failed to process speech. Please try again.');
      setTranscription('');
    } finally {
      setIsLoading(false);
      setIsRecording(false);
    }
  }, [translations.noSpeechDetected]);

  useEffect(() => {
    const trimmedTranscription = triggeredTranscription.text.trim();
    if (!trimmedTranscription) return;

    console.log(`Transcription received: "${trimmedTranscription}"`); // Debugging line

    if (trimmedTranscription === 'कृपया') {
      console.log('Playing "कृपया" video.');
      setGestureVideo(pleaseGesture);
    } else if (trimmedTranscription === 'धन्यवाद') {
      console.log('Playing "धन्यवाद" video.');
      setGestureVideo(thankYouGesture);
    } else if (trimmedTranscription === 'शुभ प्रभात') {
      console.log('Playing "शुभ प्रभात" video.');
      setGestureVideo(goodMorningGesture);
    } else if (trimmedTranscription === 'मलाई तिमी मन पर्छ') {
      console.log('Playing "मलाई तिमी मन पर्छ" video.');
      setGestureVideo(iLikeYouGesture);
    } else if (trimmedTranscription === 'अस्पताल') {
      console.log('Playing "अस्पताल" video.');
      setGestureVideo(hospitalGesture);
    } else if (trimmedTranscription === 'काठमाडौँ') {
      console.log('Playing "काठमाडौँ" video.');
      setGestureVideo(kathmanduGesture);
    } else if (trimmedTranscription === 'नमस्ते') {
      console.log('Playing "नमस्ते" video.');
      setGestureVideo(namasteGesture);
    }
  }, [triggeredTranscription]);

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
        {gestureVideo && (
          <View style={[styles.gestureContainer, { transform: [{ scale: 2 }] }]}>
            <Video
              ref={videoRef}
              source={gestureVideo}
              style={styles.video}
              resizeMode="contain"
              shouldPlay
              isLooping={false}
              rate={2.0}
              onPlaybackStatusUpdate={(status: AVPlaybackStatus) => {
                if (status.isLoaded && status.didJustFinish) {
                  setGestureVideo(null);
                }
              }}
            />
          </View>
        )}
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
            setGestureVideo(null);
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  gestureContainer: {
    width: '90%',
    aspectRatio: 3 / 4,
  },
  gestureImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  video: {
    width: '100%',
    height: '100%',
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

