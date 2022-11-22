import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { withTRPC } from "@trpc/next";
import { httpBatchLink } from "@trpc/client/links/httpBatchLink";
import { loggerLink } from "@trpc/client/links/loggerLink";
import superjson from "superjson";

import { trpc } from "../utils/trpc";
import type { AppProps } from "next/app";
import "../styles/globals.css";
import { getBaseUrl } from "../utils/get-base-url";
import type { AppRouter } from "../server/router";

const App: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default withTRPC<AppRouter>({
  config() {
    const url = `${getBaseUrl()}/api/trpc`;

    return {
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        httpBatchLink({ url }),
      ],
      url,
      transformer: superjson,
      queryClientConfig: {
        defaultOptions: {
          queries: {
            staleTime: Infinity,
          },
        },
      },
    };
  },
  ssr: false,
})(App);
