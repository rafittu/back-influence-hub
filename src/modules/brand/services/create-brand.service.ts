import { Inject, Injectable } from '@nestjs/common';
import { AppError } from '../../../common/errors/Error';
import { BrandRepository } from '../repository/brand.repository';
import { IBrandRepository } from '../interfaces/repository.interface';
import { Brand } from '@prisma/client';
import { CreateBrandDto } from '../dto/create-brand.dto';

@Injectable()
export class CreateBrandService {
  constructor(
    @Inject(BrandRepository)
    private readonly brandRepository: IBrandRepository<Brand>,
  ) {}

  async execute(data: CreateBrandDto) {
    try {
      const createdBrand = await this.brandRepository.createBrand(data);

      return createdBrand;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        'brand-service.createBrand',
        500,
        'failed to create brand',
      );
    }
  }
}
