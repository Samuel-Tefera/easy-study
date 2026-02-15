import { cn } from '../../lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  lines?: number;
}

const Skeleton: React.FC<SkeletonProps> = ({ className, lines, ...props }) => {
  if (lines) {
    return (
      <div className="flex flex-col gap-2" {...props}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'skeleton h-4',
              i === lines - 1 && 'w-3/4',
              className
            )}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={cn('skeleton', className)} {...props} />
  );
};

const SkeletonCard: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn('rounded-xl border border-border bg-surface p-6 space-y-4', className)} {...props}>
    <div className="skeleton h-5 w-1/2" />
    <div className="skeleton h-3 w-3/4" />
    <div className="skeleton h-3 w-2/3" />
    <div className="flex gap-2 pt-2">
      <div className="skeleton h-5 w-16 rounded-md" />
      <div className="skeleton h-5 w-12 rounded-md" />
    </div>
  </div>
);

export { Skeleton, SkeletonCard };
