import { ThemedText } from '@/components/ThemedText';
import { Lesson } from '@/utils/dummy-lessons';
import { BlurView } from 'expo-blur';
import { Video } from 'expo-av';
import React from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface LessonVideoModalProps {
  visible: boolean;
  lesson: Lesson | null;
  onClose: () => void;
}

export const LessonVideoModal = ({ visible, lesson, onClose }: LessonVideoModalProps) => {
  if (!lesson) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <BlurView intensity={100} style={styles.blurView} tint="dark">
        <View style={styles.modalContent}>
          <ThemedText style={styles.lessonTitle}>{lesson.title}</ThemedText>
          <View style={styles.videoContainer}>
            <Video
              source={{ uri: lesson.videoUrl }}
              style={styles.video}
              resizeMode="contain"
              shouldPlay
              isLooping
            />
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <IconSymbol name="xmark" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  blurView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    aspectRatio: 9 / 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  videoContainer: {
    width: '100%',
    flex: 1,
    borderRadius: 15,
    overflow: 'hidden',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
    padding: 5,
  },
}); 