import { Barang } from '@prisma/client';

export type TDeleteBarangResponse = {
  status: number;
  message: string[];
};

export type TListBarangResponse = {
  status: number;
  data: Barang[];
};

export type TGetBarangResponse = {
  status: number;
  data: Barang | null;
};

export type TCreateBarangResponse = {
  status: number;
  message?: string[];
  data: Barang;
};

export type TUpdateBarangResponse = TCreateBarangResponse;
