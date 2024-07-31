import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BarangModule } from './barang/barang.module';

@Module({
  imports: [BarangModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
