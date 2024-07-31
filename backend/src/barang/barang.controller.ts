import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TCreateBarangDto, TUpdateBarangDto } from './barang.constants';
import { BarangService } from './barang.service';

@Controller('barang')
export class BarangController {
  constructor(private barangService: BarangService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async listBarang() {
    return this.barangService.listBarang();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getBarang(@Param() param: { id: string }) {
    return await this.barangService.getBarang(Number(param.id));
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createBarang(@Body() newBarang: TCreateBarangDto) {
    return await this.barangService.createBarang(newBarang);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateBarang(
    @Param() param: { id: string },
    @Body() updatedBarang: TUpdateBarangDto,
  ) {
    return await this.barangService.updateBarang({
      id: Number(param.id),
      ...updatedBarang,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteBarang(@Param() param: { id: string }) {
    return await this.barangService.deleteBarang(Number(param.id));
  }
}
