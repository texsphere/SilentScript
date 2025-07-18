import { Asset } from 'expo-asset';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';

export interface AvatarWebViewRef {
  playGesture: (gestureName: string) => void;
}

interface AvatarWebViewProps {
  style?: ViewStyle;
  onGestureComplete?: () => void;
}

export const AvatarWebView = forwardRef<AvatarWebViewRef, AvatarWebViewProps>(
  ({ style, onGestureComplete }, ref) => {
    const webViewRef = useRef<WebView>(null);

    useImperativeHandle(ref, () => ({
      playGesture: (gestureName: string) => {
        if (webViewRef.current) {
          webViewRef.current.injectJavaScript(`
            window.playGesture("${gestureName}");
            true;
          `);
        }
      },
    }));

    const handleMessage = (event: WebViewMessageEvent) => {
      try {
        const data = JSON.parse(event.nativeEvent.data);
        if (data.type === 'gestureComplete' && onGestureComplete) {
          onGestureComplete();
        }
      } catch (error) {
        console.error('Error parsing WebView message:', error);
      }
    };

    // Get the local path to avatar.html
    const htmlAsset = Asset.fromModule(require('../assets/avatar.html'));

    return (
      <View style={[styles.container, style]}>
        <WebView
          ref={webViewRef}
          source={{ uri: htmlAsset.uri }}
          style={styles.webview}
          onMessage={handleMessage}
          containerStyle={{ backgroundColor: 'transparent' }}
          scrollEnabled={false}
          bounces={false}
          javaScriptEnabled={true}
          allowFileAccess={true}
          allowUniversalAccessFromFileURLs={true}
          originWhitelist={['*']}
        />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
}); 