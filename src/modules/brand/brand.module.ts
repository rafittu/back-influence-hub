import { Module } from '@nestjs/common';
import { BrandController } from './brand.controller';
import { PrismaService } from 'src/prisma.service';
import { CreateBrandService } from './services/create-brand.service';
import { BrandRepository } from './repository/brand.repository';

@Module({
  controllers: [BrandController],
  providers: [PrismaService, BrandRepository, CreateBrandService],
})
export class BrandModule {}
