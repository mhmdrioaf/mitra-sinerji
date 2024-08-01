"use client";

import { TBarang } from "@/lib/api/barang/definitions";
import { useBarang } from "@/lib/hooks/useBarang";
import { SortAscIcon, SortDescIcon } from "lucide-react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { Button } from "../button";
import DeleteBarang from "../forms/DeleteBarang";
import { Input } from "../input";
import { Label } from "../label";
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
import TableSkeleton from "./TableSkeleton";

interface IBarangTableHeadProps {
  dataKey: keyof TBarang;
  title: string;
  centered?: boolean;
  bordered?: boolean;
  onSort: (key: keyof TBarang) => void;
  currentSort: {
    by: keyof TBarang | null;
    order: "asc" | "desc";
  };
}

function BarangTableHead({
  dataKey,
  title,
  centered = false,
  bordered = false,
  onSort,
  currentSort,
}: IBarangTableHeadProps) {
  return (
    <TableHead
      className={twMerge(
        "text-left",
        bordered && "border-r",
        centered && "text-center"
      )}
    >
      <Button
        variant="ghost"
        onClick={() => onSort(dataKey)}
        className="w-full"
      >
        <span className="mr-2">{title}</span>
        {currentSort.by === dataKey ? (
          currentSort.order === "asc" ? (
            <SortAscIcon className="w-4 h-4" />
          ) : (
            <SortDescIcon className="w-4 h-4" />
          )
        ) : null}
      </Button>
    </TableHead>
  );
}

export default function TableBarang() {
  const barang = useBarang();

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="w-full grid grid-cols-4 gap-4 md:gap-8">
        <div className="col-span-4 md:col-span-3 flex flex-col gap-2">
          <Label htmlFor="search">Cari Barang</Label>
          <Input
            type="text"
            id="search"
            name="search"
            placeholder="Cari berdasarkan nama barang"
            className="w-full"
            onChange={(e) => barang.data.handler.search(e.target.value)}
          />
        </div>

        <Button asChild className="col-span-4 md:col-span-1 md:self-end">
          <Link href="/barang/create">Tambah Barang</Link>
        </Button>
      </div>

      <Table>
        <TableCaption>Data Barang</TableCaption>
        <TableHeader>
          <TableRow className="border">
            <TableHead className="text-center border-r">No.</TableHead>
            <BarangTableHead
              dataKey="id"
              title="ID Barang"
              currentSort={barang.sort.state.options}
              onSort={() => barang.sort.handler.sort("id")}
              centered
              bordered
            />
            <BarangTableHead
              dataKey="kode"
              title="Kode Barang"
              currentSort={barang.sort.state.options}
              onSort={() => barang.sort.handler.sort("kode")}
              centered
              bordered
            />
            <BarangTableHead
              dataKey="nama"
              title="Nama Barang"
              currentSort={barang.sort.state.options}
              onSort={() => barang.sort.handler.sort("nama")}
              bordered
            />
            <BarangTableHead
              dataKey="harga"
              title="Harga Barang"
              currentSort={barang.sort.state.options}
              onSort={() => barang.sort.handler.sort("harga")}
              bordered
            />
            <TableHead className="text-center">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="border">
          {barang.data.state.isLoading && <TableSkeleton rows={6} />}

          {barang.data.state.error && (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                Terjadi kesalahan saat memuat data barang...
              </TableCell>
            </TableRow>
          )}

          {barang.data.state.barang && (
            <>
              {barang.data.state.barang.length > 0 ? (
                barang.data.state.barang.map((data, idx) => (
                  <TableRow
                    key={data.id}
                    className="even:bg-neutral-100 even:hover:bg-neutral-100"
                  >
                    <TableCell className="text-center border-r">
                      {idx + 1}
                    </TableCell>
                    <TableCell className="text-center border-r">
                      {data.id}
                    </TableCell>
                    <TableCell className="text-center border-r">
                      {data.kode}
                    </TableCell>
                    <TableCell className="border-r">{data.nama}</TableCell>
                    <TableCell className="text-left border-r">
                      {data.harga.toLocaleString("id-ID", {
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
                            <Button
                              asChild
                              variant="outline"
                              className="w-full"
                            >
                              <Link href={`/barang/${data.id}`}>Edit</Link>
                            </Button>
                            <DeleteBarang
                              id={data.id}
                              redirect={false}
                              callback={() =>
                                barang.data.handler.mutation.mutate()
                              }
                            />
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
            </>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
