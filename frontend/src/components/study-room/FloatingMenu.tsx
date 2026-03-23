import React from 'react';
import { cn } from '../../lib/utils';
import { aiActions, type ActionKey } from './constants';
import { useFloating, shift, flip, offset, autoUpdate } from '@floating-ui/react';

interface FloatingMenuProps {
  virtualElement: any;
  onAction: (action: ActionKey) => void;
}

export const FloatingMenu: React.FC<FloatingMenuProps> = ({ virtualElement, onAction }) => {
  const { refs, floatingStyles } = useFloating({
    placement: 'bottom-start',
    elements: {
      reference: virtualElement,
    },
    middleware: [
      offset(8),
      flip({ fallbackPlacements: ['top-start', 'bottom-end', 'top-end'] }),
      shift({ padding: 16 })
    ],
    whileElementsMounted: autoUpdate,
  });

  if (!virtualElement) return null;

  return (
    <div
      ref={refs.setFloating}
      style={floatingStyles}
      className="fixed z-50 animate-in fade-in zoom-in duration-200"
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

