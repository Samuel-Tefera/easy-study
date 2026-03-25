import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ResponseRendererProps {
  content: string;
  isTyping?: boolean;
}

export const ResponseRenderer: React.FC<ResponseRendererProps> = ({ content }) => {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none text-[15px] text-foreground/90 leading-relaxed marker:text-primary">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ node, ...props }) => <p className="mb-3 last:mb-0" {...props} />,
          a: ({ node, ...props }) => <a className="text-primary hover:underline font-medium" {...props} />,
          strong: ({ node, ...props }) => <strong className="font-bold text-foreground" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-3 space-y-1" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-3 space-y-1" {...props} />,
          h1: ({ node, ...props }) => <h1 className="text-xl font-bold mt-5 mb-3 text-foreground" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-lg font-bold mt-5 mb-3 text-foreground" {...props} />,
          h3: ({ node, ...props }) => (
            <h3 className="text-base font-bold mt-4 mb-2 text-foreground flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
              {props.children}
            </h3>
          ),
          h4: ({ node, ...props }) => <h4 className="text-base font-bold mt-4 mb-2 text-foreground" {...props} />,
          code: ({ node, inline, className, children, ...props }: any) => {
            return inline ? (
              <code className="bg-muted/80 px-1.5 py-0.5 rounded text-[13px] font-mono text-foreground" {...props}>
                {children}
              </code>
            ) : (
              <code className="block bg-muted/60 p-4 rounded-lg my-4 text-[13px] font-mono overflow-x-auto border border-border text-foreground" {...props}>
                {children}
              </code>
            );
          },
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-primary/50 pl-4 py-1 my-4 bg-muted/30 rounded-r-lg italic text-foreground/80" {...props} />
          )
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
