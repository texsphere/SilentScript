import Constants from 'expo-constants';
import { EncodingType, readAsStringAsync } from 'expo-file-system';
import { HistoryManager } from './HistoryManager';
import { SettingsManager } from './SettingsManager';

// --- Configuration and Constants ---

// Securely get the API key from environment variables via app.config.js
const GOOGLE_CLOUD_API_KEY = Constants.expoConfig?.extra?.googleCloudApiKey;
const GOOGLE_SPEECH_API_URL = `https://speech.googleapis.com/v1/speech:recognize?key=${GOOGLE_CLOUD_API_KEY}`;

// --- Type Definitions ---

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence?: number;
}

interface SpeechRecognitionResult {
  alternatives: SpeechRecognitionAlternative[];
  languageCode?: string;
}

interface SpeechResponse {
  results?: SpeechRecognitionResult[];
  error?: {
    code: number;
    message: string;
    status: string;
  };
}

// --- Helper Functions ---

/**
 * Validates that the API key is available.
 */
const ensureApiKey = () => {
  if (!GOOGLE_CLOUD_API_KEY) {
    const errorMessage = 'Google Cloud API Key is not configured. Please set it up in your .env file and app.config.js';
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Converts audio data (file URI or base64 string) to a pure base64 string.
 * @param audioData - The audio data URI or a data URL string.
 * @returns A promise that resolves to the base64 encoded audio string.
 */
const getBase64Audio = async (audioData: string): Promise<string> => {
  // Check if the input is already a base64 data URL (from web recordings)
  if (audioData.startsWith('data:')) {
    console.log('Processing base64 data URL from web...');
    return audioData.split(',')[1];
  } else {
    console.log('Processing native audio file URI...');
    return await readAsStringAsync(audioData, {
      encoding: EncodingType.Base64,
    });
  }
};

/**
 * Constructs the configuration object for the Google Speech-to-Text API.
 * @param settings - The application's current settings.
 * @returns The recognition config object.
 */
const buildRecognitionConfig = async () => {
  const settings = await SettingsManager.getSettings();
  
  return {
    encoding: 'MP3',  // Changed to MP3 since we're getting M4A files
    sampleRateHertz: 44100,  // Standard rate for high-quality audio
    languageCode: 'ne-NP',
    alternativeLanguageCodes: [],
    enableAutomaticPunctuation: true,
    useEnhanced: true,
    model: 'default',
    metadata: {
      interactionType: 'DICTATION',
      microphoneDistance: 'NEARFIELD',
      recordingDeviceType: 'SMARTPHONE',
      originalMediaType: 'AUDIO',
    },
    speechContexts: [{
      phrases: [
        // Common Nepali phrases to boost recognition accuracy
        'नमस्ते', 'धन्यवाद', 'शुभ प्रभात', 'कस्तो छ', 'ठीक छ',
        'म', 'तिमी', 'हामी', 'तपाईं', 'हो', 'छ', 'के', 'कहाँ', 'किन',
        'आज', 'भोलि', 'हिजो', 'आमा', 'बुवा', 'दाजु', 'भाई', 'दिदी', 'बहिनी',
        'कृपया', 'माफ गर्नुहोस्', 'फेरि भन्नुहोस्',
        // Common loanwords
        'हेलो', 'बाइ', 'थ्याङ्क यु', 'सरी', 'ओके', 'फेसबुक', 'मोबाइल', 'अनलाइन',
        'भिडियो', 'डाउनलोड', 'लाइक', 'कमेन्ट'
      ],
      boost: 20
    }],
    enableWordTimeOffsets: false
  };
};

// --- Main Transcription Function ---

/**
 * Transcribes a given audio file URI to Nepali text using Google Speech-to-Text.
 * @param audioUri - The local URI of the audio file to transcribe.
 * @returns A promise that resolves to the transcribed text, or an empty string on failure.
 */
export const transcribeAudio = async (audioUri: string): Promise<string> => {
  try {
    console.log('Initiating Nepali audio transcription...');
    ensureApiKey();

    const settings = await SettingsManager.getSettings();

    // Offline mode check
    if (settings.offlineMode) {
      // TODO: Implement offline recognition using a local model if available.
      console.log('Offline mode is enabled, but not yet implemented. Cannot transcribe.');
      return '';
    }

    const base64Audio = await getBase64Audio(audioUri);
    const recognitionConfig = await buildRecognitionConfig();

    const requestBody = {
      config: recognitionConfig,
      audio: {
        content: base64Audio,
      },
    };

    console.log('Sending request to Google Speech-to-Text API...');
    const response = await fetch(GOOGLE_SPEECH_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorBody}`);
    }

    const result = await response.json() as SpeechResponse;

    if (result.error) {
      throw new Error(`Google API Error: ${result.error.message} (Status: ${result.error.status})`);
    }

    const transcript = result.results?.[0]?.alternatives?.[0]?.transcript;

    if (transcript) {
      console.log('नेपाली अनुवाद (Nepali Transcription):', transcript);
      if (settings.autoSave) {
        await HistoryManager.saveTranslation(transcript);
      }
      return transcript;
    } else {
      console.warn('कुनै पनि पाठ पहिचान गरिएन। (No text was recognized.)');
      return '';
    }

  } catch (error) {
    if (error instanceof Error) {
      console.error('Error during transcription process:', error.message);
    } else {
      console.error('An unknown error occurred during transcription:', error);
    }
    return ''; // Return an empty string to signify failure, as per the original contract
  }
};

