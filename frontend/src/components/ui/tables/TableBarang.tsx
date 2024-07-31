"use client";

import { TListBarangApiResponse } from "@/lib/api/barang/definitions";
import Link from "next/link";
import { Button } from "../button";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../table";

export default function TableBarang() {
  const dataBarang: TListBarangApiResponse = {
    data: [],
    status: 200,
  };
  return (
    <Table>
      <TableCaption>Data Barang</TableCaption>
      <TableHeader>
        <TableRow className="border">
          <TableHead className="text-center border-r">No.</TableHead>
          <TableHead className="text-center border-r">ID Barang</TableHead>
          <TableHead className="text-center border-r">Kode Barang</TableHead>
          <TableHead className="border-r">Nama Barang</TableHead>
          <TableHead className="text-left border-r">Harga Barang</TableHead>
          <TableHead className="text-center">Aksi</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody className="border">
        {dataBarang.data.length > 0 ? (
          dataBarang.data.map((barang, idx) => (
            <TableRow
              key={barang.id}
              className="even:bg-neutral-100 even:hover:bg-neutral-100"
            >
              <TableCell className="text-center border-r">{idx + 1}</TableCell>
              <TableCell className="text-center border-r">
                {barang.id}
              </TableCell>
              <TableCell className="text-center border-r">
                {barang.kode}
              </TableCell>
              <TableCell className="border-r">{barang.nama}</TableCell>
              <TableCell className="text-left border-r">
                {barang.harga.toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                })}
              </TableCell>
              <TableCell className="text-center">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">Aksi</Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="w-full flex flex-col gap-2">
                      <Button asChild variant="outline" className="w-full">
                        <Link href={`/barang/${barang.id}`}>Edit</Link>
                      </Button>
                      <Button variant="destructive" className="w-full">
                        Hapus Barang
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="text-center">
              Saat ini, tidak ada data barang yang tersedia...
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
