import { Module } from '@nestjs/common';
import { BrandController } from './brand.controller';
import { PrismaService } from '../../prisma.service';
import { CreateBrandService } from './services/create-brand.service';
import { BrandRepository } from './repository/brand.repository';
import { FindAllBrandsService } from './services/find-all-brands.service';
import { FindOneBrandService } from './services/find-one-brand.service';
import { UpdateBrandService } from './services/update-brand.service';

@Module({
  controllers: [BrandController],
  providers: [
    PrismaService,
    BrandRepository,
    CreateBrandService,
    FindAllBrandsService,
    FindOneBrandService,
    UpdateBrandService,
  ],
})
export class BrandModule {}
