"use client";

import { TCustomer } from "@/lib/api/customer/definitions";
import useCustomer, { TCustomerSortOptions } from "@/lib/hooks/useCustomer";
import { SortAscIcon, SortDescIcon } from "lucide-react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { Button } from "../button";
import DeleteCustomer from "../forms/DeleteCustomer";
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

interface ICustomerTableHeadProps {
  dataKey?: keyof TCustomer;
  title: string;
  centered?: boolean;
  bordered?: boolean;
  sortable?: boolean;
  sortOptions?: TCustomerSortOptions;
  onSort?: (key: keyof TCustomer) => void;
}

function CustomerTableHead({ ...props }: ICustomerTableHeadProps) {
  return (
    <TableHead
      className={twMerge(
        "text-left",
        props.centered && "text-center",
        props.bordered && "border-r"
      )}
    >
      {props.sortable ? (
        <Button
          variant="ghost"
          onClick={() => props.onSort!(props.dataKey!)}
          className="w-full"
        >
          <span className="mr-2">{props.title}</span>
          {props.sortOptions!.by === props.dataKey ? (
            props.sortOptions!.order === "asc" ? (
              <SortAscIcon className="w-4 h-4" />
            ) : (
              <SortDescIcon className="w-4 h-4" />
            )
          ) : null}
        </Button>
      ) : (
        props.title
      )}
    </TableHead>
  );
}

export default function TableCustomer() {
  const { customer, handler } = useCustomer();

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="w-full grid grid-cols-4 gap-4 md:gap-8">
        <div className="col-span-4 md:col-span-3 flex flex-col gap-2">
          <Label htmlFor="search">Cari Customer</Label>
          <Input
            type="text"
            id="search"
            name="search"
            placeholder="Cari berdasarkan nama, kode, nomor telepon"
            className="w-full"
            onChange={(e) => handler.search(e.target.value)}
          />
        </div>

        <div className="col-span-4 md:col-span-1 md:self-end">
          <Button variant="default" asChild className="w-full">
            <Link href="/customer/create">Tambahkan Customer</Link>
          </Button>
        </div>
      </div>

      <Table>
        <TableCaption>Data Customer</TableCaption>
        <TableHeader>
          <TableRow className="border">
            <CustomerTableHead sortable={false} title="No." centered bordered />
            <CustomerTableHead
              dataKey="id"
              sortable
              title="ID Customer"
              centered
              bordered
              sortOptions={customer.currentSort}
              onSort={() => handler.sort("id")}
            />
            <CustomerTableHead
              dataKey="kode"
              sortable
              title="Kode Customer"
              bordered
              sortOptions={customer.currentSort}
              onSort={() => handler.sort("kode")}
            />
            <CustomerTableHead
              dataKey="name"
              sortable
              title="Nama Customer"
              bordered
              sortOptions={customer.currentSort}
              onSort={() => handler.sort("name")}
            />
            <CustomerTableHead
              sortable={false}
              title="Nomor Telepon"
              centered
              bordered
            />
            <CustomerTableHead sortable={false} title="Aksi" centered />
          </TableRow>
        </TableHeader>

        <TableBody className="border">
          {customer.isLoading && <TableSkeleton rows={6} />}
          {customer.error && (
            <TableRow className="border">
              <TableCell colSpan={6} className="text-center">
                Terjadi kesalahan ketika mendapatkan data customer...
              </TableCell>{" "}
            </TableRow>
          )}

          {!customer.isLoading &&
            !customer.error &&
            (customer.data.length > 0 ? (
              customer.data.map((data, index) => (
                <TableRow className="border" key={data.id}>
                  <TableCell className="text-center border-r">
                    {index + 1}
                  </TableCell>
                  <TableCell className="text-center border-r">
                    {data.id}
                  </TableCell>
                  <TableCell className="text-center border-r">
                    {data.kode}
                  </TableCell>
                  <TableCell className="border-r">{data.name}</TableCell>
                  <TableCell className="text-center border-r">
                    {data.telp}
                  </TableCell>
                  <TableCell className="text-center border-r">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost">Aksi</Button>
                      </PopoverTrigger>

                      <PopoverContent>
                        <div className="w-full flex flex-col gap-2">
                          <Button variant="outline" asChild>
                            <Link href={`/customer/${data.id}`}>Edit</Link>
                          </Button>

                          <DeleteCustomer
                            id={data.id}
                            redirect={false}
                            callback={handler.mutate}
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="border">
                <TableCell colSpan={5} className="text-center">
                  Saat ini tidak ada data customer...
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
