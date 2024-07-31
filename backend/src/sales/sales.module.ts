import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';

@Module({
  providers: [SalesService, PrismaService],
  controllers: [SalesController],
})
export class SalesModule {}
