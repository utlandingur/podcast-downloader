"use client";
import {
  QueryClient,
  QueryClientProvider as Base,
} from "@tanstack/react-query";
import { ReactNode } from "react";

const queryClient = new QueryClient();

type QueryClientProviderProps = { children: ReactNode };

export const QueryClientProvider = ({ children }: QueryClientProviderProps) => {
  return <Base client={queryClient}>{children}</Base>;
};
