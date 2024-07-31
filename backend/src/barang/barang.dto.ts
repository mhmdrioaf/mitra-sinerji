import { BadRequestException } from '@nestjs/common';
import { OmitType, PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

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

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (typeof value !== 'boolean') {
      if (value === 'true') {
        return true;
      } else {
        return false;
      }
    }

    return value;
  })
  is_diskon: boolean;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const diskon = Number(value);
      if (isNaN(diskon)) {
        throw new BadRequestException({
          status: 400,
          message: 'Diskon barang harus berupa angka',
          data: null,
        });
      }

      if (diskon > 100) {
        return 100;
      }

      return diskon;
    }

    return value;
  })
  diskon: number;
}

export class UpdateBarangDto extends PartialType(
  OmitType(CreateBarangDto, ['kode'] as const),
) {}
