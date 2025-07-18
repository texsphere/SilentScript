/**
 * Maps Nepali phrases to their corresponding sign language gesture names.
 * These gesture names should match the animation names in the Ready Player Me avatar system.
 */
export const gestureMap: Record<string, string> = {
  // Basic Greetings
  'नमस्ते': 'wave',
  'नमस्कार': 'wave',
  'धन्यवाद': 'thank_you',
  
  // Common Phrases
  'मलाई सहयोग चाहियो': 'help_me',
  'कृपया': 'please',
  'माफ गर्नुहोस्': 'sorry',
  'हजुर': 'yes',
  'होइन': 'no',
  
  // Questions
  'कसरी छ?': 'how_are_you',
  'तपाईंको नाम के हो?': 'what_is_your_name',
  'कहाँ जानुहुन्छ?': 'where_are_you_going',
  
  // Basic Needs
  'पानी': 'water',
  'खाना': 'food',
  'सुत्न': 'sleep',
  'बिरामी': 'sick',
  
  // Directions
  'यहाँ': 'here',
  'त्यहाँ': 'there',
  'माथि': 'up',
  'तल': 'down',
  'दायाँ': 'right',
  'बायाँ': 'left',
  
  // Time
  'अहिले': 'now',
  'पछि': 'later',
  'भोलि': 'tomorrow',
  'हिजो': 'yesterday',
  
  // Family
  'परिवार': 'family',
  'आमा': 'mother',
  'बुवा': 'father',
  'दाजुभाई': 'brother',
  'दिदीबहिनी': 'sister',
};

/**
 * Finds the closest matching gesture for a given Nepali phrase.
 * This is a simple implementation that could be enhanced with fuzzy matching
 * or more sophisticated NLP techniques.
 */
export function findMatchingGesture(text: string): string | null {
  // First try exact match
  if (text in gestureMap) {
    return gestureMap[text];
  }

  // Then try to find if the text contains any of the phrases
  for (const [phrase, gesture] of Object.entries(gestureMap)) {
    if (text.includes(phrase)) {
      return gesture;
    }
  }

  // If no match found, return null
  return null;
} 