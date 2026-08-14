import { createAuthClient } from "better-auth/react";
const DEV_API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const API_URL = import.meta.env.PROD ? window.location.origin : DEV_API_URL;
export const authClient = createAuthClient({
  baseURL: `${API_URL}/api/auth`,
});

export const { signIn, signUp, signOut, useSession } = authClient;
