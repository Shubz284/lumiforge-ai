import { Skeleton } from "@/components/ui/skeleton";

const SettingsSkeleton = () => {
  return (
    <div className="mt-2 ml-9 mr-9 p-2">
      {/* Header */}
      <div className="mb-6 space-y-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-5 w-72" />
      </div>

      {/* Profile */}
      <div className="mb-4 rounded-xl border bg-white p-5">
        <Skeleton className="mb-5 h-5 w-20" />

        <div className="mb-4 flex gap-3">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>

          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        </div>

        <Skeleton className="h-10 w-36 rounded-lg" />
      </div>

      {/* Plan */}
      <div className="mb-4 flex items-center justify-between rounded-xl border bg-white p-5">
        <div className="space-y-2">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-4 w-64" />
        </div>

        <Skeleton className="h-10 w-28 rounded-lg" />
      </div>

      {/* Security */}
      <div className="rounded-xl border bg-white p-5">
        <Skeleton className="mb-5 h-5 w-20" />

        <div className="mb-5 flex items-center justify-between border-b pb-4">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-8 w-32 rounded-full" />
        </div>

        <div className="space-y-4">
          <Skeleton className="h-5 w-40" />

          <div className="flex gap-2">
            <Skeleton className="h-10 flex-1 rounded-lg" />
            <Skeleton className="h-10 flex-1 rounded-lg" />
          </div>

          <Skeleton className="h-10 w-40 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default SettingsSkeleton;
