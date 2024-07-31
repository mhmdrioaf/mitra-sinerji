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
import { CreateBarangDto, UpdateBarangDto } from './barang.dto';
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
  async createBarang(@Body() newBarang: CreateBarangDto) {
    return await this.barangService.createBarang(newBarang);
  }

  @Patch('update/:id')
  @HttpCode(HttpStatus.OK)
  async updateBarang(
    @Param() param: { id: string },
    @Body() updatedBarang: UpdateBarangDto,
  ) {
    const barangId = Number(param.id);
    return await this.barangService.updateBarang(barangId, updatedBarang);
  }

  @Delete('delete/:id')
  @HttpCode(HttpStatus.OK)
  async deleteBarang(@Param() param: { id: string }) {
    return await this.barangService.deleteBarang(Number(param.id));
  }
}
