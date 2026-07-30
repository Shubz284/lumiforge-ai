import { Skeleton } from "@/components/ui/skeleton";

const CreditsPageSkeleton = () => {
  return (
    <div className="p-2 mt-2 ml-9 mr-9">
      {/* Header */}
      <div className="mb-6 space-y-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-5 w-80" />
      </div>

      {/* Summary Cards */}
      <div className="mb-6 flex gap-3">
        {/* Current Balance */}
        <div className="flex-1 rounded-xl border bg-white p-5">
          <Skeleton className="mb-3 h-4 w-28" />

          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-24" />
          </div>

          <Skeleton className="mt-5 h-10 w-36 rounded-lg" />
        </div>

        {/* Total Spent */}
        <div className="w-48 rounded-xl border bg-white p-5">
          <Skeleton className="mb-3 h-4 w-24" />
          <Skeleton className="h-8 w-20" />
        </div>

        {/* Images Generated */}
        <div className="w-48 rounded-xl border bg-white p-5">
          <Skeleton className="mb-3 h-4 w-32" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>

      {/* History Header */}
      <div className="mb-3 flex items-center justify-between">
        <Skeleton className="h-6 w-44" />
        <Skeleton className="h-9 w-28 rounded-lg" />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border bg-white">
        {/* Table Header */}
        <div className="grid grid-cols-5 border-b px-4 py-3">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-24" />
          <Skeleton className="ml-auto h-5 w-16" />
          <Skeleton className="ml-auto h-5 w-16" />
          <Skeleton className="ml-auto h-5 w-16" />
        </div>

        {/* Rows */}
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-5 items-center border-b px-4 py-4 last:border-0"
          >
            <Skeleton className="h-7 w-20 rounded-full" />
            <Skeleton className="h-5 w-48" />
            <Skeleton className="ml-auto h-5 w-12" />
            <Skeleton className="ml-auto h-5 w-12" />
            <Skeleton className="ml-auto h-5 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreditsPageSkeleton;
