import { Inject, Injectable } from '@nestjs/common';
import { AppError } from '../../../common/errors/Error';
import { IBrandRepository } from '../interfaces/repository.interface';
import { Brand } from '@prisma/client';
import { BrandRepository } from '../repository/brand.repository';

@Injectable()
export class FindAllBrandsService {
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

  private transformArrayTimestamps<
    T extends { created_at: Date; updated_at: Date },
  >(
    entities: T[],
  ): Array<
    Omit<T, 'created_at' | 'updated_at'> & { createdAt: Date; updatedAt: Date }
  > {
    return entities.map(this.transformTimestamps);
  }

  async execute() {
    try {
      const brands = await this.brandRepository.findAllBrands();
      return this.transformArrayTimestamps(brands);
    } catch (error) {
      throw new AppError(
        'brand-service.findAllBrands',
        500,
        'failed to get brands',
      );
    }
  }
}
