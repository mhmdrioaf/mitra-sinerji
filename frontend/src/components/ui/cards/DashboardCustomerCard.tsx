"use client";

import { TCustomer } from "@/lib/api/customer/definitions";
import Link from "next/link";
import { Button } from "../button";

interface IDashboardCustomerCardProps {
  customers: TCustomer[];
}

export default function DashboardCustomerCard({
  customers,
}: IDashboardCustomerCardProps) {
  return (
    <>
      {customers.length < 1 ? (
        <div className="col-span-2 flex flex-col gap-2 items-center justify-center">
          <p className="text-center text-primary/65 text-xs">
            Belum ada data customer yang ditambahkan
          </p>
          <Button asChild variant="outline">
            <Link href="/customer/create">Tambahkan Customer</Link>
          </Button>
        </div>
      ) : (
        customers.slice(0, 4).map((item) => (
          <Button asChild key={item.id} variant="outline">
            <Link href={`/customer/${item.id}`}>
              <p className="mr-2">{item.kode}</p>
              <p>{item.name}</p>
            </Link>
          </Button>
        ))
      )}

      {customers.length > 0 && (
        <Button asChild className="col-span-2 self-end">
          <Link href="/customer">Lihat Semua Customer</Link>
        </Button>
      )}
    </>
  );
}
