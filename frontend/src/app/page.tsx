import { Button } from "@/components/ui/button";
import SalesChartContainer from "@/components/ui/SalesChartContainer";
import { listBarang } from "@/lib/api/barang/fetcher";
import { listCustomer } from "@/lib/api/customer/fetcher";
import Link from "next/link";

export default async function Home() {
  const dataBarang = listBarang();
  const dataCustomer = listCustomer();

  const [barang, customer] = await Promise.all([dataBarang, dataCustomer]);

  return (
    <div className="w-full px-4 md:px-8 py-2 min-h-[calc(100svh-4rem)] gap-8 flex flex-col justify-center">
      <div className="flex flex-col gap-2 items-center">
        <div className="flex flex-col gap-1 items-center">
          <Link href="/sales" className="font-bold text-lg underline">
            Statistik Transaksi
          </Link>
          <p className="text-sm text-neutral-600">
            Berikut merupakan data statistik grand total dari seluruh transaksi
          </p>
        </div>
        <SalesChartContainer />
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-2 items-center p-2 border rounded-md">
          <div className="flex flex-col gap-1 items-center">
            <Link href="/barang" className="font-bold text-lg underline">
              Data Barang
            </Link>
            <p className="text-sm text-neutral-600">
              Berikut merupakan data barang yang tersedia
            </p>
          </div>
          <div className="w-full grid grid-cols-2 gap-4 bg-white rounded-md p-4">
            {barang.data.length < 1 ? (
              <p className="text-sm text-neutral-600 col-span-2">
                Tidak ada data barang yang tersedia...
              </p>
            ) : (
              barang.data.slice(0, 4).map((item) => (
                <Button asChild key={item.id}>
                  <Link href={`/barang/${item.id}`}>
                    <p className="mr-2">{item.kode}</p>
                    <p>{item.nama}</p>
                  </Link>
                </Button>
              ))
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 items-center p-2 border rounded-md">
          <div className="flex flex-col gap-1 items-center">
            <Link href="/customer" className="font-bold text-lg underline">
              Data Customer
            </Link>
            <p className="text-sm text-neutral-600">
              Berikut merupakan data customer yang tersedia
            </p>
          </div>
          <div className="w-full grid grid-cols-2 gap-4 bg-white rounded-md p-4">
            {customer.data.length < 1 ? (
              <p className="text-sm text-neutral-600 col-span-2">
                Tidak ada data customer yang tersedia...
              </p>
            ) : (
              customer.data.slice(0, 4).map((item) => (
                <Button asChild key={item.id}>
                  <Link href={`/customer/${item.id}`}>
                    <p className="mr-2">{item.kode}</p>
                    <p>{item.name}</p>
                  </Link>
                </Button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
