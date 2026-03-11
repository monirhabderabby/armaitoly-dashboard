"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NextTopLoader from "nextjs-toploader";
import { ReactNode } from "react";
import { Toaster } from "sonner";

interface Props {
  children: ReactNode;
}

const AppProvider = ({ children }: Props) => {
  // Create a client
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Top Loading Bar componen */}
      <NextTopLoader showSpinner={false} />

      {/* toast sooner */}
      <Toaster richColors />
    </QueryClientProvider>
  );
};

export default AppProvider;
