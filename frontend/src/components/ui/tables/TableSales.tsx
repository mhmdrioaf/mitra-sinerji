"use client";

import { TSales } from "@/lib/api/sales/definitions";
import useSalesData from "@/lib/hooks/useSalesData";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, SortAscIcon, SortDescIcon } from "lucide-react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { Button } from "../button";
import { Calendar } from "../calendar";
import { Input } from "../input";
import { Label } from "../label";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../table";

interface ITableSalesProps {
  data: TSales[];
}

interface ISortableTableHeaderProps {
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}

function SortableTableHeader({
  children,
  onClick,
  className,
}: ISortableTableHeaderProps) {
  return (
    <TableHead className={twMerge("text-center border-r", className)}>
      <Button variant="ghost" onClick={onClick}>
        {children}
      </Button>
    </TableHead>
  );
}

function SortIcon({
  isActive,
  order,
}: {
  isActive: boolean;
  order: "asc" | "desc";
}) {
  return isActive ? (
    order === "asc" ? (
      <SortAscIcon className="w-4 h-4 ml-2" />
    ) : (
      <SortDescIcon className="w-4 h-4 ml-2" />
    )
  ) : null;
}

export default function TableSales({ data }: ITableSalesProps) {
  const sales = useSalesData({ salesData: data });

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="w-full grid grid-cols-4 gap-4 md:gap-8">
        <div className="col-span-4 md:col-span-3 flex flex-col gap-2">
          <Label htmlFor="search">Cari Transaksi</Label>
          <Input
            type="text"
            id="search"
            name="search"
            placeholder="Cari berdasarkan no transaksi atau nama customer"
            className="w-full"
            onChange={(e) => sales.handler.search(e.target.value)}
          />
        </div>

        <div className="hidden md:inline md:col-span-1 md:self-end">
          <Button variant="default" asChild className="w-full">
            <Link href="/sales/create">Tambahkan Transaksi</Link>
          </Button>
        </div>

        <div className="col-span-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !sales.state.dates && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {sales.state.dates?.from ? (
                  sales.state.dates.to ? (
                    <>
                      {format(sales.state.dates.from, "LLL dd, y")} -{" "}
                      {format(sales.state.dates.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(sales.state.dates.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pilih Berdasarkan Rentang Tanggal</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={sales.state.dates?.from}
                selected={sales.state.dates}
                onSelect={sales.handler.changeDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="col-span-4 inline md:hidden">
          <Button variant="default" asChild className="w-full">
            <Link href="/sales/create">Tambahkan Transaksi</Link>
          </Button>
        </div>
      </div>

      <Table>
        <TableCaption>Data Transaksi</TableCaption>
        <TableHeader>
          <TableRow className="border">
            <TableHead className="text-center border-r">No.</TableHead>
            <SortableTableHeader
              className="text-center"
              onClick={() => sales.handler.sort("kode")}
            >
              <span>No Transaksi</span>
              <SortIcon
                isActive={sales.state.currentSort.by === "kode"}
                order={sales.state.currentSort.order}
              />
            </SortableTableHeader>
            <SortableTableHeader
              className="text-center"
              onClick={() => sales.handler.sort("tgl")}
            >
              <span>Tanggal</span>
              <SortIcon
                isActive={sales.state.currentSort.by === "tgl"}
                order={sales.state.currentSort.order}
              />
            </SortableTableHeader>
            <SortableTableHeader
              className="text-center"
              onClick={() => sales.handler.sort("cust")}
            >
              <span>Nama Customer</span>
              <SortIcon
                isActive={sales.state.currentSort.by === "cust"}
                order={sales.state.currentSort.order}
              />
            </SortableTableHeader>
            <SortableTableHeader
              className="text-center"
              onClick={() => sales.handler.sort("sales_detail")}
            >
              <span>Jumlah Barang</span>
              <SortIcon
                isActive={sales.state.currentSort.by === "sales_detail"}
                order={sales.state.currentSort.order}
              />
            </SortableTableHeader>
            <SortableTableHeader
              className="text-center"
              onClick={() => sales.handler.sort("subtotal")}
            >
              <span>Sub Total</span>
              <SortIcon
                isActive={sales.state.currentSort.by === "subtotal"}
                order={sales.state.currentSort.order}
              />
            </SortableTableHeader>
            <SortableTableHeader
              className="text-center"
              onClick={() => sales.handler.sort("diskon")}
            >
              <span>Diskon</span>
              <SortIcon
                isActive={sales.state.currentSort.by === "diskon"}
                order={sales.state.currentSort.order}
              />
            </SortableTableHeader>
            <SortableTableHeader
              className="text-center"
              onClick={() => sales.handler.sort("ongkir")}
            >
              <span>Ongkir</span>
              <SortIcon
                isActive={sales.state.currentSort.by === "ongkir"}
                order={sales.state.currentSort.order}
              />
            </SortableTableHeader>
            <SortableTableHeader
              className="text-center"
              onClick={() => sales.handler.sort("total_bayar")}
            >
              <span>Total</span>
              <SortIcon
                isActive={sales.state.currentSort.by === "total_bayar"}
                order={sales.state.currentSort.order}
              />
            </SortableTableHeader>
          </TableRow>
        </TableHeader>
        <TableBody className="border">
          {sales.state.data.length < 1 ? (
            <TableRow>
              <TableCell
                colSpan={9}
                className="text-center text-sm text-neutral-600"
              >
                Belum ada data transaksi...
              </TableCell>
            </TableRow>
          ) : (
            sales.state.data.map((sale, index) => (
              <TableRow key={sale.id}>
                <TableCell className="text-center border-r">
                  {index + 1}.
                </TableCell>
                <TableCell className="text-center border-r">
                  {sale.kode}
                </TableCell>
                <TableCell className="text-center border-r">
                  {format(sale.tgl, "dd-MMM-y")}
                </TableCell>
                <TableCell className="text-left border-r">
                  {sale.cust.name}
                </TableCell>
                <TableCell className="text-right border-r">
                  {sales.handler.calculateTotalBarang(sale)}
                </TableCell>
                <TableCell className="text-center border-r">
                  {sales.handler.formatCurrency(sale.subtotal)}
                </TableCell>
                <TableCell className="text-center border-r">
                  {sales.handler.formatCurrency(sale.diskon)}
                </TableCell>
                <TableCell className="text-center border-r">
                  {sales.handler.formatCurrency(sale.ongkir)}
                </TableCell>
                <TableCell className="text-center border-r">
                  {sales.handler.formatCurrency(sale.total_bayar)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>

        <TableFooter>
          <TableRow className="bg-neutral-950 text-neutral-200 hover:bg-neutral-950">
            <TableCell />
            <TableCell className="border-r border-r-neutral-600" />
            <TableCell className="border-r border-r-neutral-600" />
            <TableCell className="border-r border-r-neutral-600" />
            <TableCell
              colSpan={4}
              className="text-center font-bold border-r border-r-neutral-600"
            >
              Grand Total
            </TableCell>
            <TableCell className="text-center font-bold">
              {sales.handler.formatCurrency(sales.state.grandTotal)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
