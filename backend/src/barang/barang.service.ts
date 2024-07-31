import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  TCreateBarangResponse,
  TDeleteBarangResponse,
  TGetBarangResponse,
  TListBarangResponse,
  TUpdateBarangResponse,
} from './barang.constants';
import { CreateBarangDto, UpdateBarangDto } from './barang.dto';

@Injectable()
export class BarangService {
  constructor(private prismaService: PrismaService) {}

  async listBarang(): Promise<TListBarangResponse> {
    try {
      const barang = await this.prismaService.barang.findMany();
      return {
        status: HttpStatus.OK,
        data: barang,
      };
    } catch (error) {
      console.error('[API ERROR] Error while listing barang data: ', error);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: [],
      };
    }
  }

  async getBarang(barangId: number): Promise<TGetBarangResponse> {
    try {
      const barang = await this.prismaService.barang.findUnique({
        where: {
          id: barangId,
        },
      });
      return {
        status: HttpStatus.OK,
        data: barang,
      };
    } catch (error) {
      console.error('[API ERROR] Error while getting barang: ', error);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }
  }

  async createBarang(
    newBarang: CreateBarangDto,
  ): Promise<TCreateBarangResponse> {
    try {
      const createdBarang = await this.prismaService.barang.create({
        data: newBarang,
      });
      return {
        status: HttpStatus.CREATED,
        message: ['Barang berhasil ditambahkan'],
        data: createdBarang,
      };
    } catch (error) {
      console.error('[API ERROR] Error while creating barang: ', error);

      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException({
            status: HttpStatus.BAD_REQUEST,
            message: 'Kode barang sudah terdaftar, silahkan gunakan kode lain',
            data: null,
          });
        }
      }

      throw error;
    }
  }

  async updateBarang(
    barangId: number,
    updatedBarang: UpdateBarangDto,
  ): Promise<TUpdateBarangResponse> {
    try {
      console.log(updatedBarang);
      const updatedBarangData = await this.prismaService.barang.update({
        where: {
          id: barangId,
        },
        data: updatedBarang,
      });

      return {
        status: HttpStatus.OK,
        message: ['Barang berhasil diperbarui'],
        data: updatedBarangData,
      };
    } catch (error) {
      console.error('[API ERROR] Error while updating barang: ', error);

      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new BadRequestException({
            status: HttpStatus.BAD_REQUEST,
            message: ['Data barang tidak ditemukan'],
            data: null,
          });
        }
      }

      throw error;
    }
  }

  async deleteBarang(barangId: number): Promise<TDeleteBarangResponse> {
    try {
      const deleteBarang = await this.prismaService.barang.delete({
        where: {
          id: barangId,
        },
      });

      if (deleteBarang) {
        return {
          status: HttpStatus.OK,
          message: ['Barang berhasil dihapus'],
        };
      } else {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: ['Barang gagal dihapus'],
        };
      }
    } catch (error) {
      console.error('[API ERROR] Error while deleting barang: ', error);

      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new BadRequestException({
            status: HttpStatus.BAD_REQUEST,
            message: ['Data barang tidak ditemukan'],
          });
        }
      }

      throw error;
    }
  }
}
