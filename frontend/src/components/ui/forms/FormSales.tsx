"use client";

import { TBarang } from "@/lib/api/barang/definitions";
import { TCustomer } from "@/lib/api/customer/definitions";
import { useSales } from "@/lib/hooks/useSales";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  CalendarIcon,
  HelpCircleIcon,
  Loader2Icon,
  Trash2Icon,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../alert-dialog";
import { Button } from "../button";
import { Calendar } from "../calendar";
import { Form } from "../form";
import { Input } from "../input";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { ScrollArea } from "../scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../table";
import CurrencyInput from "./CurrencyInput";

interface IFormSales {
  dataBarang: TBarang[];
  dataCustomer: TCustomer[];
}

export default function FormSales({ dataBarang, dataCustomer }: IFormSales) {
  const { form, state, refs } = useSales({ dataBarang, dataCustomer });

  return (
    <div className="min-h-svh relative">
      <div className="w-full flex flex-col gap-4 px-4 py-2 md:px-8 overflow-x-auto z-0 pb-48">
        <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div className="inline-flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  className="w-full md:w-fit transition-all"
                  variant="default"
                  ref={refs.barang}
                >
                  Tambah Barang
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="w-full flex flex-col gap-2">
                  <Input
                    type="text"
                    onChange={(e) =>
                      form.handler.search("barang", e.target.value)
                    }
                    placeholder="Cari berdasarkan nama atau kode"
                  />
                  <ScrollArea className="w-full h-[24svh]">
                    <div className="w-full flex flex-col gap-2">
                      {form.barang.map((barang) => (
                        <Button
                          variant="outline"
                          key={barang.id}
                          onClick={() =>
                            form.handler.salesDetail.add(barang.id)
                          }
                          className="justify-start w-full"
                        >
                          <div className="inline-flex items-center gap-2 justify-start">
                            <span>{barang.kode}</span>
                            <span>{barang.nama}</span>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full md:w-fit transition-all"
                  ref={refs.customer}
                >
                  Pilih Customer
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="w-full flex flex-col gap-2">
                  <Input
                    type="text"
                    onChange={(e) =>
                      form.handler.search("customer", e.target.value)
                    }
                    placeholder="Cari berdasarkan nama atau kode"
                  />
                  <ScrollArea className="w-full h-[24svh]">
                    <div className="w-full flex flex-col gap-2">
                      {form.customer.map((customer) => (
                        <Button
                          variant={
                            state.customerId === customer.id
                              ? "default"
                              : "outline"
                          }
                          key={customer.id}
                          onClick={() =>
                            form.handler.chooseCustomer(customer.id)
                          }
                          className="justify-start"
                        >
                          <div className="inline-flex items-center gap-2 justify-start">
                            <span>{customer.kode}</span>
                            <span>{customer.name}</span>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="default"
                className={cn(
                  "w-full md:w-fit justify-center md:justify-start text-center md:text-left font-normal transition-all",
                  !state.date && "text-primary-foreground/85"
                )}
                ref={refs.tgl}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {state.date ? (
                  format(state.date, "PPP")
                ) : (
                  <span>Pilih Tanggal Transaksi</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={state.date ? new Date(state.date) : undefined}
                onSelect={(date) => form.handler.selectDate(date)}
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {form.productData.length === 0 ? (
          <div className="w-full flex flex-col gap-2 justify-center items-center">
            <span className="text-primary/85">
              Belum ada barang yang di input
            </span>

            <Button variant="outline">Tambahkan Barang</Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border">
                <TableHead rowSpan={2} className="text-center border-r">
                  Aksi
                </TableHead>
                <TableHead rowSpan={2} className="text-center border-r">
                  No
                </TableHead>
                <TableHead rowSpan={2} className="text-center border-r">
                  Kode Barang
                </TableHead>
                <TableHead rowSpan={2} className="text-center border-r">
                  Nama Barang
                </TableHead>
                <TableHead rowSpan={2} className="text-center border-r">
                  Harga Bandrol
                </TableHead>
                <TableHead rowSpan={2} className="text-center border-r">
                  Qty
                </TableHead>
                <TableHead
                  rowSpan={1}
                  colSpan={2}
                  className="text-center border-r"
                >
                  Diskon
                </TableHead>
                <TableHead rowSpan={2} className="text-center border-r">
                  Harga Diskon
                </TableHead>
                <TableHead rowSpan={2} className="text-center">
                  Total
                </TableHead>
              </TableRow>
              <TableRow className="border">
                <TableHead className="text-center border-r">%</TableHead>
                <TableHead className="text-center border-r">{"(Rp)"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="border">
              {form.productData.map((detail, index) => (
                <TableRow key={detail.barang.id}>
                  <TableCell className="text-center border-r">
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => form.handler.salesDetail.remove(detail.id)}
                    >
                      <Trash2Icon className="w-4 h-4" />
                    </Button>
                  </TableCell>
                  <TableCell className="text-center border-r">
                    {index + 1}
                  </TableCell>
                  <TableCell className="text-center border-r">
                    {detail.barang.kode}
                  </TableCell>
                  <TableCell className="text-center border-r">
                    {detail.barang.nama}
                  </TableCell>
                  <TableCell className="text-center border-r">
                    {form.handler.formatCurrency(detail.barang.harga)}
                  </TableCell>
                  <TableCell className="text-center border-r">
                    <Input
                      inputMode="numeric"
                      min={0}
                      max={100}
                      value={detail.qty}
                      className="min-w-[8ch] max-w-[8ch] text-center mx-auto"
                      onChange={(e) =>
                        form.handler.salesDetail.quantityInput(
                          e.target.value,
                          detail.id
                        )
                      }
                    />
                  </TableCell>
                  <TableCell className="text-center border-r">
                    <div className="w-full inline-flex justify-center items-center gap-2">
                      <Input
                        inputMode="numeric"
                        min={0}
                        max={100}
                        value={
                          detail.diskon_pct > 0
                            ? detail.diskon_pct.toString().replace(/\D/g, "")
                            : detail.diskon_pct
                        }
                        className="min-w-[8ch] max-w-[8ch] text-center"
                        onChange={(e) =>
                          form.handler.salesDetail.discountInput(
                            e.target.value,
                            detail.id
                          )
                        }
                      />
                      <span className="text-xs">%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center border-r">
                    {detail.diskon_nilai > 0
                      ? form.handler.formatCurrency(detail.diskon_nilai)
                      : "-"}
                  </TableCell>
                  <TableCell className="text-center border-r">
                    {form.handler.formatCurrency(detail.harga_diskon)}
                  </TableCell>
                  <TableCell className="text-center">
                    {form.handler.formatCurrency(detail.total)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {form.productData.length > 0 && (
        <Form {...form.form}>
          <form
            onSubmit={form.form.handleSubmit(form.handler.submit)}
            className="w-full grid grid-cols-6 gap-4 px-4 md:px-8 py-2 bg-white z-50 fixed bottom-0 text-xs md:text-sm border-t"
          >
            <div className="col-span-4 md:col-span-5 flex flex-col gap-px justify-self-start">
              <div className="w-full grid grid-cols-2">
                <b className="self-center">Sub total</b>
                <span className="justify-self-end">
                  {form.handler.formatCurrency(state.subtotal)}
                </span>
              </div>

              <div className="w-full grid grid-cols-2">
                <b className="self-center">Diskon</b>
                <CurrencyInput
                  form={form.form}
                  name="diskon"
                  label=""
                  placeholder="Rp. 0"
                  className="justify-self-end text-right p-0 border-none text-xs md:text-sm"
                />
              </div>

              <div className="w-full grid grid-cols-2">
                <div className="self-center inline-flex items-center gap-px">
                  <b>Ongkir</b>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" type="button">
                        <HelpCircleIcon className="w-4 h-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <p className="text-sm">
                        Mengikuti contoh yang diberikan di dokumen instruksi,
                        yakni ongkir mengurangi hasil dari subtotal dikurangi
                        diskon.
                      </p>
                    </PopoverContent>
                  </Popover>
                </div>
                <CurrencyInput
                  form={form.form}
                  name="ongkir"
                  label=""
                  placeholder="Rp. 0"
                  className="justify-self-end text-right p-0 border-none text-xs md:text-sm"
                />
              </div>

              <div className="w-full grid grid-cols-2">
                <b className="self-center">Total Bayar</b>
                <span className="justify-self-end">
                  {form.handler.formatCurrency(state.total)}
                </span>
              </div>
            </div>

            <div className="col-span-2 md:col-span-1 flex flex-col gap-2 self-center">
              <Button
                type="submit"
                variant="default"
                disabled={state.submitting}
              >
                {state.submitting && (
                  <Loader2Icon className="w-4 h-4 animate-spin" />
                )}
                <span>Simpan</span>
              </Button>
              <AlertDialog>
                <Button
                  variant="destructive"
                  asChild
                  disabled={state.submitting}
                >
                  <AlertDialogTrigger>
                    <span>Batal</span>
                  </AlertDialogTrigger>
                </Button>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Apakah anda yakin akan membatalkan transaksi ini?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Ketika anda membatalkan transaksi ini, semua data
                      transaksi barang yang telah di input dalam transaksi ini
                      akan di hapus.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Tidak</AlertDialogCancel>
                    <Button variant="destructive" asChild>
                      <AlertDialogAction onClick={form.handler.resetForm}>
                        Ya
                      </AlertDialogAction>
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
