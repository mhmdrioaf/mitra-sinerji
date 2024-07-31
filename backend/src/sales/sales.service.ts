import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { generateKodeSales, getSalesDates } from 'src/utils/helper';
import { SalesDto } from './sales.dto';

@Injectable()
export class SalesService {
  constructor(private prismaService: PrismaService) {}

  async listSales() {
    try {
      const sales = await this.prismaService.sales.findMany();
      return {
        status: HttpStatus.OK,
        data: sales,
      };
    } catch (error) {
      console.error('[API ERROR] Unable get sales data: ', error);

      throw new InternalServerErrorException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: ['Unable to get sales data'],
        data: [],
      });
    }
  }

  async getSalesById(id: number) {
    try {
      const sales = await this.prismaService.sales.findUnique({
        where: {
          id,
        },
      });
      return {
        status: HttpStatus.OK,
        data: sales,
      };
    } catch (error) {
      console.error('[API ERROR] Unable get sales data: ', error);

      throw new InternalServerErrorException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: ['Unable to get sales data'],
        data: [],
      });
    }
  }

  async makeSale(dto: SalesDto) {
    try {
      const { salesDetail, ...salesData } = dto;

      const salesDates = getSalesDates(new Date(salesData.tgl));

      const maxKode = await this.prismaService.sales.aggregate({
        where: {
          tgl: {
            gte: salesDates.firstDay,
            lte: salesDates.lastDay,
          },
        },
        _max: {
          kode: true,
        },
      });

      const maxKodeCount = Number(maxKode._max.kode?.slice(-5));
      const newKodeCount = isNaN(maxKodeCount) ? 0 : maxKodeCount;

      console.log(maxKode);

      const newSales = await this.prismaService.sales.create({
        data: {
          kode: generateKodeSales(newKodeCount, salesDates.firstDay),
          cust_id: salesData.cust_id,
          ...salesData,
          sales_detail: {
            createMany: {
              data: salesDetail,
            },
          },
        },
      });

      return {
        status: HttpStatus.CREATED,
        message: 'Berhasil menambahkan data sales.',
        data: newSales,
      };
    } catch (error) {
      console.error('[API ERROR] Unable to create sales data: ', error);
      return;
    }
  }
}
