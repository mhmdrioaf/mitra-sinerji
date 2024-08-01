"use client";

import { TBarang, TListBarangApiResponse } from "@/lib/api/barang/definitions";
import { listBarang } from "@/lib/api/barang/fetcher";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FilterIcon, SortAscIcon, SortDescIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
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

export default function TableBarang() {
  const queryClient = useQueryClient();
  const {
    data: dataBarang,
    error,
    isLoading,
  } = useQuery<TListBarangApiResponse>({
    queryKey: ["barang"],
    queryFn: listBarang,
  });

  const mutation = useMutation({
    mutationFn: listBarang,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["barang"] });
    },
  });

  const [search, setSearch] = React.useState<string>("");
  const [sortOptions, setSortOptions] = React.useState<{
    by: keyof TBarang | null;
    order: "asc" | "desc";
  }>({
    by: null,
    order: "asc",
  });
  const keysBarang: (keyof TBarang)[] = ["id", "kode", "nama", "harga"];

  const sortDataBarang = (data: TBarang[], key: keyof TBarang) => {
    return data.sort((a, b) => {
      if (sortOptions.order === "asc") {
        if (a[key] < b[key]) {
          return -1;
        }
        if (a[key] > b[key]) {
          return 1;
        }
        return 0;
      } else {
        if (a[key] > b[key]) {
          return -1;
        }
        if (a[key] < b[key]) {
          return 1;
        }
        return 0;
      }
    });
  };

  const handleSort = (option: keyof TBarang) => {
    setSortOptions((prev) => ({
      ...prev,
      by: prev.by === option ? null : option,
    }));
  };

  const handleOrder = () => {
    setSortOptions((prev) => ({
      ...prev,
      order: prev.order === "asc" ? "desc" : "asc",
    }));
  };

  const filterData = () => {
    if (dataBarang && dataBarang.data) {
      if (search) {
        const filteredDataBarang = dataBarang.data.filter((barang) =>
          barang.nama.toLowerCase().includes(search.toLowerCase())
        );

        return sortDataBarang(filteredDataBarang, sortOptions.by ?? "nama");
      }

      return sortDataBarang(dataBarang.data, sortOptions.by ?? "kode");
    }
  };

  const barang = filterData();

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="w-full grid grid-cols-4 md:grid-cols-3 gap-2">
        <div className="col-span-4 md:col-span-1 flex flex-col gap-2">
          <Label htmlFor="search">Cari Barang</Label>
          <Input
            type="text"
            id="search"
            name="search"
            placeholder="Cari berdasarkan nama barang"
            className="w-full"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Popover>
          <div className="col-span-2 md:col-span-1 md:self-end inline-flex items-center gap-2">
            <PopoverTrigger asChild className="w-full">
              <Button variant="outline">
                <FilterIcon className="w-4 h-4" />
                <span>Urutkan Data</span>
              </Button>
            </PopoverTrigger>

            <Button variant="outline" onClick={handleOrder}>
              {sortOptions.order === "asc" ? (
                <SortAscIcon className="w-4 h-4" />
              ) : (
                <SortDescIcon className="w-4 h-4" />
              )}
            </Button>
          </div>
          <PopoverContent>
            <div className="w-full flex flex-col gap-2">
              {keysBarang.map((key) => (
                <Button
                  key={key}
                  variant={sortOptions.by === key ? "default" : "outline"}
                  onClick={() => handleSort(key)}
                >
                  {key}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Button asChild className="col-span-2 md:col-span-1 md:self-end">
          <Link href="/barang/create">Tambah Barang</Link>
        </Button>
      </div>

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
          {isLoading && <TableSkeleton rows={6} />}

          {error && (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                Terjadi kesalahan saat memuat data barang...
              </TableCell>
            </TableRow>
          )}

          {barang && (
            <>
              {barang.length > 0 ? (
                barang.map((barang, idx) => (
                  <TableRow
                    key={barang.id}
                    className="even:bg-neutral-100 even:hover:bg-neutral-100"
                  >
                    <TableCell className="text-center border-r">
                      {idx + 1}
                    </TableCell>
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
                            <Button
                              asChild
                              variant="outline"
                              className="w-full"
                            >
                              <Link href={`/barang/${barang.id}`}>Edit</Link>
                            </Button>
                            <DeleteBarang
                              id={barang.id}
                              redirect={false}
                              callback={() => mutation.mutate()}
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
