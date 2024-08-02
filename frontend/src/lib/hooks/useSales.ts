"use client";

import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { TBarang } from "../api/barang/definitions";
import { TCustomer } from "../api/customer/definitions";
import { createSales } from "../api/sales/actions";
import { SalesDto, TSalesDetail } from "../api/sales/definitions";

export type TSalesHook = {
  state: {
    submitting: boolean;
    date: string | undefined;
    customerId: number | null;
    total: number;
    subtotal: number;
  };

  form: {
    form: UseFormReturn<z.infer<typeof SalesDto>, any, undefined>;
    productData: TSalesDetail[];

    barang: TBarang[];
    customer: TCustomer[];

    handler: {
      salesDetail: {
        add: (id: number) => void;
        remove: (id: number) => void;

        discountInput: (discount: string, id: number) => void;
        quantityInput: (quantity: string, id: number) => void;
      };
      formatCurrency: (value: number) => string;
      chooseCustomer: (id: number) => void;
      resetForm: () => void;
      selectDate: (date: Date | undefined) => void;

      submit: (data: z.infer<typeof SalesDto>) => Promise<void>;
      search: (key: keyof TSearch, value: string) => void;
    };
  };
};

export type TSearch = {
  customer: string;
  barang: string;
};

export function useSales({
  dataBarang,
  dataCustomer,
}: {
  dataBarang?: TBarang[];
  dataCustomer: TCustomer[];
}): TSalesHook {
  const [productData, setProductData] = React.useState<TSalesDetail[]>([]);
  const [customerId, setCustomerId] = React.useState<number | null>(null);
  const [submitting, setSubmitting] = React.useState<boolean>(false);
  const [date, setDate] = React.useState<string>();
  const [search, setSearch] = React.useState<TSearch>({
    barang: "",
    customer: "",
  });

  const { toast } = useToast();
  const router = useRouter();

  const barangToAdd =
    dataBarang?.filter(
      (item) =>
        !productData.find((detail) => detail.barang.id === item.id) &&
        (item.nama.toLowerCase().includes(search.barang.toLowerCase()) ||
          item.kode.toLowerCase().includes(search.barang.toLowerCase()))
    ) ?? [];

  const customers = dataCustomer.filter(
    (customer) =>
      customer.name.toLowerCase().includes(search.customer.toLowerCase()) ||
      customer.kode.toLowerCase().includes(search.customer.toLowerCase())
  );

  const form = useForm<z.infer<typeof SalesDto>>({
    defaultValues: {
      subtotal: 0,
      diskon: 0,
      ongkir: 0,
      total_bayar: 0,
      salesDetail: [],
    },
  });

  function calculatePrice(price: number, qty: number) {
    return price * qty;
  }

  function addBarang(id: number) {
    setProductData((prev) => {
      const barang = dataBarang?.find((item) => item.id === id);
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
  }

  function onDiskonInput(diskonPct: string, salesId: number) {
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
  }

  function onQtyInput(qty: string, salesId: number) {
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
  }

  function formatCurrency(raw: number) {
    return raw.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
    });
  }

  const calculateTotal = React.useCallback(() => {
    const salesDiskon = form.watch("diskon");
    const salesOngkir = form.watch("ongkir");
    const subtotal = productData.reduce((acc, curr) => acc + curr.total, 0);
    const totalBayar = subtotal - salesDiskon - salesOngkir;

    return {
      subtotal: subtotal,
      total: totalBayar,
    };
  }, [form, productData]);

  function chooseCustomer(id: number) {
    setCustomerId((prev) => (prev === id ? null : id));
  }

  function onDeleteDetail(id: number) {
    setProductData((prev) => prev.filter((item) => item.id !== id));
  }

  function onDateSelect(date?: Date) {
    const selected = format(date ?? new Date(), "Y-MM-dd");

    setDate(selected);
  }

  async function onSubmit(data: z.infer<typeof SalesDto>) {
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
      subtotal: calculateTotal().subtotal,
      total_bayar: calculateTotal().total,
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
  }

  function onReset() {
    form.reset();
    setProductData([]);
    setCustomerId(null);
    setDate(undefined);
  }

  function onSearch(key: keyof TSearch, value: string) {
    setSearch((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  return {
    state: {
      customerId,
      date,
      submitting,
      total: calculateTotal().total,
      subtotal: calculateTotal().subtotal,
    },

    form: {
      form,
      productData,
      barang: barangToAdd,
      customer: customers,
      handler: {
        salesDetail: {
          add: addBarang,
          remove: onDeleteDetail,
          discountInput: onDiskonInput,
          quantityInput: onQtyInput,
        },
        chooseCustomer,
        formatCurrency,
        resetForm: onReset,
        selectDate: onDateSelect,
        submit: onSubmit,
        search: onSearch,
      },
    },
  };
}
