import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AnonAadhaarProvider } from "@anon-aadhaar/react";
import { GlobalContextProvider } from "@/context/store";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <GlobalContextProvider>
      <AnonAadhaarProvider>
        <Component {...pageProps} />
      </AnonAadhaarProvider>
    </GlobalContextProvider>
  );
}
