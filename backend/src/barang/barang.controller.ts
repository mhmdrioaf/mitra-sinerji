import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { BarangEntity } from './barang.constants';
import { CreateBarangDto, UpdateBarangDto } from './barang.dto';
import { BarangService } from './barang.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('barang')
export class BarangController {
  constructor(private barangService: BarangService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async listBarang() {
    const { data, ...result } = await this.barangService.listBarang();

    const barang = data.map((barang) => new BarangEntity(barang));

    return {
      ...result,
      data: barang,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getBarang(@Param() param: { id: string }) {
    const { data, ...result } = await this.barangService.getBarang(
      Number(param.id),
    );
    const barang = data ? new BarangEntity(data) : null;

    return {
      ...result,
      data: barang,
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createBarang(@Body() newBarang: CreateBarangDto) {
    const { data, ...result } =
      await this.barangService.createBarang(newBarang);
    const barang = data ? new BarangEntity(data) : null;

    return {
      ...result,
      data: barang,
    };
  }

  @Patch('update/:id')
  @HttpCode(HttpStatus.OK)
  async updateBarang(
    @Param() param: { id: string },
    @Body() updatedBarang: UpdateBarangDto,
  ) {
    const { data, ...result } = await this.barangService.updateBarang(
      Number(param.id),
      updatedBarang,
    );
    const barang = data ? new BarangEntity(data) : null;

    return {
      ...result,
      data: barang,
    };
  }

  @Delete('delete/:id')
  @HttpCode(HttpStatus.OK)
  async deleteBarang(@Param() param: { id: string }) {
    return await this.barangService.deleteBarang(Number(param.id));
  }
}
