import * as z from "zod";

export type TBarang = {
  id: number;
  kode: string;
  nama: string;
  harga: number;
};

export const BarangDto = z.object({
  kode: z
    .string()
    .max(10, "Kode barang tidak bolen lebih dari 10 karakter")
    .optional(),
  nama: z
    .string()
    .min(1, "Nama barang tidak boleh kosong")
    .max(100, "Nama barang tidak boleh lebih dari 100 karakter"),
  harga: z
    .number({
      message: "Harga tidak boleh kosong",
    })
    .int()
    .positive("Harga barang harus lebih dari 0"),
});
