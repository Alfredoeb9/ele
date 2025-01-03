"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createWSClient,
  loggerLink,
  unstable_httpBatchStreamLink,
  wsLink,
  createTRPCClient,
  splitLink,
} from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { useState } from "react";
import superjson from "superjson";

import { type AppRouter } from "@/server/api/root";
import { getUrl, transformer } from "./shared";
import { env } from "@/env";

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        // staleTime: 1000,
        refetchOnMount: true,
        retryOnMount: true,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        retry: false,
        gcTime: 0,
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

// create persistent WebSocket connection
// const wsClient = createWSClient({
//   url: `ws://localhost:3001`,
// });

// console.log("wsClient", wsClient);

// export const trpc = createTRPCClient<AppRouter>({
//   links: [wsLink({ client: wsClient, transformer })],
// });

export const api = createTRPCReact<AppRouter>();

export function TRPCReactProvider(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        loggerLink({
          enabled: (op) =>
            env.NODE_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        wsLink({
          client: createWSClient({
            url: env.NEXT_PUBLIC_WS_URL,
          }),
          transformer,
        }),
        splitLink({
          condition: (op) => op.type === "subscription",
          false: unstable_httpBatchStreamLink({
            url: getUrl(),
            transformer,
            headers: () => {
              const headers = new Headers();
              headers.set("x-trpc-source", "nextjs-react");
              return headers;
            },
          }),
          true: wsLink({
            client: createWSClient({
              url: env.NEXT_PUBLIC_WS_URL,
            }),
            transformer,
          }),
        }),
      ],
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </api.Provider>
    </QueryClientProvider>
  );
}
