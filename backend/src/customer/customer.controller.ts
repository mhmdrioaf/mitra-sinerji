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
import { CreateCustomerDto, UpdateCustomerDto } from './customer.dto';
import { CustomerService } from './customer.service';

@Controller('customer')
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async listCustomer() {
    return await this.customerService.listCustomer();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createCustomer(@Body() body: CreateCustomerDto) {
    try {
      return await this.customerService.createCustomer(body);
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getCustomer(@Param() param: { id: string }) {
    return await this.customerService.getCustomer(Number(param.id));
  }

  @Patch('update/:id')
  @HttpCode(HttpStatus.OK)
  async updateCustomer(
    @Param() param: { id: string },
    @Body() body: UpdateCustomerDto,
  ) {
    try {
      const customerId = Number(param.id);
      return await this.customerService.updateCustomer(customerId, body);
    } catch (error) {
      throw error;
    }
  }

  @Delete('delete/:id')
  @HttpCode(HttpStatus.OK)
  async deleteCustomer(@Param() param: { id: string }) {
    return await this.customerService.deleteCustomer(Number(param.id));
  }
}
