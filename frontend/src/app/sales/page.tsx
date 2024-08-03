"use client";

import TableSales from "@/components/ui/tables/TableSales";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function SalesPage() {
  return (
    <div className="w-full flex flex-col gap-4 md:gap-8 px-4 md:px-8 py-2 min-h-svh">
      <div className="w-full flex flex-col gap-px">
        <h3 className="font-bold text-lg md:text-xl">Data Transaksi</h3>
        <p className="text-xs text-neutral-600">
          Berikut merupakan data transaksi yang tersedia di database
        </p>
      </div>
      <QueryClientProvider client={queryClient}>
        <TableSales />
      </QueryClientProvider>
    </div>
  );
}
