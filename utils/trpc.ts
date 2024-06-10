import { httpBatchLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import type { AppRouter } from "@routers/_app";

function getBaseUrl() {
  if (typeof window !== "undefined")
    // browser should use relative path
    return "";
  if (process.env.VERCEL_URL)
    // reference for vercel.com
    return `https://${process.env.VERCEL_URL}`;
  if (process.env.RENDER_INTERNAL_HOSTNAME)
    // reference for render.com
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;
  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const trpc = createTRPCNext<AppRouter>({
  config(opts) {
    const baseUrl = `${getBaseUrl()}/api/trpc`;
    let refreshTokenPromise: Promise<Response> | null = null;

    return {
      links: [
        httpBatchLink({
          /**
           * If you want to use SSR, you need to use the server's full URL
           * @link https://trpc.io/docs/ssr
           **/
          url: baseUrl,
          fetch: async (info, options) => {
            // Don't attempt refresh on auth routes
            if ((info as string).includes("/api/auth.")) {
              return fetch(info, options);
            } else {
              const response = await fetch(info, options);

              // If unauthorized was the status then attempt to refresh
              if (response.status === 401) {
                // Check if another request is already attempting to refresh
                if (!refreshTokenPromise) {
                  refreshTokenPromise = fetch(`${baseUrl}/auth.refresh`, { method: "POST" });
                }

                const refreshTokenResponse = await refreshTokenPromise;
                refreshTokenPromise = null;

                // Return original response if refresh failed
                if (refreshTokenResponse.status >= 400) {
                  return response;
                }

                // Retry the request after successful refresh
                return fetch(info, options);
              }

              return response;
            }
          },
        }),
      ],
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   **/
  ssr: false,
});
