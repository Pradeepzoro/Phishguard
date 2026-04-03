// BERT-based NLP Processing for Phishing Detection
import * as tf from '@tensorflow/tfjs';
import * as use from '@tensorflow-models/universal-sentence-encoder';

// Initialize TensorFlow.js backend
let backendInitialized = false;

async function initializeTFBackend() {
  if (backendInitialized) return;
  
  try {
    // Set backend to WebGL for better performance, fallback to CPU
    await tf.setBackend('webgl');
    await tf.ready();
    backendInitialized = true;
    console.log('✅ TensorFlow.js backend initialized:', tf.getBackend());
  } catch (error) {
    console.warn('WebGL backend failed, trying CPU backend...', error);
    try {
      await tf.setBackend('cpu');
      await tf.ready();
      backendInitialized = true;
      console.log('✅ TensorFlow.js CPU backend initialized');
    } catch (cpuError) {
      console.error('❌ Failed to initialize TensorFlow.js backend:', cpuError);
      throw new Error('Could not initialize TensorFlow.js. Please refresh the page.');
    }
  }
}

export interface BERTProcessedText {
  original: string;
  tokens: string[];
  embeddings: number[];
  features: BERTFeatures;
  contextualFeatures: ContextualFeatures;
}

export interface BERTFeatures {
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

export interface ContextualFeatures {
  sentenceComplexity: number;
  semanticUrgency: number;
  trustIndicators: number;
  manipulationScore: number;
}

// Global model instance (singleton pattern)
let modelInstance: use.UniversalSentenceEncoder | null = null;
let isModelLoading = false;
let modelLoadPromise: Promise<use.UniversalSentenceEncoder> | null = null;

// Phishing-related keywords (enhanced for BERT context)
const URGENCY_WORDS = new Set([
  'urgent', 'immediately', 'action required', 'act now', 'limited time',
  'expires', 'deadline', 'hurry', 'quick', 'fast', 'asap', 'now', 'today',
  'within 24 hours', 'suspension', 'suspended', 'locked', 'frozen', 'critical',
  'emergency', 'final notice', 'last chance', 'expire', 'expiring'
]);

const FINANCIAL_TERMS = new Set([
  'bank', 'account', 'credit', 'card', 'payment', 'paypal', 'transfer',
  'money', 'cash', 'refund', 'verify', 'confirm', 'security', 'password',
  'invoice', 'billing', 'transaction', 'deposit', 'withdraw', 'balance',
  'suspicious activity', 'unauthorized', 'fraud', 'ssn', 'social security',
  'routing number', 'pin', 'cvv', 'cryptocurrency', 'bitcoin', 'wallet'
]);

const THREAT_WORDS = new Set([
  'suspend', 'close', 'terminate', 'delete', 'remove', 'lose', 'lost',
  'compromised', 'breach', 'hacked', 'stolen', 'unauthorized', 'illegal',
  'penalty', 'fine', 'lawsuit', 'legal action', 'arrest', 'police', 'irs',
  'tax', 'audit', 'prosecution', 'criminal', 'violation'
]);

const POSITIVE_WORDS = new Set([
  'congratulations', 'winner', 'won', 'prize', 'reward', 'free', 'bonus',
  'gift', 'lucky', 'selected', 'exclusive', 'guaranteed', 'amazing', 'incredible',
  'million', 'thousand', 'claim', 'qualify', 'eligible'
]);

const MODAL_VERBS = new Set([
  'must', 'should', 'need', 'required', 'have to', 'ought to', 'will', 'shall'
]);

const TRUST_INDICATORS = new Set([
  'thank you', 'reminder', 'notification', 'update', 'information',
  'scheduled', 'confirmed', 'review', 'statement', 'invoice'
]);

/**
 * Load Universal Sentence Encoder model (BERT-like)
 */
export async function loadBERTModel(): Promise<use.UniversalSentenceEncoder> {
  // Initialize backend first
  await initializeTFBackend();
  
  if (modelInstance) {
    return modelInstance;
  }

  if (isModelLoading && modelLoadPromise) {
    return modelLoadPromise;
  }

  isModelLoading = true;
  modelLoadPromise = use.load();

  try {
    modelInstance = await modelLoadPromise;
    isModelLoading = false;
    console.log('✅ BERT model (Universal Sentence Encoder) loaded successfully');
    return modelInstance;
  } catch (error) {
    isModelLoading = false;
    modelLoadPromise = null;
    console.error('❌ Error loading BERT model:', error);
    throw error;
  }
}

/**
 * Get BERT embeddings for text
 */
export async function getBERTEmbeddings(text: string): Promise<number[]> {
  const model = await loadBERTModel();
  const embeddings = await model.embed([text]);
  const embeddingsArray = await embeddings.array();
  embeddings.dispose(); // Clean up tensors
  return embeddingsArray[0];
}

/**
 * Tokenize text into words (BERT-aware tokenization)
 */
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s@.-]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 0);
}

/**
 * Extract traditional features from text
 */
export function extractFeatures(text: string, tokens: string[]): BERTFeatures {
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
  for (const phrase of [...URGENCY_WORDS, ...FINANCIAL_TERMS]) {
    if (phrase.includes(' ') && lowerText.includes(phrase)) {
      if (URGENCY_WORDS.has(phrase)) urgencyCount++;
      if (FINANCIAL_TERMS.has(phrase)) financialCount++;
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
    verbCount: 0,
    modalVerbs: modalCount,
    positiveWords: positiveCount,
    negativeWords: 0,
    threatWords: threatCount,
  };
}

/**
 * Extract contextual features using BERT embeddings
 */
export function extractContextualFeatures(
  text: string, 
  embeddings: number[],
  features: BERTFeatures
): ContextualFeatures {
  const lowerText = text.toLowerCase();
  
  // Sentence complexity based on structure
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgSentenceLength = sentences.length > 0 
    ? text.length / sentences.length 
    : 0;
  const sentenceComplexity = Math.min(avgSentenceLength / 100, 1);
  
  // Semantic urgency score (combining multiple indicators)
  const semanticUrgency = Math.min(
    (features.urgencyWords * 0.3 + 
     features.exclamationMarks * 0.2 + 
     features.capitalizedWords * 0.15 +
     features.modalVerbs * 0.2 +
     (sentences.length < 3 ? 0.15 : 0)) / 1.0,
    1
  );
  
  // Trust indicators (legitimate email patterns)
  let trustScore = 0;
  for (const indicator of TRUST_INDICATORS) {
    if (lowerText.includes(indicator)) trustScore += 0.15;
  }
  // Penalize for suspicious patterns
  if (features.suspiciousUrls > 0) trustScore -= 0.3;
  if (features.urgencyWords > 2) trustScore -= 0.2;
  const trustIndicators = Math.max(0, Math.min(trustScore, 1));
  
  // Manipulation score (psychological tactics)
  const manipulationScore = Math.min(
    (features.threatWords * 0.25 +
     features.positiveWords * 0.2 +
     features.urgencyWords * 0.25 +
     features.financialTerms * 0.15 +
     (features.suspiciousUrls > 0 ? 0.15 : 0)) / 1.0,
    1
  );
  
  return {
    sentenceComplexity,
    semanticUrgency,
    trustIndicators,
    manipulationScore,
  };
}

/**
 * Complete BERT-based NLP processing pipeline
 */
export async function processBERTText(text: string): Promise<BERTProcessedText> {
  const tokens = tokenize(text);
  const features = extractFeatures(text, tokens);
  
  // Get BERT embeddings
  const embeddings = await getBERTEmbeddings(text);
  
  // Extract contextual features
  const contextualFeatures = extractContextualFeatures(text, embeddings, features);
  
  return {
    original: text,
    tokens,
    embeddings,
    features,
    contextualFeatures,
  };
}

/**
 * Convert BERT features to ML feature vector
 */
export function bertFeaturesToVector(
  embeddings: number[],
  features: BERTFeatures,
  contextual: ContextualFeatures
): number[] {
  // Combine BERT embeddings with traditional features
  // Use a subset of embeddings (first 32 dimensions) to keep vector manageable
  const embeddingSubset = embeddings.slice(0, 32);
  
  const traditionalFeatures = [
    features.length / 1000,
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
  
  const contextualFeaturesArray = [
    contextual.sentenceComplexity,
    contextual.semanticUrgency,
    contextual.trustIndicators,
    contextual.manipulationScore,
  ];
  
  // Combine all features
  return [
    ...embeddingSubset,
    ...traditionalFeatures,
    ...contextualFeaturesArray
  ];
}

/**
 * Batch process multiple texts with BERT
 */
export async function processBERTBatch(texts: string[]): Promise<BERTProcessedText[]> {
  const model = await loadBERTModel();
  
  // Get all embeddings in one batch (more efficient)
  const embeddingsTensor = await model.embed(texts);
  const embeddingsArray = await embeddingsTensor.array();
  embeddingsTensor.dispose();
  
  // Process each text
  const results: BERTProcessedText[] = [];
  for (let i = 0; i < texts.length; i++) {
    const text = texts[i];
    const tokens = tokenize(text);
    const features = extractFeatures(text, tokens);
    const embeddings = embeddingsArray[i];
    const contextualFeatures = extractContextualFeatures(text, embeddings, features);
    
    results.push({
      original: text,
      tokens,
      embeddings,
      features,
      contextualFeatures,
    });
  }
  
  return results;
}

/**
 * Calculate semantic similarity between two texts using BERT
 */
export async function calculateSemanticSimilarity(text1: string, text2: string): Promise<number> {
  const model = await loadBERTModel();
  const embeddings = await model.embed([text1, text2]);
  const embeddingsArray = await embeddings.array();
  
  // Calculate cosine similarity
  const vec1 = embeddingsArray[0];
  const vec2 = embeddingsArray[1];
  
  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;
  
  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i];
    magnitude1 += vec1[i] * vec1[i];
    magnitude2 += vec2[i] * vec2[i];
  }
  
  const similarity = dotProduct / (Math.sqrt(magnitude1) * Math.sqrt(magnitude2));
  embeddings.dispose();
  
  return similarity;
}