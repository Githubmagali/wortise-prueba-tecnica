import { createAuthClient } from "better-auth/react";
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient()

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";

export const authClient = createAuthClient({
  baseURL: apiUrl,
});

export const { signIn, signUp, signOut, useSession } = authClient;

export const requestPasswordReset = (authClient as any).requestPasswordReset as (params: {
  email: string
  redirectTo: string
}) => Promise<{ data: unknown; error: { message?: string } | null }>

export const resetPassword = (authClient as any).resetPassword as (params: {
  newPassword: string
  token: string
}) => Promise<{ data: unknown; error: { message?: string } | null }>
