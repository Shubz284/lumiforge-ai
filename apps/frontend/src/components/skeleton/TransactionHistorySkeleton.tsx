import { Skeleton } from "@/components/ui/skeleton";

const TransactionHistorySkeleton = () => {
  return (
    <div className="p-2 mt-2 ml-9 mr-9">
      {/* Header */}
      <div className="mb-6 space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-5 w-72" />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border bg-white">
        {/* Table Header */}
        <div className="grid grid-cols-5 border-b px-4 py-3">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="ml-auto h-5 w-16" />
        </div>

        {/* Rows */}
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-5 items-center border-b px-4 py-4 last:border-0"
          >
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-16" />
            <Skeleton className="ml-auto h-5 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionHistorySkeleton;
