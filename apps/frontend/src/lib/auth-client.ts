import { createAuthClient } from "better-auth/react";
const API_URL = import.meta.env.VITE_API_URL || window.location.origin;
export const authClient = createAuthClient({
  baseURL: `${API_URL}/api/auth`, // The base URL of your auth server
});

export const {signIn, signUp, signOut, useSession} = authClient;