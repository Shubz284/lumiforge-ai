import { apiFetch } from "@/lib/api";
import { useEffect, useMemo, useState } from "react";

interface ImageModel {
  id: string;
  name: string;
  description?: string;
  supported_resolutions?: string[];
  supported_aspect_ratios?: string[];
  supportsReferences: boolean;
}

interface GeneratedImage {
  id: string;
  storageUrl: string;
  prompt: string;
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
  const [selectedModelId, setSelectedModelId] = useState<string>(DEFAULT_MODEL_ID);
  const [prompt, setPrompt] = useState("");
  const [resolution, setResolution] = useState<string>("");
  const [aspectRatio, setAspectRatio] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentImages, setRecentImages] = useState<GeneratedImage[]>([]);

  const allowedModels = useMemo(
    () => allModels.filter((m) => ALLOWED_MODEL_IDS.includes(m.id)),
    [allModels],
    
  );

  const selectedModel = useMemo(
    () => allowedModels.find((m) => m.id === selectedModelId),
    [allowedModels, selectedModelId],
  );

  useEffect(() => {
    apiFetch("/image/models")
      .then((response) => {
        setAllModels(response.modelLists ?? []);
      })
      .catch((err) => console.error("Failed to load models:", err));
  }, []);

  useEffect(() => {
    if (!selectedModel) return;
    setResolution(selectedModel.supported_resolutions?.[0] ?? "");
    setAspectRatio(selectedModel.supported_aspect_ratios?.[0] ?? "");
  }, [selectedModel]);

  useEffect(() => {
    apiFetch("/images")
      .then((data) => setRecentImages(data.images ?? data))
      .catch((err) => console.error("Failed to load images:", err));
  }, [recentImages]);

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

      console.log("GENERATE RESULT:", result);

      setRecentImages((prev) => [result, ...prev]);
      setPrompt("");
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
  }

  return (
    <div className="border-2 mt-2 ml-9 mr-9 h-full w-auto">
      <div>
        <div className="mt-3 ml-4">
          <h1 className="text-xl font-medium">✨ Create Images</h1>
          <h4 className="mt-1">Bring your imagination to life.</h4>
        </div>
        <div className="mt-3 ml-4 mr-4 p-6 rounded-2xl border bg-white ">
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

          <div className="flex  items-end gap-3 mt-2">
            <select
              className="h-12 w-[35%] cursor-pointer rounded-lg border px-4"
              value={selectedModelId}
              onChange={(e) => setSelectedModelId(e.target.value)}
            >
              {allowedModels.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>

            <select
              className="h-12 cursor-pointer flex-1 rounded-lg border px-4"
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
              className="h-12 cursor-pointer flex-1 rounded-lg border px-4"
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

            <button
              className="h-12 rounded-lg cursor-pointer bg-black px-6 text-white font-semibold disabled:opacity-50"
              onClick={handleGenerate}
              disabled={loading || !selectedModelId}
            >
              {loading ? "Generating..." : "Generate"}
            </button>
          </div>
        </div>

        <div className="flex justify-between mt-3 ml-9 mr-9">
          <span className="text-lg font-medium">Recent Generations</span>
          <span>{recentImages.length} Total</span>
        </div>

        <div className="grid grid-cols-4 gap-3 mt-3 ml-9 mr-9">
          {recentImages.map((img) => (
            <img
              key={img.id}
              src={img.storageUrl}
              alt={img.prompt}
              className="aspect-square object-cover rounded-lg border"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GenerateImages;
