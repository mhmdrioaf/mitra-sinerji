import * as z from "zod";

export type TBarang = {
  id: number;
  kode: string;
  nama: string;
  harga: number;
};

export type TListBarangApiResponse = {
  status: number;
  data: TBarang[];
};

export type TDeleteBarangApiResponse = {
  status: number;
  message: string[];
};

export type TGetBarangApiResponse = {
  status: number;
  data: TBarang | null;
};

export type TCreateBarangApiResponse = {
  status: number;
  message?: string[];
  data: TBarang | null;
};

export type TUpdateBarangApiResponse = TCreateBarangApiResponse;

export enum FormBarangAction {
  Create = "create",
  Update = "update",
}

export const BarangDto = z.object({
  kode: z
    .string()
    .min(1, "Kode barang tidak boleh kosong")
    .max(10, "Kode barang tidak bolen lebih dari 10 karakter"),
  nama: z
    .string()
    .min(1, "Nama barang tidak boleh kosong")
    .max(100, "Nama barang tidak boleh lebih dari 100 karakter"),
  harga: z.number().int().positive("Harga barang harus lebih dari 0"),
});
