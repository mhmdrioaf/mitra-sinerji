"use client";

import { listBarang } from "@/lib/api/barang/fetcher";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import SmallLoader from "../SmallLoader";
import { Button } from "../button";
import { CardContainer, CardContent, CardTitle } from "./CardContainer";

export default function DashboardBarangCard() {
  const query = useQuery({ queryKey: ["barang"], queryFn: listBarang });

  const data = query.data?.data || [];

  return (
    <CardContainer>
      {data.length > 0 && (
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
      )}
      <CardContent>
        {query.isLoading ? (
          <div className="col-span-2 grid place-items-center">
            <SmallLoader />
          </div>
        ) : query.error ? (
          <p className="col-span-2 text-center text-primary/65 text-xs">
            Terjadi kesalahan ketika mendapatkan data barang...
          </p>
        ) : data.length < 1 ? (
          <div className="col-span-2 flex flex-col gap-2 items-center justify-center">
            <p className="text-center text-primary/65 text-xs">
              Belum ada data barang yang ditambahkan
            </p>
            <Button asChild variant="outline">
              <Link href="/barang/create">Tambahkan Barang</Link>
            </Button>
          </div>
        ) : (
          data.slice(0, 4).map((item) => (
            <Button asChild key={item.id} variant="outline">
              <Link href={`/barang/${item.id}`}>
                <p className="mr-2">{item.kode}</p>
                <p>{item.nama}</p>
              </Link>
            </Button>
          ))
        )}

        {data.length > 0 && (
          <Button asChild className="col-span-2 self-end">
            <Link href="/barang">Lihat Semua Barang</Link>
          </Button>
        )}
      </CardContent>
    </CardContainer>
  );
}
