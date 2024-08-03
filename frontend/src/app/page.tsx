import { QueryProvider } from "@/components/ui/QueryProvider";
import SmallLoader from "@/components/ui/SmallLoader";
import React, { Suspense } from "react";

const SalesChart = React.lazy(() => import("@/components/ui/SalesChart"));
const DashboardBarangCard = React.lazy(
  () => import("@/components/ui/cards/DashboardBarangCard")
);
const DashboardCustomerCard = React.lazy(
  () => import("@/components/ui/cards/DashboardCustomerCard")
);

export default async function Home() {
  return (
    <div className="w-full px-4 md:px-8 py-2 md:py-6 min-h-[calc(100svh-4rem)] gap-8 flex flex-col text-primary">
      <Suspense fallback={<SmallLoader />}>
        <QueryProvider>
          <SalesChart />
        </QueryProvider>
      </Suspense>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        <Suspense fallback={<SmallLoader />}>
          <QueryProvider>
            <>
              <DashboardBarangCard />
              <DashboardCustomerCard />
            </>
          </QueryProvider>
        </Suspense>
      </div>
    </div>
  );
}
