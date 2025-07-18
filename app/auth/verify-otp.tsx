import { IconSymbol } from '@/components/ui/IconSymbol';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Vibration,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthManager } from '../../utils/AuthManager';

const { width } = Dimensions.get('window');
const OTP_CELL_COUNT = 6;
const CELL_SIZE = Math.min(45, (width - 100) / OTP_CELL_COUNT);
const CELL_SPACING = (width - 100 - (CELL_SIZE * OTP_CELL_COUNT)) / (OTP_CELL_COUNT - 1);

export default function VerifyOTPScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const cursorAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!email) {
      Alert.alert('Error', 'Email is required for verification');
      router.replace('/auth/register');
    }
    
    setTimeout(() => {
      inputRef.current?.focus();
    }, 500);
  }, [email]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setIsFocused(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setIsFocused(false)
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  // Blinking cursor animation
  useEffect(() => {
    if (isFocused) {
      const blinkAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(cursorAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: false,
          }),
          Animated.timing(cursorAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false,
          }),
        ])
      );
      blinkAnimation.start();
      return () => blinkAnimation.stop();
    }
  }, [isFocused, cursorAnim]);

  // Countdown timer for resending OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown]);

  // Animation for new digit entered
  useEffect(() => {
    if (otp.length > 0) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
      
      // Provide haptic feedback when a digit is entered
      if (Platform.OS !== 'web') {
        Vibration.vibrate(10);
      }
    }
  }, [otp.length]);

  const handleOtpChange = (text: string) => {
    const sanitizedText = text.replace(/[^0-9]/g, '').slice(0, OTP_CELL_COUNT);
    setOtp(sanitizedText);
    
    if (sanitizedText.length === OTP_CELL_COUNT) {
      Keyboard.dismiss();
      handleVerifyOTP(sanitizedText);
    }
  };

  const focusInput = () => {
    inputRef.current?.focus();
    setIsFocused(true);
  };

  const handleVerifyOTP = async (code: string) => {
    if (!code.trim() || code.length !== OTP_CELL_COUNT) {
      Alert.alert('Error', `Please enter a valid ${OTP_CELL_COUNT}-digit OTP`);
      return;
    }

    Keyboard.dismiss();
    setIsLoading(true);
    try {
      const success = await AuthManager.verifyOTP(email as string, code);
      if (success) {
        Alert.alert(
          'Success',
          'Email verified successfully. Please login with your credentials.',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/auth/login'),
            },
          ]
        );
      } else {
        Alert.alert('Verification Failed', 'Invalid or expired OTP. Please try again.');
        setOtp('');
        setTimeout(() => focusInput(), 500);
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred during verification');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    setIsLoading(true);
    try {
      const success = await AuthManager.resendOTP(email as string);
      if (success) {
        setCountdown(60);
        setCanResend(false);
        Alert.alert('OTP Resent', 'A new verification code has been sent to your email.');
        setOtp('');
        setTimeout(() => focusInput(), 500);
      } else {
        Alert.alert('Error', 'Failed to resend OTP. Please try again later.');
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
      Alert.alert('Error', 'An unexpected error occurred while resending OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderOtpCells = () => {
    return Array.from({ length: OTP_CELL_COUNT }).map((_, i) => {
      const isCurrent = i === otp.length;
      const isFilled = i < otp.length;
      const isLastEntered = i === otp.length - 1 && isFilled;
      
      return (
        <Animated.View
          key={i}
          style={[
            styles.otpCell,
            isFilled && styles.otpCellFilled,
            isFocused && isCurrent && styles.otpCellFocused,
            isLastEntered && { transform: [{ scale: scaleAnim }] }
          ]}
        >
          <Text style={styles.otpDigit}>{otp[i] || ''}</Text>
          {isFocused && isCurrent && (
            <Animated.View style={[styles.cursor, { opacity: cursorAnim }]} />
          )}
        </Animated.View>
      );
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#6a11cb', '#2575fc']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.background}
      />
      
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <TouchableOpacity 
          style={styles.content} 
          activeOpacity={1} 
          onPress={focusInput}
        >
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/images/nepSign_logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <BlurView intensity={20} tint="light" style={styles.formContainer}>
            <View style={styles.headerIconContainer}>
              <IconSymbol name="envelope.badge.fill" size={30} color="#ffffff" />
            </View>
            
            <Text style={styles.title}>Verify Your Email</Text>
            
            <Text style={styles.description}>
              We've sent a verification code to{' '}
              <Text style={styles.emailText}>{email}</Text>
            </Text>

            <View style={styles.otpInputContainer}>
              <TextInput
                ref={inputRef}
                style={styles.otpTextInput}
                value={otp}
                onChangeText={handleOtpChange}
                keyboardType="number-pad"
                maxLength={OTP_CELL_COUNT}
                autoFocus
                caretHidden
              />
              <View style={styles.otpCellsContainer} pointerEvents="none">
                {renderOtpCells()}
              </View>
            </View>
            
            <Text style={styles.instruction}>
              Enter the 6-digit code sent to your email
            </Text>

            <TouchableOpacity
              style={[
                styles.verifyButton,
                { opacity: otp.length === OTP_CELL_COUNT ? 1 : 0.7 }
              ]}
              onPress={() => handleVerifyOTP(otp)}
              disabled={isLoading || otp.length !== OTP_CELL_COUNT}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.verifyButtonText}>Verify</Text>
              )}
            </TouchableOpacity>

            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>Didn't receive the code?</Text>
              <TouchableOpacity
                onPress={handleResendOTP}
                disabled={!canResend || isLoading}
              >
                <Text
                  style={[
                    styles.resendLink,
                    (!canResend || isLoading) && styles.resendLinkDisabled,
                  ]}
                >
                  {canResend ? 'Resend Code' : `Resend in ${countdown}s`}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <IconSymbol name="arrow.left" size={18} color="#ffffff" style={styles.backIcon} />
              <Text style={styles.backButtonText}>Back to Registration</Text>
            </TouchableOpacity>
          </BlurView>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  formContainer: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    padding: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
  },
  headerIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#ffffff',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 25,
    textAlign: 'center',
    lineHeight: 22,
  },
  emailText: {
    fontWeight: '600',
    color: '#ffffff',
  },
  otpInputContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 25,
    position: 'relative',
    paddingHorizontal: 5,
  },
  otpTextInput: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    color: 'transparent',
    fontSize: 18,
    textAlign: 'center',
    letterSpacing: CELL_SPACING + CELL_SIZE/2 - 9, // This needs careful tuning
    zIndex: 1,
  },
  otpCellsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 10,
  },
  otpCell: {
    width: CELL_SIZE,
    height: CELL_SIZE * 1.2,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: CELL_SPACING / 2,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  otpCellFilled: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderColor: 'rgba(106, 17, 203, 0.5)',
  },
  otpCellFocused: {
    borderColor: '#6a11cb',
  },
  otpDigit: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  cursor: {
    position: 'absolute',
    height: 20,
    width: 2,
    backgroundColor: '#6a11cb',
    borderRadius: 1,
  },
  instruction: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 10,
    textAlign: 'center',
    fontStyle: 'italic',
    letterSpacing: 0.3,
  },
  verifyButton: {
    backgroundColor: '#6a11cb',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  resendText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
  },
  resendLink: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 5,
  },
  resendLinkDisabled: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    paddingVertical: 10,
  },
  backIcon: {
    marginRight: 8,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
}); 