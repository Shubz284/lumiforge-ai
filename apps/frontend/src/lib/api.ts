// src/lib/api.ts
const DEV_API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000/api/v1";
export const API_BASE = import.meta.env.PROD ? "/api/v1" : DEV_API_BASE;

console.log("API_BASE =", API_BASE);

export async function apiFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: "include", // sends the session cookie
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const json = await res.json();

  if (!res.ok) {
    throw { status: res.status, ...json };
  }

  return json.data;
}

export interface ApiError {
  status: number;
  success?: boolean;
  data?: unknown;
  error?: string;
}

export function isApiError(err: unknown): err is ApiError {
  return typeof err === "object" && err !== null && "status" in err;
}
