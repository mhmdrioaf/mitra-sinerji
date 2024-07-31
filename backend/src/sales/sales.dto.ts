import { BadRequestException } from '@nestjs/common';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class SalesDto {
  @IsOptional()
  @IsDate()
  @Transform(({ value }) => {
    if (value) {
      return new Date(value);
    }

    return new Date();
  })
  tgl: Date;

  @IsNumber()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const diskon = Number(value);
      if (isNaN(diskon)) {
        return 0;
      }

      return diskon;
    }
    return value;
  })
  diskon: number;

  @IsNumber()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const ongkir = Number(value);
      if (isNaN(ongkir)) {
        return 0;
      }

      return ongkir;
    }
    return value;
  })
  ongkir: number;

  @IsNumber()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const total = Number(value);
      if (isNaN(total)) {
        return 0;
      }

      return total;
    }
    return value;
  })
  subtotal: number;

  @IsNumber()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const total = Number(value);
      if (isNaN(total)) {
        return 0;
      }

      return total;
    }
    return value;
  })
  total_bayar: number;

  @IsArray()
  @IsNotEmpty({
    message: 'Data item penjualan tidak boleh kosong.',
  })
  salesDetail: SalesDetailDto[];

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const id = Number(value);
      if (isNaN(id)) {
        return 0;
      }

      return id;
    }
    return value;
  })
  cust_id: number;
}

export class SalesDetailDto {
  // @IsNumber()
  // @Transform(({ value }) => {
  //   if (typeof value === 'string') {
  //     const id = Number(value);
  //     if (isNaN(id)) {
  //       return 0;
  //     }

  //     return id;
  //   }
  // })
  // sales_id: number;

  @IsNumber()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const id = Number(value);
      if (isNaN(id)) {
        throw new BadRequestException({
          status: 400,
          message: ['ID barang tidak valid.'],
        });
      }

      return id;
    }

    return value;
  })
  barang_id: number;

  @IsNumber()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const harga = Number(value);
      if (isNaN(harga)) {
        return 0;
      }

      return harga;
    }
    return value;
  })
  harga_bandrol: number;

  @IsNumber()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const qty = Number(value);
      if (isNaN(qty)) {
        return 0;
      }

      return qty;
    }
    return value;
  })
  qty: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const diskon = Number(value);
      if (isNaN(diskon)) {
        return 0;
      }

      return diskon;
    }
    return value;
  })
  diskon_pct: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const diskon = Number(value);
      if (isNaN(diskon)) {
        return 0;
      }

      return diskon;
    }
    return value;
  })
  diskon_nilai: number;

  @IsNumber()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const harga = Number(value);
      if (isNaN(harga)) {
        return 0;
      }

      return harga;
    }
    return value;
  })
  harga_diskon: number;

  @IsNumber()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const total = Number(value);
      if (isNaN(total)) {
        return 0;
      }

      return total;
    }
    return value;
  })
  total: number;
}
