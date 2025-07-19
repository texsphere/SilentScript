import { Header } from '@/components/Header';
import { LessonVideoModal } from '@/components/LessonVideoModal';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { dummyLessons, Lesson, LessonCategory } from '@/utils/dummy-lessons';
import { LinearGradient } from 'expo-linear-gradient';
import { ImageBackground, TouchableOpacity, useColorScheme } from 'react-native';
import React, { useRef, useState } from 'react';
import { Animated, FlatList, StyleSheet, View, Platform } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';

const LessonCard = ({ lesson, onPress }: { lesson: Lesson; onPress: () => void }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.lessonCard}
        activeOpacity={0.9}
      >
        <ImageBackground
          source={{ uri: lesson.thumbnailUrl }}
          style={styles.lessonThumbnail}
          imageStyle={{ borderRadius: 16 }}
        >
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.9)']}
            style={styles.gradientOverlay}
          >
            <View style={styles.playIconContainer}>
              <IconSymbol name="play.circle.fill" size={40} color="rgba(255,255,255,0.8)" />
        </View>
            <ThemedText style={styles.lessonTitle} numberOfLines={2}>
              {lesson.title}
            </ThemedText>
          </LinearGradient>
        </ImageBackground>
      </TouchableOpacity>
    </Animated.View>
  );
};

const LessonCategorySection = ({ category, onLessonPress }: { category: LessonCategory; onLessonPress: (lesson: Lesson) => void; }) => (
  <View style={styles.categoryContainer}>
    <ThemedText style={styles.categoryTitle}>{category.title}</ThemedText>
    <FlatList
      data={category.lessons}
      renderItem={({ item }: { item: Lesson }) => <LessonCard lesson={item} onPress={() => onLessonPress(item)} />}
      keyExtractor={(item: Lesson) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.horizontalList}
    />
      </View>
);

const ListHeader = () => (
  <View style={styles.headerContainer}>
    <ThemedText style={styles.headerTitle}>Lessons</ThemedText>
    <ThemedText style={styles.headerSubtitle}>
      Your journey to learn Nepali Sign Language starts here.
    </ThemedText>
    </View>
  );

export default function LessonsScreen() {
  const colorScheme = useColorScheme();
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const handleLessonPress = (lesson: Lesson) => {
    setSelectedLesson(lesson);
  };

  const handleCloseModal = () => {
    setSelectedLesson(null);
  };

  return (
    <ThemedView style={styles.container}>
      <ImageBackground
        source={{ uri: 'https://www.transparenttextures.com/patterns/clean-gray-paper.png' }}
        style={StyleSheet.absoluteFill}
        imageStyle={{ opacity: colorScheme === 'dark' ? 0.1 : 0.2 }}
      />
      <FlatList
        data={dummyLessons}
        ListHeaderComponent={<ListHeader />}
        renderItem={({ item }: { item: LessonCategory }) => (
          <LessonCategorySection category={item} onLessonPress={handleLessonPress} />
        )}
        keyExtractor={(item: LessonCategory) => item.id}
        contentContainerStyle={styles.listContent}
      />
      <LessonVideoModal
        visible={!!selectedLesson}
        lesson={selectedLesson}
        onClose={handleCloseModal}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 18,
    opacity: 0.6,
    marginTop: 4,
  },
  listContent: {
    paddingBottom: 48,
    gap: 32,
  },
  categoryContainer: {
    gap: 16,
  },
  categoryTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginLeft: 24,
  },
  horizontalList: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    gap: 16,
  },
  lessonCard: {
    width: 150,
    height: 180,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
  },
    }),
  },
  lessonThumbnail: {
    flex: 1,
  },
  gradientOverlay: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 16,
  },
  playIconContainer: {
    alignSelf: 'flex-end',
  },
  lessonTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
  },
}); 