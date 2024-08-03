"use client";

import React from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SalesChart from "./SalesChart";

const queryClient = new QueryClient();

export default function SalesChartContainer() {
  return (
    <QueryClientProvider client={queryClient}>
      <SalesChart />
    </QueryClientProvider>
  );
}
