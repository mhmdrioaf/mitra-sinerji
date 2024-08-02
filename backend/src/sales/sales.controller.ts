import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { SalesEntity } from './sales.constants';
import { SalesDto } from './sales.dto';
import { SalesService } from './sales.service';

@Controller('sales')
export class SalesController {
  constructor(private salesService: SalesService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async listSales() {
    const { data, ...result } = await this.salesService.listSales();

    const sales = data.map((sale) => new SalesEntity(sale));

    return {
      ...result,
      data: sales,
    };
  }

  @Get(':id')
  async getSalesById(@Param() param: { id: string }) {
    const { data, ...result } = await this.salesService.getSalesById(
      Number(param.id),
    );

    const sales = data ? new SalesEntity(data) : null;

    return {
      ...result,
      data: sales,
    };
  }

  @Post()
  async makeSale(@Body() dto: SalesDto) {
    const { data, ...result } = await this.salesService.makeSale(dto);

    const sales = data ? new SalesEntity(data) : null;

    return {
      ...result,
      data: sales,
    };
  }
}
