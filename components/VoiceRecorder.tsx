import { MaterialIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useThemeColor } from '../hooks/useThemeColor';
import { ThemedText } from './ThemedText';

export interface VoiceRecorderProps {
  isRecording: boolean;
  onRecordingStart: () => void;
  onRecordingStop: (uri: string) => void;
  onError: (error: string) => void;
}

export function VoiceRecorder({ isRecording, onRecordingStart, onRecordingStop, onError }: VoiceRecorderProps) {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const tintColor = useThemeColor({ light: '#007AFF', dark: '#0A84FF' }, 'tint');

  useEffect(() => {
    return () => {
      if (recording) {
        recording.stopAndUnloadAsync();
      }
    };
  }, [recording]);

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording...');
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      onRecordingStart();
    } catch (err) {
      console.error('Failed to start recording:', err);
      onError('Failed to start recording. Please check microphone permissions.');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      if (!uri) {
        throw new Error('No recording URI available');
      }
      
      console.log('Recording stopped. URI:', uri);
      onRecordingStop(uri);
    } catch (err) {
      console.error('Failed to stop recording:', err);
      onError('Failed to stop recording. Please try again.');
    }

    setRecording(null);
  };

  const handlePress = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: tintColor },
          isRecording && styles.recording
        ]}
        onPress={handlePress}
      >
        <MaterialIcons
          name={isRecording ? 'stop' : 'mic'}
          size={32}
          color="white"
        />
      </TouchableOpacity>
      <ThemedText style={styles.label}>
        {isRecording ? 'Recording...' : 'Tap to speak'}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 8,
  },
  button: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007AFF',
  },
  recording: {
    backgroundColor: '#FF3B30',
  },
  label: {
    fontSize: 14,
    opacity: 0.7,
  },
}); 

