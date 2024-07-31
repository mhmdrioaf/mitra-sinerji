import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  TCreateCustomerResponse,
  TDeleteCustomerResponse,
  TGetCustomerResponse,
} from './customer.constants';
import { CreateCustomerDto, UpdateCustomerDto } from './customer.dto';

@Injectable()
export class CustomerService {
  constructor(private prismaService: PrismaService) {}

  async listCustomer() {
    try {
      const customers = await this.prismaService.customer.findMany();
      return {
        status: HttpStatus.OK,
        data: customers,
      };
    } catch (error) {
      console.error('[API ERROR] Error while listing customer data: ', error);
      throw new Error('Terjadi kesalahan ketika mengambil data customer');
    }
  }

  async getCustomer(customerId: number): Promise<TGetCustomerResponse> {
    try {
      const customer = await this.prismaService.customer.findUnique({
        where: {
          id: customerId,
        },
      });
      return {
        status: HttpStatus.OK,
        data: customer,
      };
    } catch (error) {
      console.error('[API ERROR] Error while getting customer: ', error);
      throw new Error('Terjadi kesalahan ketika mengambil data customer');
    }
  }

  async createCustomer(
    newCustomer: CreateCustomerDto,
  ): Promise<TCreateCustomerResponse> {
    try {
      const createdCustomer = await this.prismaService.customer.create({
        data: newCustomer,
      });
      return {
        status: HttpStatus.CREATED,
        message: ['Data customer berhasil di tambahkan'],
        data: createdCustomer,
      };
    } catch (error) {
      console.error('[API ERROR] Error while creating customer: ', error);

      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException({
            status: HttpStatus.BAD_REQUEST,
            message: ['Kode customer berhasil telah terdaftar'],
            data: null,
          });
        }
      }

      throw error;
    }
  }

  async updateCustomer(
    customerId: number,
    updatedCustomer: UpdateCustomerDto,
  ): Promise<TCreateCustomerResponse> {
    try {
      const updatedCustomerData = await this.prismaService.customer.update({
        where: {
          id: customerId,
        },
        data: updatedCustomer,
      });
      return {
        status: HttpStatus.OK,
        message: ['Data customer berhasil di update'],
        data: updatedCustomerData,
      };
    } catch (error) {
      console.error('[API ERROR] Error while updating customer: ', error);

      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new BadRequestException({
            status: HttpStatus.BAD_REQUEST,
            message: ['Data customer tidak ditemukan'],
            data: null,
          });
        }
      }

      throw error;
    }
  }

  async deleteCustomer(customerId: number): Promise<TDeleteCustomerResponse> {
    try {
      await this.prismaService.customer.delete({
        where: {
          id: customerId,
        },
      });
      return {
        status: HttpStatus.OK,
        message: ['Data customer berhasil di hapus'],
      };
    } catch (error) {
      console.error('[API ERROR] Error while deleting customer: ', error);

      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new BadRequestException({
            status: HttpStatus.BAD_REQUEST,
            message: ['Data customer tidak ditemukan'],
          });
        }
      }

      throw error;
    }
  }
}
