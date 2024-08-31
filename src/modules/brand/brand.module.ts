import { Module } from '@nestjs/common';
import { BrandController } from './brand.controller';
import { PrismaService } from '../../prisma.service';
import { CreateBrandService } from './services/create-brand.service';
import { BrandRepository } from './repository/brand.repository';
import { FindAllBrandsService } from './services/find-all-brands.service';

@Module({
  controllers: [BrandController],
  providers: [
    PrismaService,
    BrandRepository,
    CreateBrandService,
    FindAllBrandsService,
  ],
})
export class BrandModule {}
