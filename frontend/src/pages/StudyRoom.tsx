import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Sparkles,
  BookOpen,
  Lightbulb,
  MessageSquare,
  Send,
} from 'lucide-react';
import { Button, Badge, Skeleton } from '../components/ui';
import { cn } from '../lib/utils';

/* ── AI Modes ── */
const aiModes = [
  { key: 'explain', label: 'Explain Simple', icon: BookOpen },
  { key: 'define', label: 'Define', icon: Sparkles },
  { key: 'example', label: 'Give Example', icon: Lightbulb },
  { key: 'analogy', label: 'Analogy', icon: MessageSquare },
] as const;

type AiMode = (typeof aiModes)[number]['key'];

const StudyRoom: React.FC = () => {
  const navigate = useNavigate();

  const [selectedText] = useState<string | null>(
    'Supervised learning is a type of machine learning where the model is trained on labeled data.'
  );
  const [activeMode, setActiveMode] = useState<AiMode>('explain');
  const [followUpInput, setFollowUpInput] = useState('');
  const [isAiLoading] = useState(false);

  /* Mock AI response */
  const aiResponse = selectedText
    ? `**Supervised learning** is one of the three main types of machine learning (alongside unsupervised and reinforcement learning).

In supervised learning, the algorithm learns from a training dataset that includes both the input data and the correct output (labels). Think of it like learning with a teacher who provides the answers.

**Key characteristics:**
- Requires labeled training data
- The model maps inputs to known outputs
- Common algorithms: Linear Regression, Decision Trees, Neural Networks

**Common applications:**
- Email spam detection
- Image classification
- Medical diagnosis`
    : null;

  return (
    <div className="flex h-[calc(100vh-3.5rem)] bg-background overflow-hidden">
      {/* ── Left: PDF Viewer Panel ── */}
      <div className="flex-1 flex flex-col border-r border-border min-w-0">
        {/* Header */}
        <div className="flex items-center gap-3 h-12 px-4 border-b border-border bg-surface shrink-0">
          <button
            onClick={() => navigate('/')}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-surface-elevated transition-colors duration-200 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-medium text-foreground truncate">
              Introduction to Machine Learning
            </h2>
          </div>
          <Badge variant="outline">Page 12 / 42</Badge>
        </div>

        {/* PDF Content Area */}
        <div className="flex-1 overflow-y-auto p-8 bg-background">
          <div className="max-w-2xl mx-auto bg-surface rounded-xl border border-border shadow-card p-8 md:p-12 min-h-[600px]">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Chapter 3: Supervised Learning
            </h2>
            <div className="space-y-4 text-base text-foreground/80 leading-relaxed">
              <p>
                Machine learning is a subset of artificial intelligence that focuses on
                building systems that learn from data.
              </p>
              <p>
                <span className="bg-primary-light border-b-2 border-primary/40 px-0.5 rounded-sm cursor-pointer">
                  Supervised learning is a type of machine learning where the model is
                  trained on labeled data.
                </span>{' '}
                The algorithm learns to map input features to known output labels during
                the training phase.
              </p>
              <p>
                In contrast, unsupervised learning works with unlabeled data, seeking to
                discover hidden patterns and structures in the dataset without any predefined
                labels to guide the process.
              </p>
              <p>
                Reinforcement learning represents a different paradigm entirely, where agents
                learn through interaction with an environment, receiving rewards or penalties
                for their actions over time.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right: AI Panel ── */}
      <div className="w-full max-w-md flex-col bg-surface hidden md:flex">
        {/* Panel Header */}
        <div className="flex items-center gap-2 h-12 px-4 border-b border-border shrink-0">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">AI Assistant</span>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {selectedText ? (
            <div className="animate-fade-in">
              {/* Selected Text Preview */}
              <div className="px-4 py-3 border-b border-border bg-surface-elevated/50">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
                  Selected Text
                </p>
                <p className="text-sm text-foreground leading-relaxed line-clamp-3">
                  "{selectedText}"
                </p>
              </div>

              {/* Mode Selector */}
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border overflow-x-auto">
                {aiModes.map((mode) => (
                  <button
                    key={mode.key}
                    onClick={() => setActiveMode(mode.key)}
                    className={cn(
                      'flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap',
                      'transition-colors duration-200 cursor-pointer',
                      activeMode === mode.key
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-surface-elevated'
                    )}
                  >
                    <mode.icon className="w-3.5 h-3.5" />
                    {mode.label}
                  </button>
                ))}
              </div>

              {/* AI Response */}
              <div className="px-4 py-4">
                <div className="flex items-center gap-1.5 mb-3">
                  <Badge variant="primary">
                    {aiModes.find((m) => m.key === activeMode)?.label}
                  </Badge>
                </div>

                {isAiLoading ? (
                  <Skeleton lines={8} className="mt-2" />
                ) : aiResponse ? (
                  <div className="prose-sm text-sm text-foreground/80 leading-relaxed animate-fade-in">
                    {aiResponse.split('\n').map((line, i) => {
                      if (line.startsWith('**') && line.endsWith('**')) {
                        return (
                          <h4 key={i} className="font-semibold text-foreground mt-3 mb-1 first:mt-0">
                            {line.replace(/\*\*/g, '')}
                          </h4>
                        );
                      }
                      if (line.startsWith('- ')) {
                        return (
                          <div key={i} className="flex items-start gap-2 ml-1 my-0.5">
                            <span className="w-1 h-1 rounded-full bg-muted-foreground mt-2 shrink-0" />
                            <span>{line.slice(2)}</span>
                          </div>
                        );
                      }
                      if (line.trim() === '') return <div key={i} className="h-2" />;
                      return (
                        <p key={i} className="my-1">
                          {line.split(/(\*\*.*?\*\*)/).map((part, j) =>
                            part.startsWith('**') && part.endsWith('**') ? (
                              <strong key={j} className="font-semibold text-foreground">
                                {part.replace(/\*\*/g, '')}
                              </strong>
                            ) : (
                              part
                            )
                          )}
                        </p>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <div className="w-12 h-12 rounded-2xl bg-surface-elevated flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5 text-muted-foreground" />
              </div>
              <h3 className="text-sm font-medium text-foreground mb-1">
                Select text to get started
              </h3>
              <p className="text-xs text-muted-foreground max-w-[220px]">
                Highlight any text in the document to get AI-powered explanations.
              </p>
            </div>
          )}
        </div>

        {/* Follow-up Input */}
        <div className="border-t border-border px-4 py-3 shrink-0">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask a follow-up question…"
              value={followUpInput}
              onChange={(e) => setFollowUpInput(e.target.value)}
              className={cn(
                'flex-1 h-9 rounded-lg border border-input bg-background px-3',
                'text-sm text-foreground placeholder:text-muted-foreground',
                'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:ring-offset-background',
                'transition-colors duration-200'
              )}
            />
            <Button
              size="sm"
              disabled={!followUpInput.trim()}
              icon={<Send className="w-3.5 h-3.5" />}
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyRoom;
