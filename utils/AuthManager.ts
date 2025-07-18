import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { sendOtpEmail } from './ApiService';

// Keys for storage
const AUTH_KEYS = {
  USER_TOKEN: 'auth_user_token',
  USER_DATA: 'auth_user_data',
  REGISTERED_USERS: 'auth_registered_users',
};

// Default user
const DEFAULT_USER = {
  email: 'thenepsign@gmail.com',
  password: 'speakyourmind',
  name: 'NepSign Admin',
};

// Types
export type User = {
  email: string;
  password: string;
  name: string;
};

export type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
};

type OTPRecord = {
  email: string;
  otp: string;
  expiresAt: number;
};

// Auth Manager class
export class AuthManager {
  private static isInitialized = false;
  private static authState: AuthState = {
    isAuthenticated: false,
    user: null,
    token: null,
  };
  private static otpRecords: Map<string, OTPRecord> = new Map();
  private static authListeners: Set<(state: AuthState) => void> = new Set();

  // Initialize the auth manager
  static async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Check if we have registered users, if not, add the default user
      const registeredUsers = await this.getRegisteredUsers();
      if (registeredUsers.length === 0) {
        await this.addRegisteredUser(DEFAULT_USER);
      }

      // Try to restore session
      await this.restoreSession();
      
      this.isInitialized = true;
      console.log('AuthManager initialized, authenticated:', this.authState.isAuthenticated);
    } catch (error) {
      console.error('Error initializing AuthManager:', error);
    }
  }

  // Register auth state change listener
  static addAuthStateListener(listener: (state: AuthState) => void): void {
    this.authListeners.add(listener);
    // Immediately notify with current state
    listener({ ...this.authState });
  }

  // Remove auth state change listener
  static removeAuthStateListener(listener: (state: AuthState) => void): void {
    this.authListeners.delete(listener);
  }

  // Notify all listeners of auth state change
  private static notifyAuthStateChange(): void {
    this.authListeners.forEach(listener => {
      listener({ ...this.authState });
    });
  }

  // Get current auth state
  static getAuthState(): AuthState {
    return { ...this.authState };
  }

  // Login user
  static async login(email: string, password: string): Promise<boolean> {
    try {
      const users = await this.getRegisteredUsers();
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (!user) {
        return false;
      }

      if (user.password !== password) {
        return false;
      }

      // Generate a token (in a real app, this would be from a server)
      const token = `token_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      
      // Save token securely
      await SecureStore.setItemAsync(AUTH_KEYS.USER_TOKEN, token);
      
      // Save user data (excluding password)
      const userData = { email: user.email, name: user.name };
      await AsyncStorage.setItem(AUTH_KEYS.USER_DATA, JSON.stringify(userData));

      // Update auth state
      this.authState = {
        isAuthenticated: true,
        user: { ...user },
        token,
      };

      this.notifyAuthStateChange();
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }

  // Logout user
  static async logout(): Promise<void> {
    try {
      // Clear token and user data
      await SecureStore.deleteItemAsync(AUTH_KEYS.USER_TOKEN);
      await AsyncStorage.removeItem(AUTH_KEYS.USER_DATA);

      // Update auth state
      this.authState = {
        isAuthenticated: false,
        user: null,
        token: null,
      };

      this.notifyAuthStateChange();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  // Register new user
  static async register(email: string, password: string, name: string): Promise<{ success: boolean; message?: string }> {
    try {
      // Check if email already exists
      const users = await this.getRegisteredUsers();
      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        return { success: false, message: 'An account with this email already exists.' };
      }

      // Generate OTP
      const otp = this.generateOTP();
      
      // Store OTP (expires in 10 minutes)
      this.otpRecords.set(email.toLowerCase(), {
        email: email.toLowerCase(),
        otp,
        expiresAt: Date.now() + 10 * 60 * 1000,
      });

      // Send OTP to email via API service
      const { success, message } = await sendOtpEmail(email, otp);

      if (success) {
        // Store temporary user data
        this.tempUserData = { email, password, name };
        return { success: true };
      } else {
        return { success: false, message: message || 'Failed to send verification email.' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'An unexpected error occurred during registration.' };
    }
  }

  // Store temporary user data during registration
  private static tempUserData: User | null = null;

  // Verify OTP
  static async verifyOTP(email: string, enteredOTP: string): Promise<boolean> {
    try {
      const otpRecord = this.otpRecords.get(email.toLowerCase());
      
      // Check if OTP exists and is valid
      if (!otpRecord) {
        return false;
      }

      // Check if OTP is expired
      if (Date.now() > otpRecord.expiresAt) {
        this.otpRecords.delete(email.toLowerCase());
        return false;
      }

      // Check if OTP matches
      if (otpRecord.otp !== enteredOTP) {
        return false;
      }

      // OTP is valid, complete registration if we have temp user data
      if (this.tempUserData && this.tempUserData.email.toLowerCase() === email.toLowerCase()) {
        const newUser = { ...this.tempUserData };
        await this.addRegisteredUser(newUser);
        this.tempUserData = null;
      }

      // Remove OTP record
      this.otpRecords.delete(email.toLowerCase());
      
      return true;
    } catch (error) {
      console.error('OTP verification error:', error);
      return false;
    }
  }

  // Resend OTP
  static async resendOTP(email: string): Promise<boolean> {
    try {
      // Generate new OTP
      const otp = this.generateOTP();
      
      // Store OTP (expires in 10 minutes)
      this.otpRecords.set(email.toLowerCase(), {
        email: email.toLowerCase(),
        otp,
        expiresAt: Date.now() + 10 * 60 * 1000,
      });

      // Send new OTP to email via API service
      const { success } = await sendOtpEmail(email, otp);
      
      return success;
    } catch (error) {
      console.error('Error resending OTP:', error);
      return false;
    }
  }

  // Generate a 6-digit OTP
  private static generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Get registered users
  private static async getRegisteredUsers(): Promise<User[]> {
    try {
      const usersJSON = await AsyncStorage.getItem(AUTH_KEYS.REGISTERED_USERS);
      return usersJSON ? JSON.parse(usersJSON) : [];
    } catch (error) {
      console.error('Error getting registered users:', error);
      return [];
    }
  }

  // Add a registered user
  private static async addRegisteredUser(user: User): Promise<void> {
    try {
      const users = await this.getRegisteredUsers();
      users.push(user);
      await AsyncStorage.setItem(AUTH_KEYS.REGISTERED_USERS, JSON.stringify(users));
    } catch (error) {
      console.error('Error adding registered user:', error);
    }
  }

  // Restore session from storage
  private static async restoreSession(): Promise<void> {
    try {
      // Get token
      const token = await SecureStore.getItemAsync(AUTH_KEYS.USER_TOKEN);
      if (!token) {
        console.log('No token found, session not restored');
        return;
      }

      // Get user data
      const userDataJSON = await AsyncStorage.getItem(AUTH_KEYS.USER_DATA);
      if (!userDataJSON) {
        console.log('No user data found, session not restored');
        await SecureStore.deleteItemAsync(AUTH_KEYS.USER_TOKEN); // Clean up orphaned token
        return;
      }

      const userData = JSON.parse(userDataJSON);
      
      // Get full user data including password (for our simple implementation)
      const users = await this.getRegisteredUsers();
      const user = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
      
      if (!user) {
        console.log('User not found in registered users, session not restored');
        // Clean up invalid session data
        await SecureStore.deleteItemAsync(AUTH_KEYS.USER_TOKEN);
        await AsyncStorage.removeItem(AUTH_KEYS.USER_DATA);
        return;
      }

      // Update auth state
      this.authState = {
        isAuthenticated: true,
        user,
        token,
      };

      console.log('Session restored successfully for user:', user.email);
      this.notifyAuthStateChange();
    } catch (error) {
      console.error('Error restoring session:', error);
      // Reset auth state on error
      this.authState = {
        isAuthenticated: false,
        user: null,
        token: null,
      };
    }
  }
} 