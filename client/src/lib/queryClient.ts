import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { buildApiUrl } from "./api-config";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // Construire l'URL complète si ce n'est pas déjà fait
  const fullUrl = url.startsWith('http') ? url : buildApiUrl(url);
  
  const res = await fetch(fullUrl, {
    method,
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...data ? {} : {}
    },
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Construire l'URL complète
    const endpoint = queryKey[0] as string;
    const fullUrl = endpoint.startsWith('http') ? endpoint : buildApiUrl(endpoint);
    
    const res = await fetch(fullUrl, {
      credentials: "include",
      headers: {
        "Accept": "application/json",
      }
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes - données médicales peuvent changer
      retry: (failureCount, error: any) => {
        // Ne pas retry sur les erreurs d'authentification
        if (error?.status === 401 || error?.status === 403) {
          return false;
        }
        // Retry jusqu'à 2 fois pour les autres erreurs
        return failureCount < 2;
      },
    },
    mutations: {
      retry: false,
    },
  },
});
