import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: styles.container,
        animation: 'fade',
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
  },
}); 