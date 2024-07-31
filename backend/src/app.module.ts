import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BarangModule } from './barang/barang.module';
import { CustomerModule } from './customer/customer.module';

@Module({
  imports: [BarangModule, CustomerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
