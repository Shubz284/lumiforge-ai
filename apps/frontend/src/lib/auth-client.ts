import { createAuthClient } from "better-auth/react";
const DEV_API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const API_URL = import.meta.env.PROD ? "" : DEV_API_URL;
export const authClient = createAuthClient({
  baseURL: `${API_URL}/api/auth`, // The base URL of your auth server
});

export const { signIn, signUp, signOut, useSession } = authClient;
