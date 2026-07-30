import ImageCard from "@/components/ImageCard";
import { useState } from "react";
import type { GeneratedImage } from "./GenerateImages";
import { API_BASE, apiFetch } from "@/lib/api";
import { toast } from "sonner";
import ImagePreviewModal from "@/components/ImagePreviewModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ImageGallerySkeleton from "@/components/skeleton/ImageGallerySkeleton";
import { ImageOff } from "lucide-react";
import { Link } from "react-router-dom";
import {
  filenameFromContentDisposition,
  filenameFromUrl,
} from "@/lib/download";

// API response
export interface ImageApi {
  id: string;
  userId: string;
  prompt: string;
  model: string;
  resolution: string;
  aspectRatio: string;
  imageKey: string;
  storageUrl: string;
  mediaType: string;
  status: string;
  providerJobId: string | null;
  cost: number;
  creditCost: number;
  error: string | null;
  createdAt: string;
  updatedAt: string;
}

const ImageGallery = () => {
  const queryClient = useQueryClient();
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(
    null,
  );
  const getImages = async () => {
    const result = await apiFetch("/images");
    console.log(result);
    return result;
  };

  const {
    data: images = [],
    isLoading,
    error,
  } = useQuery<ImageApi[], Error, GeneratedImage[]>({
    queryKey: ["images"],
    queryFn: getImages,
    select: (data) =>
      data.map((image) => ({
        id: image.id,
        storageUrl: image.storageUrl,
        prompt: image.prompt,
        model: image.model,
        createdAt: image.createdAt,
      })),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiFetch(`/images/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      toast.success("Image deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ["images"] });
    },
    onError: () => {
      toast.error("Unable to delete image.");
    },
  });

  if (isLoading) {
    return <ImageGallerySkeleton />;
  }

  if (error) return <p>Something went wrong.</p>;

  const handleDelete = (image: GeneratedImage) => {
    deleteMutation.mutate(image.id);
  };

  const handleDownload = async (image: GeneratedImage) => {
    console.log("Hello");
    try {
      const res = await fetch(`${API_BASE}/images/${image.id}/download`, {
        credentials: "include", // sends the session cookie — see note below
      });

      if (!res.ok) {
        throw new Error("Download failed");
      }

      const blob = await res.blob();
      const contentType = res.headers.get("content-type") ?? blob.type;
      if (!contentType.startsWith("image/")) {
        const preview = (await blob.text()).slice(0, 120);
        throw new Error(
          `Unexpected download response: ${contentType || "unknown"} ${preview}`,
        );
      }

      const filename =
        filenameFromContentDisposition(
          res.headers.get("content-disposition"),
        ) ?? filenameFromUrl(image.storageUrl, image.id, contentType);
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Download started.");
    } catch (err) {
      console.error("Download error:", err);
      toast.error("Couldn't download image. Please try again.");
    }
  };

  if (images.length === 0) {
    return (
      <div className="mt-2 ml-9 mr-9 h-full w-auto">
        <div className="flex flex-col items-center justify-center gap-3 py-32 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
            <ImageOff className="h-6 w-6 text-gray-400" strokeWidth={1.75} />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">No images yet</h2>
          <p className="max-w-sm text-sm text-gray-500">
            Everything you generate will show up here. Create your first image
            to get started.
          </p>
          <Link
            to="/dashboard/generate-image"
            className="mt-2 rounded-full bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Generate an image
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="mt-2 ml-9 mr-9 h-full w-auto">
      <div>
        <div className="grid m-4 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {images.map((img) => (
            <ImageCard
              key={img.id}
              image={img}
              onPreview={setSelectedImage}
              onDownload={handleDownload}
              onDelete={handleDelete}
            />
          ))}
        </div>
        <ImagePreviewModal
          image={selectedImage}
          open={!!selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      </div>
    </div>
  );
};

export default ImageGallery;
