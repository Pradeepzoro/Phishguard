import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Card } from './components/ui/card';
import { Shield, Brain, BarChart3, Settings, FileText, History } from 'lucide-react';
import { RealTimeDetection } from './components/RealTimeDetection';
import { ModelTraining } from './components/ModelTraining';
import { PerformanceAnalysis } from './components/PerformanceAnalysis';
import { SystemArchitecture } from './components/SystemArchitecture';
import { Documentation } from './components/Documentation';
import { DetectionHistory } from './components/DetectionHistory';

export default function App() {
  const [activeTab, setActiveTab] = useState('detection');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg">
              <Shield className="size-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-900">
                PhishGuard
              </h1>
              <p className="text-sm text-slate-600">
                Advanced Phishing Detection System Using NLP & Machine Learning
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-6 w-full max-w-5xl mx-auto">
            <TabsTrigger value="detection" className="flex items-center gap-2">
              <Shield className="size-4" />
              <span className="hidden sm:inline">Detection</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="size-4" />
              <span className="hidden sm:inline">History</span>
            </TabsTrigger>
            <TabsTrigger value="training" className="flex items-center gap-2">
              <Brain className="size-4" />
              <span className="hidden sm:inline">Training</span>
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <BarChart3 className="size-4" />
              <span className="hidden sm:inline">Performance</span>
            </TabsTrigger>
            <TabsTrigger value="architecture" className="flex items-center gap-2">
              <Settings className="size-4" />
              <span className="hidden sm:inline">Architecture</span>
            </TabsTrigger>
            <TabsTrigger value="docs" className="flex items-center gap-2">
              <FileText className="size-4" />
              <span className="hidden sm:inline">Docs</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="detection">
            <RealTimeDetection />
          </TabsContent>

          <TabsContent value="history">
            <DetectionHistory />
          </TabsContent>

          <TabsContent value="training">
            <ModelTraining />
          </TabsContent>

          <TabsContent value="performance">
            <PerformanceAnalysis />
          </TabsContent>

          <TabsContent value="architecture">
            <SystemArchitecture />
          </TabsContent>

          <TabsContent value="docs">
            <Documentation />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="container mx-auto px-6 py-6">
          <p className="text-center text-sm text-slate-600">
            PhishGuard AI - Academic Cybersecurity Project | For Educational Purposes Only
          </p>
        </div>
      </footer>
    </div>
  );
}