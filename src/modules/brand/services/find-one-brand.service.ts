import { Inject, Injectable } from '@nestjs/common';
import { AppError } from '../../../common/errors/Error';
import { IBrandRepository } from '../interfaces/repository.interface';
import { Brand } from '@prisma/client';
import { BrandRepository } from '../repository/brand.repository';
import { IBrandDetails } from '../interfaces/brand.interface';

@Injectable()
export class FindOneBrandService {
  constructor(
    @Inject(BrandRepository)
    private readonly brandRepository: IBrandRepository<Brand>,
  ) {}

  private transformInfluencerData(data: any) {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      niches: data.BrandNiche.map((nicheObj) => nicheObj.niche.name),
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  async execute(id: string): Promise<IBrandDetails> {
    try {
      const brand = await this.brandRepository.findOneBrand(id);

      return this.transformInfluencerData(brand);
    } catch (error) {
      throw new AppError(
        'brand-service.findOneBrand',
        500,
        'failed to get brand',
      );
    }
  }
}
