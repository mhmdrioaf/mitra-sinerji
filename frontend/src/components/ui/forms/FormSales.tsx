"use client";

import { TBarang } from "@/lib/api/barang/definitions";
import { TCustomer } from "@/lib/api/customer/definitions";
import { createSales } from "@/lib/api/sales/actions";
import { SalesDto, TSalesDetail } from "@/lib/api/sales/definitions";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  CalendarIcon,
  HelpCircleIcon,
  Loader2Icon,
  Trash2Icon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../table";
import { useToast } from "../use-toast";
import CurrencyInput from "./CurrencyInput";

interface IFormSales {
  dataBarang: TBarang[];
  dataCustomer: TCustomer[];
}

export default function FormSales({ dataBarang, dataCustomer }: IFormSales) {
  const [productData, setProductData] = React.useState<TSalesDetail[]>([]);
  const [customerId, setCustomerId] = React.useState<number | null>(null);
  const [submitting, setSubmitting] = React.useState<boolean>(false);
  const [date, setDate] = React.useState<string>();

  const form = useForm<z.infer<typeof SalesDto>>({
    defaultValues: {
      subtotal: 0,
      diskon: 0,
      ongkir: 0,
      total_bayar: 0,
      salesDetail: [],
    },
  });

  const { toast } = useToast();
  const router = useRouter();

  const addBarang = (id: number) => {
    setProductData((prev) => {
      const barang = dataBarang.find((item) => item.id === id);
      if (!barang) return prev;

      const productData: TSalesDetail = {
        id: prev.length > 0 ? prev[prev.length - 1].id + 1 : 1,
        barang: barang,
        qty: 1,
        diskon_nilai: 0,
        diskon_pct: 0,
        harga_diskon: barang.harga,
        total: barang.harga,
      };

      return [...prev, productData];
    });
  };

  const onDiskonInput = (diskonPct: string, salesId: number) => {
    let newDiskon = parseInt(diskonPct);
    if (newDiskon < 0 || newDiskon > 100) return;
    if (isNaN(newDiskon)) newDiskon = 0;

    setProductData((prev) => {
      const current = prev.find((item) => item.id === salesId);
      if (!current) return prev;

      const diskonNilai = (newDiskon / 100) * current.barang.harga;
      const hargaDiskon = current.barang.harga - diskonNilai;
      const total = calculatePrice(hargaDiskon, current.qty);

      return prev.map((item) =>
        item.id === salesId
          ? {
              ...item,
              diskon_pct: newDiskon,
              diskon_nilai: diskonNilai,
              harga_diskon: hargaDiskon,
              total: total,
            }
          : item
      );
    });
  };

  const calculatePrice = (price: number, qty: number) => {
    return price * qty;
  };

  const onQtyInput = (qty: string, salesId: number) => {
    let newQty = Number(qty);
    if (newQty < 0) newQty = 1;
    if (isNaN(newQty)) newQty = 1;

    setProductData((prev) =>
      prev.map((item) =>
        item.id === salesId
          ? {
              ...item,
              qty: newQty,
              total: calculatePrice(item.harga_diskon, newQty),
            }
          : item
      )
    );
  };

  const barangToAdd = dataBarang.filter(
    (item) => !productData.find((detail) => detail.barang.id === item.id)
  );

  const formatCurrency = (raw: number) => {
    return raw.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
    });
  };

  const calculateTotal = React.useCallback(() => {
    const salesDiskon = form.watch("diskon");
    const salesOngkir = form.watch("ongkir");
    const subtotal = productData.reduce((acc, curr) => acc + curr.total, 0);
    const totalBayar = subtotal - salesDiskon - salesOngkir;

    return totalBayar;
  }, [form, productData]);

  const onSubmit = async (data: z.infer<typeof SalesDto>) => {
    setSubmitting(true);
    const { salesDetail, subtotal, total_bayar, cust_id, tgl, ...sales } = data;

    if (productData.length < 1) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Barang tidak boleh kosong.",
      });
      setSubmitting(false);
      return;
    }
    if (!customerId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Customer tidak boleh kosong.",
      });
      setSubmitting(false);
      return;
    }
    if (!date) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Tanggal transaksi tidak boleh kosong.",
      });
      setSubmitting(false);
      return;
    }

    if (productData.some((item) => item.qty < 1)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Kuantitas barang tidak boleh kurang dari 1.",
      });
      setSubmitting(false);
      return;
    }

    const salesDetailData: typeof salesDetail = productData.map((item) => ({
      barang_id: item.barang.id,
      harga_bandrol: item.barang.harga,
      qty: item.qty,
      diskon_nilai: item.diskon_nilai,
      diskon_pct: item.diskon_pct,
      harga_diskon: item.harga_diskon,
      total: item.total,
    }));

    const newSales: typeof data = {
      ...sales,
      subtotal: productData.reduce((acc, curr) => acc + curr.total, 0),
      total_bayar: calculateTotal(),
      salesDetail: salesDetailData,
      cust_id: customerId,
      tgl: date,
    };

    const response = await createSales(newSales);

    if (response.status === 201) {
      toast({
        title: "Data berhasil disimpan",
        description: response.message.join(", "),
      });
      router.refresh();
      onReset();
    } else {
      toast({
        variant: "destructive",
        title: "Gagal menyimpan data",
        description: response.message.join(", "),
      });
    }

    setSubmitting(false);
  };

  const chooseCustomer = (id: number) => {
    setCustomerId((prev) => (prev === id ? null : id));
  };

  const onReset = () => {
    form.reset();
    setProductData([]);
    setCustomerId(null);
    setDate(undefined);
  };

  const onDeleteDetail = (id: number) => {
    setProductData((prev) => prev.filter((item) => item.id !== id));
  };

  const onDateSelect = (date?: Date) => {
    const selected = format(date ?? new Date(), "Y-MM-dd");

    setDate(selected);
  };

  return (
    <div className="min-h-svh relative">
      <div className="w-full flex flex-col gap-4 px-4 py-2 md:px-8 overflow-x-auto z-0 pb-48">
        <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div className="inline-flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button className="w-full md:w-fit" variant="outline">
                  Tambah Barang
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="w-full flex flex-col gap-2">
                  {barangToAdd.map((barang) => (
                    <Button
                      variant="outline"
                      key={barang.id}
                      onClick={() => addBarang(barang.id)}
                      className="justify-start"
                    >
                      <div className="inline-flex items-center gap-2 justify-start">
                        <span>{barang.kode}</span>
                        <span>{barang.nama}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full md:w-fit">
                  Pilih Customer
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="w-full flex flex-col gap-2">
                  {dataCustomer.map((customer) => (
                    <Button
                      variant={
                        customerId === customer.id ? "default" : "outline"
                      }
                      key={customer.id}
                      onClick={() => chooseCustomer(customer.id)}
                      className="justify-start"
                    >
                      <div className="inline-flex items-center gap-2 justify-start">
                        <span>{customer.kode}</span>
                        <span>{customer.name}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full md:w-fit justify-center md:justify-start text-center md:text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? (
                  format(date, "PPP")
                ) : (
                  <span>Pilih Tanggal Transaksi</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date ? new Date(date) : undefined}
                onSelect={(date) => onDateSelect(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
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
            {productData.map((detail, index) => (
              <TableRow key={detail.barang.id}>
                <TableCell className="text-center border-r">
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => onDeleteDetail(detail.id)}
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
                  {formatCurrency(detail.barang.harga)}
                </TableCell>
                <TableCell className="text-center border-r">
                  <Input
                    inputMode="numeric"
                    min={0}
                    max={100}
                    value={detail.qty}
                    className="min-w-[8ch] max-w-[8ch] text-center mx-auto"
                    onChange={(e) => onQtyInput(e.target.value, detail.id)}
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
                      onChange={(e) => onDiskonInput(e.target.value, detail.id)}
                    />
                    <span className="text-xs">%</span>
                  </div>
                </TableCell>
                <TableCell className="text-center border-r">
                  {detail.diskon_nilai > 0
                    ? formatCurrency(detail.diskon_nilai)
                    : "-"}
                </TableCell>
                <TableCell className="text-center border-r">
                  {formatCurrency(detail.harga_diskon)}
                </TableCell>
                <TableCell className="text-center">
                  {formatCurrency(detail.total)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {productData.length > 0 && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full grid grid-cols-6 gap-4 px-4 md:px-8 py-2 bg-white z-50 fixed bottom-0 text-xs md:text-sm border-t"
          >
            <div className="col-span-4 md:col-span-5 flex flex-col gap-px justify-self-start">
              <div className="w-full grid grid-cols-2">
                <b className="self-center">Sub total</b>
                <span className="justify-self-end">
                  {formatCurrency(productData.reduce((a, b) => a + b.total, 0))}
                </span>
              </div>

              <div className="w-full grid grid-cols-2">
                <b className="self-center">Diskon</b>
                <CurrencyInput
                  form={form}
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
                  form={form}
                  name="ongkir"
                  label=""
                  placeholder="Rp. 0"
                  className="justify-self-end text-right p-0 border-none text-xs md:text-sm"
                />
              </div>

              <div className="w-full grid grid-cols-2">
                <b className="self-center">Total Bayar</b>
                <span className="justify-self-end">
                  {formatCurrency(calculateTotal())}
                </span>
              </div>
            </div>

            <div className="col-span-2 md:col-span-1 flex flex-col gap-2 self-center">
              <Button type="submit" variant="default" disabled={submitting}>
                {submitting && <Loader2Icon className="w-4 h-4 animate-spin" />}
                <span>Simpan</span>
              </Button>
              <AlertDialog>
                <Button variant="destructive" asChild disabled={submitting}>
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
                      <AlertDialogAction onClick={onReset}>
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
