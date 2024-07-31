import { Body, Controller, Get, Post } from '@nestjs/common';
import { SalesDto } from './sales.dto';
import { SalesService } from './sales.service';

@Controller('sales')
export class SalesController {
  constructor(private salesService: SalesService) {}

  @Get()
  async listSales() {
    return this.salesService.listSales();
  }

  @Get(':id')
  async getSalesById(id: number) {
    return this.salesService.getSalesById(id);
  }

  @Post()
  async makeSale(@Body() dto: SalesDto) {
    return this.salesService.makeSale(dto);
  }
}
