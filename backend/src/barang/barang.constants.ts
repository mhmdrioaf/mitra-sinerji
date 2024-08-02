import { Barang } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsNumberString } from 'class-validator';

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

export class BarangEntity implements Omit<Barang, 'harga'> {
  id: number;
  nama: string;
  kode: string;

  @IsNumberString()
  @Transform(({ value }) => Number(value))
  harga: number;

  constructor(barang: Barang) {
    Object.assign(this, barang);
  }
}
