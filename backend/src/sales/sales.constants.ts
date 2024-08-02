import { Sales, SalesDetail } from '@prisma/client';
import { Transform } from 'class-transformer';

export type TSales = Sales & {
  sales_detail: SalesDetail[];
  cust: {
    name: string;
  };
};

export type TListSalesResponse = {
  status: number;
  data: TSales[];
};

export type TGetSalesResponse = {
  status: number;
  data: TSales | null;
};

export type TCreateSalesResponse = {
  status: number;
  data: TSales | null;
  message: string[];
};

export class SalesEntity
  implements
    Omit<
      TSales,
      'subtotal' | 'diskon' | 'ongkir' | 'total_bayar' | 'sales_detail'
    >
{
  id: number;
  kode: string;
  tgl: Date;
  cust_id: number;
  cust: { name: string };

  @Transform(({ value }) => Number(value))
  subtotal: number;

  @Transform(({ value }) => Number(value))
  diskon: number;

  @Transform(({ value }) => Number(value))
  ongkir: number;

  @Transform(({ value }) => Number(value))
  total_bayar: number;

  @Transform(({ value }) =>
    value.map((detail: SalesDetail) => {
      return new SalesDetailEntity(detail);
    }),
  )
  sales_detail: SalesDetailEntity[];

  constructor(sales: TSales) {
    Object.assign(this, sales);
  }
}

export class SalesDetailEntity
  implements
    Omit<
      SalesDetail,
      'harga_bandrol' | 'diskon_pct' | 'diskon_nilai' | 'harga_diskon' | 'total'
    >
{
  barang_id: number;
  qty: number;
  id: number;
  sales_id: number;

  @Transform(({ value }) => Number(value))
  harga_bandrol: number;

  @Transform(({ value }) => Number(value))
  diskon_pct: number;

  @Transform(({ value }) => Number(value))
  diskon_nilai: number;

  @Transform(({ value }) => Number(value))
  harga_diskon: number;

  @Transform(({ value }) => Number(value))
  total: number;

  constructor(salesDetail: SalesDetail) {
    Object.assign(this, salesDetail);
  }
}
