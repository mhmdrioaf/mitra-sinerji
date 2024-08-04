"use client";

import { TBarang } from "@/lib/api/barang/definitions";
import Link from "next/link";
import { Button } from "../button";

interface IDashboardBarangCardProps {
  barang: TBarang[];
}

export default function DashboardBarangCard({
  barang,
}: IDashboardBarangCardProps) {
  return (
    <>
      {barang.length < 1 ? (
        <div className="col-span-2 flex flex-col gap-2 items-center justify-center">
          <p className="text-center text-primary/65 text-xs">
            Belum ada data barang yang ditambahkan
          </p>
          <Button asChild variant="outline">
            <Link href="/barang/create">Tambahkan Barang</Link>
          </Button>
        </div>
      ) : (
        barang.slice(0, 4).map((item) => (
          <Button asChild key={item.id} variant="outline">
            <Link href={`/barang/${item.id}`}>
              <p className="mr-2">{item.kode}</p>
              <p>{item.nama}</p>
            </Link>
          </Button>
        ))
      )}

      {barang.length > 0 && (
        <Button asChild className="col-span-2 self-end">
          <Link href="/barang">Lihat Semua Barang</Link>
        </Button>
      )}
    </>
  );
}
