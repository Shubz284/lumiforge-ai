import GenerateImagesSkeleton from "@/components/skeleton/GenerateImagesSkeleton";
import ImageCard from "@/components/ImageCard";
import ImagePreviewModal from "@/components/ImagePreviewModal";
import { useCredits } from "@/context/CreditsContext";
import { API_BASE, apiFetch } from "@/lib/api";
import {
  filenameFromContentDisposition,
  filenameFromUrl,
} from "@/lib/download";

import { MoveRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface ImageModel {
  id: string;
  name: string;
  description?: string;
  supported_resolutions?: string[];
  supported_aspect_ratios?: string[];
  supportsReferences: boolean;
}

export interface GeneratedImage {
  id: string;
  storageUrl: string;
  prompt: string;
  model: string;
  createdAt: string;
}

const ALLOWED_MODEL_IDS = [
  "sourceful/riverflow-v2.5-fast",
  "bytedance-seed/seedream-4.5",
  "x-ai/grok-imagine-image-quality",
  "recraft/recraft-v4.1-vector",
  "sourceful/riverflow-v2.5-pro",
  "google/gemini-3.1-flash-lite-image",
];

const DEFAULT_MODEL_ID = "sourceful/riverflow-v2.5-fast";

const GenerateImages = () => {
  const [allModels, setAllModels] = useState<ImageModel[]>([]);
  const [selectedModelId, setSelectedModelId] =
    useState<string>(DEFAULT_MODEL_ID);
  const [prompt, setPrompt] = useState("");
  const [resolution, setResolution] = useState<string>("");
  const [aspectRatio, setAspectRatio] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentImages, setRecentImages] = useState<GeneratedImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(
    null,
  );
  const [pageLoading, setPageLoading] = useState(true);
  const { refetchCredits } = useCredits();

  const allowedModels = useMemo(
    () => allModels.filter((m) => ALLOWED_MODEL_IDS.includes(m.id)),
    [allModels],
  );

  const selectedModel = useMemo(
    () => allowedModels.find((m) => m.id === selectedModelId),
    [allowedModels, selectedModelId],
  );

  // useEffect(() => {
  //   apiFetch("/image/models")
  //     .then((response) => {
  //       setAllModels(response.modelLists ?? []);
  //     })
  //     .catch((err) => console.error("Failed to load models:", err));
  // }, []);

  useEffect(() => {
    async function loadPage() {
      try {
        const [modelsResponse, imagesResponse] = await Promise.all([
          apiFetch("/image/models"),
          apiFetch("/images"),
        ]);

        setAllModels(modelsResponse.modelLists ?? []);
        setRecentImages(imagesResponse.images ?? imagesResponse);
      } catch (err) {
        console.error("Failed to load page:", err);
      } finally {
        setPageLoading(false);
      }
    }

    loadPage();
  }, []);

  useEffect(() => {
    if (!selectedModel) return;
    setResolution(selectedModel.supported_resolutions?.[0] ?? "");
    setAspectRatio(selectedModel.supported_aspect_ratios?.[0] ?? "");
  }, [selectedModel]);

  // useEffect(() => {
  //   apiFetch("/images")
  //     .then((data) => setRecentImages(data.images ?? data))
  //     .catch((err) => console.error("Failed to load images:", err));
  // }, []);

  const handleDelete = async (image: GeneratedImage) => {
    try {
      await apiFetch(`/images/${image.id}`, {
        method: "DELETE",
      });

      setRecentImages((prev) => prev.filter((img) => img.id !== image.id));
      toast.success("Image deleted successfully.");
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Unable to delete image.");
    }
  };

  const handleDownload = async (image: GeneratedImage) => {
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

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await apiFetch("/generate-image", {
        method: "POST",
        body: JSON.stringify({
          prompt,
          model: selectedModelId,
          resolution,
          aspectRatio,
        }),
      });


      setRecentImages((prev) => [result, ...prev]);
      setPrompt("");
      // refresh the shared credits value now that a generation just spent some
      await refetchCredits();
    } catch (err: any) {
      if (err.status === 403) {
        setError(err.details ?? "This model requires a paid plan");
      } else if (err.status === 402) {
        setError("Insufficient credits — please buy more to continue");
      } else {
        setError("Generation failed, please try again");
      }
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return <GenerateImagesSkeleton />;
  }

  return (
    <div className="mt-2 mx-3 sm:mx-6 md:ml-9 md:mr-9 h-full w-auto">
      <div>
        <div className="mt-3 ml-1 sm:ml-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            ✨ Create Images
          </h1>
          <h4 className="mt-1 text-sm text-gray-500">
            Bring your imagination to life.
          </h4>
        </div>
        <div className="mt-3 ml-1 mr-1 sm:ml-4 sm:mr-4 p-4 sm:p-6 rounded-2xl border bg-white">
          <div>
            <label className="block text-sm font-medium mb-2">Prompt</label>
            <textarea
              className="w-full min-h-24 rounded-xl border px-4 py-3 outline-none"
              placeholder="Describe the image you want to generate"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

          <div className="flex flex-col sm:flex-row sm:items-end gap-3 mt-2">
            <select
              className="h-12 w-full sm:flex-1 sm:min-w-0 cursor-pointer rounded-lg border px-4"
              value={selectedModelId}
              onChange={(e) => setSelectedModelId(e.target.value)}
            >
              {allowedModels.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>

            <div className="flex gap-3 sm:flex-1">
              <select
                className="h-12 cursor-pointer flex-1 min-w-0 rounded-lg border px-4"
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                disabled={!selectedModel?.supported_resolutions?.length}
              >
                {selectedModel?.supported_resolutions?.map((res) => (
                  <option key={res} value={res}>
                    {res}
                  </option>
                )) ?? <option>Default</option>}
              </select>

              <select
                className="h-12 cursor-pointer flex-1 min-w-0 rounded-lg border px-4"
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                disabled={!selectedModel?.supported_aspect_ratios?.length}
              >
                {selectedModel?.supported_aspect_ratios?.map((ar) => (
                  <option key={ar} value={ar}>
                    {ar}
                  </option>
                )) ?? <option>1:1</option>}
              </select>
            </div>

            <button
              className="h-12 w-full sm:w-auto shrink-0 rounded-lg cursor-pointer bg-black px-6 text-white font-semibold disabled:opacity-50"
              onClick={handleGenerate}
              disabled={loading || !selectedModelId}
            >
              {loading ? "Generating..." : "Generate"}
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center mt-3 ml-1 mr-1 sm:ml-9 sm:mr-9">
          <span className="text-base sm:text-lg font-medium">
            Recent Generations
          </span>
          <Link to="/dashboard/images">
            <span className="relative flex text-sm items-center justify-center">
              View All <MoveRight className="w-4 h-3" />
              <span className="absolute flex left-0.5 -bottom-1 w-3/4 h-0.5 bg-black"></span>
            </span>
          </Link>
        </div>

        <ImagePreviewModal
          image={selectedImage}
          open={!!selectedImage}
          onClose={() => setSelectedImage(null)}
        />

        <div className="grid m-2 sm:m-4 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {recentImages.slice(0, 4).map((img) => (
            <ImageCard
              key={img.id}
              image={img}
              onPreview={setSelectedImage}
              onDownload={handleDownload}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GenerateImages;
