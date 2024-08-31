import { Module } from '@nestjs/common';
import { BrandController } from './brand.controller';
import { PrismaService } from 'src/prisma.service';
import { CreateBrandService } from './services/create-brand.service';

@Module({
  controllers: [BrandController],
  providers: [PrismaService, CreateBrandService],
})
export class BrandModule {}
