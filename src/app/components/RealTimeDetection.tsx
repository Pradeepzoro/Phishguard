import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Shield, AlertTriangle, CheckCircle2, Zap, Brain } from 'lucide-react';
import { processBERTText, bertFeaturesToVector, BERTProcessedText, loadBERTModel } from '../utils/bert-processor';
import { 
  NaiveBayesClassifier, 
  LogisticRegressionClassifier, 
  SVMClassifier, 
  RandomForestClassifier,
  TrainingData,
  ModelPrediction 
} from '../utils/ml-models';
import { getTrainingData } from '../data/training-data';

export function RealTimeDetection() {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [modelStatus, setModelStatus] = useState<'idle' | 'loading' | 'ready'>('idle');

  // Example phishing emails for quick testing
  const examples = {
    phishing: {
      subject: 'URGENT: Your Account Will Be Suspended!',
      body: 'Dear Customer,\n\nYour PayPal account has been suspended due to suspicious activity. You must verify your account within 24 hours or it will be permanently closed.\n\nClick here to verify now: http://paypal-verify-account.com\n\nFailure to act immediately will result in loss of access to your funds.\n\nPayPal Security Team'
    },
    legitimate: {
      subject: 'Your Monthly Newsletter - February 2026',
      body: 'Hello,\n\nThank you for subscribing to our newsletter. Here are this month\'s highlights:\n\n- New product features\n- Customer success stories\n- Upcoming webinars\n\nYou can unsubscribe at any time by clicking the link at the bottom of this email.\n\nBest regards,\nThe Team'
    }
  };

  const loadExample = (type: 'phishing' | 'legitimate') => {
    setSubject(examples[type].subject);
    setBody(examples[type].body);
    setResults(null);
  };

  const analyzeEmail = async () => {
    setIsAnalyzing(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      // Combine subject and body
      const fullText = `${subject}\n${body}`;
      
      // Process text with BERT
      const processed = await processBERTText(fullText);
      
      // Get trained models
      const trainingData = await getTrainingData();
      
      // Train models (in production, these would be pre-trained)
      const nbModel = new NaiveBayesClassifier();
      nbModel.train(trainingData);
      
      const lrModel = new LogisticRegressionClassifier(0.01, 500);
      lrModel.train(trainingData);
      
      const svmModel = new SVMClassifier(0.001, 0.01, 500);
      svmModel.train(trainingData);
      
      const rfModel = new RandomForestClassifier(5, 8);
      rfModel.train(trainingData);
      
      // Convert features to vector
      const featureVector = bertFeaturesToVector(
        processed.embeddings,
        processed.features,
        processed.contextualFeatures
      );
      
      // Make predictions
      const nbPrediction = nbModel.predict(featureVector);
      const lrPrediction = lrModel.predict(featureVector);
      const svmPrediction = svmModel.predict(featureVector);
      const rfPrediction = rfModel.predict(featureVector);
      
      // Ensemble prediction (voting)
      const predictions = [nbPrediction, lrPrediction, svmPrediction, rfPrediction];
      const votes = predictions.reduce((acc, pred) => {
        acc[pred.prediction]++;
        return acc;
      }, [0, 0]);
      
      const ensemblePrediction = votes[1] > votes[0] ? 1 : 0;
      const ensembleConfidence = Math.max(...votes) / 4;
      
      // Calculate average probabilities
      const avgPhishingProb = predictions.reduce((sum, pred) => sum + pred.probabilities[1], 0) / 4;
      
      setResults({
        processed,
        predictions: {
          naiveBayes: nbPrediction,
          logisticRegression: lrPrediction,
          svm: svmPrediction,
          randomForest: rfPrediction,
        },
        ensemble: {
          prediction: ensemblePrediction,
          confidence: ensembleConfidence,
          phishingProbability: avgPhishingProb,
        },
        riskLevel: getRiskLevel(avgPhishingProb),
      });
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRiskLevel = (probability: number): 'low' | 'medium' | 'high' | 'critical' => {
    if (probability < 0.3) return 'low';
    if (probability < 0.6) return 'medium';
    if (probability < 0.8) return 'high';
    return 'critical';
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="size-5 text-blue-600" />
            Real-Time Phishing Detection with BERT
          </CardTitle>
          <CardDescription>
            Analyze emails using BERT embeddings, advanced NLP, and ensemble machine learning models
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Quick Examples */}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => loadExample('phishing')}
            >
              Load Phishing Example
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => loadExample('legitimate')}
            >
              Load Legitimate Example
            </Button>
          </div>

          {/* Input Form */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="subject">Email Subject</Label>
              <Input
                id="subject"
                placeholder="Enter email subject..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="body">Email Body</Label>
              <Textarea
                id="body"
                placeholder="Enter email body text..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={8}
              />
            </div>

            <Button 
              onClick={analyzeEmail}
              disabled={!subject || !body || isAnalyzing}
              className="w-full"
            >
              {isAnalyzing ? (
                <>Analyzing Email...</>
              ) : (
                <>
                  <Shield className="size-4 mr-2" />
                  Analyze Email
                </>
              )}
            </Button>
          </div>

          {/* Results */}
          {results && (
            <div className="space-y-6 pt-6 border-t">
              {/* Overall Result */}
              <Alert className={results.ensemble.prediction === 1 ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
                <div className="flex items-start gap-3">
                  {results.ensemble.prediction === 1 ? (
                    <AlertTriangle className="size-5 text-red-600 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="size-5 text-green-600 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">
                      {results.ensemble.prediction === 1 ? '⚠️ Phishing Detected' : '✓ Email Appears Legitimate'}
                    </h3>
                    <AlertDescription>
                      <div className="space-y-2">
                        <p>
                          Risk Level: <Badge className={getRiskColor(results.riskLevel)}>
                            {results.riskLevel.toUpperCase()}
                          </Badge>
                        </p>
                        <p>
                          Phishing Probability: <span className="font-semibold">
                            {(results.ensemble.phishingProbability * 100).toFixed(1)}%
                          </span>
                        </p>
                        <p>
                          Ensemble Confidence: <span className="font-semibold">
                            {(results.ensemble.confidence * 100).toFixed(1)}%
                          </span>
                        </p>
                      </div>
                    </AlertDescription>
                  </div>
                </div>
              </Alert>

              {/* Detailed Results */}
              <Tabs defaultValue="models" className="w-full">
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="models">Model Predictions</TabsTrigger>
                  <TabsTrigger value="features">NLP Features</TabsTrigger>
                  <TabsTrigger value="indicators">Risk Indicators</TabsTrigger>
                </TabsList>

                <TabsContent value="models" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Individual Model Results</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {Object.entries(results.predictions).map(([model, prediction]) => (
                        <div key={model} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div>
                            <p className="font-medium capitalize">{model.replace(/([A-Z])/g, ' $1').trim()}</p>
                            <p className="text-sm text-slate-600">
                              Prediction: {prediction.prediction === 1 ? 'Phishing' : 'Legitimate'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold">
                              {(prediction.probabilities[1] * 100).toFixed(1)}%
                            </p>
                            <p className="text-xs text-slate-600">phishing</p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="features" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">NLP Processing Results</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-slate-50 rounded-lg">
                          <p className="text-sm text-slate-600">Total Words</p>
                          <p className="text-2xl font-semibold">{results.processed.features.wordCount}</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-lg">
                          <p className="text-sm text-slate-600">Unique Words</p>
                          <p className="text-2xl font-semibold">{results.processed.features.uniqueWords}</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-lg">
                          <p className="text-sm text-slate-600">Avg Word Length</p>
                          <p className="text-2xl font-semibold">{results.processed.features.avgWordLength.toFixed(1)}</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-lg">
                          <p className="text-sm text-slate-600">Text Length</p>
                          <p className="text-2xl font-semibold">{results.processed.features.length}</p>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <p className="text-sm font-medium mb-2">Processing Steps:</p>
                        <ul className="space-y-2 text-sm text-slate-600">
                          <li>✓ BERT Embeddings: {results.processed.embeddings.length}-dimensional vector generated</li>
                          <li>✓ Tokenization: {results.processed.tokens.length} tokens extracted</li>
                          <li>✓ Traditional Feature Extraction: 16 phishing indicators extracted</li>
                          <li>✓ Contextual Analysis: Semantic urgency, trust indicators, manipulation score</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="indicators" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Phishing Risk Indicators</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <IndicatorRow 
                          label="Urgency Words"
                          value={results.processed.features.urgencyWords}
                          risk={results.processed.features.urgencyWords > 2}
                        />
                        <IndicatorRow 
                          label="Financial Terms"
                          value={results.processed.features.financialTerms}
                          risk={results.processed.features.financialTerms > 3}
                        />
                        <IndicatorRow 
                          label="Threat Words"
                          value={results.processed.features.threatWords}
                          risk={results.processed.features.threatWords > 1}
                        />
                        <IndicatorRow 
                          label="Suspicious URLs"
                          value={results.processed.features.suspiciousUrls}
                          risk={results.processed.features.suspiciousUrls > 0}
                        />
                        <IndicatorRow 
                          label="Exclamation Marks"
                          value={results.processed.features.exclamationMarks}
                          risk={results.processed.features.exclamationMarks > 2}
                        />
                        <IndicatorRow 
                          label="ALL CAPS Words"
                          value={results.processed.features.capitalizedWords}
                          risk={results.processed.features.capitalizedWords > 3}
                        />
                        <IndicatorRow 
                          label="Modal Verbs (must, should)"
                          value={results.processed.features.modalVerbs}
                          risk={results.processed.features.modalVerbs > 2}
                        />
                      </div>
                      
                      <div className="mt-6 pt-6 border-t">
                        <h4 className="font-medium mb-3">BERT Contextual Analysis</h4>
                        <div className="space-y-3">
                          <ContextualIndicatorRow 
                            label="Semantic Urgency"
                            value={results.processed.contextualFeatures.semanticUrgency}
                            risk={results.processed.contextualFeatures.semanticUrgency > 0.5}
                          />
                          <ContextualIndicatorRow 
                            label="Manipulation Score"
                            value={results.processed.contextualFeatures.manipulationScore}
                            risk={results.processed.contextualFeatures.manipulationScore > 0.5}
                          />
                          <ContextualIndicatorRow 
                            label="Trust Indicators"
                            value={results.processed.contextualFeatures.trustIndicators}
                            risk={results.processed.contextualFeatures.trustIndicators < 0.3}
                            inverse
                          />
                          <ContextualIndicatorRow 
                            label="Sentence Complexity"
                            value={results.processed.contextualFeatures.sentenceComplexity}
                            risk={false}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface AnalysisResults {
  processed: BERTProcessedText;
  predictions: {
    naiveBayes: ModelPrediction;
    logisticRegression: ModelPrediction;
    svm: ModelPrediction;
    randomForest: ModelPrediction;
  };
  ensemble: {
    prediction: number;
    confidence: number;
    phishingProbability: number;
  };
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

function IndicatorRow({ label, value, risk }: { label: string; value: number; risk: boolean }) {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
      <span className="text-sm">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-semibold">{value}</span>
        {risk && (
          <Badge variant="destructive" className="text-xs">
            Risk
          </Badge>
        )}
      </div>
    </div>
  );
}

function ContextualIndicatorRow({ label, value, risk, inverse }: { label: string; value: number; risk: boolean; inverse?: boolean }) {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
      <span className="text-sm">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-semibold">{value.toFixed(2)}</span>
        {risk && (
          <Badge variant="destructive" className="text-xs">
            {inverse ? 'Low' : 'High'}
          </Badge>
        )}
      </div>
    </div>
  );
}