const OPENROUTER_BASE_URL = process.env.OPENROUTER_BASE_URL;

function authHeaders(): Record<string, string> {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error(
      "OPENROUTER_API_KEY is not configured. Set it in the backend .env to generate images.",
    );
  }
  return {
    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
    "Content-Type": "application/json",
  };
}

interface CapabilityDescriptor {
  type?: string;
  values?: string[];
}

export interface MediaModel{
  id: string;
  name: string;
  description?: string;
  supported_resolutions?: string[];
  supported_aspect_ratios?: string[];
  supportsReferences?: boolean;
}

interface RawImageModel {
  id: string;
  name?: string;
  description?: string;
  supported_parameters?: Record<string, CapabilityDescriptor | undefined>;
}

interface ImageRef {
  /** A data URL (data:image/png;base64,...) or a publicly reachable URL. */
  url: string;
}

export interface GenerateImageParams {
  prompt: string;
  model?: string;
  resolution?: string;
  aspectRatio?: string;
  references?: ImageRef[];
}


export interface GeneratedImage {
  buffer: Buffer;
  contentType: string;
  cost?: number;
}

interface ImageGenerationResponse {
  data?: { b64_json?: string; url?: string }[];
  usage?: { cost?: number };
  error?: string | { message?: string };
}

/** Guess an image content type from the leading bytes of the buffer. */
function detectImageContentType(buffer: Buffer): string {
  if (
    buffer.length >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff
  ) {
    return "image/jpeg";
  }
  if (buffer.length >= 12 && buffer.toString("ascii", 8, 12) === "WEBP") {
    return "image/webp";
  }
  return "image/png";
}

// model = "sourceful/riverflow-v2.5-fast";

/** Generate an image synchronously and return the decoded bytes. */
export async function generateImage({
  prompt,
  model, //= "sourceful/riverflow-v2.5-fast",
  resolution,
  aspectRatio
}: GenerateImageParams): Promise<GeneratedImage> {
  const res = await fetch(`${OPENROUTER_BASE_URL}/images`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ model, prompt, resolution, aspectRatio}),
  });
  if (!res.ok) {
    throw new Error(
      `OpenRouter image generation failed: ${res.status} ${await res.text()}`,
    );
  }
  const json = (await res.json()) as ImageGenerationResponse;
  const first = json.data?.[0];

  if (first?.b64_json) {
    const buffer = Buffer.from(first.b64_json, "base64");
    return {
      buffer,
      contentType: detectImageContentType(buffer),
      cost: json.usage?.cost,
    };
  }
  if (first?.url) {
    const imgRes = await fetch(first.url);
    if (!imgRes.ok) {
      throw new Error(`Failed to download generated image: ${imgRes.status}`);
    }
    const buffer = Buffer.from(await imgRes.arrayBuffer());
    return {
      buffer,
      contentType:
        imgRes.headers.get("content-type") ?? detectImageContentType(buffer),
      cost: json.usage?.cost,
    };
  }

  const message =
    typeof json.error === "string"
      ? json.error
      : (json.error?.message ?? "No image returned");
  throw new Error(message);
}


export async function listImageModels(): Promise<MediaModel[]> {
  const res = await fetch(`${process.env.OPENROUTER_BASE_URL}/images/models`, {
    headers: process.env.OPENROUTER_API_KEY
      ? authHeaders()
      : { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    throw new Error(
      `Failed to list image models: ${res.status} ${await res.text()}`,
    );
  }
  const json = (await res.json()) as { data?: RawImageModel[] };
  return (json.data ?? []).map((m) => ({
    id: m.id,
    name: m.name ?? m.id,
    description: m.description,
    supported_resolutions: m.supported_parameters?.resolution?.values,
    supported_aspect_ratios: m.supported_parameters?.aspect_ratio?.values,
    supportsReferences: !!m.supported_parameters?.input_references,
  }));
}



