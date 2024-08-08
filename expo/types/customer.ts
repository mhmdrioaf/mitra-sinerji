import * as z from "zod";

export type TCustomer = {
  id: number;
  name: string;
  kode: string;
  telp: string;
};

export const CustomerDto = z.object({
  name: z
    .string()
    .min(1, "Nama customer tidak boleh kosong")
    .max(100, "Nama customer tidak boleh lebih dari 100 karakter"),
  kode: z
    .string()
    .max(10, "Kode customer tidak boleh lebih dari 10 karakter")
    .optional(),
  telp: z
    .string()
    .min(7, "Nomor telepon tidak boleh kosong")
    .max(20, "Nomor telepon tidak boleh lebih dari 20 karakter"),
});
