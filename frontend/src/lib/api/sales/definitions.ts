import * as z from "zod";
import { TBarang } from "../barang/definitions";
import { TCustomer } from "../customer/definitions";

export type TSalesDetail = {
  id: number;
  barang: TBarang;
  qty: number;
  diskon_pct: number;
  diskon_nilai: number;
  harga_diskon: number;
  total: number;
};

export const SalesDto = z.object({
  tgl: z.string(),
  subtotal: z.number(),
  diskon: z.number(),
  ongkir: z.number(),
  total_bayar: z.number(),
  salesDetail: z.array(
    z.object({
      barang_id: z.number(),
      harga_bandrol: z.number(),
      qty: z.number(),
      diskon_pct: z.number(),
      diskon_nilai: z.number(),
      harga_diskon: z.number(),
      total: z.number(),
    })
  ),
  cust_id: z.number(),
});

export type TSales = {
  id: number;
  tgl: string;
  subtotal: number;
  diskon: number;
  ongkir: number;
  total_bayar: number;
  sales_detail: TSalesDetail[];
  cust: Pick<TCustomer, "name">;
};

export type TListSalesApiResponse = {
  status: number;
  data: TSales[];
};

export type TGetSalesApiResponse = {
  status: number;
  data: TSales;
};

export type TCreateSalesApiResponse = {
  status: number;
  data: TSales | null;
  message: string[];
};
