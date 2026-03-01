import React from 'react';

interface LoadingViewProps {
  text: string;
}

export const LoadingView: React.FC<LoadingViewProps> = ({ text }) => (
  <div className="flex items-center justify-center h-[80vh] w-full">
    <div className="flex flex-col items-center gap-4 animate-in fade-in duration-500">
      <div className="relative">
        <div className="w-10 h-10 border-2 border-primary/20 rounded-full" />
        <div className="absolute top-0 w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
      <span className="text-xs font-semibold text-muted-foreground tracking-widest uppercase">{text}</span>
    </div>
  </div>
);
