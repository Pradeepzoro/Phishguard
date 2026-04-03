import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Brain, Play, CheckCircle, Code, Info } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

export function ModelTraining() {
  const [training, setTraining] = useState(false);
  const [progress, setProgress] = useState(0);
  const [trained, setTrained] = useState(false);

  const models = [
    {
      name: 'Naive Bayes',
      description: 'Probabilistic classifier based on Bayes theorem with strong independence assumptions',
      complexity: 'Low',
      trainingTime: 'Fast',
      accuracy: '~85%',
      bestFor: 'Text classification with limited data',
      pros: ['Fast training', 'Works well with small datasets', 'Simple to implement'],
      cons: ['Assumes feature independence', 'May not capture complex patterns'],
    },
    {
      name: 'Logistic Regression',
      description: 'Linear model for binary classification using sigmoid function',
      complexity: 'Low',
      trainingTime: 'Fast',
      accuracy: '~87%',
      bestFor: 'Linear relationships in data',
      pros: ['Interpretable coefficients', 'Fast inference', 'Probability outputs'],
      cons: ['Limited to linear decision boundaries', 'May underfit complex data'],
    },
    {
      name: 'Support Vector Machine (SVM)',
      description: 'Finds optimal hyperplane to separate classes with maximum margin',
      complexity: 'Medium',
      trainingTime: 'Medium',
      accuracy: '~89%',
      bestFor: 'High-dimensional data with clear separation',
      pros: ['Effective in high dimensions', 'Memory efficient', 'Robust to outliers'],
      cons: ['Slower training on large datasets', 'Requires careful parameter tuning'],
    },
    {
      name: 'Random Forest',
      description: 'Ensemble of decision trees using bagging and feature randomness',
      complexity: 'High',
      trainingTime: 'Slow',
      accuracy: '~92%',
      bestFor: 'Complex non-linear patterns',
      pros: ['Handles non-linear patterns', 'Feature importance', 'Robust to overfitting'],
      cons: ['Slower training', 'Larger model size', 'Less interpretable'],
    },
  ];

  const startTraining = async () => {
    setTraining(true);
    setProgress(0);
    
    // Simulate training progress
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setProgress(i);
    }
    
    setTraining(false);
    setTrained(true);
  };

  return (
    <div className="space-y-6">
      {/* Training Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="size-5 text-blue-600" />
            Model Training Pipeline
          </CardTitle>
          <CardDescription>
            Train multiple machine learning models on phishing email dataset
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Info className="size-4" />
            <AlertDescription>
              <strong>Dataset:</strong> 100 emails (50 phishing, 50 legitimate) processed with BERT embeddings. Features include 512-dimensional contextual embeddings, 16 traditional phishing indicators (urgency words, financial terms, URLs), and 4 contextual features (semantic urgency, manipulation score, trust indicators, sentence complexity).
            </AlertDescription>
          </Alert>

          <div className="flex items-center gap-4">
            <Button 
              onClick={startTraining}
              disabled={training}
              size="lg"
            >
              {training ? (
                <>Training Models...</>
              ) : (
                <>
                  <Play className="size-4 mr-2" />
                  Start Training
                </>
              )}
            </Button>

            {trained && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="size-5" />
                <span className="font-medium">Training Complete</span>
              </div>
            )}
          </div>

          {training && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Training Progress</span>
                <span className="font-semibold">{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Model Descriptions */}
      <div className="grid md:grid-cols-2 gap-6">
        {models.map((model, idx) => (
          <Card key={idx} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{model.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {model.description}
                  </CardDescription>
                </div>
                <Badge variant="outline">{model.accuracy}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-600">Complexity</p>
                  <p className="font-semibold">{model.complexity}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-600">Training Time</p>
                  <p className="font-semibold">{model.trainingTime}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-1">Best For:</p>
                <p className="text-sm text-slate-600">{model.bestFor}</p>
              </div>

              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium mb-1 text-green-700">Pros:</p>
                  <ul className="text-sm text-slate-600 space-y-1">
                    {model.pros.map((pro, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1 text-orange-700">Cons:</p>
                  <ul className="text-sm text-slate-600 space-y-1">
                    {model.cons.map((con, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-orange-600 mt-0.5">•</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* NLP Pipeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="size-5 text-blue-600" />
            NLP Preprocessing Pipeline with BERT
          </CardTitle>
          <CardDescription>
            Step-by-step text processing for feature extraction using BERT and traditional NLP
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                step: '1. Tokenization',
                description: 'Split text into individual words and tokens',
                example: 'Input: "URGENT: Account suspended!"\nOutput: ["urgent", "account", "suspended"]',
              },
              {
                step: '2. BERT Embedding Generation',
                description: 'Generate 512-dimensional contextual embeddings using Universal Sentence Encoder',
                example: 'Input: "urgent account suspended"\nOutput: [0.23, -0.45, 0.12, ..., 0.67] (512-dim vector)',
              },
              {
                step: '3. Traditional Feature Extraction',
                description: 'Extract numerical features for phishing indicators',
                example: 'Features: urgency_words=1, financial_terms=1, urls=1, threat_words=1, etc.',
              },
              {
                step: '4. Contextual Feature Analysis',
                description: 'Calculate semantic urgency, manipulation score, and trust indicators using BERT',
                example: 'Contextual: semantic_urgency=0.85, manipulation=0.72, trust=0.15, complexity=0.45',
              },
              {
                step: '5. Feature Vector Combination',
                description: 'Combine BERT embeddings with traditional and contextual features',
                example: 'Output: 52-dimensional feature vector (32 BERT + 16 traditional + 4 contextual)',
              },
            ].map((item, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <h4 className="font-semibold mb-1">{item.step}</h4>
                <p className="text-sm text-slate-600 mb-2">{item.description}</p>
                <div className="p-3 bg-white rounded border border-slate-200">
                  <pre className="text-xs text-slate-700 whitespace-pre-wrap">{item.example}</pre>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Optional Deep Learning */}
      <Card className="border-2 border-blue-200 bg-blue-50/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="size-5 text-blue-600" />
            Deep Learning Models (Advanced)
          </CardTitle>
          <CardDescription>
            Neural network architectures for improved accuracy
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-lg border">
              <h4 className="font-semibold mb-2">LSTM (Long Short-Term Memory)</h4>
              <p className="text-sm text-slate-600 mb-3">
                Recurrent neural network that captures sequential dependencies in text
              </p>
              <ul className="text-sm space-y-1 text-slate-600">
                <li>• Expected accuracy: ~94%</li>
                <li>• Captures word order and context</li>
                <li>• Requires more training data</li>
                <li>• Training time: ~30 minutes</li>
              </ul>
            </div>

            <div className="p-4 bg-white rounded-lg border">
              <h4 className="font-semibold mb-2">BERT (Transformer)</h4>
              <p className="text-sm text-slate-600 mb-3">
                State-of-the-art pre-trained language model with transfer learning
              </p>
              <ul className="text-sm space-y-1 text-slate-600">
                <li>• Expected accuracy: ~96%</li>
                <li>• Understands context bidirectionally</li>
                <li>• Fine-tuning on small datasets</li>
                <li>• Training time: ~1 hour</li>
              </ul>
            </div>
          </div>

          <Alert>
            <Info className="size-4" />
            <AlertDescription>
              Deep learning models require TensorFlow.js or PyTorch for browser implementation. For production deployment, these would be trained on GPU servers and exposed via API.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}