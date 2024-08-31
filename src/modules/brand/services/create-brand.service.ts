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

  private transformTimestamps<T extends { created_at: Date; updated_at: Date }>(
    entity: T,
  ): Omit<T, 'created_at' | 'updated_at'> & {
    createdAt: Date;
    updatedAt: Date;
  } {
    const { created_at, updated_at, ...rest } = entity;
    return {
      ...rest,
      createdAt: created_at,
      updatedAt: updated_at,
    };
  }

  async execute(data: CreateBrandDto) {
    try {
      const createdBrand = await this.brandRepository.createBrand(data);

      return this.transformTimestamps(createdBrand);
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
