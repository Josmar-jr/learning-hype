import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { withTRPC } from "@trpc/next";
import SEO from "../../next-seo.config";
import { DefaultSeo } from "next-seo";
import { httpBatchLink } from "@trpc/client/links/httpBatchLink";
import { loggerLink } from "@trpc/client/links/loggerLink";
import superjson from "superjson";

import { getBaseUrl } from "../utils/get-base-url";
import type { AppRouter } from "../server/router";

import "../styles/globals.css";

import { ThemeProvider } from "next-themes";
import Head from "next/head";

const App: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <Head>
        <DefaultSeo {...SEO} />
      </Head>

      <SessionProvider session={session}>
        <ThemeProvider
          enableSystem={true}
          defaultTheme="light"
          attribute="class"
        >
          <Component {...pageProps} />
        </ThemeProvider>
      </SessionProvider>
    </>
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
