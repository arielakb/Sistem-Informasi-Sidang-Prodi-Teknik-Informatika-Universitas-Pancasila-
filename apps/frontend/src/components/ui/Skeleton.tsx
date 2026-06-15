interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 space-y-3">
      <div className="flex justify-between">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <Skeleton className="h-8 w-24" />
      <Skeleton className="h-4 w-32" />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="h-12 bg-gray-50 border-b border-gray-200" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-14 border-b border-gray-100 px-4 flex items-center gap-4">
          <Skeleton className="h-4 w-full" />
        </div>
      ))}
    </div>
  );
}