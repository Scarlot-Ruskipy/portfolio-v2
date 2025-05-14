import "🎰/styles/globals.css";
import type { AppProps } from "next/app";
import NextComponentType from "next/app";
import Theme from "🎰/utils/useTheme";
import Head from "next/head";
import { useEffect, useState } from "react";

type ExtendedNextComponentType = NextComponentType & {
  metadata?: {
    title: string;
    description: string;
    keywords: string[];
  };
};

export default function App({ Component, pageProps }: AppProps) {
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const ExtendedComponent = Component as unknown as ExtendedNextComponentType;

  useEffect(() => {
    const handleLoad = () => setIsPageLoaded(true);
    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

  if (!isPageLoaded) {
    return null;
  }

  return <>
    <Head>
      {ExtendedComponent.metadata &&
        <>
          <title>{ExtendedComponent.metadata.title}</title>
          <meta name="description" content={ExtendedComponent.metadata.description} />
          <meta name="keywords" content={ExtendedComponent.metadata.keywords.join(", ")} />
        </>
      }
    </Head>

    <Theme defaultTheme="light" themes={["dark"]}>
      <Component {...pageProps} />
    </Theme>
  </>;
}