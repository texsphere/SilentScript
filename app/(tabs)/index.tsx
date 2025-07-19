import { BlurView } from 'expo-blur';
import { Video, AVPlaybackStatus, ResizeMode } from 'expo-av';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View, Platform, Text, ColorValue } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ErrorMessage } from '../../components/ErrorMessage';
import { Header } from '../../components/Header';
import { LoadingDots } from '../../components/LoadingDots';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { VoiceRecorder } from '../../components/VoiceRecorder';
import { useColorScheme } from '../../hooks/useColorScheme';
import { LanguageManager } from '../../utils/LanguageManager';
import { SettingsManager } from '../../utils/SettingsManager';
import { transcribeAudio } from '../../utils/TranscriptionManager';
import { LinearGradient } from 'expo-linear-gradient';

import pleaseGesture from '../../assets/gestures/please.mp4';
import thankYouGesture from '../../assets/gestures/thank_you.mp4';
import goodMorningGesture from '../../assets/gestures/good_morning.mp4';
import iLikeYouGesture from '../../assets/gestures/i_like_you.mp4';
import hospitalGesture from '../../assets/gestures/hospital.mp4';
import kathmanduGesture from '../../assets/gestures/kathmandu.mp4';
import namasteGesture from '../../assets/gestures/namaste.mp4';
import whereGesture from '../../assets/gestures/where.mp4';
import niceToMeetYouGesture from '../../assets/gestures/nice_to_meet_you.mp4';
import idleGesture from '../../assets/gestures/idle.mp4';

// Video state interface
interface VideoState {
  source: number | null;
  loop: boolean;
}

export default function LiveTranslateScreen() {
  const colorScheme = useColorScheme();
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [triggeredTranscription, setTriggeredTranscription] = useState({ text: '', timestamp: 0 });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<VideoState>({ source: idleGesture, loop: true });
  const videoRef = useRef<Video>(null);
  
  const gradientColors = (colorScheme === 'dark' 
    ? ['#111111', '#000000'] 
    : ['#ffffff', '#e0e0e0']) as readonly [ColorValue, ColorValue, ...ColorValue[]];

  const textAnim = useRef(new Animated.Value(0)).current;

  const [translations, setTranslations] = useState({
    title: 'Live Translate',
    transcribing: 'Transcribing',
    tapMicPrompt: 'Tap the microphone to start speaking in Nepali',
    noSpeechDetected: 'No speech was detected. Please try speaking again.'
  });

  // Fade in animation for new transcription text
  useEffect(() => {
    if (transcription) {
      textAnim.setValue(0);
      Animated.timing(textAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }
  }, [transcription, textAnim]);

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
    // Play idle animation on initial load
    setCurrentVideo({ source: idleGesture, loop: true });
  }, []);

  useEffect(() => {
    const trimmedTranscription = triggeredTranscription.text.trim();
    if (!trimmedTranscription) return;

    let gesture = null;
    switch (trimmedTranscription) {
      case 'कृपया':
        gesture = pleaseGesture;
        break;
      case 'धन्यवाद':
        gesture = thankYouGesture;
        break;
      case 'शुभ प्रभात':
        gesture = goodMorningGesture;
        break;
      case 'मलाई तिमी मन पर्छ':
        gesture = iLikeYouGesture;
        break;
      case 'अस्पताल':
        gesture = hospitalGesture;
        break;
      case 'काठमाडौँ':
        gesture = kathmanduGesture;
        break;
      case 'नमस्ते':
        gesture = namasteGesture;
        break;
      case 'कहाँ':
        gesture = whereGesture;
        break;
      case 'भेटेर खुशी लाग्यो':
        gesture = niceToMeetYouGesture;
        break;
    }

    if (gesture) {
      console.log(`Playing "${trimmedTranscription}" video.`);
      setCurrentVideo({ source: gesture, loop: false });
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
      <LinearGradient colors={gradientColors} style={StyleSheet.absoluteFill} />
      <Header title={translations.title} />
      <View style={styles.contentContainer}>
        <View style={styles.videoContainer}>
          {currentVideo.source && (
            <View style={styles.gestureContainer}>
              <Video
                ref={videoRef}
                source={currentVideo.source}
                style={[styles.video, { transform: [{ scale: 2 }] }]}
                resizeMode={ResizeMode.COVER}
                shouldPlay
                isLooping={currentVideo.loop}
                isMuted={true}
                rate={1.0}
                onPlaybackStatusUpdate={(status: AVPlaybackStatus) => {
                  if (status.isLoaded && status.didJustFinish && !currentVideo.loop) {
                    setCurrentVideo({ source: idleGesture, loop: true });
                  }
                }}
              />
            </View>
          )}
        </View>

        <View style={styles.bottomContainer}>
          <View style={styles.transcriptionContainer}>
            <BlurView intensity={80} style={StyleSheet.absoluteFill} />
            {isLoading ? (
              <View style={styles.centerContent}>
                <ThemedText style={styles.transcriptionText}>{translations.transcribing}</ThemedText>
                <LoadingDots />
              </View>
            ) : error ? (
              <ErrorMessage message={error} onDismiss={() => setError(null)} type={'error'} />
            ) : transcription ? (
              <Animated.View style={{ opacity: textAnim }}>
                <Text style={styles.transcriptionText}>{transcription}</Text>
              </Animated.View>
            ) : (
              <View style={styles.centerContent}>
                <ThemedText style={styles.placeholderText}>
                  {translations.tapMicPrompt}
                </ThemedText>
              </View>
            )}
          </View>
          <VoiceRecorder
            isRecording={isRecording}
            onRecordingStart={() => {
              setIsRecording(true);
              setError(null);
              setTranscription('');
              setCurrentVideo({ source: null, loop: false });
            }}
            onRecordingStop={handleTranscriptionComplete}
            onError={handleRecordingError}
          />
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 80, // Adjust this value to position content below the header
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gestureContainer: {
    width: '80%',
    aspectRatio: 3 / 4,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  bottomContainer: {
    padding: 24,
    gap: 24,
  },
  transcriptionContainer: {
    minHeight: 120,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    padding: 20,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  transcriptionText: {
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
  },
  placeholderText: {
    fontSize: 18,
    opacity: 0.7,
    textAlign: 'center',
  },
});

