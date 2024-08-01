import * as z from "zod";

export type TCustomer = {
  id: number;
  name: string;
  kode: string;
  telp: string;
};

export type TListCustomerApiResponse = {
  status: number;
  data: TCustomer[];
};

export type TGetCustomerApiResponse = {
  status: number;
  data: TCustomer | null;
};

export type TCreateCustomerApiResponse = {
  status: number;
  message?: string[];
  data: TCustomer | null;
};

export type TDeleteCustomerApiResponse = {
  status: number;
  message: string[];
};

export enum FormCustomerAction {
  Create = "create",
  Update = "update",
}

export const CustomerDto = z.object({
  name: z
    .string()
    .min(1, "Nama customer tidak boleh kosong")
    .max(100, "Nama customer tidak boleh lebih dari 100 karakter"),
  kode: z
    .string()
    .min(1, "Kode customer tidak boleh kosong")
    .max(10, "Kode customer tidak boleh lebih dari 10 karakter"),
  telp: z
    .string()
    .min(1, "Nomor telepon tidak boleh kosong")
    .max(20, "Nomor telepon tidak boleh lebih dari 20 karakter"),
});
