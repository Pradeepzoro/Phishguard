import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Settings, Database, Cloud, Shield, Lock, AlertTriangle, 
  Server, Cpu, Network, CheckCircle 
} from 'lucide-react';

export function SystemArchitecture() {
  return (
    <div className="space-y-6">
      {/* Architecture Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="size-5 text-blue-600" />
            End-to-End System Architecture
          </CardTitle>
          <CardDescription>
            Production-ready phishing detection system design
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Architecture Diagram (Text-based) */}
            <div className="p-6 bg-slate-50 rounded-lg border-2 border-slate-300 font-mono text-sm">
              <pre className="whitespace-pre overflow-x-auto">
{`┌────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                            │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐          │
│  │ Email Client│  │ Web Interface│  │ Browser Plugin│          │
│  └──────┬──────┘  └──────┬───────┘  └───────┬───────┘          │
└─────────┼────────────────┼──────────────────┼──────────────────┘
          │                │                  │
          │        ┌───────▼──────────────────▼────┐
          │        │      API Gateway (REST)       │
          │        │   • Authentication            │
          │        │   • Rate Limiting             │
          │        └───────┬───────────────────────┘
          │                │
┌─────────▼────────────────▼─────────────────────────────────────┐
│                    PROCESSING LAYER                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         NLP Preprocessing Pipeline (BERT)                │  │
│  │  • Tokenization  • BERT Embeddings (512-dim)             │  │
│  │  • Traditional Features  • Contextual Analysis           │  │
│  └───────────────────────┬──────────────────────────────────┘  │
│                          │                                     │
│  ┌───────────────────────▼──────────────────────────────────┐  │
│  │           Machine Learning Layer                         │  │
│  │  ┌──────────┐ ┌────────────┐ ┌─────┐ ┌──────────────┐    │  │
│  │  │Naive     │ │Logistic    │ │ SVM │ │Random        │    │  │
│  │  │Bayes     │ │Regression  │ │     │ │Forest        │    │  │
│  │  └────┬─────┘ └─────┬──────┘ └──┬──┘ └──────┬───────┘    │  │
│  │       └─────────────┴────────────┴────────────┘          │  │
│  │                          │                               │  │
│  │              ┌───────────▼───────────┐                   │  │
│  │              │ Ensemble Aggregator   │                   │  │
│  │              │  • Voting Strategy    │                   │  │
│  │              │  • Confidence Scoring │                   │  │
│  │              └───────────┬───────────┘                   │  │
│  └──────────────────────────┼───────────────────────────────┘  │
└───────────────────────────┼────────────────────────────────────┘
                            │
┌───────────────────────────▼──────────────────────────────────┐
│                      DATA LAYER                              │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐        │
│  │ Email DB    │  │ Model Storage│  │ Analytics DB  │        │
│  │ (PostgreSQL)│  │ (S3/MinIO)   │  │ (TimeSeries)  │        │
│  └─────────────┘  └──────────────┘  └───────────────┘        │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                    MONITORING & SECURITY                     │
│  • Real-time Alerting  • Audit Logs  • Performance Metrics   │
│  • Model Drift Detection  • Threat Intelligence Integration  │
└──────────────────────────────────────────────────────────────┘`}
              </pre>
            </div>

            {/* Component Description */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Server className="size-5 text-blue-600" />
                  <h3 className="font-semibold">API Gateway</h3>
                </div>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• JWT authentication</li>
                  <li>• Rate limiting: 100 req/min</li>
                  <li>• Request validation</li>
                  <li>• SSL/TLS encryption</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Cpu className="size-5 text-green-600" />
                  <h3 className="font-semibold">Processing Pipeline (BERT)</h3>
                </div>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• BERT embeddings (512-dim)</li>
                  <li>• Async task queue</li>
                  <li>• Feature caching</li>
                  <li>• &lt;200ms latency</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Database className="size-5 text-purple-600" />
                  <h3 className="font-semibold">Data Storage</h3>
                </div>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Encrypted at rest</li>
                  <li>• Daily backups</li>
                  <li>• GDPR compliant</li>
                  <li>• Data retention: 90 days</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Network className="size-5 text-orange-600" />
                  <h3 className="font-semibold">Model Serving</h3>
                </div>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Load balancing</li>
                  <li>• Model versioning</li>
                  <li>• A/B testing support</li>
                  <li>• Hot model swapping</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="deployment" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-2xl">
          <TabsTrigger value="deployment">Deployment</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="ethics">Ethics & Privacy</TabsTrigger>
        </TabsList>

        <TabsContent value="deployment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cloud className="size-5 text-blue-600" />
                Production Deployment Strategy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Infrastructure */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Server className="size-4" />
                  Infrastructure Requirements
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg border">
                    <h4 className="font-semibold mb-2 text-blue-900">Web Server</h4>
                    <ul className="text-sm text-slate-700 space-y-1">
                      <li>• Node.js / Python</li>
                      <li>• 4 CPU cores</li>
                      <li>• 8GB RAM</li>
                      <li>• Load balancer</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg border">
                    <h4 className="font-semibold mb-2 text-green-900">ML Service</h4>
                    <ul className="text-sm text-slate-700 space-y-1">
                      <li>• Python 3.9+</li>
                      <li>• 8 CPU cores</li>
                      <li>• 16GB RAM</li>
                      <li>• GPU optional</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg border">
                    <h4 className="font-semibold mb-2 text-purple-900">Database</h4>
                    <ul className="text-sm text-slate-700 space-y-1">
                      <li>• PostgreSQL 14+</li>
                      <li>• 4 CPU cores</li>
                      <li>• 8GB RAM</li>
                      <li>• 100GB SSD</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Tech Stack */}
              <div>
                <h3 className="font-semibold mb-3">Technology Stack</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Backend</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge>Python</Badge>
                      <Badge>FastAPI</Badge>
                      <Badge>scikit-learn</Badge>
                      <Badge>NLTK</Badge>
                      <Badge>spaCy</Badge>
                      <Badge>Redis</Badge>
                      <Badge>Celery</Badge>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Frontend</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">React</Badge>
                      <Badge variant="outline">TypeScript</Badge>
                      <Badge variant="outline">Tailwind CSS</Badge>
                      <Badge variant="outline">Recharts</Badge>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Infrastructure</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">Docker</Badge>
                      <Badge variant="secondary">Kubernetes</Badge>
                      <Badge variant="secondary">AWS/GCP</Badge>
                      <Badge variant="secondary">Terraform</Badge>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Monitoring</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">Prometheus</Badge>
                      <Badge variant="secondary">Grafana</Badge>
                      <Badge variant="secondary">ELK Stack</Badge>
                      <Badge variant="secondary">Sentry</Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Deployment Steps */}
              <div>
                <h3 className="font-semibold mb-3">Deployment Pipeline</h3>
                <div className="space-y-3">
                  {[
                    { step: '1', title: 'Development', items: ['Local testing', 'Unit tests', 'Integration tests', 'Code review'] },
                    { step: '2', title: 'Staging', items: ['Deploy to staging', 'Load testing', 'Security scanning', 'QA validation'] },
                    { step: '3', title: 'Production', items: ['Blue-green deployment', 'Gradual rollout', 'Monitor metrics', 'Rollback ready'] },
                    { step: '4', title: 'Post-Deploy', items: ['Performance monitoring', 'Error tracking', 'User feedback', 'A/B testing'] },
                  ].map((phase) => (
                    <div key={phase.step} className="flex gap-4 p-4 bg-slate-50 rounded-lg">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                        {phase.step}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-2">{phase.title}</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {phase.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                              <CheckCircle className="size-3 text-green-600" />
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="size-5 text-blue-600" />
                Security Architecture & Best Practices
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Security Layers */}
              <div className="space-y-4">
                <div className="p-6 border-l-4 border-blue-500 bg-blue-50">
                  <div className="flex items-start gap-3">
                    <Lock className="size-5 text-blue-600 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-2">Authentication & Authorization</h3>
                      <ul className="text-sm text-slate-700 space-y-1">
                        <li>• JWT tokens with short expiration (15 min access, 7 day refresh)</li>
                        <li>• Role-based access control (RBAC) for admin functions</li>
                        <li>• Multi-factor authentication (MFA) for sensitive operations</li>
                        <li>• OAuth 2.0 integration for enterprise SSO</li>
                        <li>• API key rotation every 90 days</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-6 border-l-4 border-green-500 bg-green-50">
                  <div className="flex items-start gap-3">
                    <Shield className="size-5 text-green-600 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-green-900 mb-2">Data Protection</h3>
                      <ul className="text-sm text-slate-700 space-y-1">
                        <li>• AES-256 encryption for data at rest</li>
                        <li>• TLS 1.3 for data in transit</li>
                        <li>• Database encryption with separate key management service</li>
                        <li>• PII data masking in logs and analytics</li>
                        <li>• Automatic data anonymization after 90 days</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-6 border-l-4 border-orange-500 bg-orange-50">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="size-5 text-orange-600 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-orange-900 mb-2">Threat Protection</h3>
                      <ul className="text-sm text-slate-700 space-y-1">
                        <li>• Rate limiting: 100 requests/min per IP, 1000/hour per user</li>
                        <li>• DDoS protection with CDN (Cloudflare, AWS Shield)</li>
                        <li>• Input validation and sanitization for all endpoints</li>
                        <li>• SQL injection prevention with parameterized queries</li>
                        <li>• XSS protection with Content Security Policy (CSP)</li>
                        <li>• Regular security audits and penetration testing</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-6 border-l-4 border-purple-500 bg-purple-50">
                  <div className="flex items-start gap-3">
                    <Database className="size-5 text-purple-600 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-purple-900 mb-2">Model Security</h3>
                      <ul className="text-sm text-slate-700 space-y-1">
                        <li>• Model versioning and integrity checks (SHA-256 hashes)</li>
                        <li>• Adversarial input detection to prevent model poisoning</li>
                        <li>• Separate model training and inference environments</li>
                        <li>• Access controls for model updates (2-person rule)</li>
                        <li>• Monitoring for model drift and performance degradation</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Checklist */}
              <div>
                <h3 className="font-semibold mb-3">Security Compliance Checklist</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    'GDPR compliance for EU users',
                    'CCPA compliance for California',
                    'SOC 2 Type II certification',
                    'ISO 27001 information security',
                    'Regular vulnerability scanning',
                    'Incident response plan',
                    'Data breach notification process',
                    'Security awareness training',
                    'Third-party security audits',
                    'Disaster recovery plan',
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                      <CheckCircle className="size-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ethics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="size-5 text-blue-600" />
                Ethical Considerations & Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Ethical Principles */}
              <Alert>
                <AlertDescription>
                  <strong>Important:</strong> This system is designed for <strong>defensive</strong> cybersecurity purposes only. 
                  It should never be used to create phishing emails, target individuals, or violate privacy rights.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-3">Privacy by Design</h3>
                  <div className="space-y-2 text-sm text-slate-700">
                    <p><strong>Data Minimization:</strong> Only collect email metadata necessary for analysis. Never store complete email content unless explicitly consented.</p>
                    <p><strong>Purpose Limitation:</strong> Use collected data solely for phishing detection. No secondary use for marketing or profiling.</p>
                    <p><strong>Storage Limitation:</strong> Automatically delete analyzed emails after 90 days unless required for legal compliance.</p>
                    <p><strong>Transparency:</strong> Clear communication about what data is collected, how it's used, and user rights.</p>
                  </div>
                </div>

                <div className="p-6 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-900 mb-3">User Rights (GDPR/CCPA)</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="p-3 bg-white rounded border">
                      <h4 className="font-semibold mb-1">Right to Access</h4>
                      <p className="text-sm text-slate-600">Users can request all data we hold about them</p>
                    </div>
                    <div className="p-3 bg-white rounded border">
                      <h4 className="font-semibold mb-1">Right to Deletion</h4>
                      <p className="text-sm text-slate-600">Users can request complete data deletion</p>
                    </div>
                    <div className="p-3 bg-white rounded border">
                      <h4 className="font-semibold mb-1">Right to Portability</h4>
                      <p className="text-sm text-slate-600">Export data in machine-readable format</p>
                    </div>
                    <div className="p-3 bg-white rounded border">
                      <h4 className="font-semibold mb-1">Right to Rectification</h4>
                      <p className="text-sm text-slate-600">Correct inaccurate personal data</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-orange-50 rounded-lg border border-orange-200">
                  <h3 className="font-semibold text-orange-900 mb-3">Bias & Fairness</h3>
                  <ul className="text-sm text-slate-700 space-y-2">
                    <li className="flex gap-2">
                      <span className="font-semibold">•</span>
                      <span><strong>Language Bias:</strong> Ensure models work equally well across different languages and dialects. Avoid over-optimization for English.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold">•</span>
                      <span><strong>Cultural Sensitivity:</strong> Recognize that communication patterns vary by culture. What seems suspicious in one culture may be normal in another.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold">•</span>
                      <span><strong>False Positive Impact:</strong> Consider the burden of false positives on users. Excessive false alarms lead to alert fatigue and decreased security.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold">•</span>
                      <span><strong>Regular Auditing:</strong> Continuously monitor for biased predictions and adjust training data accordingly.</span>
                    </li>
                  </ul>
                </div>

                <div className="p-6 bg-purple-50 rounded-lg border border-purple-200">
                  <h3 className="font-semibold text-purple-900 mb-3">Responsible AI Practices</h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold mb-1">Explainability</h4>
                      <p className="text-sm text-slate-700">Provide clear explanations for why an email was flagged. Show specific features that triggered detection.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Human Oversight</h4>
                      <p className="text-sm text-slate-700">Never fully automate critical decisions. Always allow human review for high-stakes cases.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Continuous Learning</h4>
                      <p className="text-sm text-slate-700">Implement feedback loops where users can report false positives/negatives to improve the model.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Accountability</h4>
                      <p className="text-sm text-slate-700">Maintain audit trails of all predictions and model versions. Clear ownership and responsibility structure.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Academic Use Notice */}
              <Alert className="border-blue-200 bg-blue-50">
                <AlertDescription>
                  <h4 className="font-semibold mb-2">Academic & Research Use</h4>
                  <p className="text-sm">
                    This system is designed as an educational project for cybersecurity research. When using for academic purposes:
                  </p>
                  <ul className="text-sm mt-2 space-y-1 ml-4">
                    <li>• Obtain IRB approval if testing with real user emails</li>
                    <li>• Use synthetic or publicly available datasets for training</li>
                    <li>• Cite all external libraries and research papers</li>
                    <li>• Share findings responsibly through proper channels</li>
                    <li>• Never use for malicious purposes or unauthorized testing</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}