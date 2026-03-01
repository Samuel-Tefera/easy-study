import React from 'react';
import { BookOpen, TextQuote, Lightbulb, MessageSquare, Hash, type LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

export const aiActions = [
  { key: 'explain', label: 'Explain Simple', icon: BookOpen },
  { key: 'define', label: 'Define', icon: TextQuote },
  { key: 'example', label: 'Give Example', icon: Lightbulb },
  { key: 'analogy', label: 'Analogy', icon: MessageSquare },
  { key: 'acronym', label: 'Extend Acronym', icon: Hash },
] as const;

export type ActionKey = (typeof aiActions)[number]['key'];

interface FloatingMenuProps {
  x: number;
  y: number;
  onAction: (action: ActionKey) => void;
}

export const FloatingMenu: React.FC<FloatingMenuProps> = ({ x, y, onAction }) => {
  return (
    <div
      className="fixed z-50 animate-in fade-in zoom-in duration-200"
      style={{ left: x, top: y }}
    >
      <div className="flex flex-col gap-1 p-2 bg-surface-overlay/95 border border-border/50 rounded-2xl shadow-modal backdrop-blur-xl min-w-[160px]">
        {aiActions.map((action) => (
          <button
            key={action.key}
            onClick={(e) => {
              e.stopPropagation();
              onAction(action.key);
            }}
            className={cn(
              'group flex items-center justify-start gap-3 w-full p-2 rounded-xl text-xs font-semibold transition-all duration-200',
              'text-muted-foreground hover:text-primary hover:bg-primary/10 active:scale-[0.98] cursor-pointer'
            )}
          >
            <div className="p-1.5 rounded-lg bg-surface-elevated group-hover:bg-primary/20 transition-colors">
              <action.icon className="w-4 h-4" />
            </div>
            <span>{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
