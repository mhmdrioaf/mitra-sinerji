import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BarangController } from './barang.controller';
import { BarangService } from './barang.service';

@Module({
  providers: [BarangService, PrismaService],
  controllers: [BarangController],
})
export class BarangModule {}
