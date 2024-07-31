import { BadRequestException } from '@nestjs/common';
import { OmitType, PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateBarangDto {
  @IsNotEmpty({
    message: 'Kode barang tidak boleh kosong.',
  })
  kode: string;

  @IsNotEmpty({
    message: 'Nama barang tidak boleh kosong.',
  })
  nama: string;

  @IsNumber()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const harga = Number(value);
      if (isNaN(harga)) {
        throw new BadRequestException({
          status: 400,
          message: 'Harga barang harus berupa angka',
          data: null,
        });
      }

      return harga;
    }

    return value;
  })
  harga: number;
}

export class UpdateBarangDto extends PartialType(
  OmitType(CreateBarangDto, ['kode'] as const),
) {}
