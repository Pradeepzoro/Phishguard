// NLP Processing Utilities for Phishing Detection

export interface ProcessedText {
  original: string;
  tokens: string[];
  withoutStopwords: string[];
  lemmatized: string[];
  features: TextFeatures;
}

export interface TextFeatures {
  // Basic Features
  length: number;
  wordCount: number;
  uniqueWords: number;
  avgWordLength: number;
  
  // Phishing Indicators
  urgencyWords: number;
  financialTerms: number;
  suspiciousUrls: number;
  emailAddresses: number;
  phoneNumbers: number;
  capitalizedWords: number;
  exclamationMarks: number;
  specialCharacters: number;
  
  // Linguistic Features
  pronounCount: number;
  verbCount: number;
  modalVerbs: number;
  
  // Sentiment Indicators
  positiveWords: number;
  negativeWords: number;
  threatWords: number;
}

// Common stopwords in English
const STOPWORDS = new Set([
  'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 
  'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her',
  'hers', 'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs',
  'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those',
  'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
  'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if',
  'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with',
  'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after',
  'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over',
  'under', 'again', 'further', 'then', 'once'
]);

// Phishing-related keywords
const URGENCY_WORDS = new Set([
  'urgent', 'immediately', 'action required', 'act now', 'limited time',
  'expires', 'deadline', 'hurry', 'quick', 'fast', 'asap', 'now', 'today',
  'within 24 hours', 'suspension', 'suspended', 'locked', 'frozen'
]);

const FINANCIAL_TERMS = new Set([
  'bank', 'account', 'credit', 'card', 'payment', 'paypal', 'transfer',
  'money', 'cash', 'refund', 'verify', 'confirm', 'security', 'password',
  'invoice', 'billing', 'transaction', 'deposit', 'withdraw', 'balance',
  'suspicious activity', 'unauthorized', 'fraud'
]);

const THREAT_WORDS = new Set([
  'suspend', 'close', 'terminate', 'delete', 'remove', 'lose', 'lost',
  'compromised', 'breach', 'hacked', 'stolen', 'unauthorized', 'illegal',
  'penalty', 'fine', 'lawsuit', 'legal action', 'arrest', 'police'
]);

const POSITIVE_WORDS = new Set([
  'congratulations', 'winner', 'won', 'prize', 'reward', 'free', 'bonus',
  'gift', 'lucky', 'selected', 'exclusive', 'guaranteed', 'amazing', 'incredible'
]);

const MODAL_VERBS = new Set([
  'must', 'should', 'need', 'required', 'have to', 'ought to'
]);

// Simple lemmatization rules (basic suffix removal)
const LEMMATIZATION_RULES: [RegExp, string][] = [
  [/ing$/, ''],
  [/ed$/, ''],
  [/ies$/, 'y'],
  [/es$/, ''],
  [/s$/, ''],
  [/ment$/, ''],
  [/ness$/, ''],
  [/ly$/, ''],
];

/**
 * Tokenize text into words
 */
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s@.-]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 0);
}

/**
 * Remove stopwords from tokens
 */
export function removeStopwords(tokens: string[]): string[] {
  return tokens.filter(token => !STOPWORDS.has(token));
}

/**
 * Basic lemmatization
 */
export function lemmatize(tokens: string[]): string[] {
  return tokens.map(token => {
    let lemma = token;
    for (const [pattern, replacement] of LEMMATIZATION_RULES) {
      if (pattern.test(lemma) && lemma.length > 4) {
        lemma = lemma.replace(pattern, replacement);
        break;
      }
    }
    return lemma;
  });
}

/**
 * Extract features from text for ML models
 */
export function extractFeatures(text: string, tokens: string[]): TextFeatures {
  const lowerText = text.toLowerCase();
  const words = tokens;
  const uniqueWords = new Set(words);
  
  // URL pattern
  const urlPattern = /https?:\/\/[^\s]+|www\.[^\s]+/gi;
  const urls = text.match(urlPattern) || [];
  
  // Email pattern
  const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const emails = text.match(emailPattern) || [];
  
  // Phone pattern
  const phonePattern = /(\+\d{1,3}[-.]?)?\(?\d{3}\)?[-.]?\d{3}[-.]?\d{4}/g;
  const phones = text.match(phonePattern) || [];
  
  // Count capitalized words (potential shouting)
  const capitalizedWords = text.match(/\b[A-Z]{2,}\b/g) || [];
  
  // Count special characters
  const specialChars = text.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g) || [];
  
  // Count exclamation marks
  const exclamations = text.match(/!/g) || [];
  
  // Count phishing indicators
  let urgencyCount = 0;
  let financialCount = 0;
  let threatCount = 0;
  let positiveCount = 0;
  let modalCount = 0;
  
  for (const word of words) {
    if (URGENCY_WORDS.has(word)) urgencyCount++;
    if (FINANCIAL_TERMS.has(word)) financialCount++;
    if (THREAT_WORDS.has(word)) threatCount++;
    if (POSITIVE_WORDS.has(word)) positiveCount++;
    if (MODAL_VERBS.has(word)) modalCount++;
  }
  
  // Check for multi-word phrases
  for (const phrase of URGENCY_WORDS) {
    if (phrase.includes(' ') && lowerText.includes(phrase)) {
      urgencyCount++;
    }
  }
  
  for (const phrase of FINANCIAL_TERMS) {
    if (phrase.includes(' ') && lowerText.includes(phrase)) {
      financialCount++;
    }
  }
  
  const avgWordLength = words.length > 0 
    ? words.reduce((sum, word) => sum + word.length, 0) / words.length 
    : 0;
  
  return {
    length: text.length,
    wordCount: words.length,
    uniqueWords: uniqueWords.size,
    avgWordLength,
    urgencyWords: urgencyCount,
    financialTerms: financialCount,
    suspiciousUrls: urls.length,
    emailAddresses: emails.length,
    phoneNumbers: phones.length,
    capitalizedWords: capitalizedWords.length,
    exclamationMarks: exclamations.length,
    specialCharacters: specialChars.length,
    pronounCount: words.filter(w => ['i', 'you', 'we', 'they', 'he', 'she'].includes(w)).length,
    verbCount: 0, // Simplified - would need POS tagging
    modalVerbs: modalCount,
    positiveWords: positiveCount,
    negativeWords: 0, // Simplified
    threatWords: threatCount,
  };
}

/**
 * Complete NLP processing pipeline
 */
export function processText(text: string): ProcessedText {
  const tokens = tokenize(text);
  const withoutStopwords = removeStopwords(tokens);
  const lemmatized = lemmatize(withoutStopwords);
  const features = extractFeatures(text, tokens);
  
  return {
    original: text,
    tokens,
    withoutStopwords,
    lemmatized,
    features,
  };
}

/**
 * Calculate TF-IDF features (simplified version)
 */
export function calculateTFIDF(documents: string[][]): Map<string, number[]> {
  const N = documents.length;
  const tfidf = new Map<string, number[]>();
  
  // Calculate document frequency
  const df = new Map<string, number>();
  for (const doc of documents) {
    const uniqueWords = new Set(doc);
    for (const word of uniqueWords) {
      df.set(word, (df.get(word) || 0) + 1);
    }
  }
  
  // Calculate TF-IDF for each document
  for (let i = 0; i < documents.length; i++) {
    const doc = documents[i];
    const wordCount = new Map<string, number>();
    
    // Calculate term frequency
    for (const word of doc) {
      wordCount.set(word, (wordCount.get(word) || 0) + 1);
    }
    
    // Calculate TF-IDF
    for (const [word, count] of wordCount) {
      const tf = count / doc.length;
      const idf = Math.log(N / (df.get(word) || 1));
      const tfidfScore = tf * idf;
      
      if (!tfidf.has(word)) {
        tfidf.set(word, new Array(N).fill(0));
      }
      tfidf.get(word)![i] = tfidfScore;
    }
  }
  
  return tfidf;
}

/**
 * Convert text features to ML feature vector
 */
export function featuresToVector(features: TextFeatures): number[] {
  return [
    features.length / 1000, // Normalize
    features.wordCount / 100,
    features.uniqueWords / 100,
    features.avgWordLength,
    features.urgencyWords,
    features.financialTerms,
    features.suspiciousUrls,
    features.emailAddresses,
    features.phoneNumbers,
    features.capitalizedWords,
    features.exclamationMarks / 10,
    features.specialCharacters / 10,
    features.pronounCount,
    features.modalVerbs,
    features.positiveWords,
    features.threatWords,
  ];
}
