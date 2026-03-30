import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FileText, Check, Copy } from 'lucide-react';
import { documentService, type DocumentSummary } from '../../services/document.service';
import { Button } from '../ui/Button';
import { LoadingView } from './LoadingView';
import { Skeleton } from '../ui/Skeleton';

interface DocumentSummaryViewProps {
  documentId: string;
}

export const DocumentSummaryView: React.FC<DocumentSummaryViewProps> = ({ documentId }) => {
  const [summary, setSummary] = useState<DocumentSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!documentId) return;

    const fetchOrGenerateSummary = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Try getting the existing summary first
        try {
          const data = await documentService.getSummary(documentId);
          setSummary(data);
        } catch (e: unknown) {
          const err = e as { response?: { status?: number }, status?: number };
          // If not found (404), generate it
          if (err.response?.status === 404 || err.status === 404) {
            const generatedData = await documentService.generateSummary(documentId);
            setSummary(generatedData);
          } else {
            throw e;
          }
        }
      } catch (e: unknown) {
        console.error('Failed to load summary:', e);
        setError('Failed to generate or retrieve the document summary. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (!summary) {
      fetchOrGenerateSummary();
    }
  }, [documentId, summary]);

  const handleCopy = () => {
    if (summary) {
      navigator.clipboard.writeText(summary.summary);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col h-full bg-surface">
      <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-hide">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full space-y-6 animate-in fade-in duration-700">
            <LoadingView text="AI is reading and summarizing your document..." />
            <div className="w-full max-w-sm mt-8 space-y-3 opacity-50">
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-[90%] rounded-md" />
              <Skeleton className="h-4 w-[95%] rounded-md" />
              <Skeleton className="h-4 w-[80%] rounded-md" />
              <Skeleton className="h-4 w-full mt-6 rounded-md" />
              <Skeleton className="h-4 w-[85%] rounded-md" />
              <Skeleton className="h-4 w-[90%] rounded-md" />
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full py-12 text-center animate-fade-in">
            <div className="w-12 h-12 bg-destructive/10 rounded-2xl flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-destructive" />
            </div>
            <p className="text-sm font-medium text-foreground">{error}</p>
          </div>
        ) : summary ? (
          <div className="prose prose-sm md:prose-base prose-invert max-w-none animate-fade-in-up pb-8 selection:bg-primary/30">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {summary.summary}
            </ReactMarkdown>
          </div>
        ) : null}
      </div>

      {/* Footer */}
      {summary && !isLoading && !error && (
        <div className="px-6 py-4 border-t border-border/10 bg-surface/80 backdrop-blur-md shrink-0 flex justify-end">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleCopy}
            icon={isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          >
            {isCopied ? 'Copied to Clipboard' : 'Copy Summary'}
          </Button>
        </div>
      )}
    </div>
  );
};
