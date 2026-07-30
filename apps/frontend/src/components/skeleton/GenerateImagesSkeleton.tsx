import { Skeleton } from "@/components/ui/skeleton";

const GenerateImagesSkeleton = () => {
  return (
    <div className="mt-2 ml-9 mr-9">
      {/* Page Header */}
      <div className="mt-3 ml-4 space-y-2">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-5 w-72" />
      </div>

      {/* Prompt Card */}
      <div className="mt-3 ml-4 mr-4 rounded-2xl border bg-white p-6 space-y-5">
        <Skeleton className="h-5 w-20" />

        <Skeleton className="h-28 w-full rounded-xl" />

        <div className="flex gap-3">
          <Skeleton className="h-12 w-[35%] rounded-lg" />

          <Skeleton className="h-12 flex-1 rounded-lg" />

          <Skeleton className="h-12 flex-1 rounded-lg" />

          <Skeleton className="h-12 w-32 rounded-lg" />
        </div>
      </div>

      {/* Recent Header */}
      <div className="flex justify-between mt-6 ml-9 mr-9">
        <Skeleton className="h-7 w-44" />
        <Skeleton className="h-5 w-20" />
      </div>

      {/* Image Grid */}
      <div className="grid m-4 grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl border bg-white overflow-hidden p-4 space-y-4"
          >
            <Skeleton className="aspect-square w-full rounded-lg" />

            <Skeleton className="h-4 w-20" />

            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-2/3" />

            <Skeleton className="h-4 w-24" />

            <Skeleton className="h-4 w-40" />

            <div className="flex gap-2 pt-2">
              <Skeleton className="h-10 flex-1 rounded-lg" />
              <Skeleton className="h-10 flex-1 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GenerateImagesSkeleton;
