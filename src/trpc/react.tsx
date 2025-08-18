"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createWSClient,
  loggerLink,
  wsLink,
  httpBatchLink,
  splitLink,
} from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { createContext, useContext, useEffect, useState } from "react";
import { type AppRouter } from "@/server/api/root";
import { getUrl, transformer } from "./shared";
import { env } from "@/env";

// Create a singleton WebSocket client
let wsClient: ReturnType<typeof createWSClient> | undefined = undefined;

function getDefaultWsUrl() {
  if (typeof window === "undefined") return "";
  const protocol = window.location.protocol === "https:" ? "wss" : "ws";
  const hostname = window.location.hostname;
  // Default to the same host with port 3001 where the server websocket listens in dev
  const port = 3001;
  return `${protocol}://${hostname}:${port}`;
}

// Add proper batching configuration
const httpLink = httpBatchLink({
  url: getUrl(),
  transformer,
  headers: () => {
    const headers = new Headers();
    headers.set("x-trpc-source", "nextjs-react");
    return headers;
  },
  // Add these options:
  maxURLLength: 2000, // Reasonable limit for URL length
});

// function getEndingLink(): TRPCLink<AppRouter> {
//   if (typeof window === "undefined") {
//     return httpLink;
//   }
//   // Reuse WebSocket connection with reconnection logic
//   if (!wsClient) {
//     wsClient = createWSClient({
//       url: env.NEXT_PUBLIC_WS_URL,
//       retryDelayMs: (attempt) => Math.min(attempt * 1000, 10000),
//       onOpen: () => console.log("WebSocket connection established"),
//       onClose: () => console.log("WebSocket connection closed"),
//     });
//   }
//   return splitLink({
//     condition: (op) => op.type === "subscription",
//     true: wsLink({
//       client: wsClient,
//       transformer,
//     }),
//     false: httpLink,
//   });
// }

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes - reduce unnecessary refetches
        refetchOnMount: "always",
        retryOnMount: true,
        refetchOnWindowFocus: false, // Good for improved user experience
        refetchOnReconnect: true,
        retry: (failureCount, error) => {
          // Only retry network-related errors, not application errors
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
          const err = error as Error;
          const shouldRetry =
            !err.message?.includes("UNAUTHORIZED") &&
            !err.message?.includes("FORBIDDEN") &&
            failureCount < 3;
          return shouldRetry;
        },
        gcTime: 10 * 60 * 1000, // 10 minutes - keep cached data longer
      },
      mutations: {
        // Add options for mutations
        retry: 1, // Only retry mutations once
        networkMode: "always",
      },
    },
  });

let clientQueryClientSingleton: QueryClient | undefined = undefined;

const getQueryClient = () => {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return createQueryClient();
  }
  // Browser: use singleton pattern to keep the same query client
  return (clientQueryClientSingleton ??= createQueryClient());
};

export const api = createTRPCReact<AppRouter>();

export const TRPCConnectionContext = createContext<{
  connectionStatus: "connected" | "disconnected" | "connecting";
}>({
  connectionStatus: "connecting",
});

export function useTRPCConnectionStatus() {
  return useContext(TRPCConnectionContext).connectionStatus;
}

export function TRPCReactProvider(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  const [connectionStatus, setConnectionStatus] = useState<
    "connected" | "disconnected" | "connecting"
  >("connecting");

  const [trpcClient] = useState(
    () => {
      // If we're server-side rendering, don't create a WebSocket client
      if (typeof window === "undefined") {
        return api.createClient({
          links: [
            loggerLink({
              enabled: (op) =>
                env.NODE_ENV === "development" ||
                (op.direction === "down" && op.result instanceof Error),
            }),
            httpLink,
          ],
        });
      }

      // Create WebSocket client with connection status callbacks
      if (!wsClient) {
        const url = env.NEXT_PUBLIC_WS_URL || getDefaultWsUrl();
        wsClient = createWSClient({
          url,
          onOpen: () => {
            setConnectionStatus("connected");
            console.log("WebSocket connected ->", url);
          },
          onClose: () => {
            setConnectionStatus("disconnected");
            console.log("WebSocket disconnected, attempting to reconnect...");
          },
        });
      }

      return api.createClient({
        links: [
          loggerLink({
            enabled: (op) =>
              env.NODE_ENV === "development" ||
              (op.direction === "down" && op.result instanceof Error),
          }),
          splitLink({
            condition: (op) => op.type === "subscription",
            true: wsLink({
              client: wsClient,
              transformer,
            }),
            false: httpLink,
          }),
        ],
      });
    },

  );

  // Add cleanup logic
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && wsClient) {
        console.log("Cleaning up WebSocket connection");
        wsClient.close();
      }
    };
  }, []);

  return (
    <TRPCConnectionContext.Provider value={{ connectionStatus }}>
      <QueryClientProvider client={queryClient}>
        <api.Provider client={trpcClient} queryClient={queryClient}>
          {props.children}
        </api.Provider>
      </QueryClientProvider>
    </TRPCConnectionContext.Provider>
  );
}
