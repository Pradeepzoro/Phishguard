// Machine Learning Models for Phishing Detection

export interface TrainingData {
  features: number[][];
  labels: number[]; // 0 = legitimate, 1 = phishing
}

export interface ModelPrediction {
  prediction: number; // 0 or 1
  confidence: number; // 0 to 1
  probabilities: [number, number]; // [legitimate, phishing]
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  confusionMatrix: [[number, number], [number, number]]; // [[TN, FP], [FN, TP]]
  auc: number;
}

/**
 * Naive Bayes Classifier
 */
export class NaiveBayesClassifier {
  private meansByClass: Map<number, number[]> = new Map();
  private stdByClass: Map<number, number[]> = new Map();
  private priors: Map<number, number> = new Map();
  private featureCount: number = 0;
  
  train(data: TrainingData): void {
    this.featureCount = data.features[0].length;
    const classCounts = new Map<number, number>();
    const classSums = new Map<number, number[]>();
    
    // Calculate sums and counts for each class
    for (let i = 0; i < data.labels.length; i++) {
      const label = data.labels[i];
      const features = data.features[i];
      
      classCounts.set(label, (classCounts.get(label) || 0) + 1);
      
      if (!classSums.has(label)) {
        classSums.set(label, new Array(this.featureCount).fill(0));
      }
      
      const sums = classSums.get(label)!;
      for (let j = 0; j < features.length; j++) {
        sums[j] += features[j];
      }
    }
    
    // Calculate means and priors
    for (const [label, count] of classCounts) {
      const sums = classSums.get(label)!;
      const means = sums.map(sum => sum / count);
      this.meansByClass.set(label, means);
      this.priors.set(label, count / data.labels.length);
    }
    
    // Calculate standard deviations
    for (const [label, count] of classCounts) {
      const means = this.meansByClass.get(label)!;
      const variances = new Array(this.featureCount).fill(0);
      
      for (let i = 0; i < data.labels.length; i++) {
        if (data.labels[i] === label) {
          const features = data.features[i];
          for (let j = 0; j < features.length; j++) {
            const diff = features[j] - means[j];
            variances[j] += diff * diff;
          }
        }
      }
      
      const stds = variances.map(v => Math.sqrt(v / count + 1e-9)); // Add small value to avoid division by zero
      this.stdByClass.set(label, stds);
    }
  }
  
  private gaussianProbability(x: number, mean: number, std: number): number {
    const exponent = Math.exp(-Math.pow(x - mean, 2) / (2 * Math.pow(std, 2)));
    return (1 / (Math.sqrt(2 * Math.PI) * std)) * exponent;
  }
  
  predict(features: number[]): ModelPrediction {
    const scores = new Map<number, number>();
    
    for (const [label, prior] of this.priors) {
      const means = this.meansByClass.get(label)!;
      const stds = this.stdByClass.get(label)!;
      
      let logLikelihood = Math.log(prior);
      for (let i = 0; i < features.length; i++) {
        const prob = this.gaussianProbability(features[i], means[i], stds[i]);
        logLikelihood += Math.log(prob + 1e-9);
      }
      
      scores.set(label, logLikelihood);
    }
    
    // Find class with highest score
    let maxScore = -Infinity;
    let prediction = 0;
    
    for (const [label, score] of scores) {
      if (score > maxScore) {
        maxScore = score;
        prediction = label;
      }
    }
    
    // Convert to probabilities
    const expScores = Array.from(scores.values()).map(s => Math.exp(s));
    const sumExp = expScores.reduce((a, b) => a + b, 0);
    const probabilities = expScores.map(s => s / sumExp) as [number, number];
    
    return {
      prediction,
      confidence: probabilities[prediction],
      probabilities,
    };
  }
}

/**
 * Logistic Regression Classifier
 */
export class LogisticRegressionClassifier {
  private weights: number[] = [];
  private bias: number = 0;
  private learningRate: number = 0.01;
  private iterations: number = 1000;
  
  constructor(learningRate: number = 0.01, iterations: number = 1000) {
    this.learningRate = learningRate;
    this.iterations = iterations;
  }
  
  private sigmoid(z: number): number {
    return 1 / (1 + Math.exp(-z));
  }
  
  train(data: TrainingData): void {
    const n = data.features.length;
    const m = data.features[0].length;
    
    // Initialize weights
    this.weights = new Array(m).fill(0);
    this.bias = 0;
    
    // Gradient descent
    for (let iter = 0; iter < this.iterations; iter++) {
      const gradients = new Array(m).fill(0);
      let biasGradient = 0;
      
      for (let i = 0; i < n; i++) {
        const features = data.features[i];
        const label = data.labels[i];
        
        // Calculate prediction
        let z = this.bias;
        for (let j = 0; j < m; j++) {
          z += this.weights[j] * features[j];
        }
        const prediction = this.sigmoid(z);
        
        // Calculate error
        const error = prediction - label;
        
        // Update gradients
        biasGradient += error;
        for (let j = 0; j < m; j++) {
          gradients[j] += error * features[j];
        }
      }
      
      // Update weights
      this.bias -= this.learningRate * biasGradient / n;
      for (let j = 0; j < m; j++) {
        this.weights[j] -= this.learningRate * gradients[j] / n;
      }
    }
  }
  
  predict(features: number[]): ModelPrediction {
    let z = this.bias;
    for (let i = 0; i < features.length; i++) {
      z += this.weights[i] * features[i];
    }
    
    const phishingProb = this.sigmoid(z);
    const legitimateProb = 1 - phishingProb;
    
    return {
      prediction: phishingProb > 0.5 ? 1 : 0,
      confidence: Math.max(phishingProb, legitimateProb),
      probabilities: [legitimateProb, phishingProb],
    };
  }
}

/**
 * Simple SVM Classifier (Linear Kernel)
 */
export class SVMClassifier {
  private weights: number[] = [];
  private bias: number = 0;
  private learningRate: number = 0.001;
  private lambda: number = 0.01; // Regularization parameter
  private iterations: number = 1000;
  
  constructor(learningRate: number = 0.001, lambda: number = 0.01, iterations: number = 1000) {
    this.learningRate = learningRate;
    this.lambda = lambda;
    this.iterations = iterations;
  }
  
  train(data: TrainingData): void {
    const n = data.features.length;
    const m = data.features[0].length;
    
    // Initialize weights
    this.weights = new Array(m).fill(0);
    this.bias = 0;
    
    // Convert labels to -1 and 1
    const labels = data.labels.map(l => l === 0 ? -1 : 1);
    
    // Gradient descent with hinge loss
    for (let iter = 0; iter < this.iterations; iter++) {
      for (let i = 0; i < n; i++) {
        const features = data.features[i];
        const label = labels[i];
        
        // Calculate prediction
        let z = this.bias;
        for (let j = 0; j < m; j++) {
          z += this.weights[j] * features[j];
        }
        
        // Check if margin condition is satisfied
        if (label * z < 1) {
          // Update weights for misclassified or margin samples
          this.bias += this.learningRate * label;
          for (let j = 0; j < m; j++) {
            this.weights[j] += this.learningRate * (label * features[j] - 2 * this.lambda * this.weights[j]);
          }
        } else {
          // Regularization only
          for (let j = 0; j < m; j++) {
            this.weights[j] += this.learningRate * (-2 * this.lambda * this.weights[j]);
          }
        }
      }
    }
  }
  
  predict(features: number[]): ModelPrediction {
    let z = this.bias;
    for (let i = 0; i < features.length; i++) {
      z += this.weights[i] * features[i];
    }
    
    // Convert decision value to probability-like score
    const phishingProb = 1 / (1 + Math.exp(-z));
    const legitimateProb = 1 - phishingProb;
    
    return {
      prediction: z > 0 ? 1 : 0,
      confidence: Math.abs(z) / 10, // Normalized confidence
      probabilities: [legitimateProb, phishingProb],
    };
  }
}

/**
 * Random Forest Classifier (Simplified)
 */
export class RandomForestClassifier {
  private trees: DecisionTree[] = [];
  private nTrees: number = 10;
  private maxDepth: number = 10;
  
  constructor(nTrees: number = 10, maxDepth: number = 10) {
    this.nTrees = nTrees;
    this.maxDepth = maxDepth;
  }
  
  train(data: TrainingData): void {
    this.trees = [];
    
    for (let i = 0; i < this.nTrees; i++) {
      // Bootstrap sampling
      const bootstrapData = this.bootstrap(data);
      
      // Train decision tree
      const tree = new DecisionTree(this.maxDepth);
      tree.train(bootstrapData);
      this.trees.push(tree);
    }
  }
  
  private bootstrap(data: TrainingData): TrainingData {
    const n = data.features.length;
    const bootstrapFeatures: number[][] = [];
    const bootstrapLabels: number[] = [];
    
    for (let i = 0; i < n; i++) {
      const idx = Math.floor(Math.random() * n);
      bootstrapFeatures.push(data.features[idx]);
      bootstrapLabels.push(data.labels[idx]);
    }
    
    return { features: bootstrapFeatures, labels: bootstrapLabels };
  }
  
  predict(features: number[]): ModelPrediction {
    const predictions = this.trees.map(tree => tree.predict(features));
    
    // Majority voting
    const votes = predictions.reduce((acc, pred) => {
      acc[pred.prediction]++;
      return acc;
    }, [0, 0]);
    
    const prediction = votes[1] > votes[0] ? 1 : 0;
    const confidence = Math.max(...votes) / this.nTrees;
    
    // Average probabilities
    const avgProbs = predictions.reduce((acc, pred) => {
      acc[0] += pred.probabilities[0];
      acc[1] += pred.probabilities[1];
      return acc;
    }, [0, 0]);
    
    const probabilities: [number, number] = [
      avgProbs[0] / this.nTrees,
      avgProbs[1] / this.nTrees
    ];
    
    return { prediction, confidence, probabilities };
  }
}

/**
 * Simple Decision Tree
 */
class DecisionTree {
  private root: TreeNode | null = null;
  private maxDepth: number;
  
  constructor(maxDepth: number = 10) {
    this.maxDepth = maxDepth;
  }
  
  train(data: TrainingData): void {
    this.root = this.buildTree(data.features, data.labels, 0);
  }
  
  private buildTree(features: number[][], labels: number[], depth: number): TreeNode {
    // Check stopping criteria
    if (depth >= this.maxDepth || labels.length === 0 || new Set(labels).size === 1) {
      const counts = [0, 0];
      labels.forEach(l => counts[l]++);
      return {
        isLeaf: true,
        prediction: counts[1] > counts[0] ? 1 : 0,
        probability: counts[1] / labels.length,
      };
    }
    
    // Find best split
    const { featureIdx, threshold, leftIndices, rightIndices } = this.findBestSplit(features, labels);
    
    if (leftIndices.length === 0 || rightIndices.length === 0) {
      const counts = [0, 0];
      labels.forEach(l => counts[l]++);
      return {
        isLeaf: true,
        prediction: counts[1] > counts[0] ? 1 : 0,
        probability: counts[1] / labels.length,
      };
    }
    
    // Split data
    const leftFeatures = leftIndices.map(i => features[i]);
    const leftLabels = leftIndices.map(i => labels[i]);
    const rightFeatures = rightIndices.map(i => features[i]);
    const rightLabels = rightIndices.map(i => labels[i]);
    
    return {
      isLeaf: false,
      featureIdx,
      threshold,
      left: this.buildTree(leftFeatures, leftLabels, depth + 1),
      right: this.buildTree(rightFeatures, rightLabels, depth + 1),
    };
  }
  
  private findBestSplit(features: number[][], labels: number[]) {
    let bestGini = Infinity;
    let bestFeatureIdx = 0;
    let bestThreshold = 0;
    let bestLeftIndices: number[] = [];
    let bestRightIndices: number[] = [];
    
    const nFeatures = features[0].length;
    const nSamples = features.length;
    
    // Try random subset of features
    const featureSubset = Array.from({ length: nFeatures }, (_, i) => i)
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.ceil(Math.sqrt(nFeatures)));
    
    for (const featureIdx of featureSubset) {
      const values = features.map(f => f[featureIdx]);
      const uniqueValues = Array.from(new Set(values)).sort((a, b) => a - b);
      
      for (let i = 0; i < uniqueValues.length - 1; i++) {
        const threshold = (uniqueValues[i] + uniqueValues[i + 1]) / 2;
        
        const leftIndices: number[] = [];
        const rightIndices: number[] = [];
        
        for (let j = 0; j < nSamples; j++) {
          if (features[j][featureIdx] <= threshold) {
            leftIndices.push(j);
          } else {
            rightIndices.push(j);
          }
        }
        
        if (leftIndices.length === 0 || rightIndices.length === 0) continue;
        
        const gini = this.calculateGini(leftIndices, rightIndices, labels);
        
        if (gini < bestGini) {
          bestGini = gini;
          bestFeatureIdx = featureIdx;
          bestThreshold = threshold;
          bestLeftIndices = leftIndices;
          bestRightIndices = rightIndices;
        }
      }
    }
    
    return {
      featureIdx: bestFeatureIdx,
      threshold: bestThreshold,
      leftIndices: bestLeftIndices,
      rightIndices: bestRightIndices,
    };
  }
  
  private calculateGini(leftIndices: number[], rightIndices: number[], labels: number[]): number {
    const n = labels.length;
    const nLeft = leftIndices.length;
    const nRight = rightIndices.length;
    
    const leftCounts = [0, 0];
    const rightCounts = [0, 0];
    
    leftIndices.forEach(i => leftCounts[labels[i]]++);
    rightIndices.forEach(i => rightCounts[labels[i]]++);
    
    const leftGini = 1 - Math.pow(leftCounts[0] / nLeft, 2) - Math.pow(leftCounts[1] / nLeft, 2);
    const rightGini = 1 - Math.pow(rightCounts[0] / nRight, 2) - Math.pow(rightCounts[1] / nRight, 2);
    
    return (nLeft / n) * leftGini + (nRight / n) * rightGini;
  }
  
  predict(features: number[]): ModelPrediction {
    let node = this.root!;
    
    while (!node.isLeaf) {
      if (features[node.featureIdx!] <= node.threshold!) {
        node = node.left!;
      } else {
        node = node.right!;
      }
    }
    
    const phishingProb = node.probability!;
    const legitimateProb = 1 - phishingProb;
    
    return {
      prediction: node.prediction!,
      confidence: Math.max(phishingProb, legitimateProb),
      probabilities: [legitimateProb, phishingProb],
    };
  }
}

interface TreeNode {
  isLeaf: boolean;
  prediction?: number;
  probability?: number;
  featureIdx?: number;
  threshold?: number;
  left?: TreeNode;
  right?: TreeNode;
}

/**
 * Calculate model evaluation metrics
 */
export function calculateMetrics(predictions: number[], actual: number[]): ModelMetrics {
  let tp = 0, tn = 0, fp = 0, fn = 0;
  
  for (let i = 0; i < predictions.length; i++) {
    if (predictions[i] === 1 && actual[i] === 1) tp++;
    else if (predictions[i] === 0 && actual[i] === 0) tn++;
    else if (predictions[i] === 1 && actual[i] === 0) fp++;
    else if (predictions[i] === 0 && actual[i] === 1) fn++;
  }
  
  const accuracy = (tp + tn) / (tp + tn + fp + fn);
  const precision = tp / (tp + fp) || 0;
  const recall = tp / (tp + fn) || 0;
  const f1Score = 2 * (precision * recall) / (precision + recall) || 0;
  
  // Simplified AUC calculation
  const auc = (recall + (tn / (tn + fp))) / 2;
  
  return {
    accuracy,
    precision,
    recall,
    f1Score,
    confusionMatrix: [[tn, fp], [fn, tp]],
    auc,
  };
}
