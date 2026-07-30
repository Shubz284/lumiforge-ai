import { Skeleton } from "@/components/ui/skeleton";

const ImageGallerySkeleton = () => {
  return (
    <div className="mt-2 ml-9 mr-9">
      {/* Page Header */}
      <div className="ml-4 mt-3 space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-5 w-72" />
      </div>

      {/* Image Grid */}
      <div className="m-4 grid grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-xl border bg-white p-4 shadow-sm"
          >
            {/* Image */}
            <Skeleton className="aspect-square w-full rounded-lg" />

            <div className="mt-4 space-y-4">
              {/* Prompt */}
              <div className="space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-2/3" />
              </div>

              {/* Model */}
              <div className="space-y-2">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-4 w-40" />
              </div>

              {/* Date */}
              <Skeleton className="h-4 w-36" />

              {/* Buttons */}
              <div className="flex gap-2 pt-2">
                <Skeleton className="h-10 flex-1 rounded-md" />
                <Skeleton className="h-10 flex-1 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallerySkeleton;
