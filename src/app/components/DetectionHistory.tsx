import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { History, AlertTriangle, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

interface DetectionRecord {
  subject: string;
  body: string;
  prediction: number;
  confidence: number;
  riskLevel: string;
  explanation: string;
  timestamp: string;
}

export function DetectionHistory() {
  const [history, setHistory] = useState<Array<{ key: string; value: DetectionRecord }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-102449ef/detection-history`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch detection history');
      }

      const data = await response.json();
      // Sort by timestamp descending (newest first)
      const sortedHistory = (data.history || []).sort((a: any, b: any) => {
        return new Date(b.value.timestamp).getTime() - new Date(a.value.timestamp).getTime();
      });
      setHistory(sortedHistory);
    } catch (err) {
      console.error('Error fetching history:', err);
      setError('Failed to load detection history');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <History className="size-5 text-blue-600" />
                Detection History
              </CardTitle>
              <CardDescription>
                View all past email analyses and AI explanations
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchHistory}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <RefreshCw className="size-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
              {error}
            </div>
          )}

          {!error && history.length === 0 && !isLoading && (
            <div className="text-center py-12 text-slate-500">
              <History className="size-12 mx-auto mb-4 opacity-50" />
              <p>No detection history yet</p>
              <p className="text-sm mt-2">Analyzed emails will appear here</p>
            </div>
          )}

          {!error && history.length > 0 && (
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-4">
                {history.map((record) => (
                  <Card key={record.key} className="border-slate-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          {record.value.prediction === 1 ? (
                            <AlertTriangle className="size-5 text-red-600 mt-0.5 flex-shrink-0" />
                          ) : (
                            <CheckCircle2 className="size-5 text-green-600 mt-0.5 flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm truncate">
                              {record.value.subject}
                            </h4>
                            <p className="text-xs text-slate-500 mt-1">
                              {formatTimestamp(record.value.timestamp)}
                            </p>
                          </div>
                        </div>
                        <Badge className={getRiskColor(record.value.riskLevel)}>
                          {record.value.riskLevel.toUpperCase()}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-3">
                      <div className="text-sm text-slate-600 line-clamp-2 bg-slate-50 p-3 rounded">
                        {record.value.body}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="p-2 bg-slate-50 rounded">
                          <span className="text-slate-600">Classification:</span>
                          <span className="ml-2 font-semibold">
                            {record.value.prediction === 1 ? 'Phishing' : 'Legitimate'}
                          </span>
                        </div>
                        <div className="p-2 bg-slate-50 rounded">
                          <span className="text-slate-600">Confidence:</span>
                          <span className="ml-2 font-semibold">
                            {(record.value.confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>

                      {record.value.explanation && (
                        <details className="group">
                          <summary className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-700">
                            View AI Explanation
                          </summary>
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg text-sm text-slate-700 whitespace-pre-line border border-blue-200">
                            {record.value.explanation}
                          </div>
                        </details>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
