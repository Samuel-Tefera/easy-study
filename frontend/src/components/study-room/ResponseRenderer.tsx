import React from 'react';

interface ResponseRendererProps {
  content: string;
  isTyping?: boolean;
}

export const ResponseRenderer: React.FC<ResponseRendererProps> = ({ content, isTyping }) => {
  return (
    <div className="space-y-3 text-[15px] text-foreground/90 leading-relaxed">
      {content.split('\n').map((line, i) => {
        if (line.startsWith('**') && line.endsWith('**')) {
          return (
            <h4 key={i} className="font-bold text-foreground mt-5 mb-2 first:mt-0 text-base flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
              {line.replace(/\*\*/g, '')}
            </h4>
          );
        }
        if (line.startsWith('- ')) {
          return (
            <div key={i} className="flex items-start gap-3 ml-1 my-1">
              <span className="w-1 h-1 rounded-full bg-primary mt-2.5 shrink-0 opacity-60" />
              <span>
                {line.slice(2).split(/(\*\*.*?\*\*)/).map((part, j) =>
                  part.startsWith('**') && part.endsWith('**') ? (
                    <strong key={j} className="font-bold text-foreground">
                      {part.replace(/\*\*/g, '')}
                    </strong>
                  ) : (
                    part
                  )
                )}
              </span>
            </div>
          );
        }
        if (line.trim() === '') return <div key={i} className="h-2" />;
        return (
          <p key={i} className="my-1">
            {line.split(/(\*\*.*?\*\*)/).map((part, j) =>
              part.startsWith('**') && part.endsWith('**') ? (
                <strong key={j} className="font-bold text-foreground">
                  {part.replace(/\*\*/g, '')}
                </strong>
              ) : (
                part
              )
            )}
          </p>
        );
      })}
      {isTyping && (
        <span className="inline-block w-1.5 h-4 ml-1 bg-primary/40 animate-pulse align-middle" />
      )}
    </div>
  );
};
