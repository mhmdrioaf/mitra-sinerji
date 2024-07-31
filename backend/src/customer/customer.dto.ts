import { IsNotEmpty } from 'class-validator';

export class CreateCustomerDto {
  @IsNotEmpty({
    message: 'Nama customer tidak boleh kosong',
  })
  name: string;

  @IsNotEmpty({
    message: 'Kode customer tidak boleh kosong',
  })
  kode: string;

  @IsNotEmpty({
    message: 'Nomor telepon customer tidak boleh kosong',
  })
  telp: string;
}

export class UpdateCustomerDto {
  @IsNotEmpty({
    message: 'Nama customer tidak boleh kosong',
  })
  name: string;

  @IsNotEmpty({
    message: 'Nomor telepon customer tidak boleh kosong',
  })
  telp: string;
}
