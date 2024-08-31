import { Inject, Injectable } from '@nestjs/common';
import { AppError } from '../../../common/errors/Error';
import { BrandRepository } from '../repository/brand.repository';
import { IBrandRepository } from '../interfaces/repository.interface';
import { Brand } from '@prisma/client';
import { UpdateBrandDto } from '../dto/update-brand.dto';
import { IBrandDetails } from '../interfaces/brand.interface';

@Injectable()
export class UpdateBrandService {
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

  async execute(id: string, data: UpdateBrandDto): Promise<IBrandDetails> {
    try {
      const updatedBrand = await this.brandRepository.updateBrand(id, data);

      return this.transformInfluencerData(updatedBrand);
    } catch (error) {
      throw new AppError(
        'brand-service.updateBrand',
        500,
        'failed to update brand data',
      );
    }
  }
}
