export function filenameFromContentDisposition(header: string | null) {
  if (!header) return null;

  const match = header.match(/filename="?([^";]+)"?/i);
  return match?.[1] ?? null;
}

export function filenameFromUrl(
  url: string,
  fallbackId: string,
  mimeType: string,
) {
  try {
    const pathname = new URL(url).pathname;
    const lastSegment = pathname.split("/").pop() ?? "";
    const extFromPath = lastSegment.split(".").pop();

    if (extFromPath && extFromPath !== lastSegment) {
      return `lumiforge-${fallbackId}.${extFromPath}`;
    }
  } catch {
    // Ignore malformed URLs and fall back to the MIME type below.
  }

  const extFromMime = mimeType.split("/")[1] ?? "png";
  return `lumiforge-${fallbackId}.${extFromMime}`;
}
