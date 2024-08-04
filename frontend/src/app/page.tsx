import {
  CardContainer,
  CardContent,
  CardTitle,
} from "@/components/ui/cards/CardContainer";
import SmallLoader from "@/components/ui/SmallLoader";
import { listBarang } from "@/lib/api/barang/fetcher";
import { listCustomer } from "@/lib/api/customer/fetcher";
import { listSales } from "@/lib/api/sales/fetcher";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Suspense } from "react";

export const revalidate = 3600;

const SalesChart = dynamic(() => import("@/components/ui/SalesChart"), {
  loading: () => (
    <div className="w-full md:max-w-4xl mx-auto h-[40svh] grid place-items-center">
      <SmallLoader />
    </div>
  ),
  ssr: false,
});
const DashboardBarangCard = dynamic(
  () => import("@/components/ui/cards/DashboardBarangCard"),
  {
    loading: () => (
      <div className="col-span-2 grid place-items-center">
        <SmallLoader />
      </div>
    ),
    ssr: false,
  }
);
const DashboardCustomerCard = dynamic(
  () => import("@/components/ui/cards/DashboardCustomerCard"),
  {
    loading: () => (
      <div className="col-span-2 grid place-items-center">
        <SmallLoader />
      </div>
    ),
    ssr: false,
  }
);

export default async function Home() {
  const salesData = listSales();
  const barangData = listBarang();
  const customerData = listCustomer();

  const [sales, barang, customer] = await Promise.all([
    salesData,
    barangData,
    customerData,
  ]);

  return (
    <div className="w-full px-4 md:px-8 py-2 md:py-6 min-h-[calc(100svh-4rem)] gap-8 flex flex-col text-primary">
      <div className="w-full md:max-w-4xl mx-auto min-h-[40svh] border rounded-md p-2">
        <div className="flex flex-col gap-2 items-center">
          <div className="flex flex-col gap-1 items-center">
            <Link
              href="/sales"
              className="font-bold text-lg hover:underline hover:underline-offset-4"
            >
              Statistik Transaksi
            </Link>
            <p className="text-sm text-primary/75">
              Berikut merupakan statistik data pendapatan dari seluruh transaksi
            </p>
          </div>

          <Suspense fallback={<SmallLoader />}>
            <SalesChart sales={sales.data} />
          </Suspense>
        </div>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        <CardContainer>
          <CardTitle>
            <Link
              href="/barang"
              className="hover:underline text-lg hover:underline-offset-4 font-bold"
            >
              Data Barang
            </Link>
            <p className="text-sm text-primary/75">
              Berikut merupakan data barang yang tersedia
            </p>
          </CardTitle>

          <CardContent>
            <Suspense>
              <DashboardBarangCard barang={barang.data} />
            </Suspense>
          </CardContent>
        </CardContainer>

        <CardContainer>
          <CardTitle>
            <Link
              href="/customer"
              className="hover:underline text-lg hover:underline-offset-4 font-bold"
            >
              Data Customer
            </Link>
            <p className="text-sm text-primary/75">
              Berikut merupakan data customer yang tersedia
            </p>
          </CardTitle>

          <CardContent>
            <Suspense>
              <DashboardCustomerCard customers={customer.data} />
            </Suspense>
          </CardContent>
        </CardContainer>
      </div>
    </div>
  );
}
